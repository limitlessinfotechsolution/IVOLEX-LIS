import { motion } from 'framer-motion';
import { ShoppingCart, Heart } from 'lucide-react';
import Stars from '../Stars/Stars';
import Badge from '../Badge';
import { useLocation } from '../../contexts/LocationContext.jsx';

export default function ProductCard({ product }) {
  const { effectiveCurrency } = useLocation();

  // Currency conversion rates (simplified)
  const conversionRates = {
    SAR: 1,
    USD: 0.27,
    AED: 0.99,
    EUR: 0.25,
    GBP: 0.22
  };

  // Convert price to effective currency
  const convertPrice = (price) => {
    const numericPrice = parseFloat(price.replace(/[^\d.]/g, ''));
    const converted = numericPrice * (conversionRates[effectiveCurrency] || 1);
    return `${effectiveCurrency} ${converted.toFixed(0)}`;
  };

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl bg-white shadow-soft cursor-pointer group"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      {/* Circular Image Frame */}
      <div className="relative p-4">
        <div className="relative w-full aspect-square rounded-full overflow-hidden bg-stone-100">
          <img
            src={product.img}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          {product.tag && (
            <div className="absolute top-2 left-2">
              <Badge tone="gold">{product.tag}</Badge>
            </div>
          )}
        </div>

        {/* Action Buttons - Fade in on hover */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex gap-2">
            <motion.button
              className="p-3 bg-white rounded-full shadow-lg hover:bg-stone-50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Add to Cart"
            >
              <ShoppingCart size={20} className="text-stone-700" />
            </motion.button>
            <motion.button
              className="p-3 bg-white rounded-full shadow-lg hover:bg-stone-50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Add to Wishlist"
            >
              <Heart size={20} className="text-stone-700" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        <h3 className="font-medium text-stone-900 line-clamp-2">{product.title}</h3>
        <Stars value={product.rating || 5} />
        <p className="text-brand-700 font-semibold">{convertPrice(product.price)}</p>
      </div>

      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-brand-500/10 to-transparent pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
