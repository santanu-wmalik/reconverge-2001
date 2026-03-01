import { motion } from 'framer-motion';
import SectionHeading from '../../../components/shared/SectionHeading';
import ScrollReveal from '../../../components/shared/ScrollReveal';
import GlassCard from '../../../components/ui/GlassCard';
import { staggerContainer, staggerItem } from '../../../utils/animationVariants';

const highlights = [
  { icon: '🎭', title: 'REConverge Gala Program', desc: 'Welcome note, performances, and Bakwas Stories to kick off the celebrations!' },
  { icon: '🍽️', title: 'Musical Evening & Gala Dinner', desc: 'Multi-cuisine gala dinner with cocktails, sharing memories, and meeting old friends.' },
  { icon: '🚶', title: 'Batch Procession @ Rajpath', desc: 'Relive the memories of walking down the iconic Rajpath together once again.' },
  { icon: '🏛️', title: 'Alumni Day Function at NITC', desc: 'Address by Faculty & Alumni, felicitation ceremony, and remembrance of batchmates.' },
  { icon: '🍌', title: 'Kerala Traditional Sadhya', desc: 'The grand Kerala feast - traditional Sadhya lunch at the campus hostel mess.' },
  { icon: '🥘', title: 'Branch Wise Dinner', desc: 'Intimate dinners with your branch mates at different venues across Calicut.' },
];

export default function EventHighlights() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          title="Event Highlights"
          subtitle="Three days packed with reunions, celebrations, and unforgettable experiences"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {highlights.map((item, i) => (
            <motion.div key={i} variants={staggerItem}>
              <GlassCard className="h-full">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
