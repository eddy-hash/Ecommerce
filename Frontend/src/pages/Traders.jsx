import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FiArrowRight } from 'react-icons/fi'
import { traderApi } from '../api/traderApi'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import VerifiedBadge from '../components/VerifiedBadge'
import Avatar from '../components/Avatar'

export default function Traders() {
  const { t } = useTranslation()
  const [traders, setTraders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    traderApi.list().then(setTraders).finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner size="lg" />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      <div>
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white">{t('traders.title')}</h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1 sm:mt-2">{t('traders.subtitle')}</p>
      </div>

      {traders.length === 0 ? (
        <EmptyState title={t('traders.noTraders')} message={t('traders.noTradersDesc')} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mt-6 sm:mt-10">
          {traders.map((tr, i) => (
            <motion.div key={tr.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link
                to={`/traders/${tr.id}/products`}
                className="card p-4 sm:p-6 hover:shadow-md active:scale-[0.98] transition-all group block"
              >
                <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-center gap-3 sm:gap-4">
                  {/* Profile picture with badge overlay */}
                  <Avatar user={tr} size="lg" showBadge />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-center sm:justify-start gap-1.5">
                      <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white group-hover:text-brand-600 transition truncate">
                        {tr.name}
                      </h3>
                      {tr.verified && <VerifiedBadge size="sm" />}
                    </div>
                    <p className="text-[10px] sm:text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      {tr.email}
                    </p>
                  </div>

                  <FiArrowRight className="hidden sm:block w-5 h-5 text-gray-400 group-hover:text-brand-600 group-hover:translate-x-1 transition flex-shrink-0" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}