'use client'

import { useCartStore } from '@/lib/store'
import { useRouter } from 'next/navigation'

export default function CartDrawer() {
  const router = useRouter()

  const {
    items,
    isOpen,
    closeCart,
    increaseQty,
    decreaseQty,
    removeItem,
  } = useCartStore()

  const total = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  )

  return (
    <>
      {/* BACKDROP */}
      {isOpen && (
        <div className="cart-backdrop" onClick={closeCart} />
      )}

      {/* DRAWER */}
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button onClick={closeCart}>✕</button>
        </div>

        {/* EMPTY */}
        {items.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <>
            {/* ITEMS */}
            <div className="cart-items">
              {items.map((item) => (
                <div key={item._id} className="cart-item">

                  {/* IMAGE */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="cart-img"
                  />

                  {/* INFO */}
                  <div className="cart-info">
                    <h4>{item.title}</h4>

                    <p>
                      ${(item.price * item.quantity).toLocaleString()}
                    </p>

                    {/* QTY */}
                    <div className="qty">
                      <button onClick={() => decreaseQty(item._id)}>
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button onClick={() => increaseQty(item._id)}>
                        +
                      </button>
                    </div>

                    {/* DELETE */}
                    <button
                      className="delete"
                      onClick={() => removeItem(item._id)}
                    >
                      🗑
                    </button>
                  </div>

                </div>
              ))}
            </div>

            {/* FOOTER */}
            <div className="cart-footer">
              <div className="total">
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>

              {/* CHECKOUT BUTTON */}
              <button
                className="checkout-btn"
                onClick={() => {
                  closeCart()
                  router.push('/checkout')
                }}
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}