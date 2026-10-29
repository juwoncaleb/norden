
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

const PRODUCT_TYPE = "vases";

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
        item: JSON.parse(JSON.stringify(entry)),
      },
    };
  } catch (error) {
    console.error("VASE FETCH ERROR:", error);

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
// VASE DETAIL PAGE
// ============================================

export default function VasesDetailPage({ item }) {
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

  const productId = item?.sys?.id;
  const fields = item?.fields || {};

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
          "VASE WISHLIST LOAD ERROR:",
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
          ? "This vase has been saved."
          : "This vase has been removed."
      );
    } catch (error) {
      console.error(
        "VASE WISHLIST UPDATE ERROR:",
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
  // PAGE
  // ============================================

  return (
    <div className="norden-vase-detail">
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

      <main className="sd-wrapper">
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
                aria-label={`View vase image ${i + 1}`}
              >
                {imageUrl(img, 120) && (
                  <img
                    src={imageUrl(img, 120)}
                    alt={`Vase view ${i + 1}`}
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
                  alt={fields.title || "Vase"}
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
      </main>

      <CartDrawer />
      <Footer />

      {/* ============================================
          COMPLETE INLINE CSS
      ============================================ */}

      <style jsx global>{`
        /* PRODUCT LAYOUT */

        .norden-vase-detail .sd-wrapper {
          width: min(1400px, 94%);
          margin: 0 auto;
          padding: 65px 0 100px;
          display: grid;
          grid-template-columns:
            minmax(0, 1.2fr) minmax(0, 0.8fr);
          gap: clamp(35px, 6vw, 100px);
          align-items: start;
        }

        .norden-vase-detail .sd-gallery {
          display: grid;
          grid-template-columns: 80px minmax(0, 1fr);
          gap: 15px;
          min-width: 0;
        }

        .norden-vase-detail .sd-thumbs {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 650px;
          overflow-y: auto;
        }

        .norden-vase-detail .sd-thumb {
          width: 80px;
          aspect-ratio: 1;
          padding: 0;
          background: #f6f3ed;
          border: 1px solid transparent;
          cursor: pointer;
          overflow: hidden;
        }

        .norden-vase-detail .sd-thumb.active {
          border-color: #8b3f1f;
        }

        .norden-vase-detail .sd-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .norden-vase-detail .sd-main-image {
          width: 100%;
          aspect-ratio: 0.9;
          max-height: 750px;
          background: #f6f3ed;
          overflow: hidden;
        }

        .norden-vase-detail .sd-main-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.2s ease;
        }

        .norden-vase-detail .sd-main-image.zoomed {
          cursor: zoom-in;
        }

        .norden-vase-detail .sd-info {
          min-width: 0;
          padding-top: 10px;
        }

        .norden-vase-detail .sd-badge {
          display: inline-block;
          margin-bottom: 18px;
          color: #8b3f1f;
          font-size: 11px;
          letter-spacing: 1.6px;
          text-transform: uppercase;
        }

        .norden-vase-detail .sd-title {
          margin: 0 0 18px;
          font-family: "Radley", Georgia, serif;
          font-size: clamp(30px, 3vw, 48px);
          font-weight: 400;
          line-height: 1.18;
          color: #292523;
        }

        .norden-vase-detail .sd-price {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 25px;
        }

        .norden-vase-detail .sd-price-current {
          font-size: 23px;
          color: #292523;
        }

        .norden-vase-detail .sd-price-original {
          font-size: 17px;
          color: #99918a;
          text-decoration: line-through;
        }

        .norden-vase-detail .sd-desc {
          margin: 0 0 28px;
          color: #665e57;
          font-size: 15px;
          line-height: 1.9;
          white-space: pre-line;
        }

        .norden-vase-detail .sd-meta {
          border-top: 1px solid #e7e0d8;
          border-bottom: 1px solid #e7e0d8;
          padding: 18px 0;
        }

        .norden-vase-detail .sd-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 8px 0;
          font-size: 14px;
        }

        .norden-vase-detail .sd-meta-row > span:first-child {
          color: #817870;
        }

        .norden-vase-detail .sd-meta-row > span:last-child {
          color: #292523;
          text-align: right;
        }

        .norden-vase-detail .sd-meta-row .in {
          color: #37754b !important;
        }

        .norden-vase-detail .sd-meta-row .out {
          color: #b33c3c !important;
        }

        /* ACTION ROW */

        html body .norden-vase-detail .sd-action-row {
          display: grid !important;
          grid-template-columns:
            minmax(0, 1fr) 60px !important;
          align-items: stretch !important;
          gap: 12px !important;
          width: 100% !important;
          margin: 24px 0 0 !important;
          padding: 0 !important;
          box-sizing: border-box !important;
        }

        /* ADD TO CART */

        html body .norden-vase-detail
        .sd-action-row button.sd-cart-action {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 100% !important;
          min-width: 0 !important;
          height: 60px !important;
          min-height: 60px !important;
          margin: 0 !important;
          padding: 0 16px !important;
          background: #8b3f1f !important;
          color: #ffffff !important;
          border: 1px solid #8b3f1f !important;
          border-radius: 0 !important;
          font-family: inherit !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          letter-spacing: 1px !important;
          text-transform: uppercase !important;
          cursor: pointer !important;
          box-shadow: none !important;
          transition: background 0.25s ease !important;
        }

        html body .norden-vase-detail
        .sd-action-row button.sd-cart-action:hover:not(:disabled) {
          background: #6f3017 !important;
          border-color: #6f3017 !important;
        }

        html body .norden-vase-detail
        .sd-action-row button.sd-cart-action:disabled {
          background: #c8b7ad !important;
          border-color: #c8b7ad !important;
          cursor: not-allowed !important;
        }

        /* LIKE BUTTON */

        html body .norden-vase-detail
        .sd-action-row button.sd-like-btn {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 60px !important;
          min-width: 60px !important;
          height: 60px !important;
          min-height: 60px !important;
          margin: 0 !important;
          padding: 0 !important;
          background: #fff !important;
          border: 1px solid #8b3f1f !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          cursor: pointer !important;
          transition: background 0.25s ease !important;
        }

        html body .norden-vase-detail
        .sd-action-row button.sd-like-btn:hover:not(:disabled),
        html body .norden-vase-detail
        .sd-action-row button.sd-like-btn.is-liked {
          background: #f8eee8 !important;
        }

        .norden-vase-detail .sd-like-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
        }

        .norden-vase-detail .sd-like-icon svg {
          display: block;
          width: 24px;
          height: 24px;
          stroke: #8b3f1f;
        }

        .norden-vase-detail
        .sd-like-btn.is-animating .sd-like-icon {
          animation: vase-heart-pop 0.5s ease;
        }

        /* SPINNER */

        .norden-vase-detail .sd-like-spinner {
          display: block;
          width: 22px;
          height: 22px;
          border: 2px solid #e4d3c9;
          border-top-color: #8b3f1f;
          border-radius: 50%;
          animation: vase-spin 0.7s linear infinite;
        }

        @keyframes vase-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes vase-heart-pop {
          0%, 100% {
            transform: scale(1);
          }

          30% {
            transform: scale(1.4);
          }

          55% {
            transform: scale(0.85);
          }
        }

        /* SAVED MESSAGE */

        .norden-vase-detail .sd-saved-text {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 13px;
          color: #8b3f1f;
          font-size: 13px;
        }

        .norden-vase-detail .sd-saved-text svg {
          width: 15px;
          height: 15px;
          fill: #8b3f1f;
        }

        .norden-vase-detail .sd-saved-text a {
          color: #8b3f1f;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        /* NOTIFICATIONS */

        .norden-toast {
          position: fixed;
          top: 125px;
          right: 25px;
          z-index: 99999;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          width: min(390px, calc(100vw - 32px));
          padding: 19px 18px 22px;
          background: #fbf9f4;
          border: 1px solid #e9e2d8;
          box-shadow: 0 12px 40px rgba(32, 20, 20, 0.12);
          overflow: hidden;
          box-sizing: border-box;
          animation: vase-toast-enter 0.35s ease both;
        }

        .norden-toast__icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 39px;
          height: 39px;
          border-radius: 50%;
          background: #f8eee8;
          color: #8b3f1f;
          font-size: 23px;
        }

        .norden-toast--removed .norden-toast__icon {
          background: #eeeae4;
          color: #514b45;
        }

        .norden-toast--error .norden-toast__icon {
          background: #fbe7e7;
          color: #b91c1c;
        }

        .norden-toast__content {
          flex: 1;
          min-width: 0;
        }

        .norden-toast__content strong {
          display: block;
          margin-bottom: 5px;
          font-family: "Radley", Georgia, serif;
          font-size: 17px;
          font-weight: 400;
          color: #292523;
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
          color: #8b3f1f;
          font-size: 12px;
          text-decoration: underline;
        }

        .norden-toast__close {
          flex-shrink: 0;
          border: 0;
          background: transparent;
          color: #77716c;
          cursor: pointer;
        }

        .norden-toast__progress {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: #8b3f1f;
          transform-origin: left;
          animation: vase-toast-progress 3.5s linear forwards;
        }

        .norden-toast--removed .norden-toast__progress {
          background: #aaa198;
        }

        .norden-toast--error .norden-toast__progress {
          background: #b91c1c;
        }

        @keyframes vase-toast-enter {
          from {
            opacity: 0;
            transform: translateX(35px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes vase-toast-progress {
          from {
            transform: scaleX(1);
          }

          to {
            transform: scaleX(0);
          }
        }

        /* TABLET */

        @media (max-width: 1024px) {
          .norden-vase-detail .sd-wrapper {
            gap: 35px;
            padding: 45px 0 70px;
          }

          .norden-vase-detail .sd-gallery {
            grid-template-columns:
              65px minmax(0, 1fr);
            gap: 10px;
          }

          .norden-vase-detail .sd-thumb {
            width: 65px;
          }

          html body .norden-vase-detail .sd-action-row {
            grid-template-columns:
              minmax(0, 1fr) 56px !important;
            gap: 10px !important;
          }

          html body .norden-vase-detail
          .sd-action-row button.sd-cart-action,
          html body .norden-vase-detail
          .sd-action-row button.sd-like-btn {
            height: 56px !important;
            min-height: 56px !important;
          }

          html body .norden-vase-detail
          .sd-action-row button.sd-like-btn {
            width: 56px !important;
            min-width: 56px !important;
          }
        }

        /* MOBILE */

        @media (max-width: 700px) {
          .norden-vase-detail .sd-wrapper {
            display: flex;
            flex-direction: column;
            width: 100%;
            padding: 20px 0 65px;
            gap: 30px;
          }

          .norden-vase-detail .sd-gallery {
            display: flex;
            flex-direction: column-reverse;
            width: 100%;
            gap: 12px;
          }

          .norden-vase-detail .sd-main-image {
            aspect-ratio: 1;
            max-height: none;
          }

          .norden-vase-detail .sd-main-image img {
            transform: none !important;
          }

          .norden-vase-detail .sd-thumbs {
            flex-direction: row;
            overflow-x: auto;
            max-height: none;
            padding: 0 16px 5px;
          }

          .norden-vase-detail .sd-thumb {
            flex: 0 0 70px;
            width: 70px;
          }

          .norden-vase-detail .sd-info {
            width: 100%;
            padding: 0 20px;
            box-sizing: border-box;
          }

          .norden-vase-detail .sd-title {
            font-size: 32px;
          }

          html body .norden-vase-detail .sd-action-row {
            grid-template-columns:
              minmax(0, 1fr) 52px !important;
            gap: 10px !important;
            margin-top: 20px !important;
          }

          html body .norden-vase-detail
          .sd-action-row button.sd-cart-action {
            height: 52px !important;
            min-height: 52px !important;
            font-size: 12px !important;
            padding: 0 10px !important;
          }

          html body .norden-vase-detail
          .sd-action-row button.sd-like-btn {
            width: 52px !important;
            min-width: 52px !important;
            height: 52px !important;
            min-height: 52px !important;
          }

          .norden-toast {
            top: 85px;
            right: 16px;
            padding: 16px 15px 20px;
          }
        }

        /* SMALL PHONES */

        @media (max-width: 360px) {
          html body .norden-vase-detail .sd-action-row {
            grid-template-columns:
              minmax(0, 1fr) 48px !important;
            gap: 8px !important;
          }

          html body .norden-vase-detail
          .sd-action-row button.sd-cart-action,
          html body .norden-vase-detail
          .sd-action-row button.sd-like-btn {
            height: 48px !important;
            min-height: 48px !important;
          }

          html body .norden-vase-detail
          .sd-action-row button.sd-like-btn {
            width: 48px !important;
            min-width: 48px !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .norden-vase-detail
          .sd-like-btn.is-animating .sd-like-icon,
          .norden-toast,
          .norden-toast__progress {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
