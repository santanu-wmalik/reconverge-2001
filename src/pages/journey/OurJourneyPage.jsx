import { useState } from 'react';
import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, staggerItem } from '../../utils/animationVariants';
import SectionHeading from '../../components/shared/SectionHeading';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import { journeyMilestones, journeyCategories } from '../../data/journeyMilestones';

const categoryColors = {
  milestone: { bg: 'bg-gold-500/10', text: 'text-gold-400', border: 'border-gold-500/30', variant: 'gold' },
  governance: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30', variant: 'default' },
  outreach: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', variant: 'success' },
  planning: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', variant: 'default' },
};

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function OurJourneyPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = activeCategory === 'all'
    ? journeyMilestones
    : journeyMilestones.filter((m) => m.category === activeCategory);

  return (
    <motion.div {...pageTransition}>
      <SectionHeading
        title="Our Journey"
        subtitle="A chronological record of how REConverge 2001 came together — from the first spark to reunion day"
      />

      {/* Intro Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <GlassCard className="border-gold-500/20 bg-gradient-to-br from-gold-500/5 to-primary-900/20">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-slate-300 leading-relaxed">
              This page serves as a formal record of the key decisions, milestones, and progress made by the
              volunteer organizing committee. It chronicles the journey of bringing together 350+ alumni
              of REC Calicut&apos;s Class of 2001 for our Silver Jubilee reunion.
            </p>
          </div>
        </GlassCard>
      </motion.div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-10 justify-center">
        {journeyCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeCategory === cat.id
                ? 'bg-gold-500 text-navy-950 shadow-lg shadow-gold-500/25'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            <span className="mr-1.5">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold-500/40 via-gold-500/20 to-transparent" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          key={activeCategory}
          className="space-y-8"
        >
          {filtered.map((milestone, idx) => {
            const colors = categoryColors[milestone.category] || categoryColors.planning;
            const isLeft = idx % 2 === 0;

            return (
              <motion.div
                key={milestone.id}
                variants={staggerItem}
                className="relative"
              >
                {/* Timeline Dot */}
                <div className={`absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 z-10 ${
                  milestone.highlight
                    ? 'bg-gold-500 border-gold-400 shadow-lg shadow-gold-500/50'
                    : 'bg-slate-800 border-slate-600'
                }`} />

                {/* Content Card */}
                <div className={`ml-10 md:ml-0 md:w-[calc(50%-2rem)] ${
                  isLeft ? 'md:mr-auto md:pr-0' : 'md:ml-auto md:pl-0'
                }`}>
                  <GlassCard className={`${milestone.highlight ? `border-l-4 ${colors.border}` : ''}`}>
                    {/* Date */}
                    <div className="flex items-center gap-2 mb-2">
                      <time className="text-xs font-medium text-gold-400">
                        {formatDate(milestone.date)}
                      </time>
                      <Badge variant={colors.variant} size="sm">
                        {milestone.category.charAt(0).toUpperCase() + milestone.category.slice(1)}
                      </Badge>
                      {milestone.highlight && (
                        <span className="text-xs text-gold-400">⭐</span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className={`text-base font-heading font-bold mb-2 ${
                      milestone.highlight ? 'text-white' : 'text-slate-200'
                    }`}>
                      {milestone.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {milestone.description}
                    </p>
                  </GlassCard>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Footer Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 text-center"
      >
        <GlassCard className="inline-block">
          <p className="text-slate-400 text-sm">
            📝 This journey continues to be written. Check back regularly for updates as we get closer to
            <span className="text-gold-400 font-semibold"> December 27-28, 2026</span>.
          </p>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
