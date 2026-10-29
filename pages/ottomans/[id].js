
import { useState, useEffect, useRef } from "react";
import { createClient } from "contentful";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";

import Header from "../component/Header";
import Footer from "../component/footer";
import CartDrawer from "../component/CartDrawer";
import { useCartStore } from "../../store/cartStore";

// ============================================
// CONFIGURATION
// ============================================

const PRODUCT_TYPE = "diningTable";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

// ============================================
// FETCH PRODUCT FROM CONTENTFUL
// ============================================

export async function getServerSideProps({ params }) {
  try {
    const entry = await client.getEntry(params.id);

    return {
      props: {
        item: JSON.parse(JSON.stringify(entry)),
      },
    };
  } catch (error) {
    console.error("DINING TABLE FETCH ERROR:", error);

    return {
      props: {
        item: null,
      },
    };
  }
}

// ============================================
// HELPERS
// ============================================

function formatPrice(value) {
  if (value == null) return "";

  const number = Number(value);

  if (!Number.isFinite(number)) return "";

  return (
    "₦" +
    new Intl.NumberFormat("en-NG", {
      maximumFractionDigits: 0,
    }).format(number)
  );
}

function imageUrl(image, width) {
  const url = image?.fields?.file?.url;

  if (!url) return null;

  const fullUrl = url.startsWith("//")
    ? `https:${url}`
    : url;

  if (!width) return fullUrl;

  return `${fullUrl}${
    fullUrl.includes("?") ? "&" : "?"
  }w=${width}`;
}

async function readWishlistResponse(response) {
  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("Invalid wishlist response.");
  }

  if (!response.ok || data.success === false) {
    throw new Error(
      data.error || "Unable to update wishlist."
    );
  }

  return data;
}

// ============================================
// HEART ICON
// ============================================

function HeartIcon({ filled = false }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={filled ? "#65000b" : "none"}
      stroke={filled ? "#65000b" : "#292523"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  );
}

// ============================================
// DINING TABLE DETAIL PAGE
// ============================================

