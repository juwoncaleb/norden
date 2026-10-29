
import { useState, useEffect, useRef } from "react";
import { createClient } from "contentful";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";

import Header from "../component/Header";
import Footer from "../component/footer";
import CartDrawer from "../component/CartDrawer";
import { useCartStore } from "../../store/cartStore";

const PRODUCT_TYPE = "tvUnit";
const PRODUCT_LABEL = "TV unit";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

export async function getServerSideProps({ params }) {
  try {
    const entry = await client.getEntry(params.id);

    return {
      props: {
        item: JSON.parse(JSON.stringify(entry)),
      },
    };
  } catch (error) {
    console.error("TV UNIT FETCH ERROR:", error);
    return { props: { item: null } };
  }
}

function formatPrice(value) {
  const amount = Number(value);
  if (value == null || !Number.isFinite(amount)) return "";

  return `₦${amount.toLocaleString("en-NG", {
    maximumFractionDigits: 0,
  })}`;
}

function imageUrl(image, width) {
  const url = image?.fields?.file?.url;
  if (!url) return null;

  const full = url.startsWith("//") ? `https:${url}` : url;

  return width
    ? `${full}${full.includes("?") ? "&" : "?"}w=${width}`
    : full;
}

async function wishlistRequest(method, body) {
  const response = await fetch("/api/wishlist", {
    method,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new Error(data.error || "Unable to update wishlist.");
  }

  return data;
}

function HeartIcon({ filled = false }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={filled ? "#8b3f1f" : "none"}
      stroke="#8b3f1f"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  );
}

