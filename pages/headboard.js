
import { createClient } from "contentful";
import Header from "./component/Header";
import Footer from "./component/footer";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSession, signIn } from "next-auth/react";

// ============================================
// CONFIGURATION
// ============================================

const PRODUCT_TYPE = "headboard";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

// ============================================
// FETCH HEADBOARDS
// ============================================

export async function getServerSideProps() {
  try {
    const pageSize = 100;
    let skip = 0;
    let total = Infinity;
    const items = [];

    while (skip < total) {
      const response = await client.getEntries({
        content_type: PRODUCT_TYPE,
        limit: pageSize,
        skip,
        order: ["fields.title"],
      });

      total = response.total;
      items.push(...response.items);
      skip += response.items.length;

      if (!response.items.length) break;
    }

    return {
      props: {
        items: JSON.parse(JSON.stringify(items)),
      },
    };
  } catch (error) {
    console.error("HEADBOARDS FETCH ERROR:", error);

    return {
      props: {
        items: [],
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

function imageUrl(image) {
  const url = image?.fields?.file?.url;

  if (!url) return null;

  return url.startsWith("//")
    ? `https:${url}`
    : url;
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
      width="23"
      height="23"
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
// HEADBOARD LIST PAGE
// ============================================

export default function HeadboardListPage({
  items = [],
}) {
  const { data: session, status } = useSession();

  const [likedIds, setLikedIds] = useState([]);
  const [loadingLikes, setLoadingLikes] =
    useState(true);
  const [savingIds, setSavingIds] = useState([]);
  const [animatedIds, setAnimatedIds] = useState([]);
  const [toast, setToast] = useState(null);

  const pending = useRef(new Set());
  const toastTimer = useRef(null);
  const animationTimers = useRef(new Map());

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
  // LOAD SAVED LIKES
  // ============================================

  useEffect(() => {
    let cancelled = false;

    if (status === "loading") {
      setLoadingLikes(true);
      return;
    }

    if (status !== "authenticated") {
      setLikedIds([]);
      setLoadingLikes(false);
      return;
    }

    async function loadWishlist() {
      setLoadingLikes(true);

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

        const ids = data.likes
          .filter(
            (like) =>
              like.productType === PRODUCT_TYPE
          )
          .map((like) => like.productId);

        if (!cancelled) {
          setLikedIds(ids);
        }
      } catch (error) {
        console.error(
          "HEADBOARD WISHLIST LOAD ERROR:",
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
          setLoadingLikes(false);
        }
      }
    }

    loadWishlist();

    return () => {
      cancelled = true;
    };
  }, [status, session?.user?.email]);

  // ============================================
  // CLEANUP
  // ============================================

  useEffect(() => {
    return () => {
      clearTimeout(toastTimer.current);

      animationTimers.current.forEach((timer) => {
        clearTimeout(timer);
      });

      animationTimers.current.clear();
    };
  }, []);

  // ============================================
  // HEART ANIMATION
  // ============================================

  function animateHeart(productId) {
    const existingTimer =
      animationTimers.current.get(productId);

    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    setAnimatedIds((previous) => [
      ...new Set([...previous, productId]),
    ]);

    const timer = setTimeout(() => {
      setAnimatedIds((previous) =>
        previous.filter((id) => id !== productId)
      );

      animationTimers.current.delete(productId);
    }, 550);

    animationTimers.current.set(productId, timer);
  }

  // ============================================
  // ADD / REMOVE LIKE
  // ============================================

  async function handleToggleLike(
    productId,
    productTitle
  ) {
    if (status === "loading") return;

    // Sign in first
    if (status !== "authenticated") {
      await signIn("google", {
        callbackUrl: window.location.href,
      });
      return;
    }

    if (
      loadingLikes ||
      pending.current.has(productId)
    ) {
      return;
    }

    pending.current.add(productId);

    setSavingIds((previous) => [
      ...previous,
      productId,
    ]);

    const currentlyLiked =
      likedIds.includes(productId);

    try {
      const response = await fetch("/api/wishlist", {
        method: currentlyLiked ? "DELETE" : "POST",
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

      setLikedIds((previous) =>
        data.liked
          ? [...new Set([...previous, productId])]
          : previous.filter(
              (id) => id !== productId
            )
      );

      animateHeart(productId);

      showToast(
        data.liked ? "success" : "removed",
        data.liked
          ? "Added to your likes"
          : "Removed from your likes",
        data.liked
          ? `${productTitle} has been saved.`
          : `${productTitle} has been removed.`
      );
    } catch (error) {
      console.error(
        "HEADBOARD WISHLIST UPDATE ERROR:",
        error
      );

      showToast(
        "error",
        "Unable to update wishlist",
        error.message
      );
    } finally {
      pending.current.delete(productId);

      setSavingIds((previous) =>
        previous.filter(
          (id) => id !== productId
        )
      );
    }
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
          className={`headboard-toast headboard-toast--${toast.type}`}
          role={
            toast.type === "error"
              ? "alert"
              : "status"
          }
        >
          <div className="headboard-toast__icon">
            {toast.type === "success"
              ? "♥"
              : toast.type === "removed"
              ? "♡"
              : "!"}
          </div>

          <div className="headboard-toast__content">
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
            className="headboard-toast__close"
            onClick={() => setToast(null)}
            aria-label="Close notification"
          >
            ✕
          </button>

          <div className="headboard-toast__progress" />
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-10 min-h-[70vh]">
        <h1 className="text-3xl font-serif mb-8">
          Headboards
        </h1>

        {items.length === 0 ? (
          <p className="text-gray-500 py-10 text-lg">
            No headboards found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {items.map((entry) => {
              const item = entry.fields || {};
              const productId = entry.sys.id;

              const coverUrl =
                imageUrl(item.images?.[0]) ||
                "/placeholder.jpg";

              const hasDiscount =
                item.discountedPrice != null &&
                item.price != null &&
                Number(item.discountedPrice) <
                  Number(item.price);

              const tagList = Array.isArray(
                item.tags
              )
                ? item.tags
                : typeof item.tags === "string"
                ? item.tags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean)
                : [];

              const isLiked =
                likedIds.includes(productId);

              const isSaving =
                savingIds.includes(productId);

              const isAnimating =
                animatedIds.includes(productId);

              return (
                <div
                  key={productId}
                  className="headboard-product-card group"
                >
                  {/* PRODUCT IMAGE */}

                  <div className="relative aspect-[4/3] w-full mb-3 bg-stone-100 overflow-hidden headboard-image-container">
                    {/* Image link is separate from Like button */}

                    <Link
                      href={`/headboard/${productId}`}
                      className="headboard-image-link"
                    >
                      <Image
                        src={coverUrl}
                        alt={
                          item.title ||
                          "Headboard image"
                        }
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition"
                      />
                    </Link>

                    {/* OUT OF STOCK */}

                    {!item.inStock && (
                      <span className="absolute left-3 top-3 bg-stone-900 text-stone-50 text-xs px-2.5 py-1 headboard-stock-badge">
                        Out of stock
                      </span>
                    )}

                    {/* LIKE BUTTON */}

                    <button
                      type="button"
                      className={`headboard-card-like ${
                        isLiked ? "is-liked" : ""
                      } ${
                        isAnimating
                          ? "is-animating"
                          : ""
                      }`}
                      onClick={() =>
                        handleToggleLike(
                          productId,
                          item.title || "Headboard"
                        )
                      }
                      disabled={
                        loadingLikes ||
                        isSaving ||
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
                      {isSaving ? (
                        <span className="headboard-card-spinner" />
                      ) : (
                        <span className="headboard-card-heart">
                          <HeartIcon filled={isLiked} />
                        </span>
                      )}
                    </button>
                  </div>

                  {/* PRODUCT TITLE */}

                  <Link
                    href={`/headboard/${productId}`}
                    className="headboard-title-link"
                  >
                    <h2 className="text-lg font-serif text-stone-900">
                      {item.title}
                    </h2>
                  </Link>

                  {/* MATERIAL */}

                  {item.material && (
                    <p className="text-sm text-stone-500 mt-1">
                      {item.material}
                    </p>
                  )}

                  {/* PRICE */}

                  <div className="mt-2 flex items-baseline gap-2">
                    {hasDiscount ? (
                      <>
                        <span className="text-base text-amber-800">
                          {formatPrice(
                            item.discountedPrice
                          )}
                        </span>

                        <span className="text-sm text-stone-400 line-through">
                          {formatPrice(item.price)}
                        </span>
                      </>
                    ) : (
                      <span className="text-base text-stone-900">
                        {formatPrice(item.price)}
                      </span>
                    )}
                  </div>

                  {/* TAGS */}

                  {tagList.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {tagList.map((tag) => (
                        <li
                          key={tag}
                          className="border border-stone-200 text-stone-500 text-xs px-2 py-0.5"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />

      <style jsx global>{`
        /* =====================================
           HEADBOARD PRODUCT CARD
        ===================================== */

        .headboard-product-card {
          position: relative;
          min-width: 0;
        }

        .headboard-image-container {
          position: relative;
          isolation: isolate;
        }

        .headboard-image-link {
          position: absolute;
          inset: 0;
          display: block;
          z-index: 1;
        }

        .headboard-image-link img {
          object-fit: cover;
        }

        .headboard-title-link {
          display: inline-block;
          text-decoration: none;
        }

        .headboard-title-link:hover h2 {
          color: #8B3F1F !important;
        }

        .headboard-stock-badge {
          z-index: 3;
          pointer-events: none;
        }

        /* =====================================
           LIKE BUTTON
           OVERRIDES TAILWIND STYLES
        ===================================== */

        html body .headboard-product-card
        button.headboard-card-like {
          position: absolute !important;
          top: 12px !important;
          right: 12px !important;
          z-index: 10 !important;

          display: flex !important;
          align-items: center !important;
          justify-content: center !important;

          width: 44px !important;
          min-width: 44px !important;
          max-width: 44px !important;

          height: 44px !important;
          min-height: 44px !important;

          margin: 0 !important;
          padding: 0 !important;

          background-color: #ffffff !important;
          background-image: none !important;

          border: 1px solid #e7d9d0 !important;
          border-radius: 50% !important;

          box-shadow:
            0 3px 14px rgba(0, 0, 0, 0.08) !important;

          cursor: pointer !important;
          visibility: visible !important;
          opacity: 1 !important;

          box-sizing: border-box !important;

          transition:
            background-color 0.25s ease,
            border-color 0.25s ease,
            box-shadow 0.25s ease !important;
        }

        html body .headboard-product-card
        button.headboard-card-like:hover:not(:disabled) {
          background-color: #f8eee8 !important;
          border-color: #8B3F1F !important;
          box-shadow:
            0 4px 18px rgba(139, 63, 31, 0.16) !important;
        }

        html body .headboard-product-card
        button.headboard-card-like.is-liked {
          background-color: #f8eee8 !important;
          border-color: #8B3F1F !important;
        }

        html body .headboard-product-card
        button.headboard-card-like:disabled {
          cursor: wait !important;
        }

        /* HEART ICON */

        html body .headboard-card-heart {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;

          width: 23px !important;
          height: 23px !important;
        }

        html body .headboard-card-heart svg {
          display: block !important;
          width: 23px !important;
          height: 23px !important;
          stroke: #8B3F1F !important;
        }

        html body
        .headboard-card-like.is-liked
        .headboard-card-heart svg {
          fill: #8B3F1F !important;
          stroke: #8B3F1F !important;
        }

        html body
        .headboard-card-like:not(.is-liked)
        .headboard-card-heart svg {
          fill: none !important;
          stroke: #8B3F1F !important;
        }

        /* HEART ANIMATION */

        .headboard-card-like.is-animating
        .headboard-card-heart {
          animation:
            headboard-card-pop 0.5s ease;
        }

        @keyframes headboard-card-pop {
          0% {
            transform: scale(1);
          }

          30% {
            transform: scale(1.35);
          }

          55% {
            transform: scale(0.85);
          }

          100% {
            transform: scale(1);
          }
        }

        /* LOADING SPINNER */

        .headboard-card-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #e8d8ce;
          border-top-color: #8B3F1F;
          border-radius: 50%;
          animation:
            headboard-card-spin 0.7s linear infinite;
        }

        @keyframes headboard-card-spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* =====================================
           NOTIFICATION
        ===================================== */

        .headboard-toast {
          position: fixed;
          top: 115px;
          right: 25px;
          z-index: 99999;

          display: flex;
          align-items: flex-start;
          gap: 14px;

          width: min(390px, calc(100vw - 32px));
          padding: 19px 18px 22px;

          background: #fbf9f4;
          border: 1px solid #e9e2d8;

          box-shadow:
            0 12px 40px rgba(32, 20, 20, 0.12);

          overflow: hidden;

          animation:
            headboard-toast-enter 0.35s ease both;
        }

        .headboard-toast__icon {
          width: 39px;
          height: 39px;
          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;
          background: #f8eee8;
          color: #8B3F1F;

          font-size: 23px;
        }

        .headboard-toast--removed
        .headboard-toast__icon {
          background: #eeeae4;
          color: #514b45;
        }

        .headboard-toast--error
        .headboard-toast__icon {
          background: #fbe7e7;
          color: #b91c1c;
        }

        .headboard-toast__content {
          flex: 1;
          min-width: 0;
        }

        .headboard-toast__content strong {
          display: block;
          font-family: "Radley", Georgia, serif;
          font-size: 17px;
          font-weight: 400;
          color: #292523;
          margin-bottom: 5px;
        }

        .headboard-toast__content p {
          margin: 0;
          font-size: 13px;
          line-height: 1.6;
          color: #77716c;
        }

        .headboard-toast__content a {
          display: inline-block;
          margin-top: 9px;
          font-size: 12px;
          color: #8B3F1F;
          text-decoration: underline;
        }

        .headboard-toast__close {
          flex-shrink: 0;
          border: 0;
          background: transparent;
          cursor: pointer;
          color: #77716c;
        }

        .headboard-toast__progress {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          width: 100%;
          background: #8B3F1F;
          transform-origin: left;
          animation:
            headboard-toast-progress 3.5s linear forwards;
        }

        @keyframes headboard-toast-enter {
          from {
            opacity: 0;
            transform: translateX(35px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes headboard-toast-progress {
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
          html body .headboard-product-card
          button.headboard-card-like {
            top: 10px !important;
            right: 10px !important;

            width: 40px !important;
            min-width: 40px !important;
            max-width: 40px !important;

            height: 40px !important;
            min-height: 40px !important;
          }

          html body .headboard-card-heart svg {
            width: 21px !important;
            height: 21px !important;
          }

          .headboard-toast {
            top: 85px;
            right: 16px;
            padding: 16px 15px 20px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .headboard-card-like.is-animating
          .headboard-card-heart,
          .headboard-toast__progress {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
