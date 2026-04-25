import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

// A persistent, full-width banner that's only rendered while a super-admin
// is impersonating another user. It's deliberately loud so nobody forgets
// they're acting as someone else — accidental writes during impersonation
// would be hard to untangle later.

export default function ImpersonationBanner() {
  const { impersonating, user, stopImpersonating } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  if (!impersonating) return null;

  const handleStop = async () => {
    setBusy(true);
    const res = await stopImpersonating();
    setBusy(false);
    if (!res.success) {
      showToast(res.error || 'Could not stop impersonating', 'error');
      return;
    }
    showToast('Returned to your super-admin session', 'success');
    navigate('/admin/users');
  };

  return (
    <div className="sticky top-0 z-[60] bg-amber-500/95 text-amber-950 border-b border-amber-700/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-3 text-sm">
        <p className="font-medium truncate">
          <span className="mr-2">👁️</span>
          Viewing the portal as <b>{user?.name || user?.email}</b>. Any action you take is recorded
          as them.
        </p>
        <button
          type="button"
          onClick={handleStop}
          disabled={busy}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-950 text-amber-100 hover:bg-amber-900 disabled:opacity-50 whitespace-nowrap"
        >
          {busy ? 'Stopping…' : 'Stop impersonating'}
        </button>
      </div>
    </div>
  );
}