export default function TvUnitDetailPage({ item }) {
  const { status } = useSession();

  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const [activeImage, setActiveImage] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const [isLiked, setIsLiked] = useState(false);
  const [loadingLike, setLoadingLike] = useState(true);
  const [savingLike, setSavingLike] = useState(false);
  const [heartAnimating, setHeartAnimating] = useState(false);
  const [toast, setToast] = useState(null);

  const pending = useRef(false);
  const toastTimer = useRef(null);
  const heartTimer = useRef(null);

  const productId = item?.sys?.id;
  const fields = item?.fields || {};

  const images = Array.isArray(fields.images)
    ? fields.images
    : [];

  const tags = Array.isArray(fields.tags)
    ? fields.tags
    : typeof fields.tags === "string"
    ? fields.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
    : [];

  const hasDiscount =
    fields.discountedPrice != null &&
    fields.price != null &&
    Number(fields.discountedPrice) < Number(fields.price);

  const inStock = fields.inStock === true;

  function showToast(type, title, message) {
    clearTimeout(toastTimer.current);

    setToast({
      id: Date.now(),
      type,
      title,
      message,
    });

    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }

  useEffect(() => {
    let cancelled = false;

    if (!productId || status === "loading") return;

    if (status !== "authenticated") {
      setIsLiked(false);
      setLoadingLike(false);
      return;
    }

    async function loadLikes() {
      setLoadingLike(true);

      try {
        const data = await wishlistRequest("GET");

        if (!Array.isArray(data.likes)) {
          throw new Error("Invalid wishlist data.");
        }

        if (!cancelled) {
          setIsLiked(
            data.likes.some(
              (like) =>
                like.productId === productId &&
                like.productType === PRODUCT_TYPE
            )
          );
        }
      } catch (error) {
        console.error("TV UNIT WISHLIST ERROR:", error);
      } finally {
        if (!cancelled) setLoadingLike(false);
      }
    }

    loadLikes();

    return () => {
      cancelled = true;
    };
  }, [productId, status]);

  useEffect(() => {
    return () => {
      clearTimeout(toastTimer.current);
      clearTimeout(heartTimer.current);
    };
  }, []);

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
        throw new Error("Invalid wishlist response.");
      }

      setIsLiked(data.liked);

      setHeartAnimating(true);
      clearTimeout(heartTimer.current);
      heartTimer.current = setTimeout(
        () => setHeartAnimating(false),
        550
      );

      showToast(
        data.liked ? "success" : "removed",
        data.liked
          ? "Added to your likes"
          : "Removed from your likes",
        data.liked
          ? "This TV unit has been saved."
          : "This TV unit has been removed."
      );
    } catch (error) {
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

  function handleMouseMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();

    setMousePos({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  }

  if (!item) {
    return (
      <>
        <Header />
        <main style={{ padding: "100px 20px", textAlign: "center" }}>
          <h2>TV unit not found</h2>
          <Link href="/tvunit">Back to TV units</Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <div className="norden-detail-page">
      <Header />

      {toast && (
        <div
          key={toast.id}
          className={`norden-toast norden-toast--${toast.type}`}
          role={toast.type === "error" ? "alert" : "status"}
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
              <Link href="/likes">View my likes</Link>
            )}
          </div>

          <button
            type="button"
            className="norden-toast__close"
            aria-label="Close notification"
            onClick={() => setToast(null)}
          >
            ×
          </button>

          <div className="norden-toast__progress" />
        </div>
      )}

      <main className="sd-wrapper">
        <div className="sd-gallery">
          <div className="sd-thumbs">
            {images.map((img, index) => (
              <button
                key={index}
                type="button"
                className={`sd-thumb ${
                  activeImage === index ? "active" : ""
                }`}
                onClick={() => {
                  setActiveImage(index);
                  setZoom(false);
                }}
                aria-label={`View TV unit image ${index + 1}`}
              >
                {imageUrl(img, 150) && (
                  <img
                    src={imageUrl(img, 150)}
                    alt={`${fields.title} view ${index + 1}`}
                  />
                )}
              </button>
            ))}
          </div>

          <div
            className={`sd-main-image ${zoom ? "zoomed" : ""}`}
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
            onMouseMove={handleMouseMove}
          >
            {imageUrl(images[activeImage], 1200) ? (
              <img
                src={imageUrl(images[activeImage], 1200)}
                alt={fields.title || PRODUCT_LABEL}
                style={
                  zoom
                    ? {
                        transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                        transform: "scale(2)",
                      }
                    : {}
                }
              />
            ) : (
              <span className="sd-no-image">Image unavailable</span>
            )}
          </div>
        </div>

        <div className="sd-info">
          {tags[0] && <span className="sd-badge">{tags[0]}</span>}

          <h1 className="sd-title">{fields.title}</h1>

          <div className="sd-price">
            <span className="sd-price-current">
              {formatPrice(
                hasDiscount
                  ? fields.discountedPrice
                  : fields.price
              )}
            </span>

            {hasDiscount && (
              <span className="sd-price-original">
                {formatPrice(fields.price)}
              </span>
            )}
          </div>

          {typeof fields.description === "string" &&
            fields.description && (
              <p className="sd-desc">{fields.description}</p>
            )}

          <div className="sd-meta">
            {fields.material && (
              <div className="sd-meta-row">
                <span>Material</span>
                <span>{fields.material}</span>
              </div>
            )}

            <div className="sd-meta-row">
              <span>Availability</span>
              <span className={inStock ? "in" : "out"}>
                {inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>

          <div className="sd-action-row">
            <button
              type="button"
              className="sd-cart-action"
              disabled={!inStock}
              onClick={handleAddToCart}
            >
              {inStock ? "Add to Cart" : "Out of Stock"}
            </button>

            <button
              type="button"
              className={`sd-like-btn ${
                isLiked ? "is-liked" : ""
              } ${heartAnimating ? "is-animating" : ""}`}
              disabled={
                loadingLike ||
                savingLike ||
                status === "loading"
              }
              onClick={handleToggleLike}
              aria-label={
                isLiked ? "Remove from likes" : "Add to likes"
              }
              aria-pressed={isLiked}
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
              <Link href="/likes">View likes</Link>
            </p>
          )}
        </div>
      </main>

      <CartDrawer />
      <Footer />

      <style jsx global>{`
        .norden-detail-page {
          background: #fbf9f4;
          color: #292523;
          min-height: 100vh;
        }

        .norden-detail-page .sd-wrapper {
          width: min(1400px, 94%);
          margin: 0 auto;
          padding: 65px 0 110px;
          display: grid;
          grid-template-columns: minmax(0, 1.3fr) minmax(350px, 0.85fr);
          align-items: start;
          gap: clamp(40px, 6vw, 100px);
        }

        .norden-detail-page .sd-gallery {
          display: grid;
          grid-template-columns: 80px minmax(0, 1fr);
          gap: 16px;
          min-width: 0;
        }

        .norden-detail-page .sd-thumbs {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 650px;
          overflow-y: auto;
        }

        .norden-detail-page .sd-thumb {
          display: block;
          width: 80px;
          height: 95px;
          padding: 0;
          background: #eeeae4;
          border: 1px solid transparent;
          cursor: pointer;
          overflow: hidden;
        }

        .norden-detail-page .sd-thumb.active {
          border-color: #8b3f1f;
        }

        .norden-detail-page .sd-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .norden-detail-page .sd-main-image {
          position: relative;
          width: 100%;
          height: 650px;
          overflow: hidden;
          background: #eeeae4;
          cursor: zoom-in;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .norden-detail-page .sd-main-image img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          transition: transform 0.15s ease;
        }

        .norden-detail-page .sd-main-image.zoomed {
          cursor: zoom-out;
        }

        .norden-detail-page .sd-no-image {
          color: #77716c;
          font-size: 14px;
        }

        .norden-detail-page .sd-info {
          min-width: 0;
          padding-top: 12px;
        }

        .norden-detail-page .sd-badge {
          display: inline-block;
          margin-bottom: 20px;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #8b3f1f;
        }

        .norden-detail-page .sd-title {
          margin: 0 0 20px;
          font-family: "Radley", Georgia, serif;
          font-size: clamp(32px, 3vw, 52px);
          font-weight: 400;
          line-height: 1.15;
        }

        .norden-detail-page .sd-price {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 30px;
        }

        .norden-detail-page .sd-price-current {
          font-size: 23px;
          font-weight: 500;
        }

        .norden-detail-page .sd-price-original {
          font-size: 17px;
          color: #9b938c;
          text-decoration: line-through;
        }

        .norden-detail-page .sd-desc {
          font-size: 15px;
          line-height: 1.9;
          color: #68615b;
          margin: 0 0 35px;
          white-space: pre-line;
        }

        .norden-detail-page .sd-meta {
          border-top: 1px solid #e4ded5;
          border-bottom: 1px solid #e4ded5;
          padding: 10px 0;
        }

        .norden-detail-page .sd-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 13px 0;
          font-size: 14px;
        }

        .norden-detail-page .sd-meta-row > span:first-child {
          color: #827a73;
        }

        .norden-detail-page .sd-meta-row .in {
          color: #42734c;
        }

        .norden-detail-page .sd-meta-row .out {
          color: #a13c30;
        }

        html body .norden-detail-page .sd-action-row {
          display: grid !important;
          grid-template-columns: minmax(0, 1fr) 60px !important;
          gap: 12px !important;
          align-items: stretch !important;
          width: 100% !important;
          margin: 24px 0 0 !important;
        }

        html body .norden-detail-page .sd-cart-action {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          width: 100% !important;
          min-width: 0 !important;
          height: 60px !important;
          padding: 0 15px !important;
          background: #8b3f1f !important;
          color: #fff !important;
          border: 1px solid #8b3f1f !important;
          border-radius: 0 !important;
          font: inherit !important;
          font-size: 14px !important;
          letter-spacing: 1px !important;
          text-transform: uppercase !important;
          cursor: pointer !important;
          transition: background 0.25s ease !important;
        }

        html body .norden-detail-page .sd-cart-action:hover:not(:disabled) {
          background: #6f3017 !important;
        }

        html body .norden-detail-page .sd-cart-action:disabled {
          background: #c8b7ad !important;
          border-color: #c8b7ad !important;
          cursor: not-allowed !important;
        }

        html body .norden-detail-page .sd-like-btn {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 60px !important;
          min-width: 60px !important;
          height: 60px !important;
          margin: 0 !important;
          padding: 0 !important;
          background: #fff !important;
          border: 1px solid #8b3f1f !important;
          border-radius: 0 !important;
          cursor: pointer !important;
          transition: background 0.25s ease !important;
        }

        html body .norden-detail-page .sd-like-btn:hover,
        html body .norden-detail-page .sd-like-btn.is-liked {
          background: #f8eee8 !important;
        }

        .norden-detail-page .sd-like-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .norden-detail-page .sd-like-icon svg {
          width: 24px;
          height: 24px;
        }

        .norden-detail-page .sd-like-btn.is-animating .sd-like-icon {
          animation: norden-heart-pop 0.5s ease;
        }

        .norden-detail-page .sd-like-spinner {
          width: 22px;
          height: 22px;
          border: 2px solid #e4d3c9;
          border-top-color: #8b3f1f;
          border-radius: 50%;
          animation: norden-spin 0.7s linear infinite;
        }

        .norden-detail-page .sd-saved-text {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 14px;
          color: #8b3f1f;
          font-size: 13px;
        }

        .norden-detail-page .sd-saved-text svg {
          width: 15px;
          height: 15px;
        }

        .norden-detail-page .sd-saved-text a {
          color: #8b3f1f;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

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
          animation: norden-toast-enter 0.35s ease both;
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
        }

        .norden-toast__content p {
          margin: 0;
          color: #77716c;
          font-size: 13px;
          line-height: 1.6;
        }

        .norden-toast__content a {
          display: inline-block;
          margin-top: 9px;
          color: #8b3f1f;
          font-size: 12px;
          text-decoration: underline;
        }

        .norden-toast__close {
          border: none;
          background: transparent;
          color: #77716c;
          font-size: 20px;
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
          animation: norden-toast-progress 3.5s linear forwards;
        }

        .norden-toast--error .norden-toast__progress {
          background: #b91c1c;
        }

        @keyframes norden-spin {
          to { transform: rotate(360deg); }
        }

        @keyframes norden-heart-pop {
          0%, 100% { transform: scale(1); }
          30% { transform: scale(1.4); }
          55% { transform: scale(0.85); }
        }

        @keyframes norden-toast-enter {
          from { opacity: 0; transform: translateX(35px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes norden-toast-progress {
          to { transform: scaleX(0); }
        }

        @media (max-width: 1024px) {
          .norden-detail-page .sd-wrapper {
            grid-template-columns: minmax(0, 1fr) minmax(300px, 0.9fr);
            gap: 30px;
          }

          .norden-detail-page .sd-gallery {
            grid-template-columns: 65px minmax(0, 1fr);
            gap: 10px;
          }

          .norden-detail-page .sd-thumb {
            width: 65px;
            height: 80px;
          }

          .norden-detail-page .sd-main-image {
            height: 520px;
          }
        }

        @media (max-width: 767px) {
          .norden-detail-page .sd-wrapper {
            display: flex;
            flex-direction: column;
            gap: 30px;
            padding: 25px 0 65px;
          }

          .norden-detail-page .sd-gallery {
            width: 100%;
            display: flex;
            flex-direction: column-reverse;
          }

          .norden-detail-page .sd-thumbs {
            flex-direction: row;
            overflow-x: auto;
            max-height: none;
            padding-bottom: 5px;
          }

          .norden-detail-page .sd-thumb {
            flex: 0 0 68px;
            width: 68px;
            height: 78px;
          }

          .norden-detail-page .sd-main-image {
            height: auto;
            aspect-ratio: 4 / 4.3;
            max-height: 550px;
          }

          .norden-detail-page .sd-main-image.zoomed img {
            transform: none !important;
          }

          .norden-detail-page .sd-info {
            width: 100%;
            padding-top: 0;
          }

          .norden-detail-page .sd-title {
            font-size: 34px;
          }

          .norden-detail-page .sd-price-current {
            font-size: 21px;
          }

          html body .norden-detail-page .sd-action-row {
            grid-template-columns: minmax(0, 1fr) 52px !important;
            gap: 10px !important;
          }

          html body .norden-detail-page .sd-cart-action,
          html body .norden-detail-page .sd-like-btn {
            height: 52px !important;
          }

          html body .norden-detail-page .sd-like-btn {
            width: 52px !important;
            min-width: 52px !important;
          }

          .norden-toast {
            top: 85px;
            right: 16px;
          }
        }

        @media (max-width: 360px) {
          html body .norden-detail-page .sd-action-row {
            grid-template-columns: minmax(0, 1fr) 48px !important;
            gap: 8px !important;
          }

          html body .norden-detail-page .sd-cart-action,
          html body .norden-detail-page .sd-like-btn {
            height: 48px !important;
          }

          html body .norden-detail-page .sd-like-btn {
            width: 48px !important;
            min-width: 48px !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .norden-detail-page .sd-like-icon,
          .norden-toast,
          .norden-toast__progress {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
