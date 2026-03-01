import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, staggerItem } from '../../utils/animationVariants';
import SectionHeading from '../../components/shared/SectionHeading';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import { committees, branchRepresentatives } from '../../data/committees';

export default function CommitteesPage() {
  return (
    <motion.div {...pageTransition}>
      <SectionHeading
        title="Committees"
        subtitle="The hearts and hands behind REConverge 2001"
      />

      {/* Committee Cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16"
      >
        {committees.map((committee) => (
          <motion.div key={committee.id} variants={staggerItem}>
            <GlassCard className="h-full border-gold-500/10 hover:border-gold-500/30 transition-colors duration-300">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-xl flex-shrink-0">
                  {committee.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-heading font-bold text-white leading-tight">
                    {committee.name}
                  </h3>
                  <Badge variant="default" size="sm" className="mt-1">{committee.shortName}</Badge>
                </div>
              </div>

              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                {committee.description}
              </p>

              {committee.lead !== null && (
                <>
                  <div className="h-px bg-white/5 mb-3" />
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gold-400">Lead</span>
                    <span className="text-slate-400 text-xs italic">{committee.lead}</span>
                  </div>
                </>
              )}

              <p className="text-xs text-slate-500 mt-3">
                Minimum 5 members needed per committee
              </p>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Branch Representatives */}
      <SectionHeading
        title="Branch Representatives"
        subtitle="Connecting every department — 2 reps per branch (1M, 1F preferred)"
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-2 gap-4 mb-16"
      >
        {branchRepresentatives.map((br, idx) => (
          <motion.div key={br.branch} variants={staggerItem}>
            <GlassCard className={`border-l-4 ${br.status === 'open' ? 'border-l-amber-500/60' : 'border-l-emerald-500/60'}`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-semibold text-sm">{br.branch}</h4>
                {br.status === 'open' ? (
                  <Badge variant="warning" size="sm">Volunteers Needed</Badge>
                ) : (
                  <Badge variant="success" size="sm">Active</Badge>
                )}
              </div>

              {br.reps.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-2">
                  {br.reps.map((rep) => (
                    <span
                      key={rep}
                      className="inline-flex items-center gap-1.5 bg-white/5 rounded-lg px-2.5 py-1 border border-white/5"
                    >
                      <svg className="w-3.5 h-3.5 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-slate-300 text-xs font-medium">{rep}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-amber-400/80 text-xs italic mb-2">
                  No representatives assigned yet — reach out if you can help!
                </p>
              )}

              <div className="flex items-center gap-3 text-xs text-slate-500">
                {br.whatsAppSize && (
                  <span>📱 WhatsApp: {br.whatsAppSize}</span>
                )}
                <span>{br.notes}</span>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Help Us Find Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mb-12"
      >
        <GlassCard className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-primary-900/20">
          <div className="text-center max-w-xl mx-auto">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="text-xl font-heading font-bold text-white mb-2">Help Us Find Missing Batchmates</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              We&apos;re still looking for some of our 1997-2001 batchmates. If you know how to reach anyone
              who hasn&apos;t joined their branch WhatsApp group yet, please help us reconnect!
            </p>
            <p className="text-xs text-slate-500">
              Check with your branch representatives or contact us at reconverge2001@gmail.com
            </p>
          </div>
        </GlassCard>
      </motion.div>

      {/* Volunteer CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <GlassCard className="text-center border-gold-500/20 bg-gradient-to-br from-gold-500/5 to-primary-900/20">
          <div className="max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-heading font-bold text-white mb-3">
              Want to lend a hand?
            </h3>
            <p className="text-slate-400 leading-relaxed mb-6">
              REConverge is a labor of love. We need at least 5 members per committee and volunteers
              from every branch. Whether you&apos;re in India, US, Europe, or Australia — there&apos;s a role for you!
            </p>
            <a
              href="mailto:reconverge2001@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/25"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Join the Team
            </a>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
