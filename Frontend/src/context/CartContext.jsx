import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
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

  const addItem = (product, quantity = 1) => {
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