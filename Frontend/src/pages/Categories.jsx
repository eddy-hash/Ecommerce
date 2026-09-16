import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import { categoryApi } from '../api/categoryApi'
import Spinner from '../components/Spinner'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    categoryApi.list().then(setCategories).finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner size="lg" />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Categories</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Browse our full selection by category</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {categories.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Link to={`/categories/${c.id}`}
              className="card dark:bg-gray-800 dark:border-gray-700 p-6 flex items-center justify-between hover:shadow-md transition group">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-brand-600 transition">{c.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Explore products</p>
              </div>
              <FiArrowRight className="w-6 h-6 text-gray-400 group-hover:text-brand-600 group-hover:translate-x-1 transition" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}