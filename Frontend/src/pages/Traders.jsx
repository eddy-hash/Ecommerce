import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiArrowRight } from 'react-icons/fi'
import { traderApi } from '../api/traderApi'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'

export default function Traders() {
  const [traders, setTraders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    traderApi.list().then(setTraders).finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner size="lg" />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Traders</h1>
      <p className="text-gray-500 dark:text-gray-400 mt-2">Meet the sellers on ShopHub</p>

      {traders.length === 0 ? (
        <EmptyState title="No traders yet" message="No traders have signed up yet. Be the first!" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {traders.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={`/traders/${t.id}/products`} className="card dark:bg-gray-800 dark:border-gray-700 p-6 hover:shadow-md transition group block">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-brand-100 rounded-full flex items-center justify-center">
                    <FiUser className="w-7 h-7 text-brand-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-brand-600 transition">{t.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.email}</p>
                  </div>
                  <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-brand-600 group-hover:translate-x-1 transition" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}