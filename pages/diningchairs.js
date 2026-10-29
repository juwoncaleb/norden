
import { useState, useEffect, useRef } from "react";
import { createClient } from "contentful";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";

import Header from "./component/Header";
import Footer from "./component/footer";

// ============================================
// CONFIGURATION
// ============================================

const PRODUCT_TYPE = "diningChairs";
const PRODUCT_ROUTE = "/diningchairs";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

// ============================================
// FETCH DINING CHAIRS
// ============================================

export async function getServerSideProps() {
  try {
    let items = [];
    let skip = 0;
    let total = Infinity;

    while (skip < total) {
      const response = await client.getEntries({
        content_type: PRODUCT_TYPE,
        limit: 100,
        skip,
      });

      items.push(...response.items);
      total = response.total;
      skip += response.items.length;

      if (!response.items.length) break;
    }

    return {
      props: {
        items: JSON.parse(JSON.stringify(items)),
      },
    };
  } catch (error) {
    console.error("DINING CHAIRS FETCH ERROR:", error);

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

function HeartIcon({ filled = false }) {
  return (
    <svg
      width="23"
      height="23"
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
// DINING CHAIRS LISTING
// ============================================

export default function DiningChairsListPage({
  items = [],
}) {
  const { data: session, status } = useSession();

  const [likedIds, setLikedIds] = useState([]);
  const [loadingLikes, setLoadingLikes] =
    useState(true);
  const [savingIds, setSavingIds] = useState([]);
  const [toast, setToast] = useState(null);

  const pending = useRef(new Set());
  const toastTimer = useRef(null);

  function showToast(type, title, message) {
    clearTimeout(toastTimer.current);

    setToast({
      type,
      title,
      message,
    });

    toastTimer.current = setTimeout(() => {
      setToast(null);
    }, 3500);
  }

  // ============================================
  // LOAD WISHLIST
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
          setLoadingLikes(false);
        }
      }
    }

    loadWishlist();

    return () => {
      cancelled = true;
    };
  }, [status, session?.user?.email]);

  useEffect(() => {
    return () => clearTimeout(toastTimer.current);
  }, []);

  // ============================================
  // TOGGLE LIKE
  // ============================================

  async function handleToggleLike(productId, title) {
    if (status === "loading") return;

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

      setLikedIds((previous) =>
        data.liked
          ? [...new Set([...previous, productId])]
          : previous.filter((id) => id !== productId)
      );

      showToast(
        data.liked ? "success" : "removed",
        data.liked
          ? "Added to your likes"
          : "Removed from your likes",
        data.liked
          ? `${title} has been saved.`
          : `${title} has been removed.`
      );
    } catch (error) {
      showToast(
        "error",
        "Unable to update wishlist",
        error.message
      );
    } finally {
      pending.current.delete(productId);

      setSavingIds((previous) =>
        previous.filter((id) => id !== productId)
      );
    }
  }

  // ============================================
  // PAGE
  // ============================================

  return (
    <div>
      <Header />

      {toast && (
        <div className="dc-toast" role="status">
          <div className="dc-toast-icon">
            {toast.type === "success"
              ? "♥"
              : toast.type === "removed"
              ? "♡"
              : "!"}
          </div>

          <div className="dc-toast-content">
            <strong>{toast.title}</strong>
            <p>{toast.message}</p>

            {toast.type === "success" && (
              <Link href="/likes">
                View my likes
              </Link>
            )}
          </div>

          <button
            onClick={() => setToast(null)}
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      )}

      <main className="dc-list-wrapper">
        <div className="dc-list-heading">
          <span>THE NORDEN COLLECTION</span>
          <h1>Dining Chairs</h1>
          <p>
            Thoughtfully designed seating for
            beautiful dining spaces.
          </p>
        </div>

        {items.length === 0 ? (
          <p className="dc-empty">
            No dining chairs available yet.
          </p>
        ) : (
          <div className="dc-product-grid">
            {items.map((item) => {
              const fields = item.fields || {};
              const id = item.sys.id;

              const images = Array.isArray(fields.images)
                ? fields.images
                : [];

              const cover = imageUrl(images[0], 700);

              const liked = likedIds.includes(id);
              const saving = savingIds.includes(id);

              const hasDiscount =
                fields.discountedPrice != null &&
                Number(fields.discountedPrice) <
                  Number(fields.price);

              return (
                <article
                  key={id}
                  className="dc-product-card"
                >
                  <div className="dc-product-image">
                    <Link
                      href={`${PRODUCT_ROUTE}/${id}`}
                      className="dc-image-link"
                    >
                      {cover ? (
                        <img
                          src={cover}
                          alt={fields.title || "Dining Chair"}
                          loading="lazy"
                        />
                      ) : (
                        <div className="dc-no-image">
                          No image available
                        </div>
                      )}
                    </Link>

                    <button
                      type="button"
                      className={`dc-heart ${
                        liked ? "liked" : ""
                      }`}
                      onClick={() =>
                        handleToggleLike(
                          id,
                          fields.title || "Dining Chair"
                        )
                      }
                      disabled={
                        loadingLikes ||
                        saving ||
                        status === "loading"
                      }
                      aria-label={
                        liked
                          ? "Remove from likes"
                          : "Add to likes"
                      }
                      aria-pressed={liked}
                    >
                      {saving ? (
                        <span className="dc-spinner" />
                      ) : (
                        <HeartIcon filled={liked} />
                      )}
                    </button>

                    {fields.inStock === false && (
                      <span className="dc-stock-badge">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  <div className="dc-product-info">
                    <Link href={`${PRODUCT_ROUTE}/${id}`}>
                      <h2>{fields.title}</h2>
                    </Link>

                    {fields.material && (
                      <p className="dc-material">
                        {fields.material}
                      </p>
                    )}

                    <div className="dc-price">
                      {hasDiscount ? (
                        <>
                          <span>
                            {formatPrice(
                              fields.discountedPrice
                            )}
                          </span>

                          <del>
                            {formatPrice(fields.price)}
                          </del>
                        </>
                      ) : (
                        <span>
                          {formatPrice(fields.price)}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <Footer />

      <style jsx global>{`
        .dc-list-wrapper {
          max-width: 1450px;
          margin: 0 auto;
          padding: 65px 5% 110px;
          min-height: 70vh;
        }

        .dc-list-heading {
          text-align: center;
          margin-bottom: 55px;
        }

        .dc-list-heading > span {
          font-size: 11px;
          letter-spacing: 3px;
          color: #65000b;
        }

        .dc-list-heading h1 {
          font-family: "Radley", Georgia, serif;
          font-size: clamp(36px, 5vw, 60px);
          font-weight: 400;
          margin: 14px 0;
        }

        .dc-list-heading p {
          color: #777;
          font-size: 15px;
        }

        .dc-product-grid {
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));
          gap: 35px 22px;
        }

        .dc-product-image {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 4.5;
          background: #f5f2ed;
          overflow: hidden;
        }

        .dc-image-link {
          display: block;
          width: 100%;
          height: 100%;
        }

        .dc-image-link img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .dc-product-card:hover
        .dc-image-link img {
          transform: scale(1.05);
        }

        .dc-no-image {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #999;
        }

        .dc-heart {
          position: absolute;
          z-index: 10;
          top: 14px;
          right: 14px;
          width: 43px;
          height: 43px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          border: 0;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 3px 12px
            rgba(0, 0, 0, 0.07);
        }

        .dc-heart:hover:not(:disabled) {
          transform: scale(1.08);
        }

        .dc-heart:disabled {
          cursor: wait;
        }

        .dc-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #ddd;
          border-top-color: #65000b;
          border-radius: 50%;
          animation: dc-spin 0.7s linear infinite;
        }

        @keyframes dc-spin {
          to { transform: rotate(360deg); }
        }

        .dc-stock-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          padding: 7px 10px;
          background: #292523;
          color: white;
          font-size: 11px;
        }

        .dc-product-info {
          padding: 18px 2px;
        }

        .dc-product-info h2 {
          font-family: "Radley", Georgia, serif;
          font-size: 21px;
          font-weight: 400;
          color: #292523;
          margin: 0 0 8px;
        }

        .dc-material {
          color: #888;
          font-size: 13px;
          margin-bottom: 8px;
        }

        .dc-price {
          display: flex;
          gap: 12px;
          align-items: center;
          font-size: 15px;
          color: #65000b;
        }

        .dc-price del {
          color: #999;
          font-size: 13px;
        }

        .dc-empty {
          text-align: center;
          padding: 80px 0;
          color: #777;
        }

        .dc-toast {
          position: fixed;
          top: 115px;
          right: 25px;
          z-index: 99999;
          width: min(390px, calc(100vw - 32px));
          display: flex;
          gap: 14px;
          align-items: flex-start;
          padding: 20px;
          background: #fbf9f4;
          border: 1px solid #e8e1d8;
          box-shadow: 0 12px 40px
            rgba(0, 0, 0, 0.12);
        }

        .dc-toast-icon {
          color: #65000b;
          font-size: 24px;
        }

        .dc-toast-content {
          flex: 1;
        }

        .dc-toast-content strong {
          font-family: "Radley", Georgia, serif;
          font-size: 17px;
          font-weight: 400;
        }

        .dc-toast-content p {
          color: #777;
          font-size: 13px;
          margin: 5px 0;
        }

        .dc-toast-content a {
          color: #65000b;
          font-size: 12px;
          text-decoration: underline;
        }

        .dc-toast > button {
          border: 0;
          background: transparent;
          cursor: pointer;
        }

        @media (max-width: 1000px) {
          .dc-product-grid {
            grid-template-columns:
              repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .dc-product-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
            gap: 22px 12px;
          }

          .dc-list-wrapper {
            padding: 40px 4% 70px;
          }

          .dc-product-info h2 {
            font-size: 17px;
          }

          .dc-heart {
            width: 38px;
            height: 38px;
            top: 10px;
            right: 10px;
          }

          .dc-toast {
            top: 85px;
            right: 16px;
          }
        }
      `}</style>
    </div>
  );
}
