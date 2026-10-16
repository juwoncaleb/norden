import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useCartStore } from "../../store/cartStore";

function formatPrice(value) {
  return "₦" + new Intl.NumberFormat("en-NG", {
    maximumFractionDigits: 0,
  }).format(value);
}

export default function CartDrawer() {
  const router = useRouter();

  const items = useCartStore((s) => s.items);
  const isCartOpen = useCartStore((s) => s.isCartOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  // Cart is stored in localStorage, so only render items after mount
  // to avoid a hydration mismatch with the server-rendered page.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && closeCart();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeCart]);

  const visibleItems = mounted ? items : [];
  const total = visibleItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <>
      <div
        className={`cart-overlay ${isCartOpen ? "open" : ""}`}
        onClick={closeCart}
      />

      <aside
        className={`cart-drawer ${isCartOpen ? "open" : ""}`}
        aria-hidden={!isCartOpen}
      >
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="cart-close" onClick={closeCart} aria-label="Close cart">
            ✕
          </button>
        </div>

        <div className="cart-body">
          {visibleItems.length === 0 ? (
            <p className="cart-empty">Your cart is empty</p>
          ) : (
            visibleItems.map((item) => (
              <div className="cart-item" key={item.id}>
                {item.image && <img src={item.image} alt={item.title} />}

                <div className="cart-item-info">
                  <p className="cart-item-title">{item.title}</p>
                  <p className="cart-item-price">{formatPrice(item.price)}</p>

                  <div className="cart-qty">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  className="cart-delete"
                  onClick={() => removeItem(item.id)}
                  aria-label="Remove from cart"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {visibleItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <button className="cart-checkout" onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        )}
      </aside>
    </>
  );
}