import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FiArrowRight } from 'react-icons/fi'
import { categoryApi } from '../api/categoryApi'
import Spinner from '../components/Spinner'

export default function Categories() {
  const { t } = useTranslation()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    categoryApi.list().then(setCategories).finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner size="lg" />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white">{t('categories.title')}</h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1 sm:mt-2">{t('categories.subtitle')}</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mt-6 sm:mt-10">
        {categories.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Link
              to={`/categories/${c.id}`}
              className="card p-4 sm:p-6 flex items-center justify-between hover:shadow-md active:scale-[0.98] transition-all group"
            >
              <div className="min-w-0">
                <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white group-hover:text-brand-600 transition truncate">{c.name}</h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">{t('categories.explore')}</p>
              </div>
              <FiArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-brand-600 group-hover:translate-x-1 transition flex-shrink-0 ml-2" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}