import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SectionHeading from '../../../components/shared/SectionHeading';
import GlassCard from '../../../components/ui/GlassCard';
import Button from '../../../components/ui/Button';
import { healthCentreProject } from '../../../data/donationCampaigns';

export default function GiveBackPreview() {
  const hc = healthCentreProject;

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          title="Give Back"
          subtitle="25 years ago, NITC gave us everything. Now it's asking us for something — and the ask is simple, urgent, and human."
        />

        {/* Hero card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <GlassCard className="border-gold-500/30 bg-gradient-to-br from-gold-500/10 via-primary-900/20 to-navy-950/40 overflow-hidden">
            <div className="grid md:grid-cols-5 gap-8 items-center">
              <div className="md:col-span-2">
                <img
                  src={hc.appealPosterUrl}
                  alt="NIT Calicut Health Centre Appeal"
                  className="w-full rounded-xl border border-white/10 shadow-2xl"
                  loading="lazy"
                />
              </div>

              <div className="md:col-span-3">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-400/20 text-gold-400 text-xs font-medium mb-4">
                  <span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-pulse" />
                  What the college is asking of us
                </span>

                <h3 className="text-2xl md:text-3xl font-heading font-bold text-white leading-tight mb-3">
                  A new Health Centre for a campus that&apos;s about to <span className="gradient-text">double in size</span>.
                </h3>

                <div className="space-y-3 text-slate-300 leading-relaxed text-[15px]">
                  <p>
                    Remember the old campus clinic? The one with the ancient stretcher and the single doctor who somehow knew every hostel block? It&apos;s still there. Still doing its best. And it&apos;s been there since the <span className="text-white font-medium">REC era</span>.
                  </p>
                  <p>
                    Today NITC is home to almost <span className="text-white font-medium">10,000 people</span> — students, faculty, staff, and their families. Under the new education policy, student intake is set to grow by <span className="text-white font-medium">40%</span> and foreign admissions by <span className="text-white font-medium">20%</span>. In a few years, that community will nearly <span className="text-white font-medium">double</span>.
                  </p>
                  <p>
                    The campus needs a real health centre. One that can handle a fever at 2 a.m., a sprained ankle on the football ground, a pregnancy scan for a faculty spouse, a diabetes check-up for the canteen uncle who fed us for four years. NITCAA is building exactly that — the <span className="text-gold-400 font-semibold">Susrutha Swastya Kendram</span>.
                  </p>
                  <p className="pt-2 text-white">
                    The Class of <span className="font-semibold">1999 has already pledged ₹47 lakhs</span>. Our turn now. <span className="text-gold-400 font-semibold">This is where the Class of 2001&apos;s Give Back goes.</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Impact strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/10">
              <div className="text-center">
                <p className="text-3xl font-heading font-bold gradient-text">₹{hc.totalCostCrore} cr</p>
                <p className="text-xs text-slate-400 mt-1">Total flagship project</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-heading font-bold gradient-text">₹{hc.alreadyPledgedLakh} L</p>
                <p className="text-xs text-slate-400 mt-1">Class of &apos;99 has already pledged</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-heading font-bold gradient-text">{hc.timelineMonths} mo</p>
                <p className="text-xs text-slate-400 mt-1">Build, once funded</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-heading font-bold gradient-text">80G</p>
                <p className="text-xs text-slate-400 mt-1">Tax-exempt · Wall of Honor at ₹1 L+</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Emotional closer + CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="text-lg md:text-xl text-slate-200 leading-relaxed italic mb-6">
            &ldquo;You never really leave NITC — you carry it forward.&rdquo;<br />
            <span className="text-slate-400 not-italic text-sm">Every rupee we give here will be sitting in a bed, a ward, a quiet consultation room that will matter to someone we&apos;ll never meet. That&apos;s the kind of legacy worth 25 years.</span>
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/give-back">
              <Button size="lg">See how to contribute →</Button>
            </Link>
            <a href="https://www.worldnitcaa.com" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline">Join NITCAA (worldnitcaa.com)</Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
