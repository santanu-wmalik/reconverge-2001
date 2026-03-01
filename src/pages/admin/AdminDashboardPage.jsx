import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, staggerItem } from '../../utils/animationVariants';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import { outreachStats, actionItems, bankingStatus } from '../../data/adminData';

const priorityConfig = {
  critical: { variant: 'warning', label: 'Critical' },
  high: { variant: 'gold', label: 'High' },
  medium: { variant: 'default', label: 'Medium' },
  low: { variant: 'success', label: 'Low' },
};

const statusConfig = {
  in_progress: { color: 'text-blue-400', label: 'In Progress' },
  open: { color: 'text-slate-400', label: 'Open' },
  blocked: { color: 'text-red-400', label: 'Blocked' },
  completed: { color: 'text-emerald-400', label: 'Completed' },
};

export default function AdminDashboardPage() {
  const totalInGroups = outreachStats.reduce((sum, b) => {
    const n = parseInt(b.inGroup) || 0;
    return sum + n;
  }, 0);

  const openActions = actionItems.filter((a) => a.status !== 'completed').length;
  const criticalActions = actionItems.filter((a) => a.priority === 'critical').length;

  return (
    <motion.div {...pageTransition}>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-white">Admin Dashboard</h1>
        <p className="text-slate-400 mt-1">REConverge 2001 Planning Overview</p>
      </div>

      {/* Quick Stats */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Batch Strength', value: '350+', icon: '👥' },
          { label: 'In WhatsApp Groups', value: `${totalInGroups}+`, icon: '📱' },
          { label: 'Branches Active', value: '7/7', icon: '🏛️' },
          { label: 'Bank Account', value: bankingStatus.status === 'in_progress' ? 'Setting Up' : 'Ready', icon: '🏦' },
        ].map((stat, i) => (
          <motion.div key={stat.label} variants={staggerItem}>
            <GlassCard>
              <div className="text-2xl mb-2">{stat.icon}</div>
              <p className="text-2xl font-heading font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Action Items */}
        <div>
          <h2 className="text-lg font-heading font-bold text-white mb-4">
            Action Items
            <Badge variant="warning" size="sm" className="ml-2">{openActions} open</Badge>
            {criticalActions > 0 && <Badge variant="warning" size="sm" className="ml-1">{criticalActions} critical</Badge>}
          </h2>
          <div className="space-y-3">
            {actionItems.filter((a) => a.status !== 'completed').slice(0, 8).map((item) => {
              const priority = priorityConfig[item.priority] || priorityConfig.medium;
              const status = statusConfig[item.status] || statusConfig.open;
              return (
                <GlassCard key={item.id} className="py-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium">{item.task}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant={priority.variant} size="sm">{priority.label}</Badge>
                        <span className={`text-xs ${status.color}`}>{status.label}</span>
                        {item.blockedBy && <span className="text-xs text-red-400">⚠ Blocked by: {item.blockedBy}</span>}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Assignee: {item.assignee} {item.dueDate && `• Due: ${item.dueDate}`}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* Banking & Branch Overview */}
        <div>
          <h2 className="text-lg font-heading font-bold text-white mb-4">Banking Status</h2>
          <GlassCard className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🏦</span>
              <Badge variant="gold" size="sm">{bankingStatus.status === 'in_progress' ? 'In Progress' : 'Ready'}</Badge>
            </div>
            <p className="text-sm text-slate-300 mb-3">Account Type: {bankingStatus.type}</p>
            <div className="space-y-2">
              {bankingStatus.attempts.map((attempt) => (
                <div key={attempt.bank} className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">{attempt.bank}</span>
                  <span className={
                    attempt.status === 'in_progress' ? 'text-blue-400' :
                    attempt.status === 'responded' ? 'text-emerald-400' : 'text-slate-500'
                  }>
                    {attempt.status === 'in_progress' ? '🔄 In Progress' :
                     attempt.status === 'responded' ? '✅ Responded' : '⏳ No Response'}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-white/5 text-xs text-slate-500">
              <p>Account Holders: {bankingStatus.accountHolders.join(', ')}</p>
              <p>Proposed Finance Head: {bankingStatus.financeHead}</p>
            </div>
          </GlassCard>

          <h2 className="text-lg font-heading font-bold text-white mb-4">Branch Outreach</h2>
          <div className="space-y-2">
            {outreachStats.map((branch) => (
              <GlassCard key={branch.branch} className="py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white font-medium">{branch.branch}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {branch.inGroup || '?'} in group of {branch.totalEstimate}
                      {branch.reps.length > 0 && ` • Reps: ${branch.reps.join(', ')}`}
                    </p>
                  </div>
                  <Badge
                    variant={branch.status === 'Strong' ? 'success' : branch.status === 'Needs Reps' ? 'warning' : 'default'}
                    size="sm"
                  >
                    {branch.percentage || branch.status}
                  </Badge>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
