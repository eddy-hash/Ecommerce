import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiPackage, FiMenu, FiSun, FiMoon } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import LocaleSwitcher from './LocaleSwitcher'
import Avatar from './Avatar'
import VerifiedBadge from './VerifiedBadge'

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { t } = useTranslation()

  return (
    <nav className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 safe-top">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
        
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={onMenuClick}
            className="p-2 -ml-1 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition active:scale-95"
            aria-label="Open menu"
          >
            <FiMenu className="w-6 h-6" />
          </button>
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <FiPackage className="text-white w-4 h-4" />
            </div>
            <span className="text-base sm:text-xl font-bold text-gray-900 dark:text-white truncate">ShopHub</span>
          </Link>
        </div>

        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Link to="/categories" className="hover:text-brand-600 transition">{t('nav.categories')}</Link>
          <Link to="/traders" className="hover:text-brand-600 transition">{t('nav.traders')}</Link>
        </div>

        
        <div className="flex items-center gap-1 sm:gap-2">
          <LocaleSwitcher />

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
          </motion.button>

          {user ? (
            <>
              {user.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className="hidden sm:inline-block text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 px-2"
                >
                  Admin
                </Link>
              )}
              <Link
                to="/profile"
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition"
                aria-label="Profile"
              >
                <Avatar user={user} size="sm" />
                <span className="hidden sm:flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user.name}
                  {user.verified && <VerifiedBadge size="sm" />}
                </span>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden sm:inline-block text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-brand-600 px-2">
                {t('nav.login')}
              </Link>
              <Link to="/register" className="btn-primary text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2">
                {t('nav.register')}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}