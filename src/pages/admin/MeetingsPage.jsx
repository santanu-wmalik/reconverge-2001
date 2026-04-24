import { useState } from 'react';
import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, staggerItem } from '../../utils/animationVariants';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import Tabs from '../../components/ui/Tabs';
import { meetingMinutes, icarAgenda } from '../../data/adminData';

const statusConfig = {
  logged: { variant: 'success', label: 'Logged' },
  draft: { variant: 'warning', label: 'Draft' },
};

function formatDate(iso) {
  try {
    return new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return iso;
  }
}

function MoMSection() {
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-5">
      {meetingMinutes.map((m) => {
        const status = statusConfig[m.status] || statusConfig.logged;
        return (
          <motion.div key={m.id} variants={staggerItem}>
            <GlassCard>
              <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <time className="text-xs uppercase tracking-wider text-gold-400 font-semibold">
                      {formatDate(m.date)}
                    </time>
                    <Badge variant={status.variant} size="sm">{status.label}</Badge>
                  </div>
                  <h3 className="text-white font-heading font-semibold">
                    Bi-Weekly Volunteers Syncup
                  </h3>
                  {m.attendees && m.attendees.length > 0 ? (
                    <p className="text-xs text-slate-500 mt-1">
                      Attendees: <span className="text-slate-300">{m.attendees.join(', ')}</span>
                    </p>
                  ) : (
                    <p className="text-xs text-amber-400/80 italic mt-1">Draft — attendees to be confirmed</p>
                  )}
                </div>
              </div>

              <ol className="space-y-3">
                {m.items.map((item, i) => (
                  <li key={i} className="bg-white/3 rounded-xl p-3 border border-white/5">
                    <div className="flex gap-3">
                      <span className="text-gold-400 font-semibold text-xs uppercase tracking-wider flex-shrink-0">#{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-200 leading-relaxed">{item.text}</p>
                        {(item.owner || item.followUp) && (
                          <div className="mt-2 pt-2 border-t border-white/5 text-xs">
                            {item.owner && (
                              <p className="text-slate-500">
                                <span className="uppercase tracking-wider text-gold-400/70 mr-2">Owner</span>
                                <span className="text-slate-300">{item.owner}</span>
                              </p>
                            )}
                            {item.followUp && (
                              <p className="text-slate-400 italic mt-1">{item.followUp}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </GlassCard>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

function ICARSection() {
  return (
    <>
      <GlassCard className="border-primary-400/30 bg-gradient-to-br from-primary-900/20 to-transparent mb-6">
        <div className="flex items-start gap-3">
          <div className="text-2xl">📝</div>
          <div>
            <h3 className="text-white font-heading font-semibold mb-1">Pre-meeting Q&A with NITC ICAR</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Eight topic buckets drafted ahead of the ICAR (International, Alumni &amp; Corporate Relations) meeting at NIT Calicut. The SPOC captures the institute\u2019s responses alongside each question as the meeting unfolds.
            </p>
          </div>
        </div>
      </GlassCard>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
        {icarAgenda.map((bucket, idx) => (
          <motion.div key={bucket.id} variants={staggerItem}>
            <GlassCard>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-sm font-heading font-bold text-gold-400">
                  {idx + 1}
                </div>
                <h3 className="text-white font-heading font-semibold text-base">{bucket.title}</h3>
              </div>
              <ul className="space-y-2">
                {bucket.questions.map((q, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-gold-400 mt-0.5 flex-shrink-0">›</span>
                    <span className="leading-relaxed">{q}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}

const tabs = [
  { id: 'mom', label: 'Minutes of Meeting', icon: '📋' },
  { id: 'icar', label: 'NITC ICAR Agenda', icon: '🏛️' },
];

export default function MeetingsPage() {
  const [tab, setTab] = useState('mom');

  return (
    <motion.div {...pageTransition}>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-white">Meetings</h1>
        <p className="text-slate-400 mt-1">Minutes of bi-weekly volunteer syncs and pre-meeting agenda for the NITC ICAR engagement.</p>
      </div>

      <Tabs tabs={tabs} activeTab={tab} onChange={setTab} className="mb-6" />

      <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        {tab === 'mom' ? <MoMSection /> : <ICARSection />}
      </motion.div>
    </motion.div>
  );
}
