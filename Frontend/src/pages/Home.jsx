import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiArrowRight, FiShoppingBag, FiTruck, FiShield, FiTrendingUp } from 'react-icons/fi'
import { categoryApi } from '../api/categoryApi'
import { productApi } from '../api/productApi'
import ProductCard from '../components/ProductCard'
import Spinner from '../components/Spinner'

export default function Home() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([categoryApi.list(), productApi.list()])
      .then(([c, p]) => { setCategories(c); setProducts(p.slice(0, 8)) })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-brand-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-sm font-medium mb-4">
              <FiTrendingUp /> E-Commerce & Order Management
            </span>
            <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
              Shop smarter.<br />
              <span className="text-brand-600">Sell faster.</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-lg">
              Connect customers with trusted traders in one unified marketplace.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/categories" className="btn-primary flex items-center gap-2 text-base px-6 py-3">
                Start Shopping <FiArrowRight />
              </Link>
              <Link to="/register" className="btn-secondary flex items-center gap-2 text-base px-6 py-3">
                Become a Trader
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-brand-600 rounded-3xl rotate-6 opacity-20" />
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=800&fit=crop"
                alt="Shopping"
                className="relative rounded-3xl shadow-2xl w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: FiShoppingBag, title: 'Wide Selection', text: 'Thousands of products across categories' },
            { icon: FiTruck,        title: 'Fast Delivery',  text: 'Get your orders delivered quickly' },
            { icon: FiShield,       title: 'Secure Payment', text: 'Safe checkout with buyer protection' },
          ].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="card dark:bg-gray-800 dark:border-gray-700 p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <f.icon className="w-6 h-6 text-brand-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{f.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Shop by Category</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Browse products across our curated categories</p>
          </div>
          <Link to="/categories" className="text-brand-600 hover:text-brand-700 font-medium hidden sm:flex items-center gap-1">
            View all <FiArrowRight />
          </Link>
        </div>
        {loading ? <Spinner /> : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link to={`/categories/${c.id}`}
                  className="card dark:bg-gray-800 dark:border-gray-700 p-6 flex flex-col items-center text-center hover:shadow-md transition group">
                  <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-brand-100 transition">
                    <FiShoppingBag className="w-7 h-7 text-brand-600" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">{c.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Products</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Hand-picked items from our traders</p>
          </div>
        </div>
        {loading ? <Spinner /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  )
}