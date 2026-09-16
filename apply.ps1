# ShopHub — README + motion components
$root = "C:\Ecommerce"
$fe = "$root\Frontend\src"
$utf8 = New-Object System.Text.UTF8Encoding $false

function W($path, $content) {
    $dir = Split-Path $path -Parent
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
    $content = $content -replace "`r`n", "`n"
    [System.IO.File]::WriteAllText($path, $content, $utf8)
    Write-Host "  wrote $path" -ForegroundColor DarkGray
}

Write-Host "=== Writing README + motion components ===" -ForegroundColor Cyan

# --- README.md ---
$readme = @"
# ShopHub

E-Commerce & Order Management System — a full-stack marketplace connecting customers with trusted traders.

## Tech Stack
- **Backend:** Spring Boot 3.2.5, Java 17, Spring Security, JPA, MySQL 8.0, JWT
- **Frontend:** React 19, Vite, Tailwind CSS, Framer Motion, React Router, Axios

## Features
- JWT authentication with role-based access (Customer / Trader)
- Product management with image upload
- Multi-step checkout wizard
- Order lifecycle tracking (Pending to Delivered)
- Trader dashboard with revenue stats
- Dark / light mode
- Animated success modals

## Getting Started
\`\`\`bash
git clone git@github.com:eddy-hash/Ecommerce.git
cd Ecommerce

# Backend
cd Backend
mvn spring-boot:run

# Frontend (new terminal)
cd Frontend
npm install
npm run dev
\`\`\`

Open http://localhost:3000

## License
MIT
"@
W "$root\README.md" $readme

# --- utils/motion.js ---
W "$fe\utils\motion.js" @"
export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
}

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
}

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
}

export const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
}
"@

# --- PageTransition ---
W "$fe\components\PageTransition.jsx" @"
import { motion } from 'framer-motion'
import { pageTransition } from '../utils/motion'

export default function PageTransition({ children }) {
  return <motion.div {...pageTransition}>{children}</motion.div>
}
"@

# --- CountUp ---
W "$fe\components\CountUp.jsx" @"
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
"@

# --- Skeleton ---
W "$fe\components\Skeleton.jsx" @"
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
"@

Write-Host "Done. Now run: cd C:\Ecommerce; git add .; git commit -m 'Add README and motion components'; git push" -ForegroundColor Green