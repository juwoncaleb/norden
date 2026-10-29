import { createClient } from "contentful";
import { useEffect, useState, useCallback } from "react";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

import Header from "./component/Header";
import Footer from "./component/footer";

// ============================================
// CONTENTFUL
// ============================================

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

// Add other furniture categories here later.
// The key must match the Contentful content type ID.
// The value must match the product page route.









const PRODUCT_CATEGORIES = {
  armChair: "armchair",
  sofa: "sofa",
  accessories: "accessories",
  bar: "bar",
  beds: "bed",
  bedsideTable: "bedsidetable",
  benches: "benches",
  coffeeTable: "coffeetable",
  consoles: "consoles",
  diningTable: "diningtable",
  diningChairs: "dining-chairs",
  livingConsole: "living-console",
  mirrors: "mirrors",
  ottomans: "ottomans",
  sculpturalPieces: "sculptural-pieces",
  sideTable: "side-table",
  signature: "signature",
  tvUnit: "tv-unit",
  vases: "vases",
};


// ============================================
// FETCH FURNITURE
// ============================================

export async function getServerSideProps() {
  const products = [];
  let productsError = false;

  for (const productType of Object.keys(PRODUCT_CATEGORIES)) {
    try {
      let skip = 0;

      while (true) {
        const response = await client.getEntries({
          content_type: productType,
          limit: 100,
          skip,
          include: 2,
        });

        products.push(
          ...response.items.map((entry) => ({
            ...entry,
            productType,
          })),
        );

        skip += response.items.length;

        if (response.items.length === 0 || skip >= response.total) {
          break;
        }
      }
    } catch (error) {
      console.error(`Unable to load ${productType}:`, error);
      productsError = true;
    }
  }

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      productsError,
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
    amount.toLocaleString("en-NG", {
      maximumFractionDigits: 0,
    })
  );
}

function getImageUrl(item) {
  const url = item?.images?.[0]?.fields?.file?.url;

  if (!url) return "/placeholder.jpg";

  return url.startsWith("//") ? `https:${url}` : url;
}

function getProductKey(productId, productType) {
  return `${productType}:${productId}`;
}

async function readWishlistResponse(response) {
  const text = await response.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      `Wishlist API returned an invalid response (HTTP ${response.status}).`,
    );
  }

  if (!response.ok) {
    throw new Error(data.error || "Unable to update your wishlist.");
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

// ============================================
// LOADING
// ============================================

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="w-9 h-9 border-2 border-stone-200 border-t-[#65000b] rounded-full animate-spin" />

      <p className="mt-5 text-sm text-stone-500">
        Loading your favourite furniture...
      </p>
    </div>
  );
}

// ============================================
// PRODUCT CARD
// ============================================

