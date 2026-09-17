import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiTrash2, FiPackage, FiSearch } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { adminApi } from '../api/adminApi'
import Spinner from '../components/Spinner'
import { formatTZS } from '../utils/currency'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const load = () => {
    setLoading(true)
    adminApi.products().then(setProducts).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const deleteProduct = async (p) => {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return
    try {
      await adminApi.deleteProduct(p.id)
      toast.success('Product deleted')
      load()
    } catch (e) {
      toast.error('Failed to delete')
    }
  }

  if (loading) return <Spinner size="lg" />

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white">Products</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{products.length} total</p>

      <div className="mt-4 relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="input-field pl-10"
        />
      </div>

      <div className="mt-6 space-y-2">
        {filtered.length === 0 && (
          <div className="card p-8 text-center text-gray-500 dark:text-gray-400">
            No products found
          </div>
        )}
        {filtered.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
            className="card p-3 sm:p-4 flex items-center gap-3"
          >
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
              {p.imageUrl ? (
                <img src={`/api/files/${p.imageUrl}`} alt={p.name} className="w-full h-full object-cover" />
              ) : (
                <FiPackage className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">{p.name}</p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                {p.category != null ? p.category.getName() : '—'} · by {p.trader != null ? p.trader.getName() : '—'}
              </p>
            </div>
            <span className="font-bold text-brand-600 whitespace-nowrap text-sm sm:text-base">{formatTZS(p.price)}</span>
            <button
              onClick={() => deleteProduct(p)}
              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition active:scale-95"
              title="Delete product"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}