import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animationVariants';
import { alumniApi, roomingApi } from '../../services/api';
import { hotels } from '../../data/travelOptions';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import ProgressBar from '../../components/ui/ProgressBar';

const STATUS_CONFIG = {
  confirmed: { variant: 'success', label: 'Confirmed' },
  pending: { variant: 'warning', label: 'Pending' },
  cancelled: { variant: 'default', label: 'Cancelled' },
  waitlist: { variant: 'default', label: 'Waitlist' },
};

const PAYMENT_CONFIG = {
  paid: { variant: 'success', label: 'Paid' },
  'pending-verification': { variant: 'warning', label: 'Pending UID' },
  unpaid: { variant: 'default', label: 'Unpaid' },
};

const primaryHotel = hotels.find((h) => h.tier === 'primary');
const totalInventory = primaryHotel ? primaryHotel.roomTypes.reduce((s, r) => s + r.inventory, 0) : 0;

export default function RoomingPage() {
  const [rooming, setRooming] = useState([]);
  const [alumniMap, setAlumniMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      roomingApi.getAll().catch(() => []),
      alumniApi.getAll().catch(() => []),
    ]).then(([r, a]) => {
      setRooming(r);
      const map = {};
      a.forEach((al) => { map[al.id] = al; });
      setAlumniMap(map);
      setLoading(false);
    });
  }, []);

  const stats = useMemo(() => {
    const allocated = rooming.length;
    const confirmed = rooming.filter((r) => r.status === 'confirmed').length;
    const paid = rooming.filter((r) => r.paymentStatus === 'paid').length;
    const pendingUid = rooming.filter((r) => r.paymentStatus === 'pending-verification').length;
    const occupants = rooming.reduce((s, r) => s + (r.occupants || 0), 0);
    return { allocated, confirmed, paid, pendingUid, occupants };
  }, [rooming]);

  const byRoomType = useMemo(() => {
    if (!primaryHotel) return [];
    return primaryHotel.roomTypes.map((rt) => {
      const used = rooming.filter((r) => r.hotelId === primaryHotel.id && r.roomType && r.roomType.toLowerCase().includes(rt.name.split(' ')[0].toLowerCase())).length;
      return { ...rt, used };
    });
  }, [rooming]);

  return (
    <motion.div {...pageTransition}>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-ink">Room Allotment Tracker</h1>
        <p className="text-ink-soft mt-1">Live view of the Gokulam Grand block — {totalInventory} rooms negotiated for the batch.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <GlassCard>
          <p className="text-xs uppercase tracking-wider text-ink-soft">Allocations</p>
          <p className="text-2xl font-bold text-ink mt-1">{stats.allocated} / {totalInventory}</p>
          <div className="mt-2"><ProgressBar value={stats.allocated} max={totalInventory} /></div>
        </GlassCard>
        <GlassCard>
          <p className="text-xs uppercase tracking-wider text-ink-soft">Confirmed</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{stats.confirmed}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs uppercase tracking-wider text-ink-soft">Paid</p>
          <p className="text-2xl font-bold text-gold-700 mt-1">{stats.paid}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs uppercase tracking-wider text-ink-soft">UID Pending</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">{stats.pendingUid}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs uppercase tracking-wider text-ink-soft">Occupants</p>
          <p className="text-2xl font-bold text-ink mt-1">{stats.occupants}</p>
        </GlassCard>
      </div>

      {/* By room type */}
      <h2 className="text-lg font-heading font-semibold text-ink mb-3">Inventory by Room Type (Gokulam Grand)</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {byRoomType.map((rt) => (
          <GlassCard key={rt.id}>
            <h4 className="text-ink font-semibold text-sm">{rt.name}</h4>
            <p className="text-2xl font-bold text-gold-700 mt-2">{rt.used} / {rt.inventory}</p>
            <ProgressBar value={rt.used} max={rt.inventory} className="mt-2" />
            <p className="text-xs text-ink-muted mt-2">₹{rt.singleRate.toLocaleString('en-IN')} / ₹{rt.doubleRate.toLocaleString('en-IN')} (single / double + GST)</p>
          </GlassCard>
        ))}
      </div>

      {/* Allocation table */}
      <h2 className="text-lg font-heading font-semibold text-ink mb-3">Allocations</h2>
      <GlassCard padding="p-0">
        {loading ? (
          <div className="p-6 text-ink-soft text-sm">Loading…</div>
        ) : rooming.length === 0 ? (
          <div className="p-6 text-ink-soft text-sm">No allocations recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-ink-muted border-b border-forest-500/15">
                  <th className="py-3 px-4">Alumnus</th>
                  <th className="py-3 px-4">Room Type</th>
                  <th className="py-3 px-4">Occupants</th>
                  <th className="py-3 px-4">Arrival → Departure</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Notes</th>
                </tr>
              </thead>
              <tbody>
                {rooming.map((r) => {
                  const alum = alumniMap[r.alumniId];
                  const statusCfg = STATUS_CONFIG[r.status] || STATUS_CONFIG.pending;
                  const payCfg = PAYMENT_CONFIG[r.paymentStatus] || PAYMENT_CONFIG.unpaid;
                  return (
                    <tr key={r.id} className="border-b border-forest-500/15 hover:bg-forest-600/8">
                      <td className="py-3 px-4">
                        <div className="text-ink font-medium">{alum?.name || r.alumniId}</div>
                        <div className="text-xs text-ink-muted">{alum?.branch || '—'}</div>
                      </td>
                      <td className="py-3 px-4 text-ink-soft">{r.roomType}</td>
                      <td className="py-3 px-4 text-ink-soft">{r.occupants}</td>
                      <td className="py-3 px-4 text-ink-soft text-xs">{r.arrivalDate} → {r.departureDate}</td>
                      <td className="py-3 px-4"><Badge variant={statusCfg.variant} size="sm">{statusCfg.label}</Badge></td>
                      <td className="py-3 px-4"><Badge variant={payCfg.variant} size="sm">{payCfg.label}</Badge></td>
                      <td className="py-3 px-4 text-ink-muted text-xs italic">{r.notes || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}
