import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { healthCentreProject } from '../../../data/donationCampaigns';

export default function GiveBackPreview() {
  const hc = healthCentreProject;

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="eyebrow">Legacy</span>
          <h2 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-heading font-medium italic text-forest-600">Give Back</h2>
          <p className="mt-2 font-serif text-ink-muted max-w-2xl mx-auto">
            25 years ago, NITC gave us everything. Now it's asking us for something — and the ask is simple, urgent, and human.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white border border-gold-500/40 shadow-sm p-6 md:p-8 mb-8"
        >
          <div className="grid md:grid-cols-5 gap-8 items-center">
            <div className="md:col-span-2">
              <img src={hc.appealPosterUrl} alt="NIT Calicut Health Centre Appeal" className="w-full border border-forest-500/15 shadow-md" loading="lazy" />
            </div>
            <div className="md:col-span-3">
              <span className="eyebrow mb-3">What the college is asking of us</span>
              <h3 className="text-2xl md:text-3xl font-heading text-forest-700 leading-tight mb-3">
                A new Health Centre for a campus that's about to <span className="italic text-gold-700">double in size</span>.
              </h3>
              <div className="space-y-3 font-serif text-ink-soft leading-relaxed text-[15.5px]">
                <p>Remember the old campus clinic? The one with the ancient stretcher and the single doctor who somehow knew every hostel block? It's still there. Still doing its best. And it's been there since the <span className="text-ink font-medium">REC era</span>.</p>
                <p>Today NITC is home to almost <span className="text-ink font-medium">10,000 people</span>. Under the new education policy, intake grows <span className="text-ink font-medium">40%</span>, foreign admissions <span className="text-ink font-medium">20%</span>. In a few years that community nearly <span className="text-ink font-medium">doubles</span>.</p>
                <p>NITCAA is building the answer — the <span className="text-gold-700 font-semibold">Susrutha Swastya Kendram</span>. The Class of <span className="font-semibold text-ink">1999 has already pledged ₹47 lakhs</span>. <span className="text-forest-700 font-semibold">Our turn now.</span></p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 pt-6 border-t border-forest-500/10 text-center">
            {[
              [`₹${hc.totalCostCrore} cr`, 'Total flagship project'],
              [`₹${hc.alreadyPledgedLakh} L`, "Class of '99 already pledged"],
              [`${hc.timelineMonths} mo`, 'Build, once funded'],
              ['80G', 'Tax-exempt · Wall of Honor at ₹1 L+'],
            ].map(([v, l]) => (
              <div key={l}>
                <p className="font-heading text-3xl text-gold-600">{v}</p>
                <p className="nav-caps text-ink-muted mt-1">{l}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="max-w-3xl mx-auto text-center">
          <p className="font-heading italic text-lg md:text-xl text-forest-700 mb-5">"You never really leave NITC — you carry it forward."</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/give-back" className="nav-caps px-6 py-3 bg-gold-500 hover:bg-gold-600 text-ink shadow">See how to contribute →</Link>
            <a href="https://www.worldnitcaa.com" target="_blank" rel="noopener noreferrer" className="nav-caps px-6 py-3 border-2 border-forest-600/60 text-forest-700 hover:bg-forest-600/8">Join NITCAA</a>
          </div>
        </div>
      </div>
    </section>
  );
}
