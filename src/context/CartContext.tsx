import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartItem {
  title: string
  price: number
  quantity: number
  img?: string
}

interface CartContextType {
  cartItems: CartItem[]
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  addToCart: (product: { title: string; price: number; img?: string }) => void
  updateQuantity: (title: string, amount: number) => void
  removeFromCart: (title: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('craftnest_cart')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('craftnest_cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product: { title: string; price: number; img?: string }) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.title === product.title)
      if (existing) {
        return prev.map(item =>
          item.title === product.title ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    setIsCartOpen(true)
  }

  const updateQuantity = (title: string, amount: number) => {
    setCartItems(prev =>
      prev
        .map(item => {
          if (item.title === title) {
            const newQty = item.quantity + amount
            return newQty > 0 ? { ...item, quantity: newQty } : item
          }
          return item
        })
        .filter(item => item.quantity > 0)
    )
  }

  const removeFromCart = (title: string) => {
    setCartItems(prev => prev.filter(item => item.title !== title))
  }

  const clearCart = () => {
    setCartItems([])
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
