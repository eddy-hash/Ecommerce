import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

export default function CountUp({ end = 0, duration = 1.5, decimals = 0, prefix = '', suffix = '' }) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = null
    const target = Number(end) || 0
    const step = (ts) => {
      if (start === null) start = ts
      const p = Math.min((ts - start) / (duration * 1000), 1)
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p)
      setValue(target * eased)
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, end, duration])

  const formatted = value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return <span ref={ref}>{prefix}{formatted}{suffix}</span>
}