
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

const PRODUCT_TYPE = "diningChairs";

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
    console.error("DINING CHAIR FETCH ERROR:", error);

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
// DINING CHAIR DETAIL PAGE
// ============================================

export default function DiningChairsDetailPage({ item }) {
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

  // Notification
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
  // LOAD WISHLIST
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
  // TOGGLE LIKE
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
        throw new Error("Invalid wishlist response.");
      }

      setIsLiked(data.liked);
      animateHeart();

      showToast(
        data.liked ? "success" : "removed",
        data.liked
          ? "Added to your likes"
          : "Removed from your likes",
        data.liked
          ? "Dining chair saved successfully."
          : "Dining chair removed from your likes."
      );
    } catch (error) {
      console.error("WISHLIST UPDATE ERROR:", error);

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

        <main className="dc-not-found">
          <h1>Product not found</h1>

          <p>
            This dining chair could not be loaded.
          </p>

          <Link href="/diningchairs">
            Back to Dining Chairs
          </Link>
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

    setMousePos({
      x:
        ((e.clientX - rect.left) / rect.width) *
        100,
      y:
        ((e.clientY - rect.top) / rect.height) *
        100,
    });
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
              <Link
                href="/likes"
                className="norden-toast__link"
              >
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
                    alt={`Dining chair view ${i + 1}`}
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
                  alt={fields.title || "Dining Chair"}
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

        {/* PRODUCT INFO */}

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

          {/* META */}

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

          {/* ===================================
              ADD TO CART + LIKE
          =================================== */}

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

      {/* NOTIFICATION AND NOT FOUND STYLES */}

      <style jsx global>{`
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
          padding-top: 2px;
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

        .norden-toast__link {
          display: inline-block;
          margin-top: 9px;
          font-size: 12px;
          color: #65000b;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .norden-toast__close {
          flex-shrink: 0;
          border: 0;
          background: transparent;
          color: #77716c;
          cursor: pointer;
          padding: 3px;
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
            norden-progress 3.5s linear forwards;
        }

        .norden-toast--removed
        .norden-toast__progress {
          background: #aaa198;
        }

        .norden-toast--error
        .norden-toast__progress {
          background: #b91c1c;
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

        @keyframes norden-progress {
          from {
            transform: scaleX(1);
          }

          to {
            transform: scaleX(0);
          }
        }

        .dc-not-found {
          min-height: 65vh;
          padding: 100px 20px;
          text-align: center;
        }

        .dc-not-found h1 {
          font-family: "Radley", Georgia, serif;
          font-size: 35px;
          margin-bottom: 15px;
        }

        .dc-not-found p {
          margin-bottom: 20px;
          color: #777;
        }

        .dc-not-found a {
          color: #8B3F1F;
          text-decoration: underline;
        }

        @media (max-width: 600px) {
          .norden-toast {
            top: 85px;
            right: 16px;
            padding: 16px 15px 20px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .norden-toast,
          .norden-toast__progress {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
