import { motion } from 'framer-motion'
import { pageTransition } from '../utils/motion'

export default function PageTransition({ children }) {
  return <motion.div {...pageTransition}>{children}</motion.div>
}