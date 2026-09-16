import { motion } from 'framer-motion'
import { FiCheck } from 'react-icons/fi'

export default function Stepper({ steps, currentStep }) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, i) => {
        const isDone   = i < currentStep
        const isActive = i === currentStep
        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isDone ? '#2563eb' : isActive ? '#2563eb' : '#e5e7eb',
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ duration: 0.25 }}
                className="w-10 h-10 rounded-full flex items-center justify-center font-semibold"
              >
                {isDone
                  ? <FiCheck className="w-5 h-5 text-white" />
                  : <span className={isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}>{i + 1}</span>}
              </motion.div>
              <span className={`mt-2 text-xs font-medium ${isActive ? 'text-brand-600' : 'text-gray-500 dark:text-gray-400'}`}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 bg-gray-200 relative -mt-6">
                <motion.div
                  initial={false}
                  animate={{ width: isDone ? '100%' : '0%' }}
                  transition={{ duration: 0.4 }}
                  className="h-full bg-brand-600"
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}