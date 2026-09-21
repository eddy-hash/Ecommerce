import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiX, FiTrash2, FiShoppingBag, FiTruck, FiArrowRight } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useCurrency } from '../context/CurrencyContext'
import { resolveProductImage } from '../utils/images'

const FREE_SHIPPING_THRESHOLD = 100000 // TZS

export default function CartDrawer() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { items, isOpen, setIsOpen, removeItem, updateQty, total } = useCart()
  const { format } = useCurrency()

  if (user?.role !== 'CUSTOMER') return null

  const cartCount = items.reduce((s, i) => s + i.quantity, 0)
  const shippingProgress = Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100)
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - total, 0)
  const qualifiesForFreeShipping = total >= FREE_SHIPPING_THRESHOLD

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />

          
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col"
          >
            
            <div className="relative px-5 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
                    <FiShoppingBag className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-base text-gray-900 dark:text-white leading-tight">
                      {t('cart.yourCart')}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {cartCount} {cartCount === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label={t('common.close')}
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              
              {items.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FiTruck className={`w-3.5 h-3.5 ${qualifiesForFreeShipping ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`} />
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {qualifiesForFreeShipping ? (
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          You qualify for free shipping
                        </span>
                      ) : (
                        <>
                          Add <span className="font-semibold text-gray-900 dark:text-white">{format(remaining)}</span> more for free shipping
                        </>
                      )}
                    </p>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${shippingProgress}%` }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      className={`h-full rounded-full ${
                        qualifiesForFreeShipping
                          ? 'bg-gradient-to-r from-green-400 to-green-500'
                          : 'bg-gradient-to-r from-brand-400 to-brand-600'
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>

            
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="w-24 h-24 rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-850 flex items-center justify-center mb-5 shadow-inner"
                >
                  <FiShoppingBag className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                </motion.div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                  {t('cart.empty')}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-[260px]">
                  Looks like you haven't added anything yet. Let's change that.
                </p>
                <Link
                  to="/categories"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  {t('cart.browseProducts')}
                  <FiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 60, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.25 }}
                        className="group relative flex gap-3 p-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
                      >
                        
                        <div className="w-20 h-20 flex-shrink-0 rounded-xl bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center overflow-hidden">
                          {item.imageUrl ? (
                            <img
                              src={resolveProductImage(item)}
                              alt={item.name}
                              loading="lazy"
                              className="max-w-full max-h-full object-contain"
                              onError={(e) => { e.currentTarget.src = '/placeholders/product.svg' }}
                            />
                          ) : (
                            <FiShoppingBag className="w-6 h-6 text-gray-400" />
                          )}
                        </div>

                        
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          <div>
                            <p className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2 leading-snug pr-6">
                              {item.name}
                            </p>
                            {item.color && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {item.color}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between gap-2 mt-2">
                            <span className="font-bold text-base text-brand-600">
                              {format(item.price * item.quantity)}
                            </span>

                            <div className="flex items-center gap-1.5">
                              <label
                                htmlFor={'qty-' + item.id}
                                className="sr-only"
                              >
                                {t('product.quantity')}
                              </label>
                              <select
                                id={'qty-' + item.id}
                                value={item.quantity}
                                onChange={(e) => updateQty(item.id, Number(e.target.value))}
                                className="h-8 pl-2.5 pr-7 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold text-gray-900 dark:text-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                              >
                                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                                  <option key={n} value={n}>{n}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="absolute top-2.5 right-2.5 p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all"
                          aria-label={t('cart.remove')}
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                
                <div className="border-t border-gray-100 dark:border-gray-800 px-5 py-4 space-y-4 bg-gray-50/50 dark:bg-gray-950/50">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>Subtotal</span>
                      <span>{format(total)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>Shipping</span>
                      <span className={qualifiesForFreeShipping ? 'text-green-600 dark:text-green-400 font-medium' : ''}>
                        {qualifiesForFreeShipping ? 'Free' : 'Calculated at checkout'}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between items-baseline">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Total</span>
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        {format(total)}
                      </span>
                    </div>
                  </div>

                  <Link
                    to="/checkout"
                    onClick={() => setIsOpen(false)}
                    className="group flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white text-sm font-bold shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30 active:scale-[0.98] transition-all"
                  >
                    {t('cart.checkout')}
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors py-1"
                  >
                    Continue shopping
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}