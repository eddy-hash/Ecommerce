
const PLACEHOLDER_MAP = {
  'Electronics':     '/placeholders/electronics.svg',
  'Clothing':        '/placeholders/clothing.svg',
  'Books':           '/placeholders/books.svg',
  'Home & Kitchen':  '/placeholders/home.svg',
  'Sports':          '/placeholders/sports.svg',
}

const DEFAULT_PLACEHOLDER = '/placeholders/product.svg'

export function resolveProductImage(product) {
  if (!product) return DEFAULT_PLACEHOLDER
  if (product.imageUrl && product.imageUrl.trim() !== '') {
    return `/api/files/${product.imageUrl}`
  }
  return PLACEHOLDER_MAP[product.categoryName] || DEFAULT_PLACEHOLDER
}
