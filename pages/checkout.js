import { useEffect, useState } from "react";
import Script from "next/script";
import Link from "next/link";
import Header from "./component/Header";
import Footer from "./component/footer";
import { useCartStore } from "../store/cartStore";

const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT (Abuja)","Gombe",
  "Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos",
  "Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto",
  "Taraba","Yobe","Zamfara",
];

function formatPrice(value) {
  return (
    "₦" + new Intl.NumberFormat("en-NG", { maximumFractionDigits: 0 }).format(value)
  );
}

const inputClass =
  "w-full border border-stone-300 px-4 py-3 text-stone-900 bg-white focus:outline-none focus:border-stone-900";
const labelClass = "block text-sm text-stone-600 mb-1";

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    landmark: "",
    city: "",
    state: "Lagos",
    notes: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [paidRef, setPaidRef] = useState(null);

  const cartItems = mounted ? items : [];
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      return "Please enter your first and last name.";
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      return "Please enter a valid email.";
    }
    if (form.phone.replace(/\D/g, "").length < 10) {
      return "Please enter a valid phone number.";
    }
    if (!form.address.trim()) {
      return "Please enter your delivery address.";
    }
    if (!form.city.trim()) {
      return "Please enter your city.";
    }
    if (cartItems.length === 0 || subtotal <= 0) {
      return "Your cart is empty.";
    }
    return "";
  };

  const handlePay = (e) => {
    e.preventDefault();
    setError("");

    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }

    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) {
      setError("Payment is not configured yet.");
      return;
    }

    if (typeof window === "undefined" || !window.PaystackPop) {
      setError("Payment is still loading. Please try again in a moment.");
      return;
    }

    setLoading(true);

    try {
      const reference = `NRD-${Date.now()}`;

      const itemsSummary = cartItems
        .map((item, index) => {
          const lineTotal = item.price * item.quantity;
          return `${index + 1}. ${item.title} | Qty: ${item.quantity} | ${formatPrice(
            item.price
          )} each | Total: ${formatPrice(lineTotal)}`;
        })
        .join("\n");

      const orderNotes = `ORDER ITEMS:

${itemsSummary}

ORDER TOTAL: ${formatPrice(subtotal)}

CUSTOMER NOTE:
${form.notes.trim() ? form.notes.trim() : "None"}`;

      const fullAddress = [
        form.address,
        form.landmark ? `Landmark: ${form.landmark}` : "",
        form.city,
        form.state,
      ]
        .filter(Boolean)
        .join(", ");

      const handler = window.PaystackPop.setup({
        key: publicKey,
        email: form.email,
        amount: Math.round(subtotal * 100), // kobo
        currency: "NGN",
        ref: reference,
        firstname: form.firstName,
        lastname: form.lastName,
        phone: form.phone,

        metadata: {
          custom_fields: [
            {
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: `${form.firstName} ${form.lastName}`,
            },
            {
              display_name: "Phone",
              variable_name: "phone",
              value: form.phone,
            },
            {
              display_name: "Delivery Address",
              variable_name: "delivery_address",
              value: fullAddress,
            },
            {
              display_name: "Notes",
              variable_name: "notes",
              value: orderNotes,
            },
          ],

          cart: cartItems.map((item) => ({
            id: item.id,
            title: item.title,
            quantity: item.quantity,
            unit_price: item.price,
            line_total: item.price * item.quantity,
          })),

          customer: {
            first_name: form.firstName,
            last_name: form.lastName,
            email: form.email,
            phone: form.phone,
            address: form.address,
            landmark: form.landmark,
            city: form.city,
            state: form.state,
          },

          order_total: subtotal,
          customer_note: form.notes,
        },

        // Must be a normal function (not async) for Paystack inline v1
        callback: function (response) {
          fetch("/api/paystack/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reference: response.reference }),
          })
            .then((r) => r.json())
            .then((data) => {
              if (data.verified) {
                clearCart();
                setPaidRef(response.reference);
              } else {
                setError(
                  "We couldn't confirm your payment. Please contact support with ref: " +
                    response.reference
                );
              }
            })
            .catch(() =>
              setError(
                "Verification error. Contact support with ref: " +
                  response.reference
              )
            )
            .finally(() => setLoading(false));
        },

        onClose: function () {
          setLoading(false);
        },
      });

      handler.openIframe();
    } catch (err) {
      console.error("Paystack error:", err);
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div>
      <Script
        src="https://js.paystack.co/v1/inline.js"
        strategy="lazyOnload"
      />

      <Header />

      <main className="max-w-7xl mx-auto px-4 py-10 min-h-[70vh]">
        <h1 className="text-3xl font-serif mb-8">Checkout</h1>

        {paidRef ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-serif mb-3">Thank you for your order</h2>
            <p className="text-stone-600">Your payment was received.</p>
            <p className="text-stone-500 mt-1">Reference: {paidRef}</p>
            <Link href="/" className="inline-block mt-8 underline">
              Continue shopping
            </Link>
          </div>
        ) : !mounted ? null : cartItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-stone-500 text-lg">Your cart is empty.</p>
            <Link href="/" className="inline-block mt-6 underline">
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* LEFT SIDE */}
            <form id="checkout-form" onSubmit={handlePay} className="space-y-5">
              <h2 className="text-xl font-serif">Delivery details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} htmlFor="firstName">First name</label>
                  <input
                    id="firstName"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    className={inputClass}
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="lastName">Last name</label>
                  <input
                    id="lastName"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className={inputClass}
                    autoComplete="family-name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className={inputClass}
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="phone">Phone number</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    className={inputClass}
                    autoComplete="tel"
                    placeholder="080..."
                  />
                </div>
              </div>

              <div>
                <label className={labelClass} htmlFor="address">Delivery address</label>
                <input
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className={inputClass}
                  autoComplete="street-address"
                  placeholder="House number and street"
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="landmark">
                  Nearest landmark (optional)
                </label>
                <input
                  id="landmark"
                  name="landmark"
                  value={form.landmark}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} htmlFor="city">City / Area</label>
                  <input
                    id="city"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className={inputClass}
                    autoComplete="address-level2"
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="state">State</label>
                  <select
                    id="state"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    {NIGERIAN_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass} htmlFor="notes">
                  Delivery notes (optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={form.notes}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Gate code, preferred delivery time, etc."
                />
              </div>
            </form>

            {/* RIGHT SIDE */}
            <aside className="lg:sticky lg:top-24 self-start bg-stone-50 border border-stone-200 p-6">
              <h2 className="text-xl font-serif mb-5">Your order</h2>

              <div className="divide-y divide-stone-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 py-5">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-20 h-20 object-cover bg-stone-100 flex-shrink-0"
                      />
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-stone-900">{item.title}</p>
                      <p className="text-sm text-stone-500 mt-1">
                        {formatPrice(item.price)} each
                      </p>

                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center border border-stone-300 bg-white">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-9 h-9 flex items-center justify-center text-lg hover:bg-stone-100 transition"
                            aria-label={`Decrease ${item.title} quantity`}
                          >
                            −
                          </button>

                          <span className="w-10 text-center text-sm font-medium">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-9 h-9 flex items-center justify-center text-lg hover:bg-stone-100 transition"
                            aria-label={`Increase ${item.title} quantity`}
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-xs text-stone-500 underline underline-offset-2 hover:text-red-700 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <p className="text-stone-900 font-medium whitespace-nowrap">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-lg font-semibold border-t border-stone-300 mt-2 pt-5">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              {error && <p className="text-red-700 text-sm mt-4">{error}</p>}

              <button
                type="submit"
                form="checkout-form"
                disabled={loading}
                className="w-full mt-6 py-5 text-lg font-semibold tracking-widest uppercase bg-stone-900 text-white hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? "Processing..." : `Pay Now · ${formatPrice(subtotal)}`}
              </button>

              <p className="text-xs text-stone-500 text-center mt-3">
                Secure payment powered by Paystack
              </p>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}