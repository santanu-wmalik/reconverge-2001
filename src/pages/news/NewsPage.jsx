import { motion } from 'framer-motion';
import { newsArticles } from '../../data/news';
import { sponsors } from '../../data/sponsors';
import { pageTransition, staggerContainer, staggerItem } from '../../utils/animationVariants';
import { formatDate } from '../../utils/formatters';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import SectionHeading from '../../components/shared/SectionHeading';

export default function NewsPage() {
  return (
    <motion.div {...pageTransition}>
      <SectionHeading title="News & Updates" subtitle="Stay up to date with all reunion happenings" />

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
        {newsArticles.map((article) => (
          <motion.div key={article.id} variants={staggerItem}>
            <GlassCard>
              <img src={article.image} alt={article.title} className="w-full h-40 object-cover rounded-xl mb-4" />
              <div className="flex items-center gap-2 mb-2">
                <Badge size="sm">{article.category}</Badge>
                <span className="text-xs text-slate-500">{formatDate(article.date)}</span>
              </div>
              <h3 className="text-white font-semibold">{article.title}</h3>
              <p className="text-slate-400 text-sm mt-1">{article.excerpt}</p>
              <p className="text-xs text-slate-500 mt-3">By {article.author}</p>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Sponsors */}
      <h3 className="text-xl font-heading font-bold text-white mb-6">Our Sponsors</h3>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
        {sponsors.map((s) => (
          <a key={s.id} href={s.website} className="glass p-4 flex items-center justify-center grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all rounded-xl">
            <img src={s.logo} alt={s.name} className="h-10 w-auto" />
          </a>
        ))}
      </div>
    </motion.div>
  );
}
