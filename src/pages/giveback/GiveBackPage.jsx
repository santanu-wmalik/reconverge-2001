import { motion } from 'framer-motion';
import { giveBackInitiatives, impactStories, volunteerOpportunities } from '../../data/donationCampaigns';
import { pageTransition, staggerContainer, staggerItem } from '../../utils/animationVariants';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import SectionHeading from '../../components/shared/SectionHeading';

const statusConfig = {
  active: { label: 'Active', variant: 'success' },
  planning: { label: 'In Planning', variant: 'gold' },
  discussion: { label: 'Under Discussion', variant: 'default' },
};

export default function GiveBackPage() {
  return (
    <motion.div {...pageTransition}>
      <SectionHeading
        title="Give Back"
        subtitle="Building a lasting legacy at the campus that shaped our future"
      />

      {/* Vision Statement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <GlassCard className="border-gold-500/20 bg-gradient-to-br from-gold-500/5 to-primary-900/20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-4xl mb-4">💛</div>
            <h3 className="text-xl font-heading font-bold text-white mb-3">Our Vision</h3>
            <p className="text-slate-300 leading-relaxed">
              Rather than funding something that fades from view, we&apos;re choosing to create something
              <span className="text-gold-400 font-semibold"> tangible, visible, and lasting</span> — a
              dedicated space on the NIT Calicut campus that students and faculty will actively use and
              associate with the Class of 2001 for generations to come.
            </p>
          </div>
        </GlassCard>
      </motion.div>

      {/* Initiatives */}
      <h3 className="text-xl font-heading font-bold text-white mb-6">Our Initiatives</h3>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid md:grid-cols-2 gap-5 mb-12">
        {giveBackInitiatives.map((initiative) => {
          const status = statusConfig[initiative.status] || statusConfig.discussion;
          return (
            <motion.div key={initiative.id} variants={staggerItem}>
              <GlassCard className="h-full">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                    {initiative.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-semibold">{initiative.title}</h4>
                    </div>
                    <Badge variant={status.variant} size="sm">{status.label}</Badge>
                  </div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{initiative.description}</p>

                {initiative.details && (
                  <ul className="space-y-1.5 mb-3">
                    {initiative.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-500">
                        <span className="text-gold-400 mt-0.5">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {initiative.link && (
                  <a
                    href={initiative.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-gold-400 hover:text-gold-300 transition-colors"
                  >
                    Learn more →
                  </a>
                )}
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Inspiration Stories */}
      <h3 className="text-xl font-heading font-bold text-white mb-6">Inspiration & Precedents</h3>
      <div className="grid md:grid-cols-2 gap-5 mb-12">
        {impactStories.map((s) => (
          <GlassCard key={s.id}>
            <img src={s.image} alt={s.title} className="w-full h-36 object-cover rounded-xl mb-3" />
            <h4 className="text-white font-semibold text-sm">{s.title}</h4>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">{s.excerpt}</p>
          </GlassCard>
        ))}
      </div>

      {/* How to Contribute */}
      <h3 className="text-xl font-heading font-bold text-white mb-6">How to Contribute</h3>
      <GlassCard className="mb-12">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl flex-shrink-0">
            🏦
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Bank Account Setup In Progress</h4>
            <p className="text-slate-400 text-sm leading-relaxed mb-3">
              The Finance Committee is setting up the official bank account through SBI at the NITC campus.
              The &quot;Giving Back&quot; contribution is separate from the reunion registration fee and will be
              collected once the banking infrastructure is finalized.
            </p>
            <p className="text-slate-500 text-xs">
              Details will be shared here once the account is ready. Stay tuned!
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Volunteer */}
      <h3 className="text-xl font-heading font-bold text-white mb-6">Volunteer for Giving Back</h3>
      <div className="space-y-4">
        {volunteerOpportunities.map((v) => (
          <GlassCard key={v.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <h4 className="text-white font-medium">{v.title}</h4>
              <p className="text-slate-400 text-sm">{v.description}</p>
              <div className="flex gap-3 mt-2 text-xs text-slate-500">
                <span>{v.spotsFilled}/{v.spotsTotal} spots filled</span>
                {v.skills.map((s) => (
                  <Badge key={s} variant="default" size="sm">{s}</Badge>
                ))}
              </div>
            </div>
            <Button variant="outline" size="sm">Sign Up</Button>
          </GlassCard>
        ))}
      </div>
    </motion.div>
  );
}
