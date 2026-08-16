import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, staggerItem } from '../../utils/animationVariants';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import { budgetItems, bankingStatus, budgetSummary } from '../../data/adminData';
import { formatCurrency } from '../../utils/formatters';

export default function BudgetPage() {
  const categories = [...new Set(budgetItems.map((b) => b.category))];

  return (
    <motion.div {...pageTransition}>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-white">Budget & Finance</h1>
        <p className="text-slate-400 mt-1">Fee structure, bank account status, and tentative budget breakdown</p>
      </div>

      {/* v1 Totals */}
      <h2 className="text-lg font-heading font-bold text-white mb-4">Budget v1 — Working Totals</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <GlassCard className="border-gold-500/30 bg-gradient-to-br from-gold-500/5 to-primary-900/20">
          <p className="text-xs uppercase tracking-wider text-slate-400">Total Estimate</p>
          <p className="text-2xl font-heading font-bold text-gold-400 mt-1">{formatCurrency(budgetSummary.totalEstimate)}</p>
          <p className="text-[11px] text-slate-500 mt-1">For {budgetSummary.assumedAlumniCount} alumni (~{Math.round(budgetSummary.assumedAlumniCount * (1 + budgetSummary.assumedFamilyPerAlumni))} pax)</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs uppercase tracking-wider text-slate-400">Per Alumni</p>
          <p className="text-2xl font-heading font-bold text-white mt-1">{formatCurrency(budgetSummary.perAlumniEstimate)}</p>
          <p className="text-[11px] text-slate-500 mt-1">(Total − sponsorship − family fees) ÷ {budgetSummary.assumedAlumniCount}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs uppercase tracking-wider text-slate-400">Contingency Buffer</p>
          <p className="text-2xl font-heading font-bold text-white mt-1">{formatCurrency(budgetSummary.contingencyAmount)}</p>
          <p className="text-[11px] text-slate-500 mt-1">~10% of total — for unforeseen expenses</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs uppercase tracking-wider text-slate-400">Status</p>
          <Badge variant="warning" size="sm" className="mt-2">Draft v1</Badge>
          <p className="text-[11px] text-slate-500 mt-2">{budgetSummary.status}</p>
        </GlassCard>
      </div>

      {/* Fee Structure */}
      <h2 className="text-lg font-heading font-bold text-white mb-4">Fee Structure</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <GlassCard className="border-gold-500/20">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🎫</span>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Per Person Registration</p>
              <p className="text-2xl font-heading font-bold text-gold-400">{formatCurrency(13500)}</p>
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
          {bankingStatus.openedOn && (
            <div className="bg-white/3 rounded-lg p-3 border border-white/5 md:col-span-2">
              <p className="text-xs text-slate-400 mb-1">Opened On</p>
              <p className="text-sm text-emerald-300">{bankingStatus.openedOn}</p>
            </div>
          )}
        </div>

        {bankingStatus.account && (
          <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-emerald-400">✅</span>
              <h4 className="text-sm font-semibold text-white">Live Account Details</h4>
            </div>
            <div className="grid md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div>
                <p className="text-xs text-slate-400">Beneficiary</p>
                <p className="text-white">{bankingStatus.account.beneficiary}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Account Number</p>
                <p className="text-white font-mono">{bankingStatus.account.accountNumber}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">IFSC</p>
                <p className="text-white font-mono">{bankingStatus.account.ifsc}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Branch</p>
                <p className="text-white">{bankingStatus.account.bank} — {bankingStatus.account.branch} ({bankingStatus.account.branchCode})</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-slate-400">Branch Address</p>
                <p className="text-white">{bankingStatus.account.branchAddress}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Branch Email</p>
                <p className="text-white">{bankingStatus.account.branchEmail}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Branch Phones</p>
                <p className="text-white">{bankingStatus.account.branchPhones.join(' · ')}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-slate-400">Supports</p>
                <p className="text-white">{bankingStatus.account.supports.join(' · ')}</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400 italic">
              This account is for the REConverge 2001 registration fee only. Give Back
              donations route through the NITCAA project account — see the Give Back page.
            </p>
          </div>
        )}

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
