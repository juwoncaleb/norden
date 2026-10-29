
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

const PRODUCT_TYPE = "sofa";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

// ============================================
// FETCH PRODUCT
// ============================================

export async function getServerSideProps({ params }) {
  try {
    const entry = await client.getEntry(params.id);

    return {
      props: {
        sofa: JSON.parse(JSON.stringify(entry)),
      },
    };
  } catch (error) {
    console.error("SOFA FETCH ERROR:", error);

    return {
      props: {
        sofa: null,
      },
    };
  }
}

// ============================================
// HELPERS
// ============================================

function formatPrice(value) {
  if (value == null) return "";

  const amount = Number(value);

  if (!Number.isFinite(amount)) return "";

  return (
    "₦" +
    new Intl.NumberFormat("en-NG", {
      maximumFractionDigits: 0,
    }).format(amount)
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

async function wishlistRequest(method, body) {
  const response = await fetch("/api/wishlist", {
    method,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(body
        ? { "Content-Type": "application/json" }
        : {}),
    },
    ...(body
      ? { body: JSON.stringify(body) }
      : {}),
  });

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
      fill={filled ? "#8B3F1F" : "none"}
      stroke="#8B3F1F"
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
// SOFA DETAIL PAGE
// ============================================

export default function SofaDetailPage({ sofa }) {
  const { status } = useSession();

  // Gallery
  const [activeImage, setActiveImage] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [mousePos, setMousePos] = useState({
    x: 50,
    y: 50,
  });

  // Wishlist
  const [isLiked, setIsLiked] = useState(false);
  const [loadingLike, setLoadingLike] = useState(true);
  const [savingLike, setSavingLike] = useState(false);
  const [heartAnimating, setHeartAnimating] =
    useState(false);

  // Notifications
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

  const productId = sofa?.sys?.id;
  const fields = sofa?.fields || {};

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

  const inStock = fields.inStock === true;

  // ============================================
  // NOTIFICATIONS
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

  function closeToast() {
    clearTimeout(toastTimer.current);
    setToast(null);
  }

  // ============================================
  // LOAD SAVED LIKES
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
        const data = await wishlistRequest("GET");

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
        console.error(
          "SOFA WISHLIST LOAD ERROR:",
          error
        );

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
  }, [productId, status]);

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
      const data = await wishlistRequest(
        isLiked ? "DELETE" : "POST",
        {
          productId,
          productType: PRODUCT_TYPE,
        }
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
          ? "This sofa has been saved."
          : "This sofa has been removed."
      );
    } catch (error) {
      console.error(
        "SOFA WISHLIST UPDATE ERROR:",
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
  // ADD TO CART
  // ============================================

  function handleAddToCart() {
    if (!productId || !inStock) return;

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
  // PRODUCT NOT FOUND
  // ============================================

  if (!sofa) {
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
  // PAGE
  // ============================================

  return (
    <div>
      <Header />

      {/* WISHLIST NOTIFICATION */}

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
            onClick={closeToast}
            aria-label="Close notification"
          >
            ✕
          </button>

          <div className="norden-toast__progress" />
        </div>
      )}

      {/* PRODUCT LAYOUT */}

      <div className="sd-wrapper">
        {/* IMAGE GALLERY */}

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
                aria-label={`View sofa image ${i + 1}`}
              >
                {imageUrl(img, 120) && (
                  <img
                    src={imageUrl(img, 120)}
                    alt={`Sofa view ${i + 1}`}
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
                  alt={fields.title || "Sofa"}
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

          {typeof fields.description === "string" &&
            fields.description && (
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
                className={inStock ? "in" : "out"}
              >
                {inStock
                  ? "In Stock"
                  : "Out of Stock"}
              </span>
            </div>
          </div>

          {/* ADD TO CART + LIKE */}

          <div className="sd-action-row">
            <button
              type="button"
              className="sd-add-btn sd-cart-action"
              onClick={handleAddToCart}
              disabled={!inStock}
            >
              {inStock
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

          {/* SAVED MESSAGE */}

          {isLiked && !loadingLike && (
            <p className="sd-saved-text">
              <HeartIcon filled />
              Saved to your likes
              <Link href="/likes">
                View likes
              </Link>
            </p>
          )}
        </div>
      </div>

      <CartDrawer />
      <Footer />

      {/* ============================================
          COMPLETE INLINE BUTTON + TOAST CSS
      ============================================ */}

      <style jsx global>{`
        /* =====================================
           ACTION ROW
        ===================================== */

        html body .sd-info .sd-action-row {
          display: grid !important;
          grid-template-columns:
            minmax(0, 1fr) 60px !important;
          align-items: stretch !important;
          justify-content: stretch !important;
          gap: 12px !important;
          width: 100% !important;
          max-width: 100% !important;
          margin: 24px 0 0 !important;
          padding: 0 !important;
          box-sizing: border-box !important;
        }

        /* =====================================
           ADD TO CART BUTTON
        ===================================== */

        html body .sd-info
        .sd-action-row button.sd-cart-action {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          flex: none !important;
          width: 100% !important;
          min-width: 0 !important;
          max-width: none !important;
          height: 60px !important;
          min-height: 60px !important;
          margin: 0 !important;
          padding: 0 16px !important;
          background-color: #8b3f1f !important;
          background-image: none !important;
          color: #ffffff !important;
          border: 1px solid #8b3f1f !important;
          border-radius: 0 !important;
          font-family: inherit !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          line-height: 1.2 !important;
          letter-spacing: 1px !important;
          text-align: center !important;
          text-transform: uppercase !important;
          box-shadow: none !important;
          transform: none !important;
          cursor: pointer !important;
          box-sizing: border-box !important;
          transition:
            background-color 0.25s ease,
            border-color 0.25s ease !important;
        }

        html body .sd-info
        .sd-action-row button.sd-cart-action:hover:not(:disabled) {
          background-color: #6f3017 !important;
          border-color: #6f3017 !important;
          color: #ffffff !important;
        }

        html body .sd-info
        .sd-action-row button.sd-cart-action:disabled {
          background-color: #c8b7ad !important;
          border-color: #c8b7ad !important;
          color: #ffffff !important;
          cursor: not-allowed !important;
        }

        /* =====================================
           LIKE BUTTON
        ===================================== */

        html body .sd-info
        .sd-action-row button.sd-like-btn {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          flex: none !important;
          width: 60px !important;
          min-width: 60px !important;
          max-width: 60px !important;
          height: 60px !important;
          min-height: 60px !important;
          margin: 0 !important;
          padding: 0 !important;
          background-color: #ffffff !important;
          background-image: none !important;
          border: 1px solid #8b3f1f !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          transform: none !important;
          cursor: pointer !important;
          visibility: visible !important;
          opacity: 1 !important;
          box-sizing: border-box !important;
          transition:
            background-color 0.25s ease,
            border-color 0.25s ease !important;
        }

        html body .sd-info
        .sd-action-row button.sd-like-btn:hover:not(:disabled) {
          background-color: #f8eee8 !important;
        }

        html body .sd-info
        .sd-action-row button.sd-like-btn.is-liked {
          background-color: #f8eee8 !important;
          border-color: #8b3f1f !important;
        }

        html body .sd-info
        .sd-action-row button.sd-like-btn:disabled {
          cursor: wait !important;
        }

        /* =====================================
           HEART ICON
        ===================================== */

        html body .sd-info
        .sd-action-row .sd-like-icon {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 24px !important;
          height: 24px !important;
        }

        html body .sd-info
        .sd-action-row .sd-like-icon svg {
          display: block !important;
          width: 24px !important;
          height: 24px !important;
          stroke: #8b3f1f !important;
        }

        html body .sd-info
        .sd-action-row .sd-like-btn.is-liked svg {
          fill: #8b3f1f !important;
          stroke: #8b3f1f !important;
        }

        html body .sd-info
        .sd-action-row .sd-like-btn:not(.is-liked) svg {
          fill: none !important;
          stroke: #8b3f1f !important;
        }

        /* =====================================
           LOADING SPINNER
        ===================================== */

        html body .sd-info
        .sd-action-row .sd-like-spinner {
          display: block !important;
          width: 22px !important;
          height: 22px !important;
          border: 2px solid #e4d3c9 !important;
          border-top-color: #8b3f1f !important;
          border-radius: 50% !important;
          animation:
            sofa-spin 0.7s linear infinite;
        }

        @keyframes sofa-spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* =====================================
           HEART ANIMATION
        ===================================== */

        .sd-info
        .sd-like-btn.is-animating
        .sd-like-icon {
          animation:
            sofa-heart-pop 0.5s ease;
        }

        @keyframes sofa-heart-pop {
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

        /* =====================================
           SAVED MESSAGE
        ===================================== */

        html body .sd-info .sd-saved-text {
          display: flex !important;
          align-items: center !important;
          flex-wrap: wrap !important;
          gap: 8px !important;
          margin-top: 13px !important;
          color: #8b3f1f !important;
          font-size: 13px !important;
        }

        html body .sd-info .sd-saved-text svg {
          width: 15px !important;
          height: 15px !important;
          fill: #8b3f1f !important;
          stroke: #8b3f1f !important;
        }

        html body .sd-info .sd-saved-text a {
          color: #8b3f1f !important;
          text-decoration: underline !important;
          text-underline-offset: 3px;
        }

        /* =====================================
           TOAST NOTIFICATIONS
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
            sofa-toast-enter 0.35s ease both;
        }

        .norden-toast__icon {
          width: 39px;
          height: 39px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #f8eee8;
          color: #8b3f1f;
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
          font-family: "Radley", Georgia, serif;
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
          color: #8b3f1f;
          text-decoration: underline;
          text-underline-offset: 3px;
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
          background: #8b3f1f;
          transform-origin: left;
          animation:
            sofa-toast-progress 3.5s linear forwards;
        }

        .norden-toast--removed
        .norden-toast__progress {
          background: #aaa198;
        }

        .norden-toast--error
        .norden-toast__progress {
          background: #b91c1c;
        }

        @keyframes sofa-toast-enter {
          from {
            opacity: 0;
            transform: translateX(35px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes sofa-toast-progress {
          from {
            transform: scaleX(1);
          }

          to {
            transform: scaleX(0);
          }
        }

        /* =====================================
           TABLET
        ===================================== */

        @media (max-width: 1024px) {
          html body .sd-info .sd-action-row {
            grid-template-columns:
              minmax(0, 1fr) 56px !important;
            gap: 10px !important;
          }

          html body .sd-info
          .sd-action-row button.sd-cart-action {
            height: 56px !important;
            min-height: 56px !important;
          }

          html body .sd-info
          .sd-action-row button.sd-like-btn {
            width: 56px !important;
            min-width: 56px !important;
            max-width: 56px !important;
            height: 56px !important;
            min-height: 56px !important;
          }
        }

        /* =====================================
           MOBILE
        ===================================== */

        @media (max-width: 600px) {
          html body .sd-info .sd-action-row {
            display: grid !important;
            grid-template-columns:
              minmax(0, 1fr) 52px !important;
            gap: 10px !important;
            width: 100% !important;
            margin-top: 20px !important;
          }

          html body .sd-info
          .sd-action-row button.sd-cart-action {
            width: 100% !important;
            min-width: 0 !important;
            height: 52px !important;
            min-height: 52px !important;
            padding: 0 10px !important;
            font-size: 12px !important;
            letter-spacing: 0.7px !important;
          }

          html body .sd-info
          .sd-action-row button.sd-like-btn {
            width: 52px !important;
            min-width: 52px !important;
            max-width: 52px !important;
            height: 52px !important;
            min-height: 52px !important;
          }

          html body .sd-info
          .sd-action-row .sd-like-icon svg {
            width: 22px !important;
            height: 22px !important;
          }

          .norden-toast {
            top: 85px;
            right: 16px;
            padding: 16px 15px 20px;
          }
        }

        /* =====================================
           SMALL PHONES
        ===================================== */

        @media (max-width: 360px) {
          html body .sd-info .sd-action-row {
            grid-template-columns:
              minmax(0, 1fr) 48px !important;
            gap: 8px !important;
          }

          html body .sd-info
          .sd-action-row button.sd-cart-action {
            height: 48px !important;
            min-height: 48px !important;
            font-size: 11px !important;
          }

          html body .sd-info
          .sd-action-row button.sd-like-btn {
            width: 48px !important;
            min-width: 48px !important;
            max-width: 48px !important;
            height: 48px !important;
            min-height: 48px !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .sd-info
          .sd-like-btn.is-animating
          .sd-like-icon,
          .norden-toast,
          .norden-toast__progress {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
