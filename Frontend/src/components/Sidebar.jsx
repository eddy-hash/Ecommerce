import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FiX, FiHome, FiGrid, FiUsers, FiShoppingBag, FiShoppingCart,
  FiUser, FiLogIn, FiLogOut, FiPackage, FiBarChart2, FiPlus,
  FiSun, FiMoon
} from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import Avatar from './Avatar'
import VerifiedBadge from './VerifiedBadge'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useTheme } from '../context/ThemeContext'

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const { theme, toggleTheme } = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    onClose()
    navigate('/')
  }

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const NavItem = ({ to, icon: Icon, label, badge, onClick }) => {
    const active = isActive(to)
    return (
      <Link
        to={to}
        onClick={() => { onClose(); onClick?.() }}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
          active
            ? 'bg-brand-600 text-white shadow-md'
            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="font-medium">{label}</span>
        {badge > 0 && (
          <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${
            active ? 'bg-white text-brand-600' : 'bg-brand-600 text-white'
          }`}>{badge}</span>
        )}
      </Link>
    )
  }

  const SectionTitle = ({ children }) => (
    <p className="px-4 pt-4 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
      {children}
    </p>
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.aside
            key="panel"
            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <Link to="/" onClick={onClose} className="flex items-center gap-2">
                <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center">
                  <FiPackage className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">ShopHub</span>
              </Link>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                aria-label="Close"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {user ? (
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Avatar user={user} size="lg" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                      {user.verified && <VerifiedBadge size="sm" />}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>
                <div className={`mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                  user.role === 'TRADER'
                    ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                    : 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                }`}>
                  {user.role === 'TRADER' ? <FiShoppingBag className="w-3 h-3" /> : <FiUser className="w-3 h-3" />}
                  {user.role === 'TRADER' ? 'Trader' : 'Customer'}
                </div>
              </div>
            ) : (
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{t('sidebar.welcome')}</p>
                <div className="flex gap-2">
                  <Link to="/login" onClick={onClose} className="flex-1 btn-secondary text-center text-sm">{t('nav.login')}</Link>
                  <Link to="/register" onClick={onClose} className="flex-1 btn-primary text-center text-sm">{t('nav.register')}</Link>
                </div>
              </div>
            )}

            <nav className="flex-1 overflow-y-auto p-3">
              <SectionTitle>{t('nav.shop')}</SectionTitle>
              <div className="space-y-1">
                <NavItem to="/" icon={FiHome} label={t('nav.home')} />
                <NavItem to="/categories" icon={FiGrid} label={t('nav.categories')} />
                <NavItem to="/traders" icon={FiUsers} label={t('nav.traders')} />
              </div>

              {user?.role === 'CUSTOMER' && (
                <>
                  <SectionTitle>{t('nav.account')}</SectionTitle>
                  <div className="space-y-1">
                    <NavItem to="/orders" icon={FiShoppingBag} label={t('nav.myOrders')} />
                    <NavItem to="/profile" icon={FiUser} label={t('nav.profile')} />
                  </div>
                </>
              )}

              {user?.role === 'TRADER' && (
                <>
                  <SectionTitle>{t('nav.traderHub')}</SectionTitle>
                  <div className="space-y-1">
                    <NavItem to="/trader/dashboard" icon={FiBarChart2} label={t('nav.dashboard')} />
                    <NavItem to="/trader/orders" icon={FiShoppingBag} label={t('nav.incomingOrders')} />
                    <NavItem to="/trader/products/new" icon={FiPlus} label={t('nav.addProduct')} />
                    <NavItem to="/profile" icon={FiUser} label={t('nav.profile')} />
                  </div>
                </>
              )}

              <SectionTitle>{t('nav.quickAccess')}</SectionTitle>
              <div className="space-y-1">
                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <FiShoppingCart className="w-5 h-5" />
                  <span className="font-medium">{t('nav.cart')}</span>
                  {cartCount > 0 && (
                    <span className="ml-auto text-xs font-bold bg-brand-600 text-white px-2 py-0.5 rounded-full">{cartCount}</span>
                  )}
                </Link>
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                  <span className="font-medium">{theme === 'dark' ? t('nav.lightMode') : t('nav.darkMode')}</span>
                </button>
              </div>
            </nav>

            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                >
                  <FiLogOut className="w-5 h-5" />
                  <span className="font-medium">{t('nav.logout')}</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={onClose}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition"
                >
                  <FiLogIn className="w-5 h-5" />
                  <span className="font-medium">{t('nav.login')}</span>
                </Link>
              )}
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-3">
                © {new Date().getFullYear()} ShopHub
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}