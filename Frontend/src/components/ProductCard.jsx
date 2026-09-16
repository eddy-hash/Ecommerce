import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiTag } from 'react-icons/fi'
import { resolveProductImage } from '../utils/images'
import { formatTZS } from '../utils/currency'

export default function ProductCard({ product }) {
  const inStock = product.stock > 0
  const imageUrl = resolveProductImage(product)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
    >
      <Link to={`/products/${product.id}`} className="block card overflow-hidden group">
        <div className="aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
          <img
            src={`${imageUrl}?v=${product.imageUrl || 'default'}`}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            onError={(e) => { e.currentTarget.src = '/placeholders/product.svg' }}
          />
        </div>
        <div className="p-4">
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-1">
            <FiTag className="w-3 h-3" />
            <span>{product.categoryName || 'Uncategorized'}</span>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{product.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">{product.traderName}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-lg font-bold text-brand-600">{formatTZS(product.price)}</span>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              inStock ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
            }`}>
              {inStock ? `${product.stock} left` : 'Out'}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}