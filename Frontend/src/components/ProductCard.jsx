import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiTag } from 'react-icons/fi'
import { resolveProductImage } from '../utils/images'
import { formatTZS } from '../utils/currency'
import { staggerItem } from '../utils/motion'

export default function ProductCard({ product }) {
  const inStock = product.stock > 0
  const imageUrl = resolveProductImage(product)

  return (
    <motion.div
      variants={staggerItem}
      whileTap={{ scale: 0.97 }}
      className="h-full"
    >
      <Link to={`/products/${product.id}`} className="block card overflow-hidden group h-full flex flex-col active:scale-[0.98] transition-transform">
        <div className="aspect-[4/3] sm:aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden relative">
          <img
            src={`${imageUrl}?v=${product.imageUrl || 'default'}`}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            onError={(e) => { e.currentTarget.src = '/placeholders/product.svg' }}
          />
          {!inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-xs sm:text-sm uppercase tracking-wider px-2 py-1 border-2 border-white rounded">
                Out of Stock
              </span>
            </div>
          )}
        </div>
        <div className="p-3 sm:p-4 flex-1 flex flex-col">
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-1">
            <FiTag className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{product.categoryName || 'Uncategorized'}</span>
          </div>
          <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white line-clamp-2 leading-snug">
            {product.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
            {product.traderName}
          </p>
          <div className="mt-auto pt-3 flex items-center justify-between gap-2">
            <span className="text-base sm:text-lg font-bold text-brand-600 truncate">
              {formatTZS(product.price)}
            </span>
            <span className={`text-[10px] sm:text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${
              inStock
                ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
            }`}>
              {inStock ? `${product.stock}` : '0'}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}