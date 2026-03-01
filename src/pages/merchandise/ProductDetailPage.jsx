import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { products } from '../../data/merchandise';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { pageTransition } from '../../utils/animationVariants';
import { formatCurrency } from '../../utils/formatters';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import QuantitySelector from '../../components/ui/QuantitySelector';
import { cn } from '../../utils/cn';

export default function ProductDetailPage() {
  const { productId } = useParams();
  const product = products.find((p) => p.id === productId);
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]?.name || '');
  const [quantity, setQuantity] = useState(1);

  if (!product) return <div className="text-center py-20 text-slate-400">Product not found</div>;

  const handleAdd = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    showToast(`Added ${quantity}x ${product.name} to cart!`, 'success');
  };

  return (
    <motion.div {...pageTransition}>
      <Link to="/store" className="text-gold-400 hover:text-gold-300 text-sm mb-4 inline-block">&larr; Back to Store</Link>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="rounded-2xl overflow-hidden">
          <img src={product.images[0]} alt={product.name} className="w-full h-auto object-cover" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">{product.name}</h1>
          <p className="text-3xl font-bold gradient-text mt-2">{formatCurrency(product.price)}</p>
          <p className="text-slate-400 mt-4">{product.description}</p>

          <div className="mt-6">
            <p className="text-sm font-medium text-slate-300 mb-2">Size</p>
            <div className="flex gap-2">
              {product.sizes.map((size) => (
                <button key={size} onClick={() => setSelectedSize(size)} className={cn('px-4 py-2 rounded-lg text-sm border transition-all', selectedSize === size ? 'border-gold-400 text-gold-400 bg-gold-400/10' : 'border-white/10 text-slate-400 hover:border-white/20')}>
                  {size}
                </button>
              ))}
            </div>
          </div>

          {product.colors.length > 1 && (
            <div className="mt-6">
              <p className="text-sm font-medium text-slate-300 mb-2">Color</p>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button key={c.name} onClick={() => setSelectedColor(c.name)} className={cn('w-8 h-8 rounded-full border-2 transition-all', selectedColor === c.name ? 'border-gold-400 ring-2 ring-gold-400/30' : 'border-white/20')} style={{ backgroundColor: c.hex }} title={c.name} />
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <p className="text-sm font-medium text-slate-300 mb-2">Quantity</p>
            <QuantitySelector value={quantity} onChange={setQuantity} />
          </div>

          <Button size="lg" fullWidth className="mt-8" onClick={handleAdd}>Add to Cart - {formatCurrency(product.price * quantity)}</Button>
        </div>
      </div>
    </motion.div>
  );
}
