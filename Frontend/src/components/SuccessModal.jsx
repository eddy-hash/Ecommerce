import { AnimatePresence, motion } from 'framer-motion'
import { FiX } from 'react-icons/fi'
import AnimatedTick from './AnimatedTick'

export default function SuccessModal({
  isOpen,
  onClose,
  title = 'Success!',
  message = '',
  primaryLabel = 'Continue',
  onPrimary,
  secondaryLabel = null,
  onSecondary,
  showClose = true,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={showClose ? onClose : undefined}
          />

          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 text-center pointer-events-auto overflow-hidden"
            >
              {showClose && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition z-10"
                  aria-label="Close"
                >
                  <FiX className="w-5 h-5" />
                </button>
              )}

              
              <div className="relative mb-6">
                <AnimatedTick size={112} />

                
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(10)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 0, x: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 1, 1, 0],
                        y: -30 - i * 6,
                        x: (i - 5) * 22 + (Math.random() - 0.5) * 30,
                        scale: [0, 1, 1, 0.6],
                        rotate: (Math.random() - 0.5) * 180,
                      }}
                      transition={{ duration: 1.6, delay: 0.5 + i * 0.04 }}
                      className={`absolute top-1/2 left-1/2 w-2.5 h-2.5 rounded-sm ${
                        i % 4 === 0 ? 'bg-green-400' :
                        i % 4 === 1 ? 'bg-brand-500' :
                        i % 4 === 2 ? 'bg-yellow-400' :
                                       'bg-pink-400'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
              >
                {title}
              </motion.h2>

              {message && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  className="text-gray-600 dark:text-gray-400 mb-6 whitespace-pre-line"
                >
                  {message}
                </motion.p>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="flex flex-col gap-2 mt-6"
              >
                {onPrimary && (
                  <button
                    onClick={onPrimary}
                    className="w-full btn-primary py-3 text-base font-semibold"
                  >
                    {primaryLabel}
                  </button>
                )}
                {onSecondary && secondaryLabel && (
                  <button
                    onClick={onSecondary}
                    className="w-full btn-secondary py-3 text-base"
                  >
                    {secondaryLabel}
                  </button>
                )}
              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}