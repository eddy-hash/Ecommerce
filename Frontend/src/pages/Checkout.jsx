import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiCreditCard, FiMapPin, FiCheck, FiUser, FiHome } from 'react-icons/fi'
import toast from 'react-hot-toast'
import Wizard from '../components/Wizard'
import FloatingInput from '../components/FloatingInput'
import { orderApi } from '../api/orderApi'
import { useCart } from '../context/CartContext'
import { formatTZS } from '../utils/currency'

function ShippingStep({ data, update }) {
  return (
    <div className="space-y-4">
      <FloatingInput id="fullName" label="Full name" value={data.fullName || ''}
        onChange={(e) => update({ fullName: e.target.value })} icon={FiUser} required autoComplete="name" />
      <FloatingInput id="address" label="Street address" value={data.address || ''}
        onChange={(e) => update({ address: e.target.value })} icon={FiHome} required autoComplete="street-address" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FloatingInput id="city" label="City" value={data.city || ''}
          onChange={(e) => update({ city: e.target.value })} icon={FiMapPin} required />
        <FloatingInput id="postal" label="Postal code" value={data.postal || ''}
          onChange={(e) => update({ postal: e.target.value })} required />
      </div>
    </div>
  )
}

function PaymentStep({ data, update }) {
  return (
    <div className="space-y-4">
      <FloatingInput id="card" label="Card number" value={data.card || ''}
        onChange={(e) => update({ card: e.target.value })} icon={FiCreditCard} required />
      <div className="grid grid-cols-2 gap-4">
        <FloatingInput id="expiry" label="Expiry (MM/YY)" value={data.expiry || ''}
          onChange={(e) => update({ expiry: e.target.value })} required />
        <FloatingInput id="cvc" label="CVC" value={data.cvc || ''}
          onChange={(e) => update({ cvc: e.target.value })} required />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Demo mode — no real charges.</p>
    </div>
  )
}

function ReviewStep({ data }) {
  const { items, total } = useCart()
  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Items</h4>
        <div className="space-y-2">
          {items.map((i) => (
            <div key={i.id} className="flex justify-between text-sm">
              <span className="text-gray-700 dark:text-gray-300">{i.name} × {i.quantity}</span>
              <span className="font-medium text-gray-900 dark:text-white">{formatTZS(i.price * i.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 mt-3 pt-3 flex justify-between font-bold text-lg">
          <span className="text-gray-900 dark:text-white">Total</span>
          <span className="text-brand-600">{formatTZS(total)}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 text-sm">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Shipping</h4>
          <p className="text-gray-600 dark:text-gray-400">{data.fullName}<br />{data.address}<br />{data.city} {data.postal}</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Payment</h4>
          <p className="text-gray-600 dark:text-gray-400">Card ending in {data.card?.slice(-4) || '****'}</p>
        </div>
      </div>
    </div>
  )
}

function ConfirmationStep() {
  return (
    <div className="text-center py-8">
      <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <FiCheck className="w-10 h-10 text-green-600 dark:text-green-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Order placed!</h3>
      <p className="text-gray-500 dark:text-gray-400 mt-2">Redirecting to your orders...</p>
    </div>
  )
}

export default function Checkout() {
  const navigate = useNavigate()
  const { items, total, clearCart } = useCart()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (items.length === 0 && !success) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your cart is empty</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Add some products before checking out.</p>
      </div>
    )
  }

  const handleComplete = async (data) => {
    if (submitting) return
    setSubmitting(true)
    setError('')
    const loadingToast = toast.loading('Placing your order...')
    try {
      const payload = items.map((i) => ({ productId: i.id, quantity: i.quantity }))
      const order = await orderApi.create(payload)
      await orderApi.pay(order.id)

      clearCart()
      toast.success('Order placed successfully!', { id: loadingToast, duration: 3000 })
      setSuccess(true)

      setTimeout(() => navigate('/orders'), 1500)
    } catch (err) {
      const msg = err.response?.data?.message || 'Checkout failed'
      setError(msg)
      toast.error(msg, { id: loadingToast })
    } finally {
      setSubmitting(false)
    }
  }

  const steps = success
    ? [{ label: 'Done', title: 'Success', subtitle: 'Order complete', component: ConfirmationStep }]
    : [
        { label: 'Shipping', title: 'Shipping info', subtitle: 'Where should we send your order?',
          component: ShippingStep, validate: (d) => d.fullName && d.address && d.city && d.postal },
        { label: 'Payment', title: 'Payment', subtitle: 'Enter your card details',
          component: PaymentStep, validate: (d) => d.card && d.expiry && d.cvc },
        { label: 'Review', title: 'Review order', subtitle: 'One last check before payment',
          component: ReviewStep },
      ]

  return (
    <div className="min-h-[80vh] py-12 px-4">
      <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">Checkout</h1>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-10">
        Total: <span className="font-bold text-brand-600">{formatTZS(total)}</span>
      </p>
      {error && <div className="max-w-3xl mx-auto mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg text-sm">{error}</div>}
      <Wizard steps={steps} onComplete={handleComplete} submitLabel={submitting ? 'Placing...' : 'Place Order'} />
    </div>
  )
}