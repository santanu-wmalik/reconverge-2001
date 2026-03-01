import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { products, productCategories } from '../../data/merchandise';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { pageTransition, staggerContainer, staggerItem } from '../../utils/animationVariants';
import { formatCurrency } from '../../utils/formatters';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Tabs from '../../components/ui/Tabs';
import SectionHeading from '../../components/shared/SectionHeading';

export default function StorePage() {
  const [category, setCategory] = useState('all');
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const filtered = category === 'all' ? products : products.filter((p) => p.category === category);

  const handleQuickAdd = (product) => {
    addToCart(product, product.sizes[0], product.colors[0]?.name || 'Default');
    showToast(`Added ${product.name} to cart!`, 'success');
  };

  return (
    <motion.div {...pageTransition}>
      <SectionHeading title="Merchandise Store" subtitle="Official Silver Jubilee memorabilia and merchandise" />
      <Tabs tabs={productCategories.map((c) => ({ id: c.id, label: c.label }))} activeTab={category} onChange={setCategory} className="mb-8" />

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((product) => (
          <motion.div key={product.id} variants={staggerItem}>
            <GlassCard>
              <Link to={`/store/${product.id}`}>
                <div className="relative rounded-xl overflow-hidden mb-4">
                  <img src={product.images[0]} alt={product.name} className="w-full h-48 object-cover" />
                  {product.badge && <Badge variant="gold" className="absolute top-2 right-2">{product.badge}</Badge>}
                </div>
              </Link>
              <Link to={`/store/${product.id}`}>
                <h3 className="text-white font-semibold hover:text-gold-400 transition-colors">{product.name}</h3>
              </Link>
              <p className="text-slate-400 text-sm mt-1 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-gold-400 font-bold text-lg">{formatCurrency(product.price)}</span>
                <Button size="sm" onClick={() => handleQuickAdd(product)}>Add to Cart</Button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
