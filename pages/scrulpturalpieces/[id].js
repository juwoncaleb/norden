
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

const PRODUCT_TYPE = "sculpturalPieces";

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
  } catch {
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
  return (
    "₦" +
    new Intl.NumberFormat("en-NG", {
      maximumFractionDigits: 0,
    }).format(value)
  );
}

function imageUrl(image, width) {
  const url = image?.fields?.file?.url;

  if (!url) return null;

  const fullUrl = url.startsWith("//")
    ? `https:${url}`
    : url;

  return width
    ? `${fullUrl}${fullUrl.includes("?") ? "&" : "?"}w=${width}`
    : fullUrl;
}

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
// SCULPTURAL PIECES DETAIL PAGE
// ============================================

export default function SculpturalPiecesDetailPage({
  item,
}) {
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
  const [notice, setNotice] = useState("");

  const pending = useRef(false);
  const noticeTimer = useRef(null);
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

  function showNotice(message) {
    clearTimeout(noticeTimer.current);

    setNotice(message);

    noticeTimer.current = setTimeout(() => {
      setNotice("");
    }, 3500);
  }

  // ============================================
  // LOAD EXISTING LIKE
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

    setLoadingLike(true);

    async function loadWishlist() {
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
          "SCULPTURAL PIECES WISHLIST ERROR:",
          error
        );

        if (!cancelled) {
          showNotice(error.message);
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
      clearTimeout(noticeTimer.current);
      clearTimeout(heartTimer.current);
    };
  }, []);

  // ============================================
  // ADD / REMOVE LIKE
  // ============================================

  async function handleToggleLike() {
    if (!productId || status === "loading") {
      return;
    }

    // Sign in before saving
    if (status !== "authenticated") {
      await signIn("google", {
        callbackUrl: window.location.href,
      });

      return;
    }

    if (loadingLike || pending.current) {
      return;
    }

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

      // Heart animation
      clearTimeout(heartTimer.current);
      setHeartAnimating(true);

      heartTimer.current = setTimeout(() => {
        setHeartAnimating(false);
      }, 550);

      showNotice(
        data.liked
          ? "Added to your likes."
          : "Removed from your likes."
      );
    } catch (error) {
      console.error(
        "SCULPTURAL PIECES LIKE ERROR:",
        error
      );

      showNotice(error.message);
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

  const fields = item.fields;
  const images = fields.images || [];

  const tagList = Array.isArray(fields.tags)
    ? fields.tags
    : fields.tags
    ? fields.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const hasDiscount =
    fields.discountedPrice != null &&
    fields.discountedPrice < fields.price;

  // ============================================
  // ADD TO CART
  // ============================================

  const handleAddToCart = () => {
    addItem({
      id: item.sys.id,
      title: fields.title,
      price: hasDiscount
        ? fields.discountedPrice
        : fields.price,
      image: imageUrl(images[0], 400),
    });

    openCart();
  };

  // ============================================
  // IMAGE ZOOM
  // ============================================

  const handleMouseMove = (e) => {
    const rect =
      e.currentTarget.getBoundingClientRect();

    const x =
      ((e.clientX - rect.left) / rect.width) *
      100;

    const y =
      ((e.clientY - rect.top) / rect.height) *
      100;

    setMousePos({ x, y });
  };

  return (
    <div>
      <Header />

      {/* WISHLIST NOTIFICATION */}

      {notice && (
        <div
          className="sculptural-like-notice"
          role="status"
        >
          <span>{notice}</span>

          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Close notification"
          >
            ×
          </button>
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
                onClick={() => setActiveImage(i)}
              >
                <img
                  src={imageUrl(img, 120)}
                  alt={`view ${i + 1}`}
                />
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
            {images[activeImage] && (
              <img
                src={imageUrl(images[activeImage], 1200)}
                alt={fields.title}
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

        {/* INFO */}

        <div className="sd-info">
          {tagList[0] && (
            <span className="sd-badge">
              {tagList[0]}
            </span>
          )}

          <h1 className="sd-title">
            {fields.title}
          </h1>

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

          {/* ADD TO CART + LIKE */}

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
              <Link href="/likes">
                View likes
              </Link>
            </p>
          )}
        </div>
      </div>

      <CartDrawer />
      <Footer />

      {/* Notification styling only.
          Button layout/colors come from global CSS. */}

      <style jsx global>{`
        .sculptural-like-notice {
          position: fixed;
          top: 110px;
          right: 20px;
          z-index: 99999;

          display: flex;
          align-items: center;
          gap: 18px;

          width: min(380px, calc(100vw - 32px));
          padding: 18px 20px;

          background: #fbf9f4;
          border: 1px solid #e8d9d0;
          color: #493b34;
          font-size: 14px;

          box-shadow:
            0 12px 35px rgba(0, 0, 0, 0.1);
        }

        .sculptural-like-notice button {
          margin-left: auto;
          border: 0;
          background: transparent;
          color: #65000b;
          font-size: 24px;
          cursor: pointer;
        }

        @media (max-width: 600px) {
          .sculptural-like-notice {
            top: 85px;
            right: 16px;
          }
        }
      `}</style>
    </div>
  );
}
