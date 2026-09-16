import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiPackage, FiMenu, FiSun, FiMoon } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Avatar from './Avatar'

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: hamburger + logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Open menu"
          >
            <FiMenu className="w-6 h-6" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <FiPackage className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">ShopHub</span>
          </Link>
        </div>

        {/* Center: public links (desktop only) */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Link to="/categories" className="hover:text-brand-600 transition">Categories</Link>
          <Link to="/traders" className="hover:text-brand-600 transition">Traders</Link>
        </div>

        {/* Right: theme toggle + avatar/login */}
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
          </motion.button>

          {user ? (
            <Link to="/profile" aria-label="Profile">
              <Avatar user={user} size="sm" />
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-brand-600">Login</Link>
              <Link to="/register" className="btn-primary text-sm">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}