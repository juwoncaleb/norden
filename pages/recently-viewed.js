
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

import Header from "./component/Header";
import Footer from "./component/footer";

import {
  getRecentlyViewed,
  removeRecentlyViewed,
  clearRecentlyViewed,
} from "../lib/recentlyViewed";

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
    logout: (
      <>
        <path d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5" />
        <path d="m14 16 4-4-4-4M8 12h10" />
      </>
    ),
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    close: <path d="M5 5l14 14M19 5 5 19" />,
    eye: (
      <>
        <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
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
      {paths[name] || paths.clock}
    </svg>
  );
}

function formatPrice(amount) {
  const value = Number(amount);

  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }

  return `₦${value.toLocaleString("en-NG", {
    maximumFractionDigits: 0,
  })}`;
}

function AccountSidebar({ session }) {
  return (
    <aside className="nrecent-sidebar">
      <div className="nrecent-identity">
        {session?.user?.image ? (
          <img
            className="nrecent-avatar"
            src={session.user.image}
            alt=""
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="nrecent-avatar-placeholder">
            {session?.user?.name?.charAt(0)?.toUpperCase() || "N"}
          </div>
        )}

        <div className="nrecent-identity-copy">
          <strong>
            {session?.user?.name || "NÓRDEN Customer"}
          </strong>
          <span>{session?.user?.email || ""}</span>
        </div>
      </div>

      <nav
        className="nrecent-side-links"
        aria-label="Account navigation"
      >
        {MENU_ITEMS.map((item) => (
          <Link
            href={item.href}
            key={item.href}
            className={`nrecent-side-link ${
              item.href === "/recently-viewed" ? "active" : ""
            }`}
          >
            <Icon name={item.icon} size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <button
        className="nrecent-signout"
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        <Icon name="logout" size={19} />
        <span>Sign Out</span>
      </button>
    </aside>
  );
}

function ProductCard({ product, onRemove }) {
  return (
    <article className="nrecent-product">
      <div className="nrecent-product-image">
        <Link href={product.href}>
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              loading="lazy"
            />
          ) : (
            <div className="nrecent-image-placeholder">
              <Icon name="eye" size={30} />
            </div>
          )}
        </Link>

        <button
          type="button"
          className="nrecent-remove"
          aria-label={`Remove ${product.title} from history`}
          onClick={() => onRemove(product.id)}
          title="Remove from history"
        >
          <Icon name="close" size={16} />
        </button>
      </div>

      <div className="nrecent-product-info">
        <span className="nrecent-category">
          {product.category || "Furniture"}
        </span>

        <Link href={product.href} className="nrecent-product-title">
          {product.title}
        </Link>

        {formatPrice(product.price) && (
          <strong className="nrecent-product-price">
            {formatPrice(product.price)}
          </strong>
        )}

        <Link href={product.href} className="nrecent-view-link">
          View Product <Icon name="arrow" size={16} />
        </Link>
      </div>
    </article>
  );
}

export default function RecentlyViewedPage() {
  const { data: session, status } = useSession();

  const [products, setProducts] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    function refreshHistory() {
      setProducts(getRecentlyViewed());
    }

    refreshHistory();
    setHydrated(true);

    window.addEventListener(
      "norden-recently-viewed-updated",
      refreshHistory
    );

    window.addEventListener("storage", refreshHistory);

    return () => {
      window.removeEventListener(
        "norden-recently-viewed-updated",
        refreshHistory
      );
      window.removeEventListener("storage", refreshHistory);
    };
  }, []);

  function handleRemove(id) {
    removeRecentlyViewed(id);
    setProducts(getRecentlyViewed());
  }

  function handleClear() {
    if (!window.confirm("Clear all recently viewed products?")) return;

    clearRecentlyViewed();
    setProducts([]);
  }

  return (
    <>
      <Header />

      <main className="nrecent-page">
        <div className="nrecent-container">
          <div className="nrecent-page-heading">
            <span className="nrecent-eyebrow">YOUR PERSONAL SPACE</span>
            <h1>Recently Viewed</h1>
            <p>
              Revisit the pieces that caught your attention.
            </p>
          </div>

          {status === "loading" ? (
            <div className="nrecent-auth-state">
              Loading your account...
            </div>
          ) : !session ? (
            <div className="nrecent-auth-state">
              <span className="nrecent-eyebrow">
                THE NÓRDEN EXPERIENCE
              </span>
              <h2>Welcome back to NÓRDEN.</h2>
              <p>
                Sign in to access your account and revisit
                your recently viewed furniture on this device.
              </p>
              <button
                type="button"
                className="nrecent-primary-btn"
                onClick={() =>
                  signIn("google", {
                    callbackUrl: "/recently-viewed",
                  })
                }
              >
                Continue with Google <Icon name="arrow" size={18} />
              </button>
            </div>
          ) : (
            <div className="nrecent-layout">
              <AccountSidebar session={session} />

              <section className="nrecent-main">
                <div className="nrecent-welcome">
                  <span className="nrecent-eyebrow">
                    YOUR DISCOVERIES
                  </span>
                  <h2>Worth another look.</h2>
                  <p>
                    Every piece tells a story. Here are the
                    designs you've explored recently.
                  </p>
                  <span
                    className="nrecent-watermark"
                    aria-hidden="true"
                  >
                    N
                  </span>
                </div>

                <div className="nrecent-section-head">
                  <div>
                    <span className="nrecent-eyebrow">
                      YOUR BROWSING HISTORY
                    </span>
                    <h2>Viewed Products</h2>
                  </div>

                  <div className="nrecent-heading-actions">
                    <span className="nrecent-count">
                      {hydrated ? products.length : 0}{" "}
                      {products.length === 1 ? "Product" : "Products"}
                    </span>

                    {products.length > 0 && (
                      <button
                        type="button"
                        className="nrecent-clear"
                        onClick={handleClear}
                      >
                        Clear History
                      </button>
                    )}
                  </div>
                </div>

                {!hydrated ? (
                  <div className="nrecent-empty">
                    Loading your recently viewed products...
                  </div>
                ) : products.length === 0 ? (
                  <div className="nrecent-empty">
                    <div className="nrecent-empty-icon">
                      <Icon name="eye" size={36} />
                    </div>

                    <span className="nrecent-eyebrow">
                      DISCOVER SOMETHING BEAUTIFUL
                    </span>

                    <h3>No recently viewed products</h3>

                    <p>
                      As you explore the NÓRDEN collection,
                      the pieces you view will appear here
                      so you can easily find them again.
                    </p>

                    <Link href="/sofa" className="nrecent-primary-btn">
                      Explore the Collection
                      <Icon name="arrow" size={18} />
                    </Link>
                  </div>
                ) : (
                  <div className="nrecent-grid">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onRemove={handleRemove}
                      />
                    ))}
                  </div>
                )}

                <div className="nrecent-help">
                  <div>
                    <span className="nrecent-eyebrow">
                      KEEP EXPLORING
                    </span>
                    <h3>There's more to discover.</h3>
                    <p>
                      Explore our thoughtfully crafted collection
                      and find the next piece for your space.
                    </p>
                  </div>

                  <Link href="/sofa">
                    Shop Furniture
                    <Icon name="arrow" size={18} />
                  </Link>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <style jsx global>{`
        .nrecent-page {
          background: #fbf9f5;
          min-height: 85vh;
          padding: 62px 0 110px;
          color: #282321;
          font-family: Arial, Helvetica, sans-serif;
        }

        .nrecent-page * {
          box-sizing: border-box;
        }

        .nrecent-container {
          width: 92.5%;
          max-width: 1600px;
          margin: auto;
        }

        .nrecent-eyebrow {
          display: block;
          color: ${BURGUNDY};
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .nrecent-page-heading {
          margin-bottom: 52px;
        }

        .nrecent-page-heading h1 {
          font-family: "Radley", Georgia, serif;
          font-size: clamp(45px, 5vw, 76px);
          font-weight: 400;
          margin: 24px 0 18px;
        }

        .nrecent-page-heading p {
          color: #857e79;
          font-size: 17px;
          margin: 0;
        }

        .nrecent-layout {
          display: grid;
          grid-template-columns: 328px minmax(0, 1fr);
          gap: 52px;
          align-items: start;
        }

        .nrecent-sidebar {
          background: white;
          border: 1px solid #e8e1d8;
        }

        .nrecent-identity {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 28px 23px;
          min-height: 120px;
          border-bottom: 1px solid #e8e1d8;
        }

        .nrecent-avatar,
        .nrecent-avatar-placeholder {
          width: 62px;
          height: 62px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }

        .nrecent-avatar-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #800f10;
          color: white;
          font-family: "Radley", Georgia, serif;
          font-size: 26px;
        }

        .nrecent-identity-copy {
          min-width: 0;
        }

        .nrecent-identity-copy strong {
          display: block;
          font-family: "Radley", Georgia, serif;
          font-size: 18px;
          font-weight: 400;
          margin-bottom: 7px;
        }

        .nrecent-identity-copy span {
          display: block;
          font-size: 11px;
          color: #827973;
          overflow-wrap: anywhere;
        }

        .nrecent-side-links {
          padding: 16px 0;
        }

        .nrecent-side-link,
        .nrecent-signout {
          width: 100%;
          min-height: 61px;
          padding: 0 25px;
          display: flex;
          align-items: center;
          gap: 18px;
          text-decoration: none;
          color: #302825;
          font-family: "Radley", Georgia, serif;
          font-size: 17px;
          border: none;
          background: transparent;
          cursor: pointer;
          text-align: left;
          transition: background 0.2s;
        }

        .nrecent-side-link:hover,
        .nrecent-signout:hover {
          background: #f8f4f1;
        }

        .nrecent-side-link.active {
          background: #f3edeb;
          color: ${BURGUNDY};
          border-left: 3px solid ${BURGUNDY};
          padding-left: 22px;
        }

        .nrecent-signout {
          border-top: 1px solid #e8e1d8;
          min-height: 74px;
        }

        .nrecent-main {
          min-width: 0;
        }

        .nrecent-welcome {
          position: relative;
          overflow: hidden;
          background: ${BURGUNDY};
          color: white;
          padding: 52px 56px;
          min-height: 260px;
        }

        .nrecent-welcome .nrecent-eyebrow {
          color: #f2d8d5;
          position: relative;
          z-index: 1;
        }

        .nrecent-welcome h2 {
          font-family: "Radley", Georgia, serif;
          font-size: clamp(32px, 3vw, 47px);
          font-weight: 400;
          margin: 24px 0 20px;
          position: relative;
          z-index: 1;
        }

        .nrecent-welcome p {
          max-width: 530px;
          font-size: 15px;
          line-height: 2;
          margin: 0;
          position: relative;
          z-index: 1;
        }

        .nrecent-watermark {
          position: absolute;
          right: 10px;
          bottom: -145px;
          font-family: Georgia, serif;
          font-size: 370px;
          line-height: 1;
          color: rgba(255, 255, 255, 0.055);
          pointer-events: none;
        }

        .nrecent-section-head {
          display: flex;
          justify-content: space-between;
          align-items: end;
          gap: 20px;
          margin: 62px 0 26px;
        }

        .nrecent-section-head h2 {
          font-family: "Radley", Georgia, serif;
          font-size: 35px;
          font-weight: 400;
          margin: 18px 0 0;
        }

        .nrecent-heading-actions {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .nrecent-count {
          color: #817770;
          font-size: 13px;
        }

        .nrecent-clear {
          background: none;
          border: none;
          border-bottom: 1px solid ${BURGUNDY};
          color: ${BURGUNDY};
          padding: 0 0 5px;
          font-size: 12px;
          cursor: pointer;
        }

        .nrecent-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 25px;
        }

        .nrecent-product {
          background: white;
          border: 1px solid #e8e1d8;
          overflow: hidden;
        }

        .nrecent-product-image {
          height: 260px;
          background: #f4f0eb;
          position: relative;
        }

        .nrecent-product-image > a {
          display: block;
          width: 100%;
          height: 100%;
        }

        .nrecent-product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .nrecent-product:hover .nrecent-product-image img {
          transform: scale(1.04);
        }

        .nrecent-image-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: ${BURGUNDY};
        }

        .nrecent-remove {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          color: #302825;
          border: 1px solid #e8e1d8;
          border-radius: 50%;
          cursor: pointer;
        }

        .nrecent-remove:hover {
          background: ${BURGUNDY};
          color: white;
        }

        .nrecent-product-info {
          padding: 23px 20px 25px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
        }

        .nrecent-category {
          font-size: 10px;
          letter-spacing: 1.5px;
          color: #9b817a;
          text-transform: uppercase;
        }

        .nrecent-product-title {
          font-family: "Radley", Georgia, serif;
          font-size: 22px;
          color: #282321;
          text-decoration: none;
          line-height: 1.35;
        }

        .nrecent-product-price {
          font-size: 14px;
          font-weight: 500;
        }

        .nrecent-view-link {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-top: 7px;
          color: ${BURGUNDY};
          text-decoration: none;
          font-size: 12px;
          border-bottom: 1px solid ${BURGUNDY};
          padding-bottom: 6px;
        }

        .nrecent-empty {
          background: white;
          border: 1px solid #e8e1d8;
          text-align: center;
          padding: 75px 25px;
        }

        .nrecent-empty-icon {
          width: 88px;
          height: 88px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 30px;
          background: #f6f0ec;
          color: ${BURGUNDY};
        }

        .nrecent-empty h3 {
          font-family: "Radley", Georgia, serif;
          font-size: 36px;
          font-weight: 400;
          margin: 19px 0 14px;
        }

        .nrecent-empty p {
          color: #857c75;
          max-width: 450px;
          margin: 0 auto 30px;
          line-height: 1.9;
          font-size: 14px;
        }

        .nrecent-primary-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          padding: 17px 28px;
          background: ${BURGUNDY};
          border: 1px solid ${BURGUNDY};
          color: white;
          font-size: 13px;
          text-decoration: none;
          cursor: pointer;
          transition: 0.2s;
        }

        .nrecent-primary-btn:hover {
          background: #611c30;
          color: white;
        }

        .nrecent-help {
          margin-top: 45px;
          padding: 36px 40px;
          border: 1px solid #e8e1d8;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
        }

        .nrecent-help h3 {
          font-family: "Radley", Georgia, serif;
          font-weight: 400;
          font-size: 28px;
          margin: 13px 0;
        }

        .nrecent-help p {
          color: #857c75;
          font-size: 13px;
          line-height: 1.8;
          margin: 0;
        }

        .nrecent-help a {
          color: ${BURGUNDY};
          white-space: nowrap;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-size: 13px;
          border-bottom: 1px solid ${BURGUNDY};
          padding-bottom: 9px;
        }

        .nrecent-auth-state {
          text-align: center;
          background: white;
          border: 1px solid #e8e1d8;
          padding: 85px 25px;
        }

        .nrecent-auth-state h2 {
          font-family: "Radley", Georgia, serif;
          font-size: 42px;
          font-weight: 400;
          margin: 20px 0;
        }

        .nrecent-auth-state p {
          max-width: 500px;
          margin: 0 auto 30px;
          color: #857c75;
          line-height: 1.9;
        }

        @media (max-width: 1200px) {
          .nrecent-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 1050px) {
          .nrecent-layout {
            grid-template-columns: 260px minmax(0, 1fr);
            gap: 25px;
          }

          .nrecent-welcome {
            padding: 40px 35px;
          }
        }

        @media (max-width: 760px) {
          .nrecent-page {
            padding: 40px 0 75px;
          }

          .nrecent-container {
            width: 91%;
          }

          .nrecent-page-heading {
            margin-bottom: 30px;
          }

          .nrecent-layout {
            grid-template-columns: 1fr;
            gap: 28px;
          }

          .nrecent-side-links {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            padding: 10px;
          }

          .nrecent-side-link {
            padding: 12px;
            min-height: 55px;
            gap: 10px;
            font-size: 14px;
          }

          .nrecent-side-link.active {
            padding-left: 9px;
          }

          .nrecent-signout {
            min-height: 55px;
          }

          .nrecent-welcome {
            min-height: 230px;
            padding: 35px 27px;
          }

          .nrecent-section-head {
            margin-top: 40px;
          }

          .nrecent-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
          }

          .nrecent-product-image {
            height: 210px;
          }

          .nrecent-help {
            padding: 30px 25px;
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 480px) {
          .nrecent-page-heading h1 {
            font-size: 48px;
          }

          .nrecent-page-heading p {
            font-size: 14px;
          }

          .nrecent-side-link {
            font-size: 12px;
            gap: 8px;
          }

          .nrecent-side-link svg {
            width: 17px;
            height: 17px;
          }

          .nrecent-welcome h2 {
            font-size: 34px;
          }

          .nrecent-section-head {
            align-items: flex-start;
            flex-direction: column;
          }

          .nrecent-product-image {
            height: 160px;
          }

          .nrecent-product-info {
            padding: 15px 12px;
          }

          .nrecent-product-title {
            font-size: 17px;
          }

          .nrecent-category {
            font-size: 9px;
          }

          .nrecent-empty {
            padding: 55px 22px;
          }
        }
      `}</style>
    </>
  );
}
