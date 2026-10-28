
const STORAGE_KEY = "norden_recently_viewed";
const MAX_ITEMS = 20;

export function getRecentlyViewed() {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const items = stored ? JSON.parse(stored) : [];
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

export function saveRecentlyViewed(product) {
  if (typeof window === "undefined" || !product) return;

  const href = product.href || product.url || "";
  if (!href || !href.startsWith("/")) return;

  const id = String(product.id || product.slug || href);

  const item = {
    id,
    title: String(product.title || product.name || "Furniture"),
    image: String(product.image || ""),
    price: Number(product.price) || 0,
    category: String(product.category || "Furniture"),
    href,
    viewedAt: new Date().toISOString(),
  };

  const previous = getRecentlyViewed();

  const updated = [
    item,
    ...previous.filter(
      (existing) => existing.id !== id && existing.href !== href
    ),
  ].slice(0, MAX_ITEMS);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("norden-recently-viewed-updated"));
  } catch (error) {
    console.error("Unable to save recently viewed product:", error);
  }
}

export function removeRecentlyViewed(id) {
  if (typeof window === "undefined") return;

  const updated = getRecentlyViewed().filter(
    (item) => item.id !== id
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("norden-recently-viewed-updated"));
}

export function clearRecentlyViewed() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("norden-recently-viewed-updated"));
}
