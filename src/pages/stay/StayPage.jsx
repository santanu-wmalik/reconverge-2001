import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, staggerItem } from '../../utils/animationVariants';
import { hotels, galaDinner, accommodationContact } from '../../data/travelOptions';
import SectionHeading from '../../components/shared/SectionHeading';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ProgressBar from '../../components/ui/ProgressBar';

const primary = hotels.find((h) => h.tier === 'primary');
const backups = hotels.filter((h) => h.tier === 'backup');
const resort = hotels.find((h) => h.tier === 'resort');

const totalInventory = primary ? primary.roomTypes.reduce((s, r) => s + r.inventory, 0) : 0;

function RoomRateCard({ room }) {
  return (
    <GlassCard className="h-full border-gold-500/10 hover:border-gold-500/30">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-white font-heading font-semibold">{room.name}</h4>
          <p className="text-xs text-slate-500 mt-1">{room.inventory} room{room.inventory === 1 ? '' : 's'} in block</p>
        </div>
        <span className="text-xs text-slate-500 line-through">₹{room.actualRate.toLocaleString('en-IN')}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">Single</p>
          <p className="text-gold-400 font-bold text-lg">₹{room.singleRate.toLocaleString('en-IN')}</p>
          <p className="text-[10px] text-slate-500">+ GST / night</p>
        </div>
        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">Double</p>
          <p className="text-gold-400 font-bold text-lg">₹{room.doubleRate.toLocaleString('en-IN')}</p>
          <p className="text-[10px] text-slate-500">+ GST / night</p>
        </div>
      </div>

      <p className="text-xs text-slate-400">Extra person (10+ yrs): ₹{room.extraPerson.toLocaleString('en-IN')} + GST</p>
      <p className="text-xs text-slate-500 mt-2 italic">{room.note}</p>
    </GlassCard>
  );
}

function GalaMenuCard({ menu }) {
  const specialWithTax = Math.round(menu.specialRate * (1 + menu.taxPercent / 100));
  return (
    <GlassCard className="h-full">
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-white font-heading font-semibold">{menu.name}</h4>
        <Badge variant="gold" size="sm">Our Rate</Badge>
      </div>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-2xl font-bold text-gold-400">₹{menu.specialRate.toLocaleString('en-IN')}</span>
        <span className="text-xs text-slate-500 line-through">₹{menu.actualRate.toLocaleString('en-IN')}</span>
        <span className="text-xs text-slate-500">+ {menu.taxPercent}%</span>
      </div>
      <p className="text-xs text-slate-500 mb-3">≈ ₹{specialWithTax.toLocaleString('en-IN')} per person inclusive</p>
      <p className="text-sm text-slate-400 leading-relaxed">{menu.includes}</p>
    </GlassCard>
  );
}

