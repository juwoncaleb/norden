
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import { useCartStore } from "../store/cartStore";
import Header from "./component/Header";
import Footer from "./component/footer";

const BURGUNDY = "#3c101e";

const MENU_ITEMS = [
  { label: "My Account", href: "/account", icon: "user" },
  { label: "My Orders", href: "/orders", icon: "package" },
  { label: "My Likes", href: "/likes", icon: "heart" },
  { label: "Recently Viewed", href: "/recently-viewed", icon: "clock" },
  { label: "My Addresses", href: "/account/addresses", icon: "pin" },
  { label: "Help & Support", href: "/contact", icon: "help" },
];

function Icon({ name, size = 21 }) {
  const paths = {
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3-6 8-6s8 2 8 6" />
      </>
    ),
    package: (
      <>
        <path d="m3 7 9-4 9 4v10l-9 4-9-4V7Z" />
        <path d="m3 7 9 4 9-4M12 11v10" />
      </>
    ),
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    help: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4" />
        <path d="M12 17h.01" />
      </>
    ),
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    bag: (
      <>
        <path d="M4 8h16l-1 13H5L4 8Z" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" />
      </>
    ),
    logout: (
      <>
        <path d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5" />
        <path d="m14 16 4-4-4-4M8 12h10" />
      </>
    ),
    truck: (
      <>
        <path d="M3 6h11v12H3zM14 10h4l3 4v4h-7z" />
        <circle cx="7.5" cy="19" r="2" />
        <circle cx="17.5" cy="19" r="2" />
      </>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.package}
    </svg>
  );
}