function LikedProductCard({ entry, onRemove, removing }) {
  const item = entry.fields || {};
  const productId = entry.sys.id;
  const productType = entry.productType;

  const route = PRODUCT_CATEGORIES[productType] || productType;

  const productUrl = `/${route}/${productId}`;

  const coverUrl = getImageUrl(item);

  const hasDiscount =
    item.discountedPrice != null &&
    item.price != null &&
    Number(item.discountedPrice) < Number(item.price);

  const currentPrice = hasDiscount ? item.discountedPrice : item.price;

  const tags = Array.isArray(item.tags)
    ? item.tags
    : typeof item.tags === "string"
      ? item.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

  const categoryLabel =
    productType === "armChair"
      ? "Arm Chair"
      : productType === "sofa"
        ? "Sofa"
        : productType;

  return (
    <article className="group">
      <div className="relative aspect-[4/3] w-full bg-[#f5f2ed] overflow-hidden mb-4">
        {/* PRODUCT IMAGE */}
        <Link
          href={productUrl}
          className="absolute inset-0 block"
          aria-label={`View ${item.title || categoryLabel}`}
        >
          <Image
            src={coverUrl}
            alt={item.title || categoryLabel}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* REMOVE FROM LIKES */}
        <button
          type="button"
          onClick={() => onRemove(productId, productType)}
          disabled={removing}
          aria-label={`Remove ${item.title || categoryLabel} from likes`}
          className="absolute top-3 right-3 z-10 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm transition-transform hover:scale-105 disabled:opacity-50"
        >
          {removing ? (
            <span className="w-5 h-5 border-2 border-stone-200 border-t-[#65000b] rounded-full animate-spin" />
          ) : (
            <HeartIcon filled />
          )}
        </button>

        {/* OUT OF STOCK */}
        {item.inStock === false && (
          <span className="absolute left-3 top-3 bg-[#292523] text-white text-xs px-3 py-1.5 pointer-events-none">
            Out of stock
          </span>
        )}
      </div>

      {/* PRODUCT DETAILS */}
      <Link href={productUrl} className="block">
        <p className="text-[11px] uppercase tracking-[2px] text-stone-400 mb-2">
          {categoryLabel}
        </p>

        <h2 className="font-serif text-xl text-[#252525] mb-1">
          {item.title || `Untitled ${categoryLabel}`}
        </h2>

        {item.material && (
          <p className="text-sm text-stone-500 mt-1">{item.material}</p>
        )}

        <div className="flex items-center gap-3 mt-3">
          <span className="text-base text-[#65000b]">
            {formatPrice(currentPrice)}
          </span>

          {hasDiscount && (
            <span className="text-sm text-stone-400 line-through">
              {formatPrice(item.price)}
            </span>
          )}
        </div>
      </Link>

      {/* TAGS */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="border border-stone-200 px-2.5 py-1 text-xs text-stone-500"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

// ============================================
// MY LIKES PAGE
// ============================================

export default function MyLikesPage({ products = [], productsError = false }) {
  const { data: session, status } = useSession();

  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingKey, setRemovingKey] = useState(null);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD ALL CUSTOMER LIKES
  // ==========================================

  const loadLikes = useCallback(async (signal) => {
    const response = await fetch("/api/wishlist", {
      method: "GET",
      cache: "no-store",
      signal,
    });

    const data = await readWishlistResponse(response);

    if (!Array.isArray(data.likes)) {
      throw new Error("Wishlist API returned invalid likes data.");
    }

    return data.likes.filter(
      (like) =>
        typeof like.productId === "string" &&
        typeof like.productType === "string",
    );
  }, []);

  // ==========================================
  // LOAD LIKES AFTER LOGIN
  // ==========================================

  useEffect(() => {
    if (status === "loading") return;

    if (status !== "authenticated") {
      setLikes([]);
      setLoading(false);
      setError("");
      return;
    }

    const controller = new AbortController();

    async function fetchLikes() {
      setLoading(true);
      setError("");

      try {
        const savedLikes = await loadLikes(controller.signal);

        if (!controller.signal.aborted) {
          setLikes(savedLikes);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("Load likes error:", err);
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchLikes();

    return () => controller.abort();
  }, [status, session?.user?.email, loadLikes]);

  // ==========================================
  // REMOVE PRODUCT FROM LIKES
  // ==========================================

  async function removeLike(productId, productType) {
    const key = getProductKey(productId, productType);

    if (!session || removingKey) return;

    setRemovingKey(key);
    setError("");

    try {
      const response = await fetch("/api/wishlist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          productId,
          productType,
        }),
      });

      const data = await readWishlistResponse(response);

      if (data.liked !== false) {
        throw new Error("Unable to confirm removal from wishlist.");
      }

      setLikes((previous) =>
        previous.filter(
          (like) =>
            !(like.productId === productId && like.productType === productType),
        ),
      );
    } catch (err) {
      console.error("Remove like error:", err);
      setError(err.message);
    } finally {
      setRemovingKey(null);
    }
  }

  // ==========================================
  // MATCH LIKES WITH CONTENTFUL PRODUCTS
  // ==========================================

  const productMap = new Map(
    products.map((product) => [
      getProductKey(product.sys.id, product.productType),
      product,
    ]),
  );

  const savedProducts = likes
    .map((like) =>
      productMap.get(getProductKey(like.productId, like.productType)),
    )
    .filter(Boolean);

  const missingProductsCount = likes.length - savedProducts.length;

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-12 min-h-[70vh]">
        {/* PAGE HEADING */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10">
          <div>
            <span className="text-xs tracking-[3px] text-[#65000b]">
              YOUR NÓRDEN COLLECTION
            </span>

            <h1 className="font-serif text-4xl mt-3 text-[#252525]">
              My Likes
            </h1>

            <p className="text-stone-500 text-sm mt-3">
              Your favourite furniture pieces, all in one place.
            </p>
          </div>

          {session && !loading && !error && (
            <span className="text-sm text-stone-500">
              {savedProducts.length}{" "}
              {savedProducts.length === 1 ? "Saved piece" : "Saved pieces"}
            </span>
          )}
        </div>

        {/* LOADING */}
        {status === "loading" || loading ? (
          <LoadingSpinner />
        ) : !session ? (
          /* SIGN IN REQUIRED */
          <div className="text-center py-24 px-6 bg-[#fbf9f4]">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white mb-6">
              <HeartIcon />
            </span>

            <h2 className="font-serif text-3xl mb-4">Your collection awaits</h2>

            <p className="text-stone-500 text-sm max-w-sm mx-auto leading-7 mb-8">
              Sign in to save your favourite NÓRDEN furniture and access your
              collection whenever you return.
            </p>

            <button
              type="button"
              onClick={() =>
                signIn("google", {
                  callbackUrl: "/likes",
                })
              }
              className="bg-[#65000b] text-white px-10 py-4 text-sm hover:bg-[#470008] transition-colors"
            >
              Continue with Google
            </button>
          </div>
        ) : (
          <>
            {/* ERROR */}
            {error && (
              <div
                role="alert"
                className="mb-8 border border-red-200 bg-red-50 text-red-700 px-5 py-4 text-sm"
              >
                <p>{error}</p>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-3 underline"
                >
                  Try again
                </button>
              </div>
            )}

            {productsError && (
              <div className="mb-8 border border-amber-200 bg-amber-50 text-amber-900 px-5 py-4 text-sm">
                Some furniture could not be loaded. Please refresh the page.
              </div>
            )}

            {/* SAVED PRODUCTS */}
            {!error && savedProducts.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-7 gap-y-12">
                  {savedProducts.map((entry) => (
                    <LikedProductCard
                      key={getProductKey(entry.sys.id, entry.productType)}
                      entry={entry}
                      removing={
                        removingKey ===
                        getProductKey(entry.sys.id, entry.productType)
                      }
                      onRemove={removeLike}
                    />
                  ))}
                </div>

                {missingProductsCount > 0 && (
                  <p className="text-stone-500 text-sm mt-10">
                    {missingProductsCount} saved item(s) are currently
                    unavailable in the furniture catalogue.
                  </p>
                )}
              </>
            )}

            {/* EMPTY WISHLIST */}
            {!error && savedProducts.length === 0 && (
              <div className="text-center py-24 px-6 bg-[#fbf9f4]">
                <div className="flex justify-center mb-6">
                  <HeartIcon />
                </div>

                <h2 className="font-serif text-3xl mb-4">
                  {missingProductsCount > 0
                    ? "Saved furniture unavailable"
                    : "Your wishlist is empty"}
                </h2>

                <p className="text-stone-500 text-sm max-w-sm mx-auto leading-7 mb-8">
                  {missingProductsCount > 0
                    ? "Your saved items could not be found in the current furniture catalogue."
                    : "Discover furniture you love and click the heart to add it to your personal collection."}
                </p>

                
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
