import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, staggerItem } from '../../utils/animationVariants';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import { outreachStats } from '../../data/adminData';

export default function OutreachPage() {
  const branchesWithReps = outreachStats.filter((b) => b.reps.length > 0).length;
  const branchesWithGroupData = outreachStats.filter((b) => b.inGroup).length;

  return (
    <motion.div {...pageTransition}>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-white">Outreach & Alumni Tracking</h1>
        <p className="text-slate-400 mt-1">Per-branch WhatsApp group sizes (as reported by volunteers), named branch reps, and flagged missing alumni.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Target Batch Strength', value: '~350', icon: '👥' },
          { label: 'Branches with Group Data', value: `${branchesWithGroupData}/7`, icon: '📱' },
          { label: 'Branches with Reps', value: `${branchesWithReps}/7`, icon: '🏛️' },
          { label: 'Open Branches', value: `${7 - branchesWithReps}`, icon: '🔍' },
        ].map((stat) => (
          <GlassCard key={stat.label} className="text-center">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <p className="text-2xl font-heading font-bold text-white">{stat.value}</p>
            <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* Per-Branch Detail */}
      <h2 className="text-lg font-heading font-bold text-white mb-4">Branch-wise Outreach Details</h2>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
        {outreachStats.map((branch) => (
          <motion.div key={branch.branch} variants={staggerItem}>
            <GlassCard className={`border-l-4 ${
              branch.status === 'Strong' ? 'border-l-emerald-500/60' :
              branch.status === 'Needs Reps' ? 'border-l-amber-500/60' :
              branch.status === 'No data' ? 'border-l-red-500/40' :
              'border-l-blue-500/40'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold">{branch.branch}</h3>
                    <Badge
                      variant={
                        branch.status === 'Strong' || branch.status === 'Active' ? 'success' :
                        branch.status === 'Needs Reps' || branch.status === 'No data' ? 'warning' :
                        'default'
                      }
                      size="sm"
                    >
                      {branch.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    <div>
                      <p className="text-xs text-slate-500">WhatsApp group size</p>
                      <p className="text-sm text-white font-medium">{branch.inGroup || <span className="text-slate-500">Not reported</span>}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Branch representatives</p>
                      <p className="text-sm text-white font-medium">
                        {branch.reps.length > 0 ? branch.reps.join(', ') : <span className="text-amber-400">None assigned</span>}
                      </p>
                    </div>
                  </div>

                  {branch.notes && (
                    <p className="text-xs text-slate-500 mt-3 italic">{branch.notes}</p>
                  )}

                  {/* Missing Alumni */}
                  {branch.missingKnown && branch.missingKnown.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <p className="text-xs text-amber-400 font-medium mb-1">Known missing alumni to trace:</p>
                      <div className="flex flex-wrap gap-2">
                        {branch.missingKnown.map((name) => (
                          <span key={name} className="text-xs bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/20">
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Help Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <GlassCard className="border-gold-500/20 text-center">
          <p className="text-slate-400 text-sm">
            🔍 If you know how to reach any missing batchmate, please contact the branch representatives
            or email <a href="mailto:crec2001reunion@gmail.com" className="text-gold-400 hover:text-gold-300">crec2001reunion@gmail.com</a>.
          </p>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
