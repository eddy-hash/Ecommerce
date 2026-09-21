import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { productApi } from '../api/productApi'
import { traderApi } from '../api/traderApi'
import ProductCard from '../components/ProductCard'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'

export default function TraderProducts() {
  const { id } = useParams()
  const [products, setProducts] = useState([])
  const [trader, setTrader] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)

    Promise.all([
      productApi.list({ traderId: id }),
      traderApi.list(),
    ])
      .then(([p, tr]) => {
        setProducts(Array.isArray(p) ? p : [])
        const match = Array.isArray(tr) ? tr.find((t) => t.id === Number(id)) : null
        setTrader(match || null)
      })
      .catch((err) => {
        console.error('TraderProducts load failed:', err?.response?.status, err?.response?.data)
        toast.error(`Failed to load products (${err?.response?.status ?? 'network'})`)
        setError(true)
        setProducts([])
        setTrader(null)
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Spinner size="lg" />

  const heading = trader?.name
    ? `${trader.name}'s Products`
    : 'Trader Products'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to="/traders"
        className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-600 mb-6"
      >
        <FiArrowLeft /> Back to traders
      </Link>

      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
        {heading}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mt-2">
        {products.length} {products.length === 1 ? 'product' : 'products'}
      </p>

      {error ? (
        <EmptyState
          title="Couldn't load products"
          message="There was a problem reaching the server. Try again in a moment."
        />
      ) : products.length === 0 ? (
        <EmptyState
          title="No products yet"
          message="This trader hasn't listed any products yet."
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mt-10">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}