export default function StayPage() {
  return (
    <motion.div {...pageTransition} className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <SectionHeading
        title="Stay & Gala Dinner"
        subtitle="Where you'll sleep, eat, and celebrate during REConverge 2001"
      />

      {/* Primary hotel */}
      {primary && (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="mb-12">
          <motion.div variants={staggerItem}>
            <GlassCard className="border-gold-500/30 bg-gradient-to-br from-gold-500/5 to-primary-900/20">
              <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                <div>
                  <Badge variant="gold" size="sm" className="mb-2">{primary.badge}</Badge>
                  <h2 className="text-2xl md:text-3xl font-heading font-bold text-white">{primary.name}</h2>
                  <p className="text-sm text-emerald-400 mt-1">{primary.status}</p>
                  {primary.tagline && <p className="text-xs text-slate-400 mt-1 italic">{primary.tagline}</p>}
                  {primary.website && (
                    <a
                      href={primary.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-xs text-gold-400 hover:text-gold-300 underline"
                    >
                      🔗 gokulamhotels.com →
                    </a>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Inventory used</p>
                  <p className="text-white font-semibold">{primary.roomsReserved} / {totalInventory}</p>
                  <div className="w-36 mt-1">
                    <ProgressBar value={primary.roomsReserved} max={totalInventory} />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-3 mb-5 text-sm">
                {primary.distanceFromStation && <div className="flex items-center gap-2 text-slate-300"><span>🚆</span>{primary.distanceFromStation}</div>}
                {primary.distanceFromAirport && <div className="flex items-center gap-2 text-slate-300"><span>✈️</span>{primary.distanceFromAirport}</div>}
                {primary.starClass && <div className="flex items-center gap-2 text-slate-300"><span>🏨</span>{primary.starClass}</div>}
                {primary.checkIn && primary.checkOut && <div className="flex items-center gap-2 text-slate-300"><span>🕑</span>Check-in {primary.checkIn} · Check-out {primary.checkOut}</div>}
                {primary.blockSize && <div className="flex items-center gap-2 text-slate-300"><span>🛏️</span>{primary.blockSize}-room block held</div>}
              </div>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {primary.amenities.map((a) => <Badge key={a} size="sm">{a}</Badge>)}
              </div>

              <h3 className="text-sm uppercase tracking-wider text-gold-400 font-semibold mb-3">Room Types & Rates</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {primary.roomTypes.map((r) => <RoomRateCard key={r.id} room={r} />)}
              </div>

              <h3 className="text-sm uppercase tracking-wider text-gold-400 font-semibold mb-3">Hotel Policies</h3>
              <ul className="grid md:grid-cols-2 gap-x-6 gap-y-2 text-sm text-slate-400 mb-5">
                <li className="flex gap-2"><span className="text-gold-400">›</span>{primary.policies.extraPerson}</li>
                <li className="flex gap-2"><span className="text-gold-400">›</span>{primary.policies.cancellation}</li>
                <li className="flex gap-2"><span className="text-gold-400">›</span>{primary.policies.payment}</li>
                <li className="flex gap-2"><span className="text-gold-400">›</span>{primary.policies.id}</li>
              </ul>

              <div className="bg-primary-900/30 rounded-xl p-4 border border-gold-500/20">
                <p className="text-xs uppercase tracking-wider text-gold-400 font-semibold mb-2">How to book</p>
                <p className="text-sm text-slate-300 mb-3">{primary.bookingMethod}</p>
                <p className="text-xs text-slate-500 italic mb-4">{accommodationContact.note}</p>
                <div className="flex flex-wrap gap-2">
                  <a href={`mailto:${accommodationContact.email}?subject=${encodeURIComponent(accommodationContact.quoteRef)}`}>
                    <Button size="sm">📧 Email AFC</Button>
                  </a>
                  <a href={accommodationContact.whatsapp} target="_blank" rel="noreferrer">
                    <Button size="sm" variant="outline">💬 WhatsApp General Comms</Button>
                  </a>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}

      {/* Gala Dinner */}
      <div className="mb-12">
        <SectionHeading
          title="Gala Dinner — Manachira Rooftop"
          subtitle="Both evenings at the 7th-floor rooftop of Gokulam Grand"
        />
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div variants={staggerItem}>
            <GlassCard className="mb-5">
              <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
                <div><span className="text-slate-500">Venue:</span> {galaDinner.venue}</div>
                <div><span className="text-slate-500">Dates:</span> Dec 27 & 28, 2026</div>
                <div><span className="text-slate-500">Time:</span> {galaDinner.time}</div>
                <div><span className="text-slate-500">Seating:</span> {galaDinner.seatingPlan}</div>
                <div><span className="text-slate-500">Expected:</span> {galaDinner.guaranteedPax} guests</div>
                <div><span className="text-slate-500">Music till:</span> {galaDinner.musicCutoff}</div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-xs uppercase tracking-wider text-gold-400 font-semibold mb-2">What's included</p>
                <div className="flex flex-wrap gap-1.5">
                  {galaDinner.includes.map((i) => <Badge key={i} size="sm">{i}</Badge>)}
                </div>
              </div>
              <ul className="mt-4 text-xs text-slate-500 space-y-1">
                {galaDinner.notes.map((n) => <li key={n}>• {n}</li>)}
              </ul>
            </GlassCard>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4">
            {galaDinner.menus.map((m) => (
              <motion.div key={m.id} variants={staggerItem}>
                <GalaMenuCard menu={m} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Backup hotels */}
      <div className="mb-12">
        <SectionHeading title="Backup Hotels" subtitle="If the Gokulam block fills up" />
        <div className="grid md:grid-cols-2 gap-5">
          {backups.map((h) => (
            <GlassCard key={h.id}>
              <Badge size="sm" className="mb-2">{h.badge}</Badge>
              <h3 className="text-white font-heading font-semibold">{h.name}</h3>
              {h.tagline && <p className="text-xs text-slate-400 mt-1 italic">{h.tagline}</p>}
              <p className="text-xs text-amber-400 mt-2">{h.status}</p>
              <p className="text-xs text-slate-500 italic mt-3">{h.bookingMethod}</p>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Resort */}
      {resort && (
        <div className="mb-8">
          <SectionHeading title="Optional Resort Evening" subtitle="Extend your stay after Dec 29" />
          <GlassCard>
            <Badge size="sm" className="mb-2">{resort.badge}</Badge>
            <h3 className="text-white font-heading font-semibold">{resort.name}</h3>
            {resort.tagline && <p className="text-xs text-slate-400 mt-1 italic">{resort.tagline}</p>}
            <p className="text-xs text-slate-400 mt-2">{resort.status}</p>
            <p className="text-xs text-slate-500 italic mt-3">{resort.bookingMethod}</p>
          </GlassCard>
        </div>
      )}
    </motion.div>
  );
}
