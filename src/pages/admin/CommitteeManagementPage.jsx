import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, staggerItem } from '../../utils/animationVariants';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import { committees, branchRepresentatives } from '../../data/committees';

export default function CommitteeManagementPage() {
  const totalMembers = committees.reduce((sum, c) => sum + c.members.length + (c.lead && c.lead !== 'TBD' ? 1 : 0), 0);
  const filledReps = branchRepresentatives.filter((b) => b.reps.length > 0).length;

  return (
    <motion.div {...pageTransition}>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-white">Committee Management</h1>
        <p className="text-slate-400 mt-1">Track committee formation, member assignments, and branch representation</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <GlassCard className="text-center">
          <p className="text-3xl font-heading font-bold text-gold-400">{committees.length}</p>
          <p className="text-xs text-slate-400 mt-1">Committees</p>
        </GlassCard>
        <GlassCard className="text-center">
          <p className="text-3xl font-heading font-bold text-gold-400">{totalMembers}</p>
          <p className="text-xs text-slate-400 mt-1">Members Assigned</p>
        </GlassCard>
        <GlassCard className="text-center">
          <p className="text-3xl font-heading font-bold text-gold-400">{filledReps}/7</p>
          <p className="text-xs text-slate-400 mt-1">Branches with Reps</p>
        </GlassCard>
      </div>

      {/* Committees Table */}
      <h2 className="text-lg font-heading font-bold text-white mb-4">Committee Status</h2>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-3 mb-10">
        {committees.map((committee) => (
          <motion.div key={committee.id} variants={staggerItem}>
            <GlassCard>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{committee.emoji}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{committee.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{committee.description.substring(0, 80)}...</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-xs text-slate-400">
                      Lead: <span className={committee.lead === 'TBD' ? 'text-amber-400' : 'text-emerald-400'}>{committee.lead || 'N/A'}</span>
                    </p>
                    <p className="text-xs text-slate-500">{committee.members.length}/5 members</p>
                  </div>
                  <Badge
                    variant={committee.lead === 'TBD' ? 'warning' : 'success'}
                    size="sm"
                  >
                    {committee.lead === 'TBD' ? 'Needs Lead' : 'Active'}
                  </Badge>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Branch Reps Table */}
      <h2 className="text-lg font-heading font-bold text-white mb-4">Branch Representatives</h2>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-3">
        {branchRepresentatives.map((br) => (
          <motion.div key={br.branch} variants={staggerItem}>
            <GlassCard className={`border-l-4 ${br.status === 'open' ? 'border-l-amber-500/60' : 'border-l-emerald-500/60'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">{br.branch}</h4>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                    {br.reps.length > 0 ? (
                      <span>Reps: <span className="text-slate-300">{br.reps.join(', ')}</span></span>
                    ) : (
                      <span className="text-amber-400">No reps assigned</span>
                    )}
                    {br.whatsAppSize && <span>📱 {br.whatsAppSize}</span>}
                  </div>
                </div>
                <Badge variant={br.status === 'open' ? 'warning' : 'success'} size="sm">
                  {br.status === 'open' ? 'Needs Volunteers' : 'Active'}
                </Badge>
              </div>
              {br.notes && <p className="text-xs text-slate-500 mt-2">{br.notes}</p>}
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
