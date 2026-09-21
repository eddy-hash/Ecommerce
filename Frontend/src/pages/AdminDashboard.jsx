import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUsers, FiShoppingBag, FiPackage, FiDollarSign, FiUserCheck, FiTrendingUp, FiClock, FiTruck, FiCheckCircle, FiXCircle } from 'react-icons/fi'
import { adminApi } from '../api/adminApi'
import Spinner from '../components/Spinner'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.stats().then(setStats).finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner size="lg" />
  if (!stats) return null

  const mainCards = [
    { label: 'Total Users',      value: stats.totalUsers,      icon: FiUsers,       color: 'blue' },
    { label: 'Traders',          value: stats.totalTraders,    icon: FiShoppingBag, color: 'purple' },
    { label: 'Products',         value: stats.totalProducts,   icon: FiPackage,     color: 'orange' },
    { label: 'Revenue',          value: `TZS ${Number(stats.totalRevenue).toLocaleString()}`, icon: FiDollarSign, color: 'green' },
  ]

  const statusCards = [
    { label: 'Pending',   value: stats.pendingOrders,   icon: FiClock,       color: 'yellow' },
    { label: 'Paid',      value: stats.paidOrders,      icon: FiDollarSign,  color: 'blue' },
    { label: 'Shipped',   value: stats.shippedOrders,   icon: FiTruck,       color: 'purple' },
    { label: 'Delivered', value: stats.deliveredOrders, icon: FiCheckCircle, color: 'green' },
  ]

  const colorMap = {
    blue:    'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
    green:   'bg-green-100 dark:bg-green-900/30 text-green-600',
    purple:  'bg-purple-100 dark:bg-purple-900/30 text-purple-600',
    orange:  'bg-orange-100 dark:bg-orange-900/30 text-orange-600',
    yellow:  'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600',
    red:     'bg-red-100 dark:bg-red-900/30 text-red-600',
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1 sm:mt-2">Platform overview and controls</p>
        </div>
      </div>

      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
        {mainCards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorMap[c.color]}`}>
                <c.icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide truncate">{c.label}</p>
                <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white truncate">{c.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-4">
        {statusCards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }} className="card p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorMap[c.color]}`}>
                <c.icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide truncate">{c.label}</p>
                <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white truncate">{c.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">Management</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Link to="/admin/users" className="card p-5 hover:shadow-md active:scale-[0.98] transition block">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <FiUsers className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Manage Users</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Verify traders, delete accounts</p>
            </div>
          </div>
        </Link>
        <Link to="/admin/products" className="card p-5 hover:shadow-md active:scale-[0.98] transition block">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <FiPackage className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Manage Products</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Review and delete listings</p>
            </div>
          </div>
        </Link>
        <Link to="/admin/orders" className="card p-5 hover:shadow-md active:scale-[0.98] transition block">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <FiTrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">All Orders</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Platform-wide order list</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}