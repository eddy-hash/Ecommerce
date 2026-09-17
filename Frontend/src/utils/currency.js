// Base currency is TZS. Rates are manually set — update weekly or fetch from an API.

const RATES = {
  TZS: 1,           // base
  USD: 0.00038,     // 1 TZS ≈ 0.00038 USD  (≈ 2,600 TZS per USD)
  EUR: 0.00035,     // 1 TZS ≈ 0.00035 EUR  (≈ 2,850 TZS per EUR)
  GBP: 0.00030,     // 1 TZS ≈ 0.00030 GBP  (≈ 3,350 TZS per GBP)
  KES: 0.049,       // 1 TZS ≈ 0.049 KES    (≈ 20 TZS per KES)
}

const SYMBOLS = {
  TZS: 'TZS',
  USD: '$',
  EUR: '€',
  GBP: '£',
  KES: 'KSh',
}

let currentCurrency = 'TZS'
if (typeof window !== 'undefined') {
  currentCurrency = localStorage.getItem('currency') || 'TZS'
  window.addEventListener('currency-change', (e) => {
    currentCurrency = e.detail
  })
}

export function setCurrency(code) {
  currentCurrency = code
}

export function getCurrency() {
  return currentCurrency
}

export function formatTZS(amountTZS, decimals = 0) {
  if (amountTZS === null || amountTZS === undefined) return `${SYMBOLS[currentCurrency]} 0`
  const num = Number(amountTZS)
  if (isNaN(num)) return `${SYMBOLS[currentCurrency]} 0`

  const rate = RATES[currentCurrency] || 1
  const converted = num * rate
  const symbol = SYMBOLS[currentCurrency] || 'TZS'

  // TZS has no decimals; other currencies show 2
  const d = currentCurrency === 'TZS' ? 0 : 2
  const fixed = converted.toFixed(d)

  const parts = fixed.split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const formatted = parts.join('.')

  return currentCurrency === 'TZS' ? `${symbol} ${formatted}` : `${symbol}${formatted}`
}

export const TZS_SYMBOL = 'TZS'