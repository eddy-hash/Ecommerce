import { createContext, useContext, useEffect, useState } from 'react'

const CurrencyContext = createContext(null)

const RATES = {
  TZS: 1,
  USD: 0.00038,
  EUR: 0.00035,
  GBP: 0.00030,
  KES: 0.049,
}

const SYMBOLS = {
  TZS: 'TZS',
  USD: '$',
  EUR: '€',
  GBP: '£',
  KES: 'KSh',
}

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('currency') || 'TZS'
    }
    return 'TZS'
  })

  const setCurrency = (code) => {
    if (!RATES[code]) return
    setCurrencyState(code)
    if (typeof window !== 'undefined') {
      localStorage.setItem('currency', code)
    }
  }

  const format = (amountTZS, decimals) => {
    if (amountTZS === null || amountTZS === undefined) {
      return `${SYMBOLS[currency]} 0`
    }
    const num = Number(amountTZS)
    if (isNaN(num)) return `${SYMBOLS[currency]} 0`

    const rate = RATES[currency] || 1
    const converted = num * rate
    const symbol = SYMBOLS[currency] || 'TZS'

    const d = decimals !== undefined ? decimals : (currency === 'TZS' ? 0 : 2)
    const fixed = converted.toFixed(d)
    const parts = fixed.split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    const formatted = parts.join('.')

    return currency === 'TZS' ? `${symbol} ${formatted}` : `${symbol}${formatted}`
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format, rates: RATES, symbols: SYMBOLS }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) {
    // Fallback for components used outside the provider (safety)
    return {
      currency: 'TZS',
      setCurrency: () => {},
      format: (n) => `TZS ${Number(n || 0).toLocaleString()}`,
    }
  }
  return ctx
}