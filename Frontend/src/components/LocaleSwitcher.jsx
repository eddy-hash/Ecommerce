import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FiGlobe, FiChevronDown, FiCheck } from 'react-icons/fi'

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'sw', label: 'Kiswahili', flag: '🇹🇿' },
]

export const CURRENCIES = [
  { code: 'TZS', label: 'TZS', symbol: 'TZS' },
  { code: 'USD', label: 'USD', symbol: '$' },
  { code: 'EUR', label: 'EUR', symbol: '€' },
  { code: 'GBP', label: 'GBP', symbol: '£' },
  { code: 'KES', label: 'KES', symbol: 'KSh' },
]

export default function LocaleSwitcher() {
  const { i18n } = useTranslation()
  const [currency, setCurrency] = useState(
    () => localStorage.getItem('currency') || 'TZS'
  )
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const changeLanguage = (code) => {
    i18n.changeLanguage(code)
    localStorage.setItem('language', code)
  }

  const changeCurrency = (code) => {
    setCurrency(code)
    localStorage.setItem('currency', code)
    window.dispatchEvent(new CustomEvent('currency-change', { detail: code }))
  }

  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0]

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition"
        aria-label="Change language and currency"
      >
        <FiGlobe className="w-4 h-4" />
        <span className="hidden sm:inline">{currentLang.code.toUpperCase()}</span>
        <span className="text-xs font-bold">{currency}</span>
        <FiChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden">
          {/* Languages */}
          <div className="p-2 border-b border-gray-100 dark:border-gray-700">
            <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 px-2 py-1">
              {i18n.t('common.language')}
            </p>
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => changeLanguage(l.code)}
                className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 transition"
              >
                <span>{l.flag}</span>
                <span className="flex-1 text-left">{l.label}</span>
                {i18n.language === l.code && <FiCheck className="w-4 h-4 text-brand-600" />}
              </button>
            ))}
          </div>

          {/* Currencies */}
          <div className="p-2">
            <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 px-2 py-1">
              {i18n.t('common.currency')}
            </p>
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                onClick={() => changeCurrency(c.code)}
                className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 transition"
              >
                <span className="font-mono w-10 text-left">{c.symbol}</span>
                <span className="flex-1 text-left">{c.label}</span>
                {currency === c.code && <FiCheck className="w-4 h-4 text-brand-600" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}