import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, staggerItem } from '../../utils/animationVariants';
import { alumniApi, userApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';

const roleConfig = {
  'super-admin': { label: 'Super Admin', variant: 'gold' },
  'admin':       { label: 'Admin',       variant: 'gold' },
  'alumni':      { label: 'Alumni',      variant: 'default' },
};

function Toggle({ on, disabled, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={() => !disabled && onChange(!on)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
        disabled
          ? 'bg-white/5 cursor-not-allowed opacity-50'
          : on
          ? 'bg-gold-500'
          : 'bg-white/10 hover:bg-white/15'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
          on ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

export default function UsersPage() {
  const { user: currentUser, isSuperAdmin: viewerIsSuperAdmin, impersonating, impersonate } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [alumniByEmail, setAlumniByEmail] = useState({});
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    Promise.all([
      userApi.getAll().catch(() => []),
      alumniApi.getAll().catch(() => []),
    ]).then(([u, a]) => {
      setUsers(u || []);
      const map = {};
      (a || []).forEach((al) => { map[al.email] = al; });
      setAlumniByEmail(map);
      setLoading(false);
    });
  }, []);

  const stats = useMemo(() => {
    const total = users.length;
    const admins = users.filter((u) => u.role === 'admin').length;
    const supers = users.filter((u) => u.role === 'super-admin').length;
    return { total, admins, supers, alumni: total - admins - supers };
  }, [users]);

  const handleImpersonate = async (row) => {
    // Confirm — the action immediately swaps the live session, so a stray
    // click on the wrong row would be confusing without a beat to react.
    const ok = window.confirm(
      `Impersonate ${row.email}? You'll see the portal as them. A banner stays on screen until you stop.`
    );
    if (!ok) return;
    setBusyId(row.id);
    const res = await impersonate(row.id);
    setBusyId(null);
    if (!res.success) {
      showToast(res.error || 'Could not impersonate', 'error');
      return;
    }
    showToast(`Now viewing as ${row.email}`, 'success');
    // Send them where the target user actually lives. Admins/super-admins go
    // to the admin dashboard; regular alumni land on their profile.
    navigate(row.role === 'alumni' ? '/profile' : '/admin');
  };

  const handleToggle = async (row, nextOn) => {
    // Guard rails (also enforced via disabled state, but belt-and-braces):
    if (row.role === 'super-admin') { showToast('Super-admin role cannot be changed from the UI', 'info'); return; }
    if (row.id === currentUser?.id || row.email === currentUser?.email) { showToast('You cannot change your own access', 'info'); return; }

    const nextRole = nextOn ? 'admin' : 'alumni';
    setBusyId(row.id);
    // Optimistic update
    setUsers((prev) => prev.map((u) => (u.id === row.id ? { ...u, role: nextRole } : u)));
    try {
      await userApi.update(row.id, { role: nextRole });
      showToast(`${row.email} → ${nextRole === 'admin' ? 'admin portal granted' : 'admin portal revoked'}`, 'success');
    } catch (e) {
      console.error(e);
      // Revert on failure
      setUsers((prev) => prev.map((u) => (u.id === row.id ? { ...u, role: row.role } : u)));
      showToast('Update failed — try again', 'error');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <motion.div {...pageTransition}>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-white">User Management</h1>
        <p className="text-slate-400 mt-1 text-sm">
          Super-admin only. Toggle admin-portal access for any alumnus. The super-admin role itself is seeded in the database and cannot be changed here.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <GlassCard>
          <p className="text-xs uppercase tracking-wider text-slate-400">Total users</p>
          <p className="text-2xl font-heading font-bold text-white mt-1">{stats.total}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs uppercase tracking-wider text-slate-400">Alumni</p>
          <p className="text-2xl font-heading font-bold text-white mt-1">{stats.alumni}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs uppercase tracking-wider text-slate-400">Admins</p>
          <p className="text-2xl font-heading font-bold text-gold-400 mt-1">{stats.admins}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs uppercase tracking-wider text-slate-400">Super admins</p>
          <p className="text-2xl font-heading font-bold text-gold-400 mt-1">{stats.supers}</p>
        </GlassCard>
      </div>

      {/* List */}
      <GlassCard padding="p-0">
        {loading ? (
          <div className="p-6 text-sm text-slate-400">Loading users…</div>
        ) : users.length === 0 ? (
          <div className="p-6 text-sm text-slate-400">No users yet.</div>
        ) : (
          <motion.ul variants={staggerContainer} initial="hidden" animate="visible" className="divide-y divide-white/5">
            {users.map((u) => {
              const alum = alumniByEmail[u.email];
              const cfg = roleConfig[u.role] || roleConfig.alumni;
              const isSuperAdmin = u.role === 'super-admin';
              const isSelf = u.id === currentUser?.id || u.email === currentUser?.email;
              const disabled = isSuperAdmin || isSelf || busyId === u.id;
              const on = u.role !== 'alumni';
              return (
                <motion.li key={u.id} variants={staggerItem} className="flex items-center gap-4 px-4 sm:px-6 py-4">
                  <Avatar src={alum?.avatar} name={alum?.name || u.email} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-white font-medium truncate">{alum?.name || u.email}</p>
                      <Badge variant={cfg.variant} size="sm">{cfg.label}</Badge>
                      {isSelf && <Badge size="sm">You</Badge>}
                    </div>
                    <p className="text-xs text-slate-500 truncate">{u.email}</p>
                    {alum && (
                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                        {alum.branch} · {alum.currentCity || '—'}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {/* Impersonate — super-admin only, never on self, never
                        while already impersonating. Hidden otherwise so
                        regular admins viewing this page (none today, but
                        possible in future) don't see a button they can't use. */}
                    {viewerIsSuperAdmin && !isSelf && !impersonating && (
                      <button
                        type="button"
                        onClick={() => handleImpersonate(u)}
                        disabled={busyId === u.id}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gold-400/40 text-gold-300 hover:bg-gold-400/10 disabled:opacity-50 whitespace-nowrap"
                        title={`View the portal as ${u.email}`}
                      >
                        {busyId === u.id ? 'Switching…' : 'Impersonate'}
                      </button>
                    )}
                    <div className="flex flex-col items-end gap-1">
                      <Toggle
                        on={on}
                        disabled={disabled}
                        onChange={(next) => handleToggle(u, next)}
                        label={`Admin portal access for ${u.email}`}
                      />
                      <p className="text-[10px] uppercase tracking-wider text-slate-500">
                        Admin portal {on ? 'on' : 'off'}
                      </p>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </GlassCard>

      <p className="text-xs text-slate-500 mt-4">
        The toggle flips the user&apos;s role between <b>alumni</b> and <b>admin</b>. Super-admin rows (and your own row) are locked.
      </p>
    </motion.div>
  );
}
