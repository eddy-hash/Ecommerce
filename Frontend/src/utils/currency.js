// Tanzanian Shilling formatter
// Usage: formatTZS(149.99) → "TZS 149.99"
//        formatTZS(149.99, 0) → "TZS 150"

export const TZS_SYMBOL = 'TZS'

export function formatTZS(amount, decimals = 0) {
  if (amount === null || amount === undefined) return `${TZS_SYMBOL} 0`
  const num = Number(amount)
  if (isNaN(num)) return `${TZS_SYMBOL} 0`
  const fixed = num.toFixed(decimals)
  // Add thousand separators
  const parts = fixed.split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return `${TZS_SYMBOL} ${parts.join('.')}`
}