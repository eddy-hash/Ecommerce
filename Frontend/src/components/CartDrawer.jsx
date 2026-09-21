import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiX, FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import { useCart } from '../context/CartContext'
import { useCurrency } from '../context/CurrencyContext'
import { resolveProductImage } from '../utils/images'

export default function CartDrawer() {
  const { t } = useTranslation()
  const { items, isOpen, setIsOpen, removeItem, updateQty, total } = useCart()
  const { format } = useCurrency()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
          <motion.aside
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className="fixed top-0 right-0 h-full w-full sm:w-96 sm:max-w-md bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between safe-top">
              <h2 className="font-bold text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                <FiShoppingBag /> {t('cart.yourCart')}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95 transition"
                aria-label={t('common.close')}
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 gap-4 p-6">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <FiShoppingBag className="w-8 h-8 text-gray-400" />
                </div>
                <p>{t('cart.empty')}</p>
                <Link to="/categories" onClick={() => setIsOpen(false)} className="btn-primary">
                  {t('cart.browseProducts')}
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 border-b border-gray-100 dark:border-gray-700 pb-4"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 flex items-center justify-center">
                        {item.imageUrl ? (
                          <img
                            src={resolveProductImage(item)}
                            alt={item.name}
                            loading="lazy"
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => { e.currentTarget.src = '/placeholders/product.svg' }}
                          />
                        ) : (
                          <FiShoppingBag className="w-5 h-5 text-gray-400" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate text-gray-900 dark:text-white">{item.name}</p>
                        <p className="text-brand-600 font-semibold mt-0.5 text-sm">{format(item.price)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => updateQty(item.id, item.quantity - 1)}
                            className="w-8 h-8 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition">
                            <FiMinus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-gray-900 dark:text-white">{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, item.quantity + 1)}
                            className="w-8 h-8 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition">
                            <FiPlus className="w-3 h-3" />
                          </button>
                          <button onClick={() => removeItem(item.id)}
                            className="ml-auto p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg active:scale-95 transition"
                            aria-label={t('cart.remove')}>
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3 safe-bottom">
                  <div className="flex justify-between font-semibold text-lg text-gray-900 dark:text-white">
                    <span>{t('cart.total')}</span>
                    <span className="text-brand-600">{format(total)}</span>
                  </div>
                  <Link to="/checkout" onClick={() => setIsOpen(false)}
                    className="block text-center btn-primary py-3.5 text-base font-semibold">
                    {t('cart.checkout')}
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}