function formatPrice(amount) {
  const value = Number(amount);
  if (!Number.isFinite(value)) return "—";
  return `₦${value.toLocaleString("en-NG", {
    maximumFractionDigits: 0,
  })}`;
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getStatus(status) {
  const value = String(status || "pending").toLowerCase();

  if (["delivered", "completed"].includes(value)) {
    return { label: "Delivered", className: "delivered" };
  }
  if (["shipped", "in transit", "dispatched"].includes(value)) {
    return { label: "Shipped", className: "shipped" };
  }
  if (["cancelled", "canceled", "failed"].includes(value)) {
    return { label: "Cancelled", className: "cancelled" };
  }
  if (["processing", "confirmed", "paid"].includes(value)) {
    return { label: "Processing", className: "processing" };
  }
  return { label: "Pending", className: "pending" };
}

// Handles common cart item formats without modifying your store.
function getCartPrice(item) {
  const sale = Number(item.discountedPrice);
  const original = Number(item.price);

  if (
    item.discountedPrice != null &&
    Number.isFinite(sale) &&
    sale >= 0 &&
    Number.isFinite(original) &&
    sale < original
  ) {
    return sale;
  }

  return Number.isFinite(original) && original >= 0 ? original : 0;
}

function getCartImage(item) {
  const image = item.image || item.imageUrl || item.thumbnail;

  if (typeof image === "string") return image;
  if (typeof image?.url === "string") return image.url;
  if (typeof image?.fields?.file?.url === "string") {
    const url = image.fields.file.url;
    return url.startsWith("//") ? `https:${url}` : url;
  }

  return "";
}

function AccountSidebar({ session }) {
  return (
    <aside className="norders-sidebar">
      <div className="norders-identity">
        {session?.user?.image ? (
          <img
            className="norders-avatar"
            src={session.user.image}
            alt=""
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="norders-avatar-placeholder">
            {session?.user?.name?.charAt(0)?.toUpperCase() || "N"}
          </div>
        )}

        <div className="norders-identity-copy">
          <strong>{session?.user?.name || "NÓRDEN Customer"}</strong>
          <span>{session?.user?.email || ""}</span>
        </div>
      </div>

      <nav className="norders-side-links" aria-label="Account navigation">
        {MENU_ITEMS.map((item) => (
          <Link
            href={item.href}
            key={item.href}
            className={`norders-side-link ${
              item.href === "/orders" ? "active" : ""
            }`}
          >
            <Icon name={item.icon} size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <button
        className="norders-signout"
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        <Icon name="logout" size={19} />
        <span>Sign Out</span>
      </button>
    </aside>
  );
}

function CurrentCart({ items, hydrated }) {
  const router = useRouter();

  const cartTotal = items.reduce(
    (total, item) =>
      total +
      getCartPrice(item) * Math.max(0, Number(item.quantity ?? 1) || 0),
    0
  );

  const cartCount = items.reduce(
    (total, item) =>
      total + Math.max(0, Number(item.quantity ?? 1) || 0),
    0
  );

  return (
    <section className="norders-cart-section">
      <div className="norders-section-head">
        <div>
          <span className="norders-eyebrow">YOUR SELECTIONS</span>
          <h2>Your Current Cart</h2>
        </div>
        <span className="norders-count">
          {hydrated ? cartCount : 0} {cartCount === 1 ? "Item" : "Items"}
        </span>
      </div>

      {!hydrated ? (
        <div className="norders-state">Loading your cart...</div>
      ) : items.length === 0 ? (
        <div className="norders-cart-empty">
          <div className="norders-cart-empty-icon">
            <Icon name="bag" size={29} />
          </div>
          <div>
            <h3>Your cart is empty</h3>
            <p>Find something you love and it will appear here.</p>
            <Link href="/sofa">
              Explore Furniture <Icon name="arrow" size={16} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="norders-cart-card">
          <div className="norders-cart-items">
            {items.map((item, index) => {
              const image = getCartImage(item);
              const quantity = Math.max(0, Number(item.quantity ?? 1) || 0);
              const unitPrice = getCartPrice(item);

              return (
                <div
                  className="norders-cart-item"
                  key={`${item.id || item.slug || index}-${index}`}
                >
                  <div className="norders-cart-image">
                    {image ? (
                      <img
                        src={image}
                        alt={item.title || item.name || "Furniture"}
                      />
                    ) : (
                      <Icon name="bag" size={25} />
                    )}
                  </div>

                  <div className="norders-cart-info">
                    <span className="norders-mini-label">
                      NÓRDEN COLLECTION
                    </span>
                    <h3>{item.title || item.name || "Furniture"}</h3>
                    <p>Quantity: {quantity}</p>
                    <strong>{formatPrice(unitPrice)}</strong>
                  </div>

                  <div className="norders-cart-line-total">
                    <span>Subtotal</span>
                    <strong>{formatPrice(unitPrice * quantity)}</strong>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="norders-cart-summary">
            <div>
              <span>Cart Subtotal</span>
              <strong>{formatPrice(cartTotal)}</strong>
              <small>Delivery charges are calculated at checkout.</small>
            </div>
            <button
              type="button"
              className="norders-primary-btn"
              onClick={() => router.push("/checkout")}
            >
              Proceed to Checkout <Icon name="arrow" size={18} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function OrderCard({ order }) {
  const status = getStatus(order.status);
  const products = Array.isArray(order.items) ? order.items : [];
  const orderId = String(order.id || order.orderNumber || "");

  return (
    <article className="norders-order-card">
      <div className="norders-order-top">
        <div>
          <span className="norders-mini-label">ORDER NUMBER</span>
          <h3>#{orderId}</h3>
        </div>
        <span className={`norders-status ${status.className}`}>
          {status.label}
        </span>
      </div>

      <div className="norders-order-meta">
        <div>
          <span>Order placed</span>
          <strong>{formatDate(order.createdAt || order.date)}</strong>
        </div>
        <div>
          <span>Total</span>
          <strong>{formatPrice(order.total)}</strong>
        </div>
        <div>
          <span>Items</span>
          <strong>
            {products.reduce(
              (sum, item) => sum + (Number(item.quantity) || 1),
              0
            )}
          </strong>
        </div>
      </div>

      {products.length > 0 && (
        <div className="norders-products">
          {products.slice(0, 3).map((item, index) => (
            <div className="norders-product" key={`${item.id || index}-${index}`}>
              <div className="norders-product-image">
                {item.image ? (
                  <img src={item.image} alt={item.title || "Furniture"} />
                ) : (
                  <Icon name="bag" size={24} />
                )}
              </div>
              <div>
                <strong>{item.title || item.name || "NÓRDEN Furniture"}</strong>
                <span>Quantity: {item.quantity || 1}</span>
              </div>
            </div>
          ))}
          {products.length > 3 && (
            <span className="norders-more">
              +{products.length - 3} more products
            </span>
          )}
        </div>
      )}

      <div className="norders-order-bottom">
        <span>Thank you for choosing NÓRDEN.</span>
        {orderId && (
          <Link href={`/orders/${encodeURIComponent(orderId)}`}>
            View Order Details <Icon name="arrow" size={17} />
          </Link>
        )}
      </div>
    </article>
  );
}

export default function OrdersPage() {
  const { data: session, status } = useSession();

  const storeItems = useCartStore((state) => state.items);
  const [hydrated, setHydrated] = useState(false);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [filter, setFilter] = useState("all");

  const cartItems = Array.isArray(storeItems) ? storeItems : [];

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (status === "loading") return;

    if (status !== "authenticated") {
      setOrders([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadOrders() {
      setLoading(true);
      setFetchError("");

      try {
        const response = await fetch("/api/orders", {
          signal: controller.signal,
          credentials: "same-origin",
        });

        if (!response.ok) {
          throw new Error("Unable to retrieve orders");
        }

        const data = await response.json();

        if (!controller.signal.aborted) {
          setOrders(
            Array.isArray(data)
              ? data
              : Array.isArray(data.orders)
              ? data.orders
              : []
          );
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setFetchError("We couldn't load your orders. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadOrders();
    return () => controller.abort();
  }, [status]);

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    const value = getStatus(order.status).className;
    if (filter === "active") {
      return ["pending", "processing", "shipped"].includes(value);
    }
    return value === filter;
  });

  const firstName = session?.user?.name?.trim().split(/\s+/)[0] || "there";

  return (
    <>
      <Header />

      <main className="norders-page">
        <div className="norders-container">
          <div className="norders-page-heading">
            <span className="norders-eyebrow">YOUR PERSONAL SPACE</span>
            <h1>My Orders</h1>
            <p>Follow your orders and revisit the pieces you have chosen.</p>
          </div>

          {status === "loading" ? (
            <div className="norders-auth-state">Loading your account...</div>
          ) : !session ? (
            <div className="norders-auth-state">
              <span className="norders-eyebrow">WELCOME TO NÓRDEN</span>
              <h2>Your orders, all in one place.</h2>
              <p>
                Sign in with your Google account to view your order history
                and keep track of your purchases.
              </p>
              <button
                type="button"
                className="norders-primary-btn"
                onClick={() => signIn("google", { callbackUrl: "/orders" })}
              >
                Continue with Google <Icon name="arrow" size={18} />
              </button>
            </div>
          ) : (
            <div className="norders-layout">
              <AccountSidebar session={session} />

              <section className="norders-main">
                <div className="norders-welcome">
                  <span className="norders-eyebrow">YOUR ORDER HISTORY</span>
                  <h2>Every piece, every detail.</h2>
                  <p>
                    Hello, {firstName}. From the moment you place an order
                    to its arrival, find the details of your NÓRDEN purchases here.
                  </p>
                  <span className="norders-watermark" aria-hidden="true">N</span>
                </div>

                {/* CURRENT CART FROM ZUSTAND */}
                <CurrentCart items={cartItems} hydrated={hydrated} />

                {/* ORDER HISTORY */}
                <div className="norders-section-head norders-history-heading">
                  <div>
                    <span className="norders-eyebrow">YOUR PURCHASES</span>
                    <h2>Order History</h2>
                  </div>
                  {!loading && !fetchError && (
                    <span className="norders-count">
                      {orders.length} {orders.length === 1 ? "Order" : "Orders"}
                    </span>
                  )}
                </div>

                {!loading && !fetchError && orders.length > 0 && (
                  <div className="norders-filters" aria-label="Filter orders">
                    {[
                      ["all", "All Orders"],
                      ["active", "In Progress"],
                      ["delivered", "Delivered"],
                      ["cancelled", "Cancelled"],
                    ].map(([value, label]) => (
                      <button
                        type="button"
                        key={value}
                        className={filter === value ? "selected" : ""}
                        onClick={() => setFilter(value)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}

                {loading ? (
                  <div className="norders-state">Loading your orders...</div>
                ) : fetchError ? (
                  <div className="norders-state">
                    <h3>Unable to load orders</h3>
                    <p>{fetchError}</p>
                    <button
                      type="button"
                      className="norders-secondary-btn"
                      onClick={() => window.location.reload()}
                    >
                      Try Again
                    </button>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="norders-empty">
                    <div className="norders-empty-icon">
                      <Icon name="bag" size={34} />
                    </div>
                    <span className="norders-eyebrow">YOUR JOURNEY STARTS HERE</span>
                    <h3>No completed orders yet</h3>
                    <p>
                      Once you complete a purchase, your order details
                      will appear here so you can keep track of your furniture.
                    </p>
                    <Link href="/sofa" className="norders-primary-btn">
                      Explore the Collection <Icon name="arrow" size={18} />
                    </Link>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="norders-state">
                    <h3>No matching orders</h3>
                    <p>There are no orders in this category yet.</p>
                    <button
                      type="button"
                      className="norders-secondary-btn"
                      onClick={() => setFilter("all")}
                    >
                      View All Orders
                    </button>
                  </div>
                ) : (
                  <div className="norders-order-list">
                    {filteredOrders.map((order, index) => (
                      <OrderCard
                        key={order.id || order.orderNumber || index}
                        order={order}
                      />
                    ))}
                  </div>
                )}

                <div className="norders-help">
                  <div>
                    <span className="norders-eyebrow">HERE TO HELP</span>
                    <h3>Questions about an order?</h3>
                    <p>
                      Our team is happy to help with your purchase,
                      delivery, or any other enquiries.
                    </p>
                  </div>
                  <Link href="/contact">
                    Contact Support <Icon name="arrow" size={18} />
                  </Link>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <style jsx global>{`
        .norders-page {
          background: #fbf9f5;
          min-height: 85vh;
          color: #282321;
          padding: 62px 0 110px;
          font-family: Arial, Helvetica, sans-serif;
        }
        .norders-page * { box-sizing: border-box; }
        .norders-container { width: 92.5%; max-width: 1600px; margin: auto; }
        .norders-eyebrow, .norders-mini-label {
          display: block;
          color: ${BURGUNDY};
          font-size: 12px;
          letter-spacing: 2px;
          font-weight: 600;
          text-transform: uppercase;
        }
        .norders-page-heading { margin-bottom: 52px; }
        .norders-page-heading h1 {
          font-family: "Radley", Georgia, serif;
          font-size: clamp(48px, 5vw, 76px);
          font-weight: 400;
          line-height: 1.1;
          margin: 24px 0 18px;
        }
        .norders-page-heading p { color: #857e79; font-size: 17px; margin: 0; }
        .norders-layout {
          display: grid;
          grid-template-columns: 328px minmax(0, 1fr);
          gap: 52px;
          align-items: start;
        }
        .norders-sidebar { background: white; border: 1px solid #e8e1d8; }
        .norders-identity {
          display: flex; align-items: center; gap: 16px;
          padding: 28px 23px; min-height: 120px;
          border-bottom: 1px solid #e8e1d8;
        }
        .norders-avatar, .norders-avatar-placeholder {
          width: 62px; height: 62px; border-radius: 50%;
          object-fit: cover; flex-shrink: 0;
        }
        .norders-avatar-placeholder {
          display: flex; align-items: center; justify-content: center;
          background: #800f10; color: white;
          font-family: "Radley", Georgia, serif; font-size: 26px;
        }
        .norders-identity-copy { min-width: 0; }
        .norders-identity-copy strong {
          display: block; font-family: "Radley", Georgia, serif;
          font-size: 18px; font-weight: 400; margin-bottom: 7px;
        }
        .norders-identity-copy span {
          display: block; font-size: 11px; color: #827973;
          overflow-wrap: anywhere;
        }
        .norders-side-links { padding: 16px 0; }
        .norders-side-link, .norders-signout {
          width: 100%; min-height: 61px; padding: 0 25px;
          display: flex; align-items: center; gap: 18px;
          text-decoration: none; color: #302825;
          font-family: "Radley", Georgia, serif;
          font-size: 17px; border: none; background: transparent;
          cursor: pointer; text-align: left;
          transition: background .2s;
        }
        .norders-side-link:hover, .norders-signout:hover { background: #f8f4f1; }
        .norders-side-link.active {
          background: #f3edeb; color: ${BURGUNDY};
          border-left: 3px solid ${BURGUNDY};
          padding-left: 22px;
        }
        .norders-signout {
          border-top: 1px solid #e8e1d8; min-height: 74px;
        }
        .norders-main { min-width: 0; }
        .norders-welcome {
          position: relative; overflow: hidden;
          background: ${BURGUNDY}; color: white;
          padding: 52px 56px; min-height: 275px;
        }
        .norders-welcome .norders-eyebrow { color: #f2d8d5; position: relative; z-index: 1; }
        .norders-welcome h2 {
          font-family: "Radley", Georgia, serif;
          font-size: clamp(32px, 3vw, 47px);
          font-weight: 400; margin: 24px 0 20px;
          position: relative; z-index: 1;
        }
        .norders-welcome p {
          max-width: 530px; font-size: 15px; line-height: 2;
          margin: 0; position: relative; z-index: 1;
        }
        .norders-watermark {
          position: absolute; right: 10px; bottom: -145px;
          font-family: Georgia, serif; font-size: 370px;
          line-height: 1; color: rgba(255,255,255,.055);
          pointer-events: none;
        }
        .norders-section-head {
          display: flex; justify-content: space-between;
          align-items: end; gap: 20px; margin: 62px 0 26px;
        }
        .norders-section-head h2 {
          font-family: "Radley", Georgia, serif;
          font-size: 35px; font-weight: 400; margin: 18px 0 0;
        }
        .norders-count { color: #817770; font-size: 13px; }
        .norders-filters {
          display: flex; flex-wrap: wrap; gap: 9px; margin-bottom: 25px;
        }
        .norders-filters button {
          border: 1px solid #e4dbd4; background: white;
          padding: 11px 19px; color: #655b55;
          cursor: pointer; font-size: 12px; transition: .2s;
        }
        .norders-filters button.selected, .norders-filters button:hover {
          background: ${BURGUNDY}; border-color: ${BURGUNDY}; color: white;
        }
        .norders-empty, .norders-state {
          border: 1px solid #e8e1d8; background: white;
          text-align: center; padding: 72px 25px;
        }
        .norders-empty-icon {
          width: 88px; height: 88px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 30px; background: #f6f0ec;
          color: ${BURGUNDY};
        }
        .norders-empty h3, .norders-state h3 {
          font-family: "Radley", Georgia, serif;
          font-size: 36px; font-weight: 400; margin: 19px 0 14px;
        }
        .norders-empty p, .norders-state p {
          color: #857c75; max-width: 450px; margin: 0 auto 30px;
          line-height: 1.9; font-size: 14px;
        }
        .norders-primary-btn, .norders-secondary-btn {
          display: inline-flex; align-items: center; justify-content: center;
          gap: 20px; padding: 17px 28px; background: ${BURGUNDY};
          border: 1px solid ${BURGUNDY}; color: white;
          font-size: 13px; text-decoration: none; cursor: pointer;
          transition: .2s;
        }
        .norders-primary-btn:hover { background: #611c30; color: white; }
        .norders-secondary-btn { background: white; color: ${BURGUNDY}; }

        /* CURRENT CART */
        .norders-cart-card { background: white; border: 1px solid #e8e1d8; }
        .norders-cart-items { padding: 0 30px; }
        .norders-cart-item {
          display: flex; align-items: center; gap: 22px;
          padding: 26px 0; border-bottom: 1px solid #eee7df;
        }
        .norders-cart-item:last-child { border-bottom: none; }
        .norders-cart-image {
          width: 105px; height: 105px; flex-shrink: 0;
          background: #f6f2ed; display: flex;
          align-items: center; justify-content: center;
          color: ${BURGUNDY};
        }
        .norders-cart-image img { width: 100%; height: 100%; object-fit: cover; }
        .norders-cart-info { flex: 1; min-width: 0; }
        .norders-cart-info .norders-mini-label {
          font-size: 10px; color: #9c8c85; letter-spacing: 1.3px;
        }
        .norders-cart-info h3 {
          font-family: "Radley", Georgia, serif;
          font-size: 23px; font-weight: 400; margin: 10px 0;
        }
        .norders-cart-info p { color: #857c75; font-size: 12px; margin: 0 0 10px; }
        .norders-cart-info strong { font-size: 14px; font-weight: 500; }
        .norders-cart-line-total { text-align: right; }
        .norders-cart-line-total span {
          display: block; color: #8d847e; font-size: 12px; margin-bottom: 10px;
        }
        .norders-cart-line-total strong { font-size: 16px; font-weight: 500; }
        .norders-cart-summary {
          border-top: 1px solid #e8e1d8; background: #f8f5f1;
          padding: 28px 30px; display: flex;
          align-items: center; justify-content: space-between; gap: 25px;
        }
        .norders-cart-summary span { display: block; color: #7d736e; font-size: 13px; margin-bottom: 7px; }
        .norders-cart-summary strong {
          display: block; font-family: "Radley", Georgia, serif;
          font-size: 30px; font-weight: 400;
        }
        .norders-cart-summary small { display: block; color: #948a83; font-size: 11px; margin-top: 7px; }
        .norders-cart-empty {
          background: white; border: 1px solid #e8e1d8;
          display: flex; align-items: center; gap: 24px; padding: 35px;
        }
        .norders-cart-empty-icon {
          width: 75px; height: 75px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: #f6f0ec; color: ${BURGUNDY}; border-radius: 50%;
        }
        .norders-cart-empty h3 {
          font-family: "Radley", Georgia, serif;
          font-size: 25px; font-weight: 400; margin: 0 0 8px;
        }
        .norders-cart-empty p { color: #857c75; font-size: 13px; margin: 0 0 14px; }
        .norders-cart-empty a {
          color: ${BURGUNDY}; font-size: 13px;
          display: inline-flex; align-items: center; gap: 9px;
          text-decoration: none; border-bottom: 1px solid ${BURGUNDY};
          padding-bottom: 5px;
        }

        /* ORDER HISTORY */
        .norders-history-heading { margin-top: 65px; }
        .norders-order-list { display: flex; flex-direction: column; gap: 20px; }
        .norders-order-card { border: 1px solid #e8e1d8; background: white; }
        .norders-order-top {
          display: flex; justify-content: space-between; gap: 20px;
          padding: 28px 32px; align-items: center;
          border-bottom: 1px solid #eee7df;
        }
        .norders-mini-label { color: #8a817a; font-size: 10px; }
        .norders-order-top h3 {
          font-family: "Radley", Georgia, serif; font-weight: 400;
          font-size: 24px; margin: 8px 0 0;
        }
        .norders-status {
          font-size: 11px; padding: 9px 13px;
          text-transform: uppercase; letter-spacing: 1px;
          background: #f5f1e9; color: #8c6b30;
        }
        .norders-status.delivered { background: #eaf4ec; color: #397449; }
        .norders-status.shipped { background: #eaf0f8; color: #38648a; }
        .norders-status.processing { background: #f9f1e3; color: #976c28; }
        .norders-status.cancelled { background: #faebeb; color: #a33b3b; }
        .norders-order-meta {
          display: flex; flex-wrap: wrap; gap: 30px;
          padding: 25px 32px;
        }
        .norders-order-meta div { min-width: 110px; }
        .norders-order-meta span {
          display: block; color: #8d847e; font-size: 12px; margin-bottom: 9px;
        }
        .norders-order-meta strong { font-size: 14px; font-weight: 500; }
        .norders-products {
          border-top: 1px solid #eee7df; padding: 22px 32px;
          display: flex; flex-direction: column; gap: 15px;
        }
        .norders-product { display: flex; align-items: center; gap: 15px; }
        .norders-product-image {
          width: 65px; height: 65px; background: #f6f2ed;
          display: flex; align-items: center; justify-content: center;
          color: ${BURGUNDY}; flex-shrink: 0;
        }
        .norders-product-image img { width: 100%; height: 100%; object-fit: cover; }
        .norders-product strong {
          display: block; font-family: "Radley", Georgia, serif;
          font-size: 17px; font-weight: 400; margin-bottom: 7px;
        }
        .norders-product span, .norders-more { font-size: 12px; color: #8d847e; }
        .norders-order-bottom {
          display: flex; align-items: center; justify-content: space-between;
          gap: 20px; border-top: 1px solid #eee7df;
          padding: 22px 32px; font-size: 12px; color: #8d847e;
        }
        .norders-order-bottom a {
          color: ${BURGUNDY}; text-decoration: none;
          display: inline-flex; align-items: center; gap: 10px;
          font-size: 13px; font-weight: 600;
        }
        .norders-help {
          margin-top: 45px; padding: 36px 40px;
          border: 1px solid #e8e1d8;
          display: flex; align-items: center;
          justify-content: space-between; gap: 25px;
        }
        .norders-help h3 {
          font-family: "Radley", Georgia, serif;
          font-weight: 400; font-size: 28px; margin: 13px 0;
        }
        .norders-help p { color: #857c75; font-size: 13px; line-height: 1.8; margin: 0; }
        .norders-help a {
          color: ${BURGUNDY}; white-space: nowrap;
          text-decoration: none; display: inline-flex;
          align-items: center; gap: 12px; font-size: 13px;
          border-bottom: 1px solid ${BURGUNDY}; padding-bottom: 9px;
        }
        .norders-auth-state {
          text-align: center; background: white;
          border: 1px solid #e8e1d8; padding: 85px 25px;
        }
        .norders-auth-state h2 {
          font-family: "Radley", Georgia, serif;
          font-size: 42px; font-weight: 400; margin: 20px 0;
        }
        .norders-auth-state p {
          max-width: 500px; margin: 0 auto 30px;
          color: #857c75; line-height: 1.9;
        }
        @media (max-width: 1050px) {
          .norders-layout { grid-template-columns: 260px minmax(0, 1fr); gap: 25px; }
          .norders-welcome { padding: 40px 35px; }
        }
        @media (max-width: 760px) {
          .norders-page { padding: 40px 0 75px; }
          .norders-container { width: 91%; }
          .norders-page-heading { margin-bottom: 30px; }
          .norders-layout { grid-template-columns: 1fr; gap: 28px; }
          .norders-sidebar { width: 100%; }
          .norders-side-links {
            display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
            padding: 10px;
          }
          .norders-side-link { padding: 12px; min-height: 55px; gap: 10px; font-size: 14px; }
          .norders-side-link.active { padding-left: 9px; }
          .norders-signout { min-height: 55px; }
          .norders-welcome { min-height: 230px; padding: 35px 27px; }
          .norders-section-head { margin-top: 40px; }
          .norders-empty { padding: 55px 22px; }
          .norders-help { padding: 30px 25px; flex-direction: column; align-items: flex-start; }
          .norders-cart-summary { flex-direction: column; align-items: stretch; }
          .norders-cart-summary .norders-primary-btn { width: 100%; }
        }
        @media (max-width: 480px) {
          .norders-page-heading h1 { font-size: 52px; }
          .norders-page-heading p { font-size: 14px; }
          .norders-side-links { grid-template-columns: 1fr 1fr; }
          .norders-side-link { font-size: 12px; gap: 8px; }
          .norders-side-link svg { width: 17px; height: 17px; }
          .norders-welcome h2 { font-size: 34px; }
          .norders-cart-items { padding: 0 17px; }
          .norders-cart-item { gap: 13px; flex-wrap: wrap; }
          .norders-cart-image { width: 80px; height: 80px; }
          .norders-cart-info h3 { font-size: 19px; }
          .norders-cart-line-total { width: 100%; text-align: left; padding-left: 93px; }
          .norders-cart-line-total span { margin-bottom: 5px; }
          .norders-cart-summary { padding: 22px; }
          .norders-cart-empty { padding: 25px 18px; gap: 15px; }
          .norders-cart-empty-icon { width: 55px; height: 55px; }
          .norders-order-top, .norders-order-meta,
          .norders-products, .norders-order-bottom { padding-left: 20px; padding-right: 20px; }
          .norders-order-bottom { align-items: flex-start; flex-direction: column; }
          .norders-filters button { padding: 10px 12px; font-size: 11px; }
        }
      `}</style>
    </>
  );
}
