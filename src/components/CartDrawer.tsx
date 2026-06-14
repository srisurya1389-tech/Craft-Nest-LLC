import React from 'react'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'

export function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart()

  return (
    <div
      className={`fixed inset-0 z-[99999] transition-all duration-500 ease-in-out ${isCartOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      {/* Backdrop overlay */}
      <div
        onClick={() => setIsCartOpen(false)}
        className={`absolute inset-0 bg-[#04140E]/80 backdrop-blur-sm transition-opacity duration-500 ${isCartOpen ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Drawer container panel */}
      <div
        className={`absolute top-0 right-0 h-full w-full sm:w-[450px] bg-[#071A10] border-l border-[#C9A84C]/35 shadow-[0_0_50px_rgba(4,20,10,0.8)] flex flex-col justify-between transition-transform duration-500 ease-in-out transform ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#C9A84C]/25 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#E8C96B]" />
            <h3 className="font-serif text-xl font-bold text-white tracking-wide uppercase">Your Selection</h3>
            <span className="bg-[#E8C96B] text-[#0B3D2E] text-[10px] font-sans font-bold px-2 py-0.5 rounded-full">
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 rounded-full border border-[#C9A84C]/30 hover:border-[#E8C96B] flex items-center justify-center text-[#C9A84C] hover:text-[#E8C96B] transition-all cursor-pointer"
            aria-label="Close Cart"
          >
            <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Item List (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 select-none">
              <span className="text-4xl">🎁</span>
              <p className="font-serif text-base text-[#E8C96B]">Your cart is empty</p>
              <p className="font-sans text-xs text-white/50 max-w-[240px]">
                Explore our featured collections and select custom keepsakes to begin.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false)
                  const servicesSection = document.getElementById('services')
                  if (servicesSection) {
                    servicesSection.scrollIntoView({ behavior: 'smooth' })
                  } else {
                    window.location.href = '/#services'
                  }
                }}
                className="font-sans text-[10px] tracking-[0.2em] font-semibold border border-[#C9A84C] text-[#C9A84C] rounded-full px-5 py-2.5 hover:bg-[#C9A84C] hover:text-[#0B3D2E] transition-all duration-300 uppercase cursor-pointer"
              >
                Browse Art
              </button>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div
                key={idx}
                className="p-4 bg-[#0B3D2E]/60 border border-[#C9A84C]/20 rounded-[16px] flex items-center justify-between gap-4 animate-scale-in text-left"
              >
                <div className="flex-1">
                  <h4 className="font-serif text-sm font-semibold text-white leading-tight mb-1">
                    {item.title}
                  </h4>
                  <p className="font-sans text-xs text-[#E8C96B] font-bold">
                    ₹{item.price.toLocaleString('en-IN')}
                  </p>
                </div>

                {/* Quantity controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.title, -1)}
                    className="w-6 h-6 rounded-full border border-[#C9A84C]/30 text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0B3D2E] flex items-center justify-center text-xs transition-all cursor-pointer font-bold"
                  >
                    -
                  </button>
                  <span className="font-sans text-xs font-bold text-white w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.title, 1)}
                    className="w-6 h-6 rounded-full border border-[#C9A84C]/30 text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0B3D2E] flex items-center justify-center text-xs transition-all cursor-pointer font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromCart(item.title)}
                  className="text-white/40 hover:text-red-400 transition-colors p-1 cursor-pointer"
                  aria-label="Remove Item"
                >
                  <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer details with total & Checkout Enquire button */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-[#C9A84C]/25 bg-[#04140E] space-y-4">
            <div className="flex items-center justify-between font-serif text-white">
              <span className="text-sm font-medium tracking-wide">SUBTOTAL</span>
              <span className="text-lg font-bold text-[#E8C96B]">
                ₹
                {cartItems
                  .reduce((acc, item) => acc + item.price * item.quantity, 0)
                  .toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={() => {
                const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
                const itemsList = cartItems
                  .map(
                    item =>
                      `• *${item.title}* (Qty: ${item.quantity}) - ₹${(
                        item.price * item.quantity
                      ).toLocaleString('en-IN')}`
                  )
                  .join('\n')

                const messageString = `Hello CraftNest! I would like to enquire about the following handcrafted items in my cart:\n\n${itemsList}\n\n*Total Estimated Order:* ₹${subtotal.toLocaleString(
                  'en-IN'
                )}\n\nPlease let me know how we can proceed. Thank you!`

                const encodedMessage = encodeURIComponent(messageString)
                const whatsappRedirectUrl = `https://wa.me/14704527988?text=${encodedMessage}`
                window.open(whatsappRedirectUrl, '_blank')
              }}
              className="w-full bg-[#E8C96B] hover:bg-[#EDD06A] text-[#0B3D2E] py-4 rounded-[12px] text-xs tracking-[0.25em] font-sans font-bold uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-[1.01]"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.504-5.727-1.465L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.859-4.407 9.862-9.83.001-2.628-1.02-5.1-2.871-6.953C16.596 1.968 14.12 .946 11.5 .944 6.066.944 1.65 5.356 1.647 10.782c-.001 1.732.463 3.42 1.343 4.927l-.988 3.6 3.69-.966z" />
              </svg>
              <span>Enquire Cart via WhatsApp</span>
            </button>

            <button
              onClick={clearCart}
              className="w-full text-center text-[10px] tracking-widest text-[#C9A84C]/60 hover:text-white uppercase transition-colors py-1 cursor-pointer font-bold"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
