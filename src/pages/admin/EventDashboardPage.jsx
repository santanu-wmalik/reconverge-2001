import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, staggerItem } from '../../utils/animationVariants';
import { formatCurrency, formatNumber, formatPercentage } from '../../utils/formatters';
import { alumniApi, rsvpApi, orderApi, itineraryApi } from '../../services/api';
import { sponsors } from '../../data/sponsors';
import { eventSchedule, eventDays } from '../../data/events';
import { giveBackInitiatives } from '../../data/donationCampaigns';
import { EVENT_CONFIG } from '../../data/constants';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import ProgressBar from '../../components/ui/ProgressBar';
import { isDemoUser } from '../../utils/isDemoUser';

const BATCH_STRENGTH = 350;
const TIER_VALUES = { platinum: 500000, gold: 250000, silver: 100000 };

const giveBackStatusConfig = {
  active: { variant: 'success', label: 'Active' },
  planning: { variant: 'gold', label: 'Planning' },
  discussion: { variant: 'default', label: 'Discussion' },
};

export default function EventDashboardPage() {
  const [alumni, setAlumni] = useState([]);
  const [rsvps, setRsvps] = useState([]);
  const [orders, setOrders] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      alumniApi.getAll().catch(() => []),
      rsvpApi.getAll().catch(() => []),
      orderApi.getAll().catch(() => []),
      itineraryApi.getAll().catch(() => []),
    ]).then(([alumniData, rsvpData, orderData, itineraryData]) => {
      setAlumni(alumniData);
      setRsvps(rsvpData);
      setOrders(orderData);
      setItineraries(itineraryData);
      setLoading(false);
    });
  }, []);

  // --- Computed metrics ---

  // Real alumni only — demo seed accounts (admin@/alumni@/superuser@email.com)
  // must not inflate registration or revenue projections.
  const realAlumni = useMemo(() => alumni.filter((a) => !isDemoUser(a)), [alumni]);
  const realRsvps = useMemo(() => rsvps.filter((r) => !isDemoUser(r)), [rsvps]);

  const registeredCount = realAlumni.length;
  const rsvpCount = realRsvps.length;
  const volunteerCount = realRsvps.filter((r) => r.volunteer).length;

  const orderTotal = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const orderCount = orders.length;
  const avgOrderValue = orderCount > 0 ? orderTotal / orderCount : 0;

  const sponsorshipTotal = useMemo(() => {
    return sponsors.reduce((sum, s) => sum + (TIER_VALUES[s.tier] || 0), 0);
  }, []);

  const sponsorsByTier = useMemo(() => {
    const tiers = { platinum: [], gold: [], silver: [] };
    sponsors.forEach((s) => {
      if (tiers[s.tier]) tiers[s.tier].push(s);
    });
    return tiers;
  }, []);

  const foodPrefs = useMemo(() => {
    const counts = {};
    rsvps.forEach((r) => {
      const pref = r.foodPreference || 'Unknown';
      counts[pref] = (counts[pref] || 0) + 1;
    });
    return counts;
  }, [rsvps]);

  const estimatedRevenue = useMemo(() => {
    const regFee = registeredCount * EVENT_CONFIG.registrationFee;
    const familyFee = rsvps.reduce((sum, r) => {
      const fam = parseInt(r.familyJoining) || 0;
      return sum + fam * EVENT_CONFIG.familyMemberFee;
    }, 0);
    return regFee + familyFee;
  }, [registeredCount, rsvps]);

  // Event popularity from itineraries
  const eventPopularity = useMemo(() => {
    const counts = {};
    itineraries.forEach((itin) => {
      (itin.selectedEventIds || []).forEach((eventId) => {
        counts[eventId] = (counts[eventId] || 0) + 1;
      });
    });
    return eventSchedule
      .map((evt) => ({ ...evt, subscribers: counts[evt.id] || 0 }))
      .sort((a, b) => b.subscribers - a.subscribers);
  }, [itineraries]);

  const topEvents = eventPopularity.slice(0, 5);
  const maxSubscribers = topEvents.length > 0 ? topEvents[0].subscribers : 1;

  // Attendance by day
  const attendanceByDay = useMemo(() => {
    const dayEventIds = {};
    eventSchedule.forEach((evt) => {
      if (!dayEventIds[evt.day]) dayEventIds[evt.day] = [];
      dayEventIds[evt.day].push(evt.id);
    });

    return eventDays.map((d) => {
      const eventIds = dayEventIds[d.day] || [];
      const subscriberSet = new Set();
      itineraries.forEach((itin) => {
        (itin.selectedEventIds || []).forEach((eid) => {
          if (eventIds.includes(eid)) subscriberSet.add(itin.userId);
        });
      });
      return {
        ...d,
        eventCount: eventIds.length,
        subscriberCount: subscriberSet.size,
      };
    });
  }, [itineraries]);

  // Order items breakdown
  const itemsBreakdown = useMemo(() => {
    const counts = {};
    orders.forEach((order) => {
      (order.items || []).forEach((item) => {
        const key = item.name || item.productId;
        if (!counts[key]) counts[key] = { name: key, quantity: 0, revenue: 0 };
        counts[key].quantity += item.quantity || 1;
        counts[key].revenue += (item.price || 0) * (item.quantity || 1);
      });
    });
    return Object.values(counts).sort((a, b) => b.revenue - a.revenue);
  }, [orders]);

  if (loading) {
    return (
      <motion.div {...pageTransition}>
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-ink">Event Dashboard</h1>
          <p className="text-ink-soft mt-1">Loading event metrics...</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <GlassCard key={i}>
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-cream-200 rounded w-2/3" />
                <div className="h-8 bg-cream-200 rounded w-1/2" />
              </div>
            </GlassCard>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div {...pageTransition}>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-ink">Event Dashboard</h1>
        <p className="text-ink-soft mt-1">REConverge 2001 — Complete Event Overview</p>
      </div>

      {/* === KPI Cards === */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[
          { icon: '👥', label: 'Registered Alumni', value: registeredCount, sub: `of ${BATCH_STRENGTH} batch` },
          { icon: '✅', label: 'RSVPs Received', value: rsvpCount, sub: `${volunteerCount} volunteers` },
          { icon: '🛍️', label: 'Merchandise Revenue', value: formatCurrency(orderTotal), sub: `${orderCount} order${orderCount !== 1 ? 's' : ''}` },
          { icon: '🤝', label: 'Sponsorship Raised', value: formatCurrency(sponsorshipTotal), sub: `${sponsors.length} sponsors` },
          { icon: '📅', label: 'Events Scheduled', value: eventSchedule.length, sub: `across ${eventDays.length} days` },
          { icon: '💛', label: 'Give Back Initiatives', value: giveBackInitiatives.length, sub: `${giveBackInitiatives.filter((g) => g.status === 'active').length} active` },
        ].map((stat) => (
          <motion.div key={stat.label} variants={staggerItem}>
            <GlassCard>
              <div className="text-2xl mb-2">{stat.icon}</div>
              <p className="text-2xl font-heading font-bold text-ink">
                {typeof stat.value === 'number' ? formatNumber(stat.value) : stat.value}
              </p>
              <p className="text-xs text-ink-soft mt-1">{stat.label}</p>
              <p className="text-[11px] text-ink-muted mt-0.5">{stat.sub}</p>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      {/* === Registration & Attendance + Sponsorship === */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Registration & Attendance */}
        <GlassCard hover={false}>
          <h2 className="text-lg font-heading font-bold text-ink mb-5 flex items-center gap-2">
            <span className="text-gold-700">✦</span> Registration & Attendance
          </h2>

          {/* Progress bar */}
          <div className="mb-5">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-ink-soft">Registration Progress</span>
              <span className="text-gold-700 font-semibold">
                {registeredCount} / {BATCH_STRENGTH} ({formatPercentage(registeredCount, BATCH_STRENGTH)}%)
              </span>
            </div>
            <ProgressBar value={registeredCount} max={BATCH_STRENGTH} />
          </div>

          {/* Estimated revenue */}
          <div className="flex justify-between items-center py-3 border-t border-forest-500/15">
            <span className="text-ink-soft text-sm">Estimated Registration Revenue</span>
            <span className="text-gold-700 font-bold">{formatCurrency(estimatedRevenue)}</span>
          </div>

          {/* RSVP stats */}
          <div className="flex justify-between items-center py-3 border-t border-forest-500/15">
            <span className="text-ink-soft text-sm">Total RSVPs</span>
            <span className="text-ink font-semibold">{rsvpCount}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-t border-forest-500/15">
            <span className="text-ink-soft text-sm">Willing Volunteers</span>
            <span className="text-ink font-semibold">{volunteerCount}</span>
          </div>

          {/* Food preference breakdown */}
          {Object.keys(foodPrefs).length > 0 && (
            <div className="mt-4 pt-4 border-t border-forest-500/15">
              <p className="text-xs font-semibold text-ink-soft uppercase tracking-wider mb-3">Food Preferences</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(foodPrefs).map(([pref, count]) => (
                  <Badge key={pref} variant="default" size="sm">
                    {pref}: {count}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </GlassCard>

        {/* Sponsorship Overview */}
        <GlassCard hover={false}>
          <h2 className="text-lg font-heading font-bold text-ink mb-5 flex items-center gap-2">
            <span className="text-gold-700">✦</span> Sponsorship Overview
          </h2>

          <div className="flex justify-between items-center py-3 border-b border-forest-500/15 mb-4">
            <span className="text-ink-soft text-sm">Total Sponsorship</span>
            <span className="text-gold-700 font-bold text-lg">{formatCurrency(sponsorshipTotal)}</span>
          </div>

          {[
            { tier: 'platinum', label: 'Platinum', color: 'text-purple-400', emoji: '💎' },
            { tier: 'gold', label: 'Gold', color: 'text-gold-700', emoji: '🥇' },
            { tier: 'silver', label: 'Silver', color: 'text-ink-soft', emoji: '🥈' },
          ].map(({ tier, label, color, emoji }) => (
            <div key={tier} className="flex items-center justify-between py-2.5 border-b border-forest-500/15 last:border-0">
              <div className="flex items-center gap-2">
                <span>{emoji}</span>
                <div>
                  <p className={`text-sm font-medium ${color}`}>{label}</p>
                  <p className="text-xs text-ink-muted">{sponsorsByTier[tier].length} sponsor{sponsorsByTier[tier].length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <span className="text-ink font-semibold text-sm">
                {formatCurrency(sponsorsByTier[tier].length * TIER_VALUES[tier])}
              </span>
            </div>
          ))}

          <div className="mt-4 pt-3 border-t border-forest-500/15">
            <p className="text-xs text-ink-muted">
              Tier values: Platinum {formatCurrency(TIER_VALUES.platinum)} | Gold {formatCurrency(TIER_VALUES.gold)} | Silver {formatCurrency(TIER_VALUES.silver)}
            </p>
          </div>
        </GlassCard>
      </div>

      {/* === Attendance by Day === */}
      <div className="mb-6">
        <h2 className="text-lg font-heading font-bold text-ink mb-4 flex items-center gap-2">
          <span className="text-gold-700">✦</span> Attendance by Day
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {attendanceByDay.map((day) => (
            <GlassCard key={day.day}>
              <div className="text-center">
                <p className="text-gold-700 text-xs font-semibold uppercase tracking-wider">{day.label}</p>
                <p className="text-ink-soft text-xs mt-0.5">{day.subtitle}</p>
                <div className="mt-4 mb-3">
                  <p className="text-3xl font-heading font-bold text-ink">{day.subscriberCount}</p>
                  <p className="text-xs text-ink-soft mt-1">subscribers</p>
                </div>
                <div className="flex justify-center gap-4 text-xs text-ink-muted">
                  <span>{day.eventCount} events</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* === Popular Events + Orders === */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Most Popular Events */}
        <GlassCard hover={false}>
          <h2 className="text-lg font-heading font-bold text-ink mb-5 flex items-center gap-2">
            <span className="text-gold-700">✦</span> Most Popular Events
          </h2>
          {topEvents.length > 0 ? (
            <div className="space-y-4">
              {topEvents.map((evt, i) => (
                <div key={evt.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-sm shrink-0">{evt.icon}</span>
                      <p className="text-sm text-ink font-medium truncate">{evt.title}</p>
                    </div>
                    <Badge variant={i === 0 ? 'gold' : 'default'} size="sm" className="shrink-0 ml-2">
                      {evt.subscribers} {evt.subscribers === 1 ? 'sub' : 'subs'}
                    </Badge>
                  </div>
                  <ProgressBar value={evt.subscribers} max={maxSubscribers} color={i === 0 ? 'gold' : 'primary'} />
                  <p className="text-[11px] text-ink-muted mt-1">
                    Day {evt.day} • {evt.startTime}–{evt.endTime} • {evt.venue}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-ink-muted text-sm text-center py-4">No itinerary data yet</p>
          )}
        </GlassCard>

        {/* Merchandise & Orders */}
        <GlassCard hover={false}>
          <h2 className="text-lg font-heading font-bold text-ink mb-5 flex items-center gap-2">
            <span className="text-gold-700">✦</span> Merchandise & Orders
          </h2>

          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="text-center p-3 bg-white rounded-xl">
              <p className="text-xl font-heading font-bold text-ink">{orderCount}</p>
              <p className="text-[11px] text-ink-soft mt-1">Orders</p>
            </div>
            <div className="text-center p-3 bg-white rounded-xl">
              <p className="text-xl font-heading font-bold text-gold-700">{formatCurrency(orderTotal)}</p>
              <p className="text-[11px] text-ink-soft mt-1">Revenue</p>
            </div>
            <div className="text-center p-3 bg-white rounded-xl">
              <p className="text-xl font-heading font-bold text-ink">{formatCurrency(Math.round(avgOrderValue))}</p>
              <p className="text-[11px] text-ink-soft mt-1">Avg. Order</p>
            </div>
          </div>

          {itemsBreakdown.length > 0 ? (
            <>
              <p className="text-xs font-semibold text-ink-soft uppercase tracking-wider mb-3">Items Ordered</p>
              <div className="space-y-2">
                {itemsBreakdown.map((item) => (
                  <div key={item.name} className="flex items-center justify-between py-2 border-b border-forest-500/15 last:border-0">
                    <div>
                      <p className="text-sm text-ink">{item.name}</p>
                      <p className="text-xs text-ink-muted">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm text-gold-700 font-semibold">{formatCurrency(item.revenue)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-ink-muted text-sm text-center py-4">No orders yet</p>
          )}
        </GlassCard>
      </div>

      {/* === Give Back Initiatives === */}
      <div className="mb-6">
        <h2 className="text-lg font-heading font-bold text-ink mb-4 flex items-center gap-2">
          <span className="text-gold-700">✦</span> Give Back Initiatives
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {giveBackInitiatives.map((initiative) => {
            const statusCfg = giveBackStatusConfig[initiative.status] || giveBackStatusConfig.discussion;
            return (
              <GlassCard key={initiative.id}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">{initiative.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-ink truncate">{initiative.title}</h3>
                      <Badge variant={statusCfg.variant} size="sm" className="shrink-0">{statusCfg.label}</Badge>
                    </div>
                    <p className="text-xs text-ink-soft line-clamp-2">{initiative.description}</p>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
