import { useEffect, useState, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiPlus, FiEdit, FiTrash2, FiDollarSign, FiShoppingBag, FiTruck, FiPackage } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { productApi } from '../api/productApi'
import { orderApi } from '../api/orderApi'
import { resolveProductImage } from '../utils/images'
import { formatTZS } from '../utils/currency'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'

export default function TraderDashboard() {
  const location = useLocation()
  const [products, setProducts] = useState([])
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [p, s, o] = await Promise.all([
        productApi.mine(),
        orderApi.stats(),
        orderApi.received(),
      ])
      setProducts(p)
      setStats(s)
      setRecentOrders(o.slice(0, 5))
    } catch (e) {
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }, [])

  // Refetch on mount + whenever location changes
  useEffect(() => { load() }, [load, location.key])

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      await productApi.remove(id)
      toast.success('Product deleted')
      load()  // refresh immediately
    } catch (e) {
      toast.error('Failed to delete')
    }
  }

  if (loading && !stats) return <Spinner size="lg" />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your business</p>
        </div>
        <div className="flex gap-3">
          <Link to="/trader/orders" className="btn-secondary flex items-center gap-2">
            <FiShoppingBag /> Incoming Orders
          </Link>
          <Link to="/trader/products/new" className="btn-primary flex items-center gap-2">
            <FiPlus /> Add Product
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <FiDollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Revenue</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{formatTZS(stats?.totalRevenue || 0)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/30 rounded-lg flex items-center justify-center">
              <FiPackage className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Products</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalProducts || 0}</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <FiShoppingBag className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Orders</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalOrders || 0}</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <FiTruck className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(stats?.pendingOrders || 0) + (stats?.paidOrders || 0)}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {[
          { label: 'Pending',   value: stats?.pendingOrders || 0,   color: 'text-yellow-600' },
          { label: 'Paid',      value: stats?.paidOrders || 0,      color: 'text-blue-600' },
          { label: 'Shipped',   value: stats?.shippedOrders || 0,   color: 'text-purple-600' },
          { label: 'Delivered', value: stats?.deliveredOrders || 0, color: 'text-green-600' },
        ].map((s) => (
          <div key={s.label} className="card p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {recentOrders.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Orders</h2>
            <Link to="/trader/orders" className="text-sm text-brand-600 hover:underline">View all</Link>
          </div>
          <div className="card divide-y divide-gray-200 dark:divide-gray-700">
            {recentOrders.map((o) => (
              <div key={o.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Order #{o.id} · {o.customerName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(o.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-brand-600">{formatTZS(o.totalAmount)}</span>
                  <span className="text-xs font-medium px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-6">Your Products</h2>

      {products.length === 0 ? (
        <EmptyState
          title="No products yet"
          message="Start by adding your first product to sell on ShopHub."
          action={<Link to="/trader/products/new" className="btn-primary">Add your first product</Link>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="card overflow-hidden">
              <div className="aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden">
                <img
                  src={resolveProductImage(p)}
                  alt={p.name}
                  className="w-full h-full object-contain p-2"
                  onError={(e) => { e.currentTarget.src = '/placeholders/product.svg' }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">{p.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{p.categoryName || 'Uncategorized'}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-bold text-brand-600">{formatTZS(p.price)}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Stock: {p.stock}</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Link to={`/trader/products/${p.id}/edit`}
                    className="flex-1 btn-secondary text-sm flex items-center justify-center gap-1">
                    <FiEdit /> Edit
                  </Link>
                  <button onClick={() => handleDelete(p.id)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}