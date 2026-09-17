import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { FiPackage, FiTruck, FiCheck, FiX } from 'react-icons/fi'
import { useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { orderApi } from '../api/orderApi'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import { formatTZS } from '../utils/currency'

const statusColors = {
  PENDING:   'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  PAID:      'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  SHIPPED:   'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  DELIVERED: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  CANCELLED: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300',
}

export default function TraderOrders() {
  const location = useLocation()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    setLoading(true)
    orderApi.received().then(setOrders).finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load, location.key])

  const act = async (id, fn, label) => {
    try { await fn(id); toast.success(`Order ${label}`); load() }
    catch (e) { toast.error(e.response?.data?.message || 'Failed') }
  }

  if (loading) return <Spinner size="lg" />

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white">Incoming Orders</h1>
      <p className="text-gray-500 dark:text-gray-400 mt-2">{orders.length} order{orders.length !== 1 && 's'}</p>

      {orders.length === 0 ? (
        <EmptyState title="No orders yet" message="When customers buy your products, orders will appear here." />
      ) : (
        <div className="space-y-4 mt-8">
          {orders.map((o, i) => (
            <motion.div key={o.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="card p-4 sm:p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-brand-50 dark:bg-brand-900/30 rounded-xl flex items-center justify-center">
                    <FiPackage className="w-6 h-6 text-brand-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Order #{o.id}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">by {o.customerName} · {new Date(o.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[o.status] || 'bg-gray-100'}`}>
                  {o.status}
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
                {o.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">{it.productName} × {it.quantity}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatTZS(it.priceAtPurchase)}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700 font-bold text-lg">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-brand-600">{formatTZS(o.totalAmount)}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {o.status === 'PAID' && (
                  <button onClick={() => act(o.id, orderApi.ship, 'shipped')}
                    className="btn-primary flex items-center gap-2 text-sm">
                    <FiTruck /> Mark as Shipped
                  </button>
                )}
                {o.status === 'SHIPPED' && (
                  <button onClick={() => act(o.id, orderApi.deliver, 'delivered')}
                    className="btn-primary flex items-center gap-2 text-sm">
                    <FiCheck /> Mark as Delivered
                  </button>
                )}
                {(o.status === 'PENDING' || o.status === 'PAID') && (
                  <button onClick={() => act(o.id, orderApi.cancel, 'cancelled')}
                    className="btn-secondary flex items-center gap-2 text-sm text-red-600">
                    <FiX /> Cancel
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}