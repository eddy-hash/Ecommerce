import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiPackage } from 'react-icons/fi'
import { adminApi } from '../api/adminApi'
import Spinner from '../components/Spinner'
import { formatTZS } from '../utils/currency'

const statusStyles = {
  PENDING:   'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  PAID:      'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  SHIPPED:   'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  DELIVERED: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  CANCELLED: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.orders().then(setOrders).finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner size="lg" />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white">All Orders</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{orders.length} total</p>

      <div className="mt-6 space-y-2">
        {orders.length === 0 && (
          <div className="card p-8 text-center text-gray-500 dark:text-gray-400">
            No orders yet
          </div>
        )}
        {orders.map((o, i) => (
          <motion.div
            key={o.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
            className="card p-3 sm:p-4 flex items-center gap-3"
          >
            <div className="w-12 h-12 bg-brand-50 dark:bg-brand-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <FiPackage className="w-6 h-6 text-brand-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">Order #{o.id}</p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                {o.customer != null ? o.customer.getName() : '—'} · {o.items ? o.items.length : 0} items
              </p>
            </div>
            <span className={`text-xs px-2 sm:px-3 py-1 rounded-full font-bold whitespace-nowrap ${statusStyles[o.status] || 'bg-gray-100'}`}>
              {o.status}
            </span>
            <span className="font-bold text-brand-600 whitespace-nowrap text-sm sm:text-base">{formatTZS(o.totalAmount)}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}