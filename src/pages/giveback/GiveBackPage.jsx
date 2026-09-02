import { motion } from 'framer-motion';
import {
  healthCentreProject,
  paymentChannels,
  paymentRequiredInfo,
  giveBackInitiatives,
  nitcaaContributionProcess,
  eightyGEligibilityNote,
} from '../../data/donationCampaigns';
import { pageTransition, staggerContainer, staggerItem } from '../../utils/animationVariants';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import SectionHeading from '../../components/shared/SectionHeading';

function BankDetail({ label, value, mono = false }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 border-b border-forest-500/15 last:border-b-0">
      <span className="text-xs text-ink-muted uppercase tracking-wider flex-shrink-0">{label}</span>
      <span className={`text-sm text-ink text-right ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}

export default function GiveBackPage() {
  const hc = healthCentreProject;
  const secondary = giveBackInitiatives.filter((i) => !i.flagship);

  return (
    <motion.div {...pageTransition} className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <SectionHeading
        title="Give Back"
        subtitle="Our batch is rallying behind a project that matters — a new Health Centre for every student who will walk through those gates after us."
      />

      {/* Flagship — Health Centre */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <GlassCard className="border-gold-500/30 bg-gradient-to-br from-gold-500/10 to-primary-900/20 overflow-hidden">
          <div className="grid md:grid-cols-5 gap-6 items-center">
            <div className="md:col-span-2">
              <img
                src={hc.appealPosterUrl}
                alt="NITCAA Health Centre Appeal"
                className="w-full rounded-xl border border-forest-500/15 shadow-xl"
                loading="lazy"
              />
            </div>
            <div className="md:col-span-3">
              <Badge variant="gold" size="sm" className="mb-3">🏥 Flagship · NITCAA</Badge>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink leading-tight mb-2">
                {hc.name}
              </h2>
              <p className="text-gold-700 font-medium mb-4">{hc.subtitle}</p>

              <p className="text-ink-soft leading-relaxed mb-4">
                When we walked those corridors in 2001, the campus clinic barely kept up. Today <span className="text-ink font-medium">10,000 people</span> — students, faculty, staff and their families — depend on it, and under NEP that number is set to nearly <span className="text-ink font-medium">double</span>. The REC-era health centre simply can&apos;t carry that load.
              </p>
              <p className="text-ink-soft leading-relaxed">
                <span className="text-ink font-medium">Susrutha Swastya Kendram</span> — the new Health Centre — is NIT Calicut and NITCAA&apos;s answer. <span className="text-gold-700 font-medium">This is where our batch&apos;s Give Back goes.</span>
              </p>
            </div>
          </div>

          {/* Impact bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 pt-6 border-t border-forest-500/15">
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-heading font-bold gradient-text">₹{hc.totalCostCrore} cr</p>
              <p className="text-xs text-ink-soft mt-1">Total flagship project</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-heading font-bold gradient-text">₹{hc.alreadyPledgedLakh} L</p>
              <p className="text-xs text-ink-soft mt-1">Already pledged by {hc.alreadyPledgedBy}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-heading font-bold gradient-text">{hc.timelineMonths} mo</p>
              <p className="text-xs text-ink-soft mt-1">From fund to finish</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-heading font-bold gradient-text">₹{hc.wallOfHonorThresholdLakh} L+</p>
              <p className="text-xs text-ink-soft mt-1">Earns a Wall of Honor spot</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Why it matters */}
      <div className="mb-12">
        <h3 className="text-xl font-heading font-bold text-ink mb-4">Why this, why now</h3>
        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-3"
        >
          {hc.rationale.map((r, i) => (
            <motion.li key={i} variants={staggerItem}>
              <GlassCard className="h-full">
                <div className="flex items-start gap-3">
                  <span className="text-gold-700 text-lg flex-shrink-0 mt-0.5">›</span>
                  <p className="text-ink-soft text-sm leading-relaxed">{r}</p>
                </div>
              </GlassCard>
            </motion.li>
          ))}
        </motion.ul>
      </div>

      {/* Why give */}
      <div className="mb-12">
        <h3 className="text-xl font-heading font-bold text-ink mb-4">What your contribution earns</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <GlassCard className="text-center">
            <div className="text-3xl mb-2">🏛️</div>
            <h4 className="text-ink font-heading font-semibold mb-1">Wall of Honor</h4>
            <p className="text-xs text-ink-soft leading-relaxed">Individual contributions of ₹1 lakh and above are permanently etched on the campus Wall of Honor.</p>
          </GlassCard>
          <GlassCard className="text-center">
            <div className="text-3xl mb-2">🧾</div>
            <h4 className="text-ink font-heading font-semibold mb-1">80G tax exemption</h4>
            <p className="text-xs text-ink-soft leading-relaxed">Every Indian-route contribution qualifies for Section 80G deduction. Share your PAN to receive the certificate.</p>
          </GlassCard>
          <GlassCard className="text-center">
            <div className="text-3xl mb-2">🌏</div>
            <h4 className="text-ink font-heading font-semibold mb-1">Global route (FCRA)</h4>
            <p className="text-xs text-ink-soft leading-relaxed">Foreign passport holders and entities can give through the dedicated FCRA account at SBI New Delhi.</p>
          </GlassCard>
        </div>
      </div>

      {/* How to contribute */}
      <div className="mb-12">
        <h3 className="text-xl font-heading font-bold text-ink mb-2">How to contribute</h3>
        <p className="text-ink-soft text-sm mb-6">All channels below route to the official NIT Calicut Alumni Association (NITCAA) account — the only legitimate recipient for this project. Always quote <span className="text-gold-700">&quot;REC 2001 Batch — Health Centre&quot;</span> as the purpose so NITCAA can reconcile per-batch.</p>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* UPI */}
          <GlassCard className="border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-transparent">
            <Badge variant="success" size="sm" className="mb-3">⚡ Fastest</Badge>
            <h4 className="text-ink font-heading font-semibold mb-3">{paymentChannels.upi.label}</h4>
            <div className="flex items-center justify-center mb-3 bg-white rounded-xl p-3">
              <img src={paymentChannels.upi.qrImage} alt="NITCAA UPI QR code" className="w-full max-w-[220px]" loading="lazy" />
            </div>
            <p className="text-xs uppercase tracking-wider text-ink-muted mb-1">UPI ID</p>
            <p className="font-mono text-gold-700 text-sm break-all mb-3">{paymentChannels.upi.upiId}</p>
            <p className="text-xs text-ink-soft leading-relaxed">{paymentChannels.upi.note}</p>
          </GlassCard>

          {/* Domestic */}
          <GlassCard>
            <Badge size="sm" className="mb-3">🇮🇳 Indian route</Badge>
            <h4 className="text-ink font-heading font-semibold mb-3">{paymentChannels.domestic.label}</h4>
            <div className="space-y-0.5">
              <BankDetail label="Beneficiary" value={paymentChannels.domestic.beneficiary} />
              <BankDetail label="Account No" value={paymentChannels.domestic.accountNumber} mono />
              <BankDetail label="IFSC" value={paymentChannels.domestic.ifsc} mono />
              <BankDetail label="Swift" value={paymentChannels.domestic.swift} mono />
              <BankDetail label="Branch code" value={paymentChannels.domestic.branchCode} mono />
              <BankDetail label="Type" value={paymentChannels.domestic.accountType} />
            </div>
            <p className="text-xs text-ink-muted mt-3 leading-relaxed">{paymentChannels.domestic.bankBranch}</p>
          </GlassCard>

          {/* FCRA */}
          <GlassCard>
            <Badge size="sm" className="mb-3">🌍 International (FCRA)</Badge>
            <h4 className="text-ink font-heading font-semibold mb-3">{paymentChannels.fcra.label}</h4>
            <div className="space-y-0.5">
              <BankDetail label="Beneficiary" value={paymentChannels.fcra.beneficiary} />
              <BankDetail label="Account No" value={paymentChannels.fcra.accountNumber} mono />
              <BankDetail label="IFSC" value={paymentChannels.fcra.ifsc} mono />
              <BankDetail label="Swift" value={paymentChannels.fcra.swift} mono />
              <BankDetail label="Branch code" value={paymentChannels.fcra.branchCode} mono />
              <BankDetail label="Type" value={paymentChannels.fcra.accountType} />
            </div>
            <p className="text-xs text-ink-muted mt-3 leading-relaxed">{paymentChannels.fcra.bankBranch}</p>
          </GlassCard>
        </div>
      </div>

      {/* Required info */}
      <div className="mb-12">
        <GlassCard className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl flex-shrink-0">📋</div>
            <div className="flex-1">
              <h4 className="text-ink font-heading font-semibold mb-2">After you pay — send these to NITCAA</h4>
              <p className="text-ink-soft text-sm mb-3">NITCAA needs the following with every transfer so your contribution is credited correctly and (if eligible) your 80G certificate is issued:</p>
              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-ink-soft">
                {paymentRequiredInfo.map((info, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">✓</span>
                    <span>{info}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-ink-muted mt-4">
                Email everything to <a href={`mailto:${hc.contactEmail}?subject=${encodeURIComponent('REC 2001 Batch - Health Centre contribution')}`} className="text-gold-700 hover:text-gold-300 underline">{hc.contactEmail}</a>
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* NITCAA contribution process */}
      <div className="mb-12">
        <h3 className="text-xl font-heading font-bold text-ink mb-2">How NITCAA handles your contribution</h3>
        <p className="text-ink-soft text-sm mb-6">
          The process was formally shared by the NITCAA Office (Uma N., 6 Aug 2026). Six steps
          from your transfer to the Wall of Honor.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {nitcaaContributionProcess.map((step, i) => (
            <GlassCard key={step.step}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-sm font-semibold text-gold-700 flex-shrink-0">
                  {i + 1}
                </div>
                <div>
                  <h4 className="text-ink font-semibold text-sm mb-1">{step.step}</h4>
                  <p className="text-ink-soft text-sm leading-relaxed">{step.detail}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
        <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-100/90">
          <span className="font-semibold">80G eligibility:</span> {eightyGEligibilityNote}
        </div>
      </div>

      {/* Secondary initiatives */}
      {secondary.length > 0 && (
        <div className="mb-12">
          <h3 className="text-xl font-heading font-bold text-ink mb-4">Alongside the flagship</h3>
          <div className="grid md:grid-cols-2 gap-5">
            {secondary.map((init) => (
              <GlassCard key={init.id}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-xl flex-shrink-0">{init.icon}</div>
                  <div>
                    <h4 className="text-ink font-semibold">{init.title}</h4>
                    <Badge size="sm" variant="default" className="mt-1">Under discussion</Badge>
                  </div>
                </div>
                <p className="text-ink-soft text-sm leading-relaxed mb-3">{init.description}</p>
                {init.details && (
                  <ul className="space-y-1">
                    {init.details.map((d, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-ink-muted">
                        <span className="text-gold-700 mt-0.5">•</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Join NITCAA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <GlassCard className="border-forest-500/20 bg-gradient-to-br from-primary-900/30 to-forest-900/40">
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div>
              <img src="/give-back/worldnitcaa.jpg" alt="World NITCAA network" className="w-full rounded-xl border border-forest-500/15" loading="lazy" />
            </div>
            <div className="md:col-span-2">
              <Badge size="sm" className="mb-2">💙 Alumni Network</Badge>
              <h3 className="text-xl md:text-2xl font-heading font-bold text-ink mb-2">While you&apos;re at it — register with NITCAA</h3>
              <p className="text-ink-soft leading-relaxed mb-4">
                NIT Calicut&apos;s official alumni network has 20+ chapters worldwide. Mentorship, lifelong connections, impact projects — it&apos;s how we keep carrying NITC forward after we leave. &quot;You never really leave NITC.&quot;
              </p>
              <a
                href="https://www.worldnitcaa.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold text-sm transition-all"
              >
                Register at worldnitcaa.com →
              </a>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