export default function DiningTableDetailPage({
  item,
}) {
  const { data: session, status } = useSession();

  // Gallery
  const [activeImage, setActiveImage] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [mousePos, setMousePos] = useState({
    x: 50,
    y: 50,
  });

  // Wishlist
  const [isLiked, setIsLiked] = useState(false);
  const [loadingLike, setLoadingLike] =
    useState(true);
  const [savingLike, setSavingLike] =
    useState(false);
  const [heartAnimating, setHeartAnimating] =
    useState(false);
  const [toast, setToast] = useState(null);

  const pending = useRef(false);
  const toastTimer = useRef(null);
  const heartTimer = useRef(null);

  // Cart
  const addItem = useCartStore(
    (state) => state.addItem
  );

  const openCart = useCartStore(
    (state) => state.openCart
  );

  const productId = item?.sys?.id;

  // ============================================
  // NOTIFICATION
  // ============================================

  function showToast(type, title, message) {
    clearTimeout(toastTimer.current);

    setToast({
      id: Date.now(),
      type,
      title,
      message,
    });

    toastTimer.current = setTimeout(() => {
      setToast(null);
    }, 3500);
  }

  // ============================================
  // LOAD SAVED LIKE
  // ============================================

  useEffect(() => {
    let cancelled = false;

    if (!productId) {
      setLoadingLike(false);
      return;
    }

    if (status === "loading") {
      setLoadingLike(true);
      return;
    }

    if (status !== "authenticated") {
      setIsLiked(false);
      setLoadingLike(false);
      return;
    }

    async function loadWishlist() {
      setLoadingLike(true);

      try {
        const response = await fetch("/api/wishlist", {
          method: "GET",
          cache: "no-store",
        });

        const data = await readWishlistResponse(
          response
        );

        if (!Array.isArray(data.likes)) {
          throw new Error("Invalid wishlist data.");
        }

        const liked = data.likes.some(
          (like) =>
            like.productId === productId &&
            like.productType === PRODUCT_TYPE
        );

        if (!cancelled) {
          setIsLiked(liked);
        }
      } catch (error) {
        console.error("WISHLIST LOAD ERROR:", error);

        if (!cancelled) {
          showToast(
            "error",
            "Wishlist unavailable",
            error.message
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingLike(false);
        }
      }
    }

    loadWishlist();

    return () => {
      cancelled = true;
    };
  }, [productId, status, session?.user?.email]);

  // ============================================
  // CLEANUP
  // ============================================

  useEffect(() => {
    return () => {
      clearTimeout(toastTimer.current);
      clearTimeout(heartTimer.current);
    };
  }, []);

  // ============================================
  // HEART ANIMATION
  // ============================================

  function animateHeart() {
    clearTimeout(heartTimer.current);

    setHeartAnimating(true);

    heartTimer.current = setTimeout(() => {
      setHeartAnimating(false);
    }, 550);
  }

  // ============================================
  // ADD / REMOVE LIKE
  // ============================================

  async function handleToggleLike() {
    if (!productId || status === "loading") return;

    // Customer must be signed in
    if (status !== "authenticated") {
      await signIn("google", {
        callbackUrl: window.location.href,
      });
      return;
    }

    if (loadingLike || pending.current) return;

    pending.current = true;
    setSavingLike(true);

    try {
      const response = await fetch("/api/wishlist", {
        method: isLiked ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          productId,
          productType: PRODUCT_TYPE,
        }),
      });

      const data = await readWishlistResponse(
        response
      );

      if (typeof data.liked !== "boolean") {
        throw new Error(
          "Invalid wishlist update response."
        );
      }

      setIsLiked(data.liked);
      animateHeart();

      showToast(
        data.liked ? "success" : "removed",
        data.liked
          ? "Added to your likes"
          : "Removed from your likes",
        data.liked
          ? "This dining table has been saved."
          : "This dining table has been removed."
      );
    } catch (error) {
      console.error(
        "WISHLIST UPDATE ERROR:",
        error
      );

      showToast(
        "error",
        "Unable to update wishlist",
        error.message
      );
    } finally {
      pending.current = false;
      setSavingLike(false);
    }
  }

  // ============================================
  // PRODUCT NOT FOUND
  // ============================================

  if (!item) {
    return (
      <div>
        <Header />

        <main className="max-w-7xl mx-auto px-4 py-20 text-center">
          <p>Product not found</p>
        </main>

        <Footer />
      </div>
    );
  }

  // ============================================
  // PRODUCT DATA
  // ============================================

  const fields = item.fields || {};

  const images = Array.isArray(fields.images)
    ? fields.images
    : [];

  const tagList = Array.isArray(fields.tags)
    ? fields.tags
    : typeof fields.tags === "string"
    ? fields.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  const hasDiscount =
    fields.discountedPrice != null &&
    fields.price != null &&
    Number(fields.discountedPrice) <
      Number(fields.price);

  // ============================================
  // ADD TO CART
  // ============================================

  function handleAddToCart() {
    addItem({
      id: productId,
      title: fields.title,
      price: hasDiscount
        ? fields.discountedPrice
        : fields.price,
      image: imageUrl(images[0], 400),
    });

    openCart();
  }

  // ============================================
  // IMAGE ZOOM
  // ============================================

  function handleMouseMove(e) {
    const rect =
      e.currentTarget.getBoundingClientRect();

    const x =
      ((e.clientX - rect.left) / rect.width) *
      100;

    const y =
      ((e.clientY - rect.top) / rect.height) *
      100;

    setMousePos({ x, y });
  }

  // ============================================
  // PAGE
  // ============================================

  return (
    <div>
      <Header />

      {/* NOTIFICATION */}

      {toast && (
        <div
          key={toast.id}
          className={`norden-toast norden-toast--${toast.type}`}
          role={
            toast.type === "error"
              ? "alert"
              : "status"
          }
        >
          <div className="norden-toast__icon">
            {toast.type === "success"
              ? "♥"
              : toast.type === "removed"
              ? "♡"
              : "!"}
          </div>

          <div className="norden-toast__content">
            <strong>{toast.title}</strong>
            <p>{toast.message}</p>

            {toast.type === "success" && (
              <Link href="/likes">
                View my likes
              </Link>
            )}
          </div>

          <button
            type="button"
            className="norden-toast__close"
            onClick={() => setToast(null)}
            aria-label="Close notification"
          >
            ✕
          </button>

          <div className="norden-toast__progress" />
        </div>
      )}

      <div className="sd-wrapper">
        {/* GALLERY */}

        <div className="sd-gallery">
          <div className="sd-thumbs">
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                className={`sd-thumb ${
                  i === activeImage ? "active" : ""
                }`}
                onClick={() => {
                  setActiveImage(i);
                  setZoom(false);
                }}
              >
                {imageUrl(img, 120) && (
                  <img
                    src={imageUrl(img, 120)}
                    alt={`Dining table view ${i + 1}`}
                  />
                )}
              </button>
            ))}
          </div>

          <div
            className={`sd-main-image ${
              zoom ? "zoomed" : ""
            }`}
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
            onMouseMove={handleMouseMove}
          >
            {images[activeImage] &&
              imageUrl(images[activeImage], 1200) && (
                <img
                  src={imageUrl(
                    images[activeImage],
                    1200
                  )}
                  alt={
                    fields.title || "Dining Table"
                  }
                  style={
                    zoom
                      ? {
                          transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                          transform: "scale(2)",
                        }
                      : {}
                  }
                />
              )}
          </div>
        </div>

        {/* PRODUCT INFORMATION */}

        <div className="sd-info">
          {tagList[0] && (
            <span className="sd-badge">
              {tagList[0]}
            </span>
          )}

          <h1 className="sd-title">
            {fields.title}
          </h1>

          {/* PRICE */}

          <div className="sd-price">
            {hasDiscount ? (
              <>
                <span className="sd-price-current">
                  {formatPrice(
                    fields.discountedPrice
                  )}
                </span>

                <span className="sd-price-original">
                  {formatPrice(fields.price)}
                </span>
              </>
            ) : (
              <span className="sd-price-current">
                {formatPrice(fields.price)}
              </span>
            )}
          </div>

          {/* DESCRIPTION */}

          {fields.description && (
            <p className="sd-desc">
              {fields.description}
            </p>
          )}

          {/* PRODUCT DETAILS */}

          <div className="sd-meta">
            {fields.material && (
              <div className="sd-meta-row">
                <span>Material</span>
                <span>{fields.material}</span>
              </div>
            )}

            <div className="sd-meta-row">
              <span>Availability</span>

              <span
                className={
                  fields.inStock ? "in" : "out"
                }
              >
                {fields.inStock
                  ? "In Stock"
                  : "Out of Stock"}
              </span>
            </div>
          </div>

          {/* ADD TO CART + LIKE BUTTON */}

          <div className="sd-action-row">
            <button
              type="button"
              className="sd-add-btn sd-cart-action"
              onClick={handleAddToCart}
              disabled={!fields.inStock}
            >
              {fields.inStock
                ? "Add to Cart"
                : "Out of Stock"}
            </button>

            <button
              type="button"
              className={`sd-like-btn ${
                isLiked ? "is-liked" : ""
              } ${
                heartAnimating
                  ? "is-animating"
                  : ""
              }`}
              onClick={handleToggleLike}
              disabled={
                loadingLike ||
                savingLike ||
                status === "loading"
              }
              aria-label={
                isLiked
                  ? "Remove from likes"
                  : "Add to likes"
              }
              aria-pressed={isLiked}
              title={
                isLiked
                  ? "Remove from likes"
                  : "Add to likes"
              }
            >
              {savingLike ? (
                <span className="sd-like-spinner" />
              ) : (
                <span className="sd-like-icon">
                  <HeartIcon filled={isLiked} />
                </span>
              )}
            </button>
          </div>

          {isLiked && !loadingLike && (
            <p className="sd-saved-text">
              <HeartIcon filled />
              Saved to your likes
            </p>
          )}
        </div>
      </div>

      <CartDrawer />
      <Footer />

      <style jsx global>{`
        /* =====================================
           ADD TO CART + LIKE
        ===================================== */

        .sd-action-row {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          align-items: stretch !important;
          gap: 12px !important;
          width: 100% !important;
          margin-top: 20px;
        }

        .sd-action-row .sd-cart-action {
          display: flex !important;
          align-items: center;
          justify-content: center;
          flex: 1 1 auto !important;
          width: auto !important;
          min-width: 0 !important;
          margin: 0 !important;
        }

        .sd-action-row .sd-like-btn {
          display: flex !important;
          align-items: center;
          justify-content: center;
          flex: 0 0 60px !important;
          width: 60px !important;
          min-width: 60px !important;
          height: 60px !important;
          min-height: 60px !important;
          padding: 0 !important;
          margin: 0 !important;
          border: 1px solid #d8d0c8 !important;
          background: #fbf9f4 !important;
          cursor: pointer;
          visibility: visible !important;
          opacity: 1 !important;
          transition:
            background 0.25s ease,
            border-color 0.25s ease;
        }

        .sd-like-btn:hover:not(:disabled) {
          background: #f2eae5 !important;
          border-color: #65000b !important;
        }

        .sd-like-btn.is-liked {
          background: #f5e9e9 !important;
          border-color: #65000b !important;
        }

        .sd-like-btn:disabled {
          cursor: wait;
        }

        .sd-like-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sd-like-btn.is-animating .sd-like-icon {
          animation: sd-heart-pop 0.5s ease;
        }

        .sd-like-spinner {
          width: 22px;
          height: 22px;
          border: 2px solid #ddd;
          border-top-color: #65000b;
          border-radius: 50%;
          animation: sd-spin 0.7s linear infinite;
        }

        .sd-saved-text {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 13px;
          font-size: 13px;
          color: #65000b;
        }

        .sd-saved-text svg {
          width: 15px;
          height: 15px;
        }

        @keyframes sd-heart-pop {
          0% {
            transform: scale(1);
          }

          30% {
            transform: scale(1.4);
          }

          55% {
            transform: scale(0.85);
          }

          100% {
            transform: scale(1);
          }
        }

        @keyframes sd-spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* =====================================
           NOTIFICATIONS
        ===================================== */

        .norden-toast {
          position: fixed;
          top: 125px;
          right: 25px;
          z-index: 99999;
          width: min(390px, calc(100vw - 32px));
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 19px 18px 22px;
          background: #fbf9f4;
          border: 1px solid #e9e2d8;
          box-shadow:
            0 12px 40px rgba(32, 20, 20, 0.12);
          overflow: hidden;
          animation:
            norden-toast-enter 0.35s ease both;
        }

        .norden-toast__icon {
          width: 39px;
          height: 39px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #f0e6e2;
          color: #65000b;
          font-size: 23px;
        }

        .norden-toast--removed
        .norden-toast__icon {
          background: #eeeae4;
          color: #514b45;
        }

        .norden-toast--error
        .norden-toast__icon {
          background: #fbe7e7;
          color: #b91c1c;
        }

        .norden-toast__content {
          flex: 1;
          min-width: 0;
        }

        .norden-toast__content strong {
          display: block;
          font-family:
            "Radley", Georgia, serif;
          font-size: 17px;
          font-weight: 400;
          color: #292523;
          margin-bottom: 5px;
        }

        .norden-toast__content p {
          margin: 0;
          font-size: 13px;
          line-height: 1.6;
          color: #77716c;
        }

        .norden-toast__content a {
          display: inline-block;
          margin-top: 9px;
          font-size: 12px;
          color: #65000b;
          text-decoration: underline;
        }

        .norden-toast__close {
          flex-shrink: 0;
          border: 0;
          background: transparent;
          cursor: pointer;
          color: #77716c;
        }

        .norden-toast__progress {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          width: 100%;
          background: #65000b;
          transform-origin: left;
          animation:
            norden-toast-progress 3.5s linear forwards;
        }

        @keyframes norden-toast-enter {
          from {
            opacity: 0;
            transform: translateX(35px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes norden-toast-progress {
          from {
            transform: scaleX(1);
          }

          to {
            transform: scaleX(0);
          }
        }

        /* =====================================
           MOBILE
        ===================================== */

        @media (max-width: 600px) {
          .sd-action-row {
            gap: 10px !important;
          }

          .sd-action-row .sd-like-btn {
            flex-basis: 54px !important;
            width: 54px !important;
            min-width: 54px !important;
            height: 54px !important;
            min-height: 54px !important;
          }

          .norden-toast {
            top: 85px;
            right: 16px;
            padding: 16px 15px 20px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .norden-toast__progress,
          .sd-like-btn.is-animating .sd-like-icon {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
