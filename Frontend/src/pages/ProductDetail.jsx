import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiShoppingCart, FiPackage, FiTag } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { productApi } from '../api/productApi'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { resolveProductImage } from '../utils/images'
import { formatTZS } from '../utils/currency'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
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
    }).catch(() => setError('Product not found'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Spinner size="lg" />
  if (error || !product) return <EmptyState title="Product not found" message="The product you're looking for doesn't exist." />

  const inStock = product.stock > 0

  const handleAddToCart = () => {
    if (!user) { navigate('/login'); return }
    if (user.role !== 'CUSTOMER') { setError('Only customers can add to cart'); return }
    addItem({ ...product, color }, qty)
    toast.success(`${qty} × ${product.name} added to cart`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/categories" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-600 mb-6">
        <FiArrowLeft /> Back
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-3xl overflow-hidden">
          <img src={`${resolveProductImage(product)}?v=${product.imageUrl || 'default'}`} alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = '/placeholders/product.svg' }} />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <FiTag /> <span>{product.categoryName || 'Uncategorized'}</span>
            <span className="mx-2">•</span>
            <FiPackage /> <span>Sold by {product.traderName}</span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mt-3">{product.name}</h1>
          <p className="text-3xl font-bold text-brand-600 mt-4">{formatTZS(product.price)}</p>

          <span className={`mt-3 inline-flex w-fit text-xs px-3 py-1 rounded-full font-medium ${
            inStock ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {inStock ? `${product.stock} in stock` : 'Out of stock'}
          </span>

          {product.description && (
            <p className="text-gray-600 dark:text-gray-300 mt-6 leading-relaxed">{product.description}</p>
          )}

          {product.colors && product.colors.length > 0 && (
            <div className="mt-6">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">Color / Type</label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button key={c} onClick={() => setColor(c)}
                    className={`px-4 py-2 rounded-lg border-2 transition text-sm font-medium ${
                      color === c ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200'
                    }`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">Quantity</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 border rounded-lg hover:bg-gray-50 dark:bg-gray-900">−</button>
              <span className="w-12 text-center font-medium">{qty}</span>
              <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="w-10 h-10 border rounded-lg hover:bg-gray-50 dark:bg-gray-900">+</button>
            </div>
          </div>

          {error && <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            disabled={!inStock}
            className="btn-primary mt-8 py-4 flex items-center justify-center gap-2 text-base">
            <FiShoppingCart /> Add to Cart
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}