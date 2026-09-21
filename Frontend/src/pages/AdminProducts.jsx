import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiTrash2, FiPackage, FiSearch } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { adminApi } from '../api/adminApi'
import Spinner from '../components/Spinner'
import { useCurrency } from '../context/CurrencyContext'
import { resolveProductImage } from '../utils/images'

export default function AdminProducts() {
  const { format } = useCurrency()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const load = () => {
    setLoading(true)
    adminApi.products()
      .then(setProducts)
      .catch((err) => {
        console.error('adminApi.products failed:', err?.response?.status, err?.response?.data)
        toast.error(`Failed to load products (${err?.response?.status ?? 'network'})`)
      })
      .finally(() => setLoading(false))
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

  const q = search.trim().toLowerCase()
  const filtered = products.filter(p => {
    if (!q) return true
    return (
      p.name?.toLowerCase().includes(q) ||
      p.categoryName?.toLowerCase().includes(q) ||
      p.traderName?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white">Products</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{products.length} total</p>

      <div className="mt-4 relative w-full sm:w-96">
        <FiSearch
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
          aria-hidden="true"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, category or trader…"
          className="input-field w-full !pl-10"
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
            className="card p-3 sm:p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 flex items-center justify-center">
                {p.imageUrl ? (
                  <img
                    src={resolveProductImage(p)}
                    alt={p.name}
                    loading="lazy"
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => { e.currentTarget.src = '/placeholders/product.svg' }}
                  />
                ) : (
                  <FiPackage className="w-6 h-6 text-gray-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                  {p.name}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                  {p.categoryName || 'Uncategorized'} · by {p.traderName || '—'}
                </p>

                <div className="mt-2 flex items-center justify-between sm:hidden">
                  <span className="font-bold text-brand-600 whitespace-nowrap text-sm">{format(p.price)}</span>
                  <button
                    onClick={() => deleteProduct(p)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition active:scale-95"
                    title="Delete product"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <span className="hidden sm:inline font-bold text-brand-600 whitespace-nowrap text-base">
                {format(p.price)}
              </span>
              <button
                onClick={() => deleteProduct(p)}
                className="hidden sm:inline-flex p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition active:scale-95"
                title="Delete product"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}