import { useState } from 'react';
import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, staggerItem } from '../../utils/animationVariants';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import { planningLog } from '../../data/adminData';

const statusConfig = {
  completed: { variant: 'success', label: 'Completed' },
  in_progress: { variant: 'gold', label: 'In Progress' },
};

export default function PlanningLogPage() {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <motion.div {...pageTransition}>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-white">Planning Log</h1>
        <p className="text-slate-400 mt-1">Detailed timeline of all planning activities, meeting outcomes, and decisions</p>
      </div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
        {planningLog.map((entry) => {
          const status = statusConfig[entry.status] || statusConfig.in_progress;
          const isExpanded = expandedId === entry.id;

          return (
            <motion.div key={entry.id} variants={staggerItem}>
              <GlassCard
                className={`cursor-pointer transition-all duration-300 ${isExpanded ? 'border-gold-500/30' : 'hover:border-white/10'}`}
                onClick={() => setExpandedId(isExpanded ? null : entry.id)}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <time className="text-xs font-medium text-gold-400">{entry.date}</time>
                      <Badge variant={status.variant} size="sm">{status.label}</Badge>
                    </div>
                    <h3 className="text-white font-semibold">{entry.title}</h3>
                    <p className="text-slate-400 text-sm mt-1">{entry.summary}</p>
                  </div>
                  <svg
                    className={`w-5 h-5 text-slate-500 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-white/5"
                  >
                    {/* Internal Notes */}
                    {entry.internalNotes && (
                      <div className="mb-4">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-400 mb-2">Internal Notes</h4>
                        <p className="text-slate-400 text-sm bg-white/3 rounded-lg p-3 border border-white/5">{entry.internalNotes}</p>
                      </div>
                    )}

                    {/* Action Items */}
                    {entry.actionItems && entry.actionItems.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-400 mb-2">Action Items</h4>
                        <ul className="space-y-1.5">
                          {entry.actionItems.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                              <span className="text-gold-400 mt-0.5">→</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
