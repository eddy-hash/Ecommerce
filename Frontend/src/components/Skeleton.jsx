import { motion } from 'framer-motion'

export default function Skeleton({ className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      className={'bg-gray-200 dark:bg-gray-700 rounded-lg ' + className}
    />
  )
}