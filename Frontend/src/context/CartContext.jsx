import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cart')
      if (stored) setItems(JSON.parse(stored))
    } catch {}
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items, hydrated])

  useEffect(() => {
    if (hydrated && (!user || user.role !== 'CUSTOMER')) {
      setItems([])
      localStorage.removeItem('cart')
    }
  }, [user, hydrated])

  const addItem = (product, quantity = 1) => {
    if (!user || user.role !== 'CUSTOMER') {
      console.warn('[Cart] blocked: only CUSTOMER role can add to cart')
      return { ok: false, reason: 'not_customer' }
    }
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        )
      }
      return [...prev, { ...product, quantity }]
    })
    setIsOpen(true)
    return { ok: true }
  }

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id))
  const updateQty = (id, qty) =>
    qty < 1
      ? setItems((prev) => prev.filter((i) => i.id !== id))
      : setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)))
  const clearCart = () => {
    setItems([])
    localStorage.removeItem('cart')
  }

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const cartCount = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, cartCount, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
