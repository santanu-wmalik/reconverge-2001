import { useState } from 'react';
import { motion } from 'framer-motion';
import { hotels, carpoolOffers, shuttleSchedule, cityWiseAlumni } from '../../data/travelOptions';
import { pageTransition, staggerContainer, staggerItem } from '../../utils/animationVariants';
import GlassCard from '../../components/ui/GlassCard';
import Tabs from '../../components/ui/Tabs';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ProgressBar from '../../components/ui/ProgressBar';
import SectionHeading from '../../components/shared/SectionHeading';

const tabs = [
  { id: 'hotels', label: 'Hotels' },
  { id: 'carpool', label: 'Carpool' },
  { id: 'shuttle', label: 'Shuttles' },
  { id: 'cities', label: 'Who\'s Coming' },
];

export default function TravelPlannerPage() {
  const [activeTab, setActiveTab] = useState('hotels');

  return (
    <motion.div {...pageTransition}>
      <SectionHeading title="Travel & Accommodation" subtitle="Plan your journey to the reunion" />
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-8" />

      {activeTab === 'hotels' && (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid md:grid-cols-2 gap-5">
          {hotels.map((h) => (
            <motion.div key={h.id} variants={staggerItem}>
              <GlassCard>
                <img src={h.image} alt={h.name} className="w-full h-36 object-cover rounded-xl mb-4" />
                <h3 className="text-white font-semibold">{h.name}</h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-slate-400">
                  <span>📍 {h.distance}</span><span>⭐ {h.rating}</span>
                </div>
                <p className="text-gold-400 font-semibold mt-2">₹{h.priceRange}/night</p>
                {h.special && <Badge variant="gold" size="sm" className="mt-2">{h.special}</Badge>}
                <div className="flex flex-wrap gap-1 mt-3">
                  {h.amenities.map((a) => <Badge key={a} size="sm">{a}</Badge>)}
                </div>
                <Button variant="outline" size="sm" fullWidth className="mt-4">Book Now</Button>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      )}

      {activeTab === 'carpool' && (
        <div className="space-y-4">
          {carpoolOffers.map((cp) => (
            <GlassCard key={cp.id} className="flex items-center gap-4">
              <div className="text-2xl">🚗</div>
              <div className="flex-1">
                <h3 className="text-white font-medium">{cp.driverName}</h3>
                <p className="text-slate-400 text-sm">{cp.fromCity} → NIT Campus</p>
                <p className="text-xs text-slate-500">{cp.departureDate} at {cp.departureTime} | {cp.vehicleType}</p>
              </div>
              <div className="text-right">
                <Badge variant="success">{cp.seatsAvailable} seats</Badge>
                <Button variant="outline" size="sm" className="mt-2">Request</Button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {activeTab === 'shuttle' && (
        <div className="space-y-4">
          {shuttleSchedule.map((sh) => (
            <GlassCard key={sh.id} className="flex items-center gap-4">
              <div className="text-2xl">🚌</div>
              <div className="flex-1">
                <h3 className="text-white font-medium text-sm">{sh.from} → {sh.to}</h3>
                <p className="text-slate-400 text-xs">{sh.date} at {sh.departureTime}</p>
                <ProgressBar value={sh.booked} max={sh.capacity} className="mt-2" />
                <p className="text-xs text-slate-500 mt-1">{sh.booked}/{sh.capacity} booked</p>
              </div>
              <Button variant="outline" size="sm" disabled={sh.booked >= sh.capacity}>Book</Button>
            </GlassCard>
          ))}
        </div>
      )}

      {activeTab === 'cities' && (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cityWiseAlumni.sort((a, b) => b.count - a.count).map((c) => (
            <motion.div key={c.city} variants={staggerItem}>
              <GlassCard className="text-center" padding="p-4">
                <div className="text-2xl font-bold gradient-text font-heading">{c.count}</div>
                <p className="text-white text-sm font-medium mt-1">{c.city}</p>
                <p className="text-slate-500 text-xs">alumni registered</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
