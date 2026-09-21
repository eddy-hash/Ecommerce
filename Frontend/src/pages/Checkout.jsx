import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { FiCreditCard, FiMapPin, FiCheck, FiUser, FiHome, FiShoppingBag } from 'react-icons/fi'
import toast from 'react-hot-toast'
import Wizard from '../components/Wizard'
import FloatingInput from '../components/FloatingInput'
import { orderApi } from '../api/orderApi'
import { useCart } from '../context/CartContext'
import { useCurrency } from '../context/CurrencyContext'
import { resolveProductImage } from '../utils/images'

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
  const formatCard = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 19)
    if (/^3[47]/.test(d)) {
      return d.replace(/^(\d{4})(\d{0,6})(\d{0,5}).*$/, (_, a, b, c) =>
        [a, b, c].filter(Boolean).join(' ')
      )
    }
    return d.replace(/(.{4})/g, '$1 ').trim()
  }

  const formatExpiry = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 4)
    return d.length <= 2 ? d : d.slice(0, 2) + '/' + d.slice(2)
  }

  const formatCvc = (v) => v.replace(/\D/g, '').slice(0, 4)

  const digits = (data.card || '').replace(/\D/g, '')

  const brand =
    /^4/.test(digits)          ? 'Visa' :
    /^5[1-5]/.test(digits)     ? 'Mastercard' :
    /^3[47]/.test(digits)      ? 'Amex' :
    /^6(?:011|5)/.test(digits) ? 'Discover' :
    null

  const isAmex = /^3[47]/.test(digits)
  const requiredCardLen = isAmex ? 15 : 16

  const luhn = (n) => {
    if (!n) return false
    let sum = 0, alt = false
    for (let i = n.length - 1; i >= 0; i--) {
      let x = parseInt(n[i], 10)
      if (alt) { x *= 2; if (x > 9) x -= 9 }
      sum += x
      alt = !alt
    }
    return sum % 10 === 0
  }

  const cardValid =
    digits.length === requiredCardLen && luhn(digits)

  const expiryValid = (() => {
    const e = data.expiry || ''
    if (!/^\d{2}\/\d{2}$/.test(e)) return false
    const [mm, yy] = e.split('/').map(Number)
    if (mm < 1 || mm > 12) return false
    const now = new Date()
    const expYear  = 2000 + yy
    const expMonth = mm
    const expEnd = new Date(expYear, expMonth, 0, 23, 59, 59)
    return expEnd >= now
  })()

  const requiredCvcLen = isAmex ? 4 : 3
  const cvcValid = (data.cvc || '').length === requiredCvcLen

  const cardError =
    data.card && !cardValid
      ? (digits.length < requiredCardLen
          ? `Card number must be ${requiredCardLen} digits`
          : 'Invalid card number')
      : null

  const expiryError =
    data.expiry && !expiryValid
      ? (data.expiry.length < 5 ? 'Use MM/YY format' : 'Card is expired or invalid')
      : null

  const cvcError =
    data.cvc && !cvcValid
      ? `CVC must be ${requiredCvcLen} digits`
      : null

  return (
    <div className="space-y-4">
      
      <div>
        <FloatingInput
          id="card"
          label="Card number"
          value={data.card || ''}
          onChange={(e) => update({ card: formatCard(e.target.value) })}
          icon={FiCreditCard}
          required
          autoComplete="cc-number"
          inputMode="numeric"
          maxLength={19}
        />
        {(brand || cardError) && (
          <div className="flex items-center justify-between mt-1.5">
            <p className="text-[11px] text-red-500">{cardError || ''}</p>
            {brand && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                {brand}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <FloatingInput
            id="expiry"
            label="Expiry (MM/YY)"
            value={data.expiry || ''}
            onChange={(e) => update({ expiry: formatExpiry(e.target.value) })}
            required
            autoComplete="cc-exp"
            inputMode="numeric"
            maxLength={5}
          />
          {expiryError && (
            <p className="text-[11px] text-red-500 mt-1.5">{expiryError}</p>
          )}
        </div>

        <div>
          <FloatingInput
            id="cvc"
            label="CVC"
            value={data.cvc || ''}
            onChange={(e) => update({ cvc: formatCvc(e.target.value) })}
            required
            autoComplete="cc-csc"
            inputMode="numeric"
            maxLength={4}
          />
          {cvcError && (
            <p className="text-[11px] text-red-500 mt-1.5">{cvcError}</p>
          )}
        </div>
      </div>
    </div>
  )
}
function ReviewStep({ data }) {
  const { items, total } = useCart()
  const { format } = useCurrency()

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Items</h4>

        <div className="space-y-3">
          {items.map((i) => (
            <div key={i.id} className="flex items-center gap-3">
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                {i.imageUrl ? (
                  <img
                    src={resolveProductImage(i)}
                    alt={i.name}
                    loading="lazy"
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => { e.currentTarget.src = '/placeholders/product.svg' }}
                  />
                ) : (
                  <FiShoppingBag className="w-4 h-4 text-gray-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{i.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">× {i.quantity}</p>
              </div>

              <span className="font-medium text-gray-900 dark:text-white text-sm whitespace-nowrap">
                {format(i.price * i.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-3 flex justify-between font-bold text-lg">
          <span className="text-gray-900 dark:text-white">Total</span>
          <span className="text-brand-600">{format(total)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 text-sm">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Shipping</h4>
          <p className="text-gray-600 dark:text-gray-400">
            {data.fullName}<br />{data.address}<br />{data.city} {data.postal}
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Payment</h4>
          <p className="text-gray-600 dark:text-gray-400">
            Card ending in {data.card?.slice(-4) || '****'}
          </p>
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
      <p className="text-gray-500 dark:text-gray-400 mt-2">Redirecting to your orders…</p>
    </div>
  )
}

export default function Checkout() {
  const { format } = useCurrency()
  const { items, total, clearCart } = useCart()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [redirect, setRedirect] = useState(false)

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
      setTimeout(() => setRedirect(true), 1500)
    } catch (err) {
      const msg = err.response?.data?.message || 'Checkout failed'
      setError(msg)
      toast.error(msg, { id: loadingToast })
    } finally {
      setSubmitting(false)
    }
  }

  if (redirect) return <Navigate to="/orders" replace />

  const steps = success
    ? [{ label: 'Done', title: 'Success', subtitle: 'Order complete', component: ConfirmationStep }]
    : [
        { label: 'Shipping', title: 'Shipping info', subtitle: 'Where should we send your order?',
          component: ShippingStep, validate: (d) => d.fullName && d.address && d.city && d.postal },
        { label: 'Payment', title: 'Payment', subtitle: 'Enter your card details',
          component: PaymentStep, validate: (d) => {
          const cd = (d.card || '').replace(/\D/g, '')
          const amex = /^3[47]/.test(cd)
          const needLen = amex ? 15 : 16
          const luhnOk = (() => {
            if (cd.length !== needLen) return false
            let s = 0, alt = false
            for (let i = cd.length - 1; i >= 0; i--) {
              let x = parseInt(cd[i], 10)
              if (alt) { x *= 2; if (x > 9) x -= 9 }
              s += x; alt = !alt
            }
            return s % 10 === 0
          })()
          const expOk = (() => {
            if (!/^\d{2}\/\d{2}$/.test(d.expiry || '')) return false
            const [mm, yy] = d.expiry.split('/').map(Number)
            if (mm < 1 || mm > 12) return false
            return new Date(2000 + yy, mm, 0, 23, 59, 59) >= new Date()
          })()
          const cvcOk = (d.cvc || '').length === (amex ? 4 : 3)
          return luhnOk && expOk && cvcOk
        } },
        { label: 'Review', title: 'Review order', subtitle: 'One last check before payment',
          component: ReviewStep },
      ]

  return (
    <div className="min-h-[80vh] py-12 px-4">
      <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">Checkout</h1>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-10">
        Total: <span className="font-bold text-brand-600">{format(total)}</span>
      </p>
      {error && (
        <div className="max-w-3xl mx-auto mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg text-sm">
          {error}
        </div>
      )}
      <Wizard steps={steps} onComplete={handleComplete} submitLabel={submitting ? 'Placing...' : 'Place Order'} />
    </div>
  )
}
