import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiX, FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { formatTZS } from '../utils/currency'

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQty, total } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
          <motion.aside
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed top-0 right-0 h-full w-96 max-w-full bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col"
          >
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <FiShoppingBag /> Your Cart
              </h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-white">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 gap-4 p-6">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <FiShoppingBag className="w-8 h-8 text-gray-400" />
                </div>
                <p>Your cart is empty</p>
                <Link to="/categories" onClick={() => setIsOpen(false)} className="btn-primary">
                  Browse products
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 border-b pb-4"
                    >
                      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <p className="text-brand-600 font-semibold mt-0.5">{formatTZS(item.price)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => updateQty(item.id, item.quantity - 1)}
                            className="w-7 h-7 border rounded flex items-center justify-center hover:bg-gray-50 dark:bg-gray-900">
                            <FiMinus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, item.quantity + 1)}
                            className="w-7 h-7 border rounded flex items-center justify-center hover:bg-gray-50 dark:bg-gray-900">
                            <FiPlus className="w-3 h-3" />
                          </button>
                          <button onClick={() => removeItem(item.id)}
                            className="ml-auto text-red-500 hover:text-red-700">
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="p-4 border-t space-y-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-brand-600">{formatTZS(total)}</span>
                  </div>
                  <Link to="/checkout" onClick={() => setIsOpen(false)}
                    className="block text-center btn-primary py-3">
                    Checkout
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