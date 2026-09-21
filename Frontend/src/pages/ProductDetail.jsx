import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiShoppingCart, FiPackage, FiTag } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { productApi } from '../api/productApi'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { resolveProductImage } from '../utils/images'
import { useCurrency } from '../context/CurrencyContext'
import Spinner from '../components/Spinner'
import VerifiedBadge from '../components/VerifiedBadge'
import Avatar from '../components/Avatar'
import EmptyState from '../components/EmptyState'

export default function ProductDetail() {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { format } = useCurrency()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [color, setColor] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    productApi.get(id).then((p) => {
      setProduct(p)
      if (p.colors && p.colors.length) setColor(p.colors[0])
    }).catch(() => setError('not_found'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Spinner size="lg" />
  if (error || !product) return <EmptyState title={t('product.notFound')} message={t('product.notFoundDesc')} />

  const inStock = product.stock > 0

  const handleAddToCart = () => {
    if (!user) { navigate('/login'); return }
    if (user.role !== 'CUSTOMER') { toast.error('Only customers can purchase products'); return }
    addItem({ ...product, color }, qty)
    toast.success(`${qty} × ${product.name}`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      <Link to="/categories" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-600 mb-4 sm:mb-6">
        <FiArrowLeft /> {t('common.back')}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-2xl sm:rounded-3xl overflow-hidden">
          <img src={resolveProductImage(product)} alt={product.name} className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = '/placeholders/product.svg' }} />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex-wrap">
            <FiTag /> <span>{product.categoryName || t('product.uncategorized')}</span>
            <span className="mx-1">|</span>
            <FiPackage /> <span>{t('product.soldBy')}</span> <Avatar user={{ name: product.traderName, verified: product.traderVerified }} size="xs" showBadge /> <span>{product.traderName}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-2 sm:mt-3">{product.name}</h1>
          <p className="text-2xl sm:text-3xl font-bold text-brand-600 mt-3 sm:mt-4">{format(product.price)}</p>

          <span className={`mt-3 inline-flex w-fit text-xs px-3 py-1 rounded-full font-medium ${
            inStock ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
          }`}>
            {inStock ? `${product.stock} ${t('product.inStock')}` : t('product.outOfStock')}
          </span>

          {product.description && (
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-4 sm:mt-6 leading-relaxed">{product.description}</p>
          )}

          {product.colors && product.colors.length > 0 && (
            <div className="mt-4 sm:mt-6">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">{t('product.colors')}</label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button key={c} onClick={() => setColor(c)}
                    className={`px-4 py-2 rounded-lg border-2 transition text-sm font-medium ${
                      color === c ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 text-gray-700 dark:text-gray-300'
                    }`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 sm:mt-6">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">{t('product.quantity')}</label>
            <div className="flex items-center gap-3">
                <select
                  id="product-qty"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="h-10 px-3 pr-8 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-900 dark:text-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 cursor-pointer"
                >
                  {Array.from({ length: Math.min(product.stock, 20) }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {product.stock} {t('product.inStock')}
                </span>
              </div>
          </div>

          {error && error !== 'not_found' && <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg text-sm">{error}</div>}

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            disabled={!inStock}
            className="btn-primary mt-6 sm:mt-8 py-3.5 sm:py-4 flex items-center justify-center gap-2 text-base">
            <FiShoppingCart /> {t('product.addToCart')}
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
