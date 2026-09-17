import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FiArrowRight, FiShoppingBag, FiTruck, FiShield, FiTrendingUp } from 'react-icons/fi'
import { categoryApi } from '../api/categoryApi'
import { productApi } from '../api/productApi'
import ProductCard from '../components/ProductCard'
import Spinner from '../components/Spinner'
import AnimatedGrid from '../components/AnimatedGrid'

export default function Home() {
  const { t } = useTranslation()
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
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-brand-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                <FiTrendingUp className="w-3 h-3" />
                {t('home.badge')}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
                {t('home.title1')}<br />
                <span className="text-brand-600">{t('home.title2')}</span>
              </h1>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-lg">
                {t('home.subtitle')}
              </p>
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
                <Link to="/categories" className="btn-primary flex items-center justify-center gap-2 text-base px-6 py-3.5">
                  {t('home.startShopping')} <FiArrowRight />
                </Link>
                <Link to="/register" className="btn-secondary flex items-center justify-center gap-2 text-base px-6 py-3.5">
                  {t('home.becomeTrader')}
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block relative"
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
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
          {[
            { icon: FiShoppingBag, title: t('home.wideSelection'), text: t('home.wideSelectionDesc') },
            { icon: FiTruck,        title: t('home.fastDelivery'),  text: t('home.fastDeliveryDesc') },
            { icon: FiShield,       title: t('home.securePayment'), text: t('home.securePaymentDesc') },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card p-4 sm:p-6 flex items-start gap-3 sm:gap-4"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-100 dark:bg-brand-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <f.icon className="w-5 h-5 sm:w-6 sm:h-6 text-brand-600" />
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">{f.title}</h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">{f.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="flex items-end justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{t('home.shopByCategory')}</h2>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">{t('home.browseCategories')}</p>
          </div>
        </div>
        {loading ? <Spinner /> : (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
            {categories.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link
                  to={`/categories/${c.id}`}
                  className="card p-3 sm:p-6 flex flex-col items-center text-center hover:shadow-md active:scale-95 transition-all group"
                >
                  <div className="w-10 h-10 sm:w-14 sm:h-14 bg-brand-50 dark:bg-brand-900/30 rounded-2xl flex items-center justify-center mb-2 sm:mb-3 group-hover:bg-brand-100 dark:group-hover:bg-brand-900/50 transition">
                    <FiShoppingBag className="w-5 h-5 sm:w-7 sm:h-7 text-brand-600" />
                  </div>
                  <span className="font-medium text-xs sm:text-sm text-gray-900 dark:text-white line-clamp-2">{c.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="flex items-end justify-between mb-4 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{t('home.featuredProducts')}</h2>
        </div>
        {loading ? <Spinner /> : (
          <AnimatedGrid className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </AnimatedGrid>
        )}
      </section>
    </div>
  )
}