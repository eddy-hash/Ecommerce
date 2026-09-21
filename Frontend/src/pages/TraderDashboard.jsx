import { useEffect, useState, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiPlus, FiEdit, FiTrash2, FiDollarSign, FiShoppingBag,
  FiTruck, FiPackage, FiTrendingUp, FiArrowRight
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { productApi } from '../api/productApi'
import { orderApi } from '../api/orderApi'
import { resolveProductImage } from '../utils/images'
import { useCurrency } from '../context/CurrencyContext'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'

const STATUS_META = {
  PENDING:   { label: 'Pending',   dot: 'bg-amber-400',   pill: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' },
  PAID:      { label: 'Paid',      dot: 'bg-blue-400',    pill: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
  SHIPPED:   { label: 'Shipped',   dot: 'bg-purple-400',  pill: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
  DELIVERED: { label: 'Delivered', dot: 'bg-green-400',   pill: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
  CANCELLED: { label: 'Cancelled', dot: 'bg-red-400',     pill: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300' },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}

const viewportOnce = { once: true, margin: '-80px' }

export default function TraderDashboard() {
  const { format } = useCurrency()
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
      setProducts(Array.isArray(p) ? p : [])
      setStats(s)
      setRecentOrders(Array.isArray(o) ? o.slice(0, 5) : [])
    } catch (e) {
      console.error('TraderDashboard load failed:', e?.response?.status, e?.response?.data)
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load, location.key])

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      await productApi.remove(id)
      toast.success('Product deleted')
      load()
    } catch (e) {
      toast.error('Failed to delete')
    }
  }

  if (loading && !stats) return <Spinner size="lg" />

  const uniqueProducts = Array.from(
    new Map(products.map((p) => [p.id, p])).values()
  )

  const totalRevenue = stats?.totalRevenue ?? 0
  const totalProducts = stats?.totalProducts ?? uniqueProducts.length
  const totalOrders = stats?.totalOrders ?? 0
  const pending = stats?.pendingOrders ?? 0
  const paid = stats?.paidOrders ?? 0
  const shipped = stats?.shippedOrders ?? 0
  const delivered = stats?.deliveredOrders ?? 0

  const topStats = [
    { label: 'Revenue',     value: format(totalRevenue),       icon: FiDollarSign,  gradient: 'from-emerald-400 to-green-500',    shadow: 'shadow-emerald-500/20' },
    { label: 'Products',    value: totalProducts,               icon: FiPackage,     gradient: 'from-blue-400 to-indigo-500',      shadow: 'shadow-blue-500/20' },
    { label: 'Orders',      value: totalOrders,                 icon: FiShoppingBag, gradient: 'from-amber-400 to-orange-500',     shadow: 'shadow-amber-500/20' },
    { label: 'In Progress', value: pending + paid,              icon: FiTruck,       gradient: 'from-purple-400 to-fuchsia-500',   shadow: 'shadow-purple-500/20' },
  ]

  const statusPills = [
    { key: 'PENDING',   count: pending },
    { key: 'PAID',      count: paid },
    { key: 'SHIPPED',   count: shipped },
    { key: 'DELIVERED', count: delivered },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your business at a glance
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/trader/orders"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium text-gray-700 dark:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
          >
            <FiShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Incoming Orders</span>
            <span className="sm:hidden">Orders</span>
          </Link>
          <Link
            to="/trader/products/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white text-sm font-semibold shadow-lg shadow-brand-500/20 active:scale-[0.98] transition-all"
          >
            <FiPlus className="w-4 h-4" />
            Add Product
          </Link>
        </div>
      </motion.div>

      
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
      >
        {topStats.map((s) => (
          <motion.div
            key={s.label}
            variants={fadeUp}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-5 hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  {s.label}
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1.5 truncate">
                  {s.value}
                </p>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center flex-shrink-0 shadow-lg ${s.shadow}`}>
                <s.icon className="w-4 h-4 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mt-3 sm:mt-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <FiTrendingUp className="w-4 h-4 text-gray-400" />
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Order status
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {statusPills.map((p) => {
            const meta = STATUS_META[p.key]
            return (
              <div key={p.key} className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full ${meta.dot} flex-shrink-0`} />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{meta.label}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                    {p.count}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      
      {recentOrders.length > 0 && (
        <div className="mt-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-between mb-4"
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent orders</h2>
            <Link to="/trader/orders" className="text-sm font-medium text-brand-600 hover:text-brand-700 inline-flex items-center gap-1">
              View all <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden divide-y divide-gray-100 dark:divide-gray-800"
          >
            {recentOrders.map((o) => {
              const meta = STATUS_META[o.status] || { pill: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300' }
              return (
                <motion.div
                  key={o.id}
                  variants={fadeUp}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="p-4 flex items-center justify-between gap-3 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                      Order #{o.id} - {o.customerName || 'Customer'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {o.createdAt ? new Date(o.createdAt).toLocaleString() : '-'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="font-semibold text-sm text-brand-600 whitespace-nowrap">
                      {format(o.totalAmount || 0)}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${meta.pill}`}>
                      {o.status}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      )}

      
      <div className="mt-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-4"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Your products
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({uniqueProducts.length})
            </span>
          </h2>
        </motion.div>

        {uniqueProducts.length === 0 ? (
          <EmptyState
            title="No products yet"
            message="Start by adding your first product to sell on ShopHub."
            action={
              <Link
                to="/trader/products/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-semibold shadow-lg shadow-brand-500/20"
              >
                <FiPlus className="w-4 h-4" /> Add your first product
              </Link>
            }
          />
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
          >
            {uniqueProducts.map((p) => (
              <motion.div
                key={p.id}
                variants={fadeUp}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                whileHover={{ y: -4 }}
                className="group rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
              >
                <div className="aspect-[4/3] flex items-center justify-center bg-gray-50/50 dark:bg-gray-800/30 p-3">
                  <img
                    src={resolveProductImage(p)}
                    alt={p.name}
                    loading="lazy"
                    className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.currentTarget.src = '/placeholders/product.svg' }}
                  />
                </div>
                <div className="p-3">
                  <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                    {p.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                    {p.categoryName || 'Uncategorized'}
                  </p>
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="font-bold text-brand-600 text-sm">
                      {format(p.price)}
                    </span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">
                      Stock: {p.stock}
                    </span>
                  </div>
                  <div className="flex gap-1.5 mt-3">
                    <Link
                      to={`/trader/products/${p.id}/edit`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                    >
                      <FiEdit className="w-3.5 h-3.5" /> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      aria-label={`Delete ${p.name}`}
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
