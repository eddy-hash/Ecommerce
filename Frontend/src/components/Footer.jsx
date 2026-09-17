import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FiGithub, FiTwitter, FiMail } from 'react-icons/fi'

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-brand-600">ShopHub</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-md">
              {t('footer.tagline')}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{t('footer.shop')}</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link to="/categories" className="hover:text-brand-600">{t('footer.categories')}</Link></li>
              <li><Link to="/traders" className="hover:text-brand-600">{t('footer.traders')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{t('footer.connect')}</h4>
            <div className="flex gap-3 text-gray-600 dark:text-gray-400">
              <a href="#" className="hover:text-brand-600"><FiGithub /></a>
              <a href="#" className="hover:text-brand-600"><FiTwitter /></a>
              <a href="#" className="hover:text-brand-600"><FiMail /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} ShopHub. {t('footer.copyright')}
        </div>
      </div>
    </footer>
  )
}