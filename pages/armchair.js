
import { createClient } from "contentful";
import { useEffect, useRef, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Header from "./component/Header";
import Footer from "./component/footer";
import Image from "next/image";
import Link from "next/link";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

// ============================================
// CONTENTFUL PRODUCTS
// ============================================

export async function getServerSideProps() {
  const items = [];
  let skip = 0;

  while (true) {
    const response = await client.getEntries({
      content_type: "armChair",
      limit: 100,
      skip,
      order: ["fields.title"],
    });

    items.push(...response.items);
    skip += response.items.length;

    if (
      response.items.length === 0 ||
      skip >= response.total
    ) {
      break;
    }
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

  return (
    "₦" +
    new Intl.NumberFormat("en-NG", {
      maximumFractionDigits: 0,
    }).format(value)
  );
}

function HeartIcon({ filled }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill={filled ? "#65000b" : "none"}
      stroke={filled ? "#65000b" : "#292523"}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function ArmChairListPage({ items }) {
  const { data: session, status } = useSession();

  const [likedIds, setLikedIds] = useState([]);
  const [savingIds, setSavingIds] = useState([]);
  const [loadingLikes, setLoadingLikes] = useState(true);

  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [animatedId, setAnimatedId] = useState(null);

  const toastTimer = useRef(null);
  const animationTimer = useRef(null);
  const savingRef = useRef(new Set());

  // ============================================
  // NOTIFICATION
  // ============================================

  function showToast(type, title, message) {
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }

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
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }

    setToast(null);
  }

  // ============================================
  // LOAD CUSTOMER LIKES
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
      setError("");

      try {
        const response = await fetch("/api/wishlist");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Unable to load your likes."
          );
        }

        if (!cancelled) {
          setLikedIds(
            (data.likes || [])
              .filter(
                (like) => like.productType === "armChair"
              )
              .map((like) => like.productId)
          );
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setError(err.message);
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
  // CLEAN UP TIMERS
  // ============================================

  useEffect(() => {
    return () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }

      if (animationTimer.current) {
        clearTimeout(animationTimer.current);
      }
    };
  }, []);

  // ============================================
  // HEART ANIMATION
  // ============================================

  function animateHeart(productId) {
    if (animationTimer.current) {
      clearTimeout(animationTimer.current);
    }

    setAnimatedId(productId);

    animationTimer.current = setTimeout(() => {
      setAnimatedId(null);
    }, 550);
  }

  // ============================================
  // ADD / REMOVE LIKES
  // ============================================

  async function toggleLike(productId, productTitle) {
    if (status === "loading" || loadingLikes) return;

    // Require Google authentication
    if (!session) {
      showToast(
        "info",
        "Sign in required",
        "Please sign in to save your favourite furniture."
      );

      signIn("google", {
        callbackUrl: window.location.href,
      });

      return;
    }

    if (savingRef.current.has(productId)) return;

    savingRef.current.add(productId);

    const isLiked = likedIds.includes(productId);

    setSavingIds((prev) => [...prev, productId]);
    setError("");

    try {
      const response = await fetch("/api/wishlist", {
        method: isLiked ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          productType: "armChair",
        }),
      });

      const contentType =
        response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          "Wishlist API is unavailable. Check /api/wishlist."
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to update your likes."
        );
      }

      // Update the heart only after successful saving
      setLikedIds((prev) => {
        if (data.liked) {
          return [...new Set([...prev, productId])];
        }

        return prev.filter((id) => id !== productId);
      });

      animateHeart(productId);

      if (data.liked) {
        showToast(
          "success",
          "Added to your likes",
          `${productTitle} has been saved to your collection.`
        );
      } else {
        showToast(
          "removed",
          "Removed from your likes",
          `${productTitle} has been removed from your collection.`
        );
      }
    } catch (err) {
      console.error(err);
      setError(err.message);

      showToast(
        "error",
        "Something went wrong",
        err.message || "Please try again."
      );
    } finally {
      savingRef.current.delete(productId);

      setSavingIds((prev) =>
        prev.filter((id) => id !== productId)
      );
    }
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <div>
      <Header />

      {/* NOTIFICATION */}

      {toast && (
        <div
          key={toast.id}
          className={`norden-toast norden-toast--${toast.type}`}
          role={toast.type === "error" ? "alert" : "status"}
          aria-live="polite"
        >
          <div className="norden-toast__icon">
            {toast.type === "success" ? (
              <HeartIcon filled />
            ) : toast.type === "removed" ? (
              <HeartIcon filled={false} />
            ) : toast.type === "error" ? (
              <CloseIcon />
            ) : (
              <CheckIcon />
            )}
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
            <CloseIcon />
          </button>

          <div className="norden-toast__progress" />
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-10 min-h-[70vh]">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-serif">
            Arm Chairs
          </h1>

          {session && (
            <Link
              href="/likes"
              className="text-sm text-stone-700 underline"
            >
              My Likes
            </Link>
          )}
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm"
          >
            {error}
          </div>
        )}

        {items.length === 0 ? (
          <p className="text-gray-500 py-10 text-lg">
            No arm chairs found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {items.map((entry) => {
              const item = entry.fields;
              const productId = entry.sys.id;

              const imageUrl =
                item.images?.[0]?.fields?.file?.url;

              const coverUrl = imageUrl
                ? imageUrl.startsWith("//")
                  ? `https:${imageUrl}`
                  : imageUrl
                : "/placeholder.jpg";

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

              const isLiked = likedIds.includes(productId);
              const isSaving = savingIds.includes(productId);

              const isAnimating =
                animatedId === productId;

              return (
                <div key={productId} className="group">
                  <div className="relative aspect-[4/3] w-full mb-3 bg-stone-100 overflow-hidden">
                    <Link
                      href={`/armchair/${productId}`}
                      className="absolute inset-0 block"
                      aria-label={`View ${item.title}`}
                    >
                      <Image
                        src={coverUrl}
                        alt={item.title || "Arm Chair"}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    {!item.inStock && (
                      <span className="absolute left-3 top-3 bg-stone-900 text-white text-xs px-2.5 py-1 pointer-events-none">
                        Out of stock
                      </span>
                    )}

                    {/* HEART BUTTON */}

                    <button
                      type="button"
                      onClick={() =>
                        toggleLike(
                          productId,
                          item.title || "This product"
                        )
                      }
                      disabled={
                        isSaving ||
                        loadingLikes ||
                        status === "loading"
                      }
                      aria-label={
                        isLiked
                          ? `Remove ${item.title} from likes`
                          : `Add ${item.title} to likes`
                      }
                      aria-pressed={isLiked}
                      className={`norden-heart-button ${
                        isLiked ? "is-liked" : ""
                      } ${
                        isAnimating ? "is-animating" : ""
                      }`}
                    >
                      {isSaving ? (
                        <span className="w-5 h-5 border-2 border-stone-300 border-t-[#65000b] rounded-full animate-spin" />
                      ) : (
                        <span className="norden-heart-button__icon">
                          <HeartIcon filled={isLiked} />
                        </span>
                      )}
                    </button>
                  </div>

                  <Link
                    href={`/armchair/${productId}`}
                    className="block"
                  >
                    <h2 className="text-lg font-serif text-stone-900">
                      {item.title}
                    </h2>

                    {item.material && (
                      <p className="text-sm text-stone-500 mt-1">
                        {item.material}
                      </p>
                    )}

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
                  </Link>

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

      {/* ANIMATIONS AND NOTIFICATION STYLES */}

      <style jsx global>{`
        .norden-heart-button {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 10;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 0;
          background: rgba(255, 255, 255, 0.96);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
          cursor: pointer;
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            background 0.25s ease;
        }

        .norden-heart-button:hover:not(:disabled) {
          transform: scale(1.1);
          background: #fff;
          box-shadow: 0 5px 18px rgba(0, 0, 0, 0.12);
        }

        .norden-heart-button:disabled {
          cursor: wait;
          opacity: 0.7;
        }

        .norden-heart-button__icon {
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
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

        /* TOAST NOTIFICATION */

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
          box-shadow: 0 12px 40px rgba(32, 20, 20, 0.12);
          overflow: hidden;
          animation: norden-toast-enter 0.35s ease both;
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

        .norden-toast__close:hover {
          color: #292523;
        }

        .norden-toast__progress {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          width: 100%;
          background: #65000b;
          transform-origin: left;
          animation: norden-progress 3.5s linear forwards;
        }

        .norden-toast--removed .norden-toast__progress {
          background: #aaa198;
        }

        .norden-toast--error .norden-toast__progress {
          background: #b91c1c;
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

          .norden-toast__content strong {
            font-size: 16px;
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
