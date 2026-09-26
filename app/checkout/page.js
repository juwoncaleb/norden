"use client";

import { useCartStore } from "../../lib/store";
import { urlFor } from "../../lib/sanity";
import Header from "../component/Header";
import Footer from "../component/footer";

export default function CheckoutPage() {
  const { items, increaseQty, decreaseQty, removeItem } = useCartStore();

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div>
      <Header />

      <div className="co-page">
        {/* LEFT */}
        <div className="co-left">
          <h1 className="co-heading">Your cart</h1>

          {items.length === 0 ? (
            <p className="co-empty">Your cart is empty.</p>
          ) : (
            <div className="co-items">
              {items.map((item) => (
                <div key={item._id} className="co-item">
                  <div className="co-item-img">
                    {item.image && <img src={item.image} alt={item.title} />}
                  </div>

                  <div className="co-item-body">
                    <div className="co-item-top">
                      <p className="co-item-name">{item.title}</p>
                      <button
                        className="co-item-remove"
                        onClick={() => removeItem(item._id)}
                      >
                        ✕
                      </button>
                    </div>

                    <div className="co-item-bottom">
                      <div className="co-qty">
                        <button
                          className="co-qty-btn"
                          onClick={() => decreaseQty(item._id)}
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          className="co-qty-btn"
                          onClick={() => increaseQty(item._id)}
                        >
                          +
                        </button>
                      </div>
                      <p className="co-item-price">
                        ${(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="co-right">
          <h2 className="co-summary-title">Cart summary</h2>

          <div className="co-summary-rows">
            <div className="co-summary-row">
              <span>Items subtotal</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>
            <div className="co-summary-row">
              <span>Estimated shipping</span>
              <span className="co-free">Free</span>
            </div>
            <div className="co-summary-row">
              <span>Sales tax (10%)</span>
              <span>
                $
                {tax.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          <div className="co-coupon">
            <span>Add Coupon Code</span>
            <button className="co-coupon-btn">+</button>
          </div>

          <div className="co-total">
            <span>
              Total{" "}
              <span className="co-total-note">(incl. taxes & shipping)</span>
            </span>
            <span>
              $
              {total.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          <button className="co-checkout-btn">Checkout</button>

          <p className="co-secure">🔒 Secure checkout</p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
