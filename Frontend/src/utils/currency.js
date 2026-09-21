
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

function getCurrency() {
  if (typeof window === 'undefined') return 'TZS'
  return localStorage.getItem('currency') || 'TZS'
}

export function formatTZS(amountTZS, decimals = 0) {
  const currency = getCurrency()
  if (amountTZS === null || amountTZS === undefined) return `${SYMBOLS[currency]} 0`
  const num = Number(amountTZS)
  if (isNaN(num)) return `${SYMBOLS[currency]} 0`

  const rate = RATES[currency] || 1
  const converted = num * rate
  const symbol = SYMBOLS[currency] || 'TZS'
  const d = currency === 'TZS' ? decimals : 2
  const fixed = converted.toFixed(d)
  const parts = fixed.split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const formatted = parts.join('.')
  return currency === 'TZS' ? `${symbol} ${formatted}` : `${symbol}${formatted}`
}

export const TZS_SYMBOL = 'TZS'
