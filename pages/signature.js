
import { createClient } from "contentful";
import { useEffect, useRef, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Header from "./component/Header";
import Footer from "./component/footer";
import Image from "next/image";
import Link from "next/link";

const PRODUCT_TYPE = "signature";
const PRODUCT_ROUTE = "/signature";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

// ============================================
// FETCH ALL SIGNATURE PRODUCTS
// ============================================

export async function getServerSideProps() {
  const items = [];
  let skip = 0;
  let total = Infinity;

  while (skip < total) {
    const response = await client.getEntries({
      content_type: PRODUCT_TYPE,
      limit: 100,
      skip,
      order: ["fields.title"],
    });

    total = response.total;
    items.push(...response.items);
    skip += response.items.length;

    if (response.items.length === 0) break;
  }

  return {
    props: {
      items: JSON.parse(JSON.stringify(items)),
    },
  };
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

function getImageUrl(item) {
  const url = item.images?.[0]?.fields?.file?.url;

  if (!url) return "/placeholder.jpg";

  return url.startsWith("//") ? `https:${url}` : url;
}

async function readWishlistResponse(response) {
  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      `Invalid wishlist response (HTTP ${response.status}).`
    );
  }

  if (!response.ok || data.success === false) {
    throw new Error(
      data.error || "Unable to update your wishlist."
    );
  }

  return data;
}

// ============================================
// HEART ICON
// ============================================

