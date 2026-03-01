import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, staggerItem } from '../../utils/animationVariants';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import { budgetItems, bankingStatus } from '../../data/adminData';
import { formatCurrency } from '../../utils/formatters';

export default function BudgetPage() {
  const categories = [...new Set(budgetItems.map((b) => b.category))];

  return (
    <motion.div {...pageTransition}>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-white">Budget & Finance</h1>
        <p className="text-slate-400 mt-1">Fee structure, bank account status, and tentative budget breakdown</p>
      </div>

      {/* Fee Structure */}
      <h2 className="text-lg font-heading font-bold text-white mb-4">Fee Structure</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <GlassCard className="border-gold-500/20">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🎫</span>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Per Person Registration</p>
              <p className="text-2xl font-heading font-bold text-gold-400">{formatCurrency(12500)}</p>
            </div>
          </div>
          <ul className="text-xs text-slate-400 space-y-1">
            <li>• Gala Dinner with cocktails</li>
            <li>• Commemorative pack (hoodie, medallion)</li>
            <li>• Traditional Sadhya lunch</li>
            <li>• Campus day activities</li>
          </ul>
          <p className="text-xs text-slate-500 mt-3 italic">Excludes: accommodation, travel, giving back</p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">👨‍👩‍👧‍👦</span>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Additional Family Member</p>
              <p className="text-2xl font-heading font-bold text-white">{formatCurrency(2500)}</p>
            </div>
          </div>
          <p className="text-xs text-slate-400">Per additional family member (partner, kids, parents)</p>
        </GlassCard>
      </div>

      {/* Bank Account Status */}
      <h2 className="text-lg font-heading font-bold text-white mb-4">Bank Account Status</h2>
      <GlassCard className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🏦</span>
          <h3 className="text-white font-semibold">Account Setup Progress</h3>
          <Badge variant={bankingStatus.status === 'in_progress' ? 'gold' : 'success'} size="sm">
            {bankingStatus.status === 'in_progress' ? 'In Progress' : 'Complete'}
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white/3 rounded-lg p-3 border border-white/5">
            <p className="text-xs text-slate-400 mb-1">Account Type</p>
            <p className="text-sm text-white">{bankingStatus.type}</p>
          </div>
          <div className="bg-white/3 rounded-lg p-3 border border-white/5">
            <p className="text-xs text-slate-400 mb-1">Account Holders</p>
            <p className="text-sm text-white">{bankingStatus.accountHolders.join(' & ')}</p>
          </div>
        </div>

        <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-400 mb-2">Bank Outreach</h4>
        <div className="space-y-2">
          {bankingStatus.attempts.map((attempt) => (
            <div key={attempt.bank} className="flex items-center justify-between bg-white/3 rounded-lg px-3 py-2 border border-white/5">
              <span className="text-sm text-white">{attempt.bank}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">{attempt.notes}</span>
                <span className={`text-xs ${
                  attempt.status === 'in_progress' ? 'text-blue-400' :
                  attempt.status === 'responded' ? 'text-emerald-400' : 'text-slate-500'
                }`}>
                  {attempt.status === 'in_progress' ? '🔄' : attempt.status === 'responded' ? '✅' : '⏳'}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-white/5">
          <p className="text-xs text-slate-400">
            Proposed Finance Head: <span className="text-gold-400 font-medium">{bankingStatus.financeHead}</span>
          </p>
        </div>
      </GlassCard>

      {/* Budget Breakdown */}
      <h2 className="text-lg font-heading font-bold text-white mb-4">Tentative Budget Breakdown</h2>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
        {categories.map((category) => (
          <motion.div key={category} variants={staggerItem}>
            <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-3">{category}</h3>
            <div className="space-y-2">
              {budgetItems.filter((b) => b.category === category).map((item, i) => (
                <GlassCard key={i} className="py-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white">{item.item}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.notes}</p>
                    </div>
                    <span className="text-sm font-medium text-slate-300 flex-shrink-0">
                      {item.amount ? formatCurrency(item.amount) : <Badge variant="default" size="sm">TBD</Badge>}
                    </span>
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
