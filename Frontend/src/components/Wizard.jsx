import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiArrowLeft, FiArrowRight, FiCheck } from 'react-icons/fi'
import Stepper from './Stepper'

export default function Wizard({ steps, onComplete, submitLabel = 'Finish' }) {
  const [current, setCurrent] = useState(0)
  const [data, setData] = useState({})

  const safeCurrent = Math.min(current, steps.length - 1)
  const isLast = safeCurrent === steps.length - 1
  const updateData = (patch) => setData((d) => ({ ...d, ...patch }))
  const next = () => (isLast ? onComplete(data) : setCurrent((c) => Math.min(c + 1, steps.length - 1)))
  const back = () => setCurrent((c) => Math.max(c - 1, 0))

  const CurrentStep = steps[safeCurrent].component
  const canNext = !steps[safeCurrent].validate || steps[safeCurrent].validate(data)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8"><Stepper steps={steps} currentStep={safeCurrent} /></div>
      <div className="card dark:bg-gray-800 dark:border-gray-700 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {steps[safeCurrent].title}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {steps[safeCurrent].subtitle}
        </p>
        <AnimatePresence mode="wait">
          <motion.div
            key={safeCurrent}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <CurrentStep data={data} update={updateData} />
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <button
            onClick={back}
            disabled={safeCurrent === 0}
            className="btn-secondary flex items-center gap-2 disabled:opacity-40"
          >
            <FiArrowLeft /> Back
          </button>
          <button
            onClick={next}
            disabled={!canNext}
            className="btn-primary flex items-center gap-2"
          >
            {isLast ? <><FiCheck /> {submitLabel}</> : <>Next <FiArrowRight /></>}
          </button>
        </div>
      </div>
    </div>
  )
}