function HeartIcon({ filled }) {
  return (
    <svg
      width="22"
      height="22"
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
// SIGNATURE PAGE
// ============================================

export default function SignatureListPage({
  items = [],
}) {
  const { data: session, status } = useSession();

  const [likedIds, setLikedIds] = useState([]);
  const [loadingLikes, setLoadingLikes] = useState(true);
  const [savingIds, setSavingIds] = useState([]);
  const [animatedIds, setAnimatedIds] = useState([]);
  const [toast, setToast] = useState(null);

  const toastTimer = useRef(null);
  const animationTimers = useRef(new Map());
  const pending = useRef(new Set());

  // ============================================
  // TOAST NOTIFICATIONS
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

    if (status === "loading") return;

    if (status !== "authenticated") {
      setLikedIds([]);
      setLoadingLikes(false);
      return;
    }

    async function loadLikes() {
      setLoadingLikes(true);

      try {
        const response = await fetch("/api/wishlist", {
          method: "GET",
          cache: "no-store",
        });

        const data = await readWishlistResponse(response);

        if (!Array.isArray(data.likes)) {
          throw new Error(
            "Wishlist API returned invalid likes data."
          );
        }

        if (!cancelled) {
          const savedIds = data.likes
            .filter(
              (like) =>
                like.productType === PRODUCT_TYPE &&
                typeof like.productId === "string"
            )
            .map((like) => like.productId);

          setLikedIds(savedIds);
        }
      } catch (error) {
        console.error("SIGNATURE WISHLIST LOAD:", error);

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

    loadLikes();

    return () => {
      cancelled = true;
    };
  }, [status, session?.user?.email]);

  // ============================================
  // CLEANUP TIMERS
  // ============================================

  useEffect(() => {
    const timers = animationTimers.current;

    return () => {
      clearTimeout(toastTimer.current);

      timers.forEach((timer) => {
        clearTimeout(timer);
      });

      timers.clear();
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
      ...previous.filter((id) => id !== productId),
      productId,
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
  // ADD / REMOVE WISHLIST ITEM
  // ============================================

  async function toggleLike(productId, productTitle) {
    if (status === "loading") return;

    if (status !== "authenticated") {
      await signIn("google", {
        callbackUrl: window.location.href,
      });

      return;
    }

    if (loadingLikes || pending.current.has(productId)) {
      return;
    }

    pending.current.add(productId);

    setSavingIds((previous) => [
      ...previous,
      productId,
    ]);

    const currentlyLiked = likedIds.includes(productId);

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

      const data = await readWishlistResponse(response);

      if (typeof data.liked !== "boolean") {
        throw new Error(
          "Wishlist API did not return a liked status."
        );
      }

      setLikedIds((previous) => {
        if (data.liked) {
          return [
            ...new Set([...previous, productId]),
          ];
        }

        return previous.filter(
          (id) => id !== productId
        );
      });

      animateHeart(productId);

      showToast(
        data.liked ? "success" : "removed",
        data.liked
          ? "Added to your likes"
          : "Removed from your likes",
        data.liked
          ? `${productTitle} has been saved to your collection.`
          : `${productTitle} has been removed from your collection.`
      );
    } catch (error) {
      console.error(
        "SIGNATURE WISHLIST UPDATE:",
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
            onClick={closeToast}
            className="norden-toast__close"
            aria-label="Close notification"
          >
            ✕
          </button>

          <div className="norden-toast__progress" />
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-10 min-h-[70vh]">
        <h1 className="text-3xl font-serif mb-8">
          Signature
        </h1>

        {items.length === 0 ? (
          <p className="text-gray-500 py-10 text-lg">
            No signature pieces found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {items.map((entry) => {
              const item = entry.fields;
              const productId = entry.sys.id;
              const coverUrl = getImageUrl(item);

              const hasDiscount =
                item.discountedPrice != null &&
                item.price != null &&
                Number(item.discountedPrice) <
                  Number(item.price);

              const tagList = Array.isArray(item.tags)
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
                  className="group"
                >
                  {/* PRODUCT IMAGE */}
                  <div className="relative aspect-[4/3] w-full mb-3 bg-stone-100 overflow-hidden">
                    <Link
                      href={`${PRODUCT_ROUTE}/${productId}`}
                      className="absolute inset-0 block"
                      aria-label={`View ${
                        item.title || "Signature Piece"
                      }`}
                    >
                      <Image
                        src={coverUrl}
                        alt={
                          item.title ||
                          "Signature Piece image"
                        }
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    {/* STOCK STATUS */}
                    {item.inStock === false && (
                      <span className="absolute left-3 top-3 z-10 bg-stone-900 text-stone-50 text-xs px-2.5 py-1">
                        Out of stock
                      </span>
                    )}

                    {/* WISHLIST HEART */}
                    <button
                      type="button"
                      onClick={() =>
                        toggleLike(
                          productId,
                          item.title ||
                            "Signature Piece"
                        )
                      }
                      disabled={
                        isSaving ||
                        loadingLikes ||
                        status === "loading"
                      }
                      aria-label={
                        isLiked
                          ? `Remove ${
                              item.title ||
                              "Signature Piece"
                            } from likes`
                          : `Add ${
                              item.title ||
                              "Signature Piece"
                            } to likes`
                      }
                      aria-pressed={isLiked}
                      className={`norden-heart-button ${
                        isLiked ? "is-liked" : ""
                      } ${
                        isAnimating
                          ? "is-animating"
                          : ""
                      }`}
                    >
                      {isSaving ? (
                        <span className="w-5 h-5 border-2 border-stone-300 border-t-[#65000b] rounded-full animate-spin" />
                      ) : (
                        <span className="norden-heart-button__icon">
                          <HeartIcon
                            filled={isLiked}
                          />
                        </span>
                      )}
                    </button>
                  </div>

                  {/* TITLE */}
                  <Link
                    href={`${PRODUCT_ROUTE}/${productId}`}
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
        .norden-heart-button {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 20;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.96);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          cursor: pointer;
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .norden-heart-button:hover:not(:disabled) {
          transform: scale(1.1);
          box-shadow: 0 5px 18px rgba(0, 0, 0, 0.12);
        }

        .norden-heart-button:disabled {
          opacity: 0.7;
          cursor: wait;
        }

        .norden-heart-button__icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .norden-heart-button.is-animating
        .norden-heart-button__icon {
          animation: norden-heart-pop 0.5s ease;
        }

        @keyframes norden-heart-pop {
          0% {
            transform: scale(1);
          }
          30% {
            transform: scale(1.45);
          }
          55% {
            transform: scale(0.85);
          }
          75% {
            transform: scale(1.12);
          }
          100% {
            transform: scale(1);
          }
        }

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

        @media (max-width: 600px) {
          .norden-toast {
            top: 85px;
            right: 16px;
            padding: 16px 15px 20px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .norden-toast,
          .norden-toast__progress,
          .norden-heart-button.is-animating
          .norden-heart-button__icon {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
