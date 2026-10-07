import { useCallback, useEffect, useRef, useState } from "react";
import { Cormorant_Garamond } from "next/font/google";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
});

const formatPrice = (n) => `₦${Number(n).toLocaleString("en-US")}`;

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 4h2l2.2 10.2a1 1 0 0 0 1 .8h8.6a1 1 0 0 0 1-.8L19.5 8H6" />
      <circle cx="9.5" cy="19" r="1.2" />
      <circle cx="16.5" cy="19" r="1.2" />
    </svg>
  );
}

function HeartIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
    </svg>
  );
}

export default function Bestsellers({ items = [] }) {
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [liked, setLiked] = useState({});

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows, items.length]);

  const scrollByCard = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("li");
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const step = card ? card.offsetWidth + gap : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  if (!items.length) return null;

  return (
    <section className={`${styles.section} ${serif.className}`}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Curated Collection</p>
        <h2 className={styles.title}>Bestsellers</h2>
      </div>

      <ul className={styles.track} ref={trackRef}>
        {items.map((item) => {
          const img = item.images?.[0];
          const subtitle = item.material || item.tags;
          const hasDiscount =
            item.discountedPrice != null && item.discountedPrice < item.price;

          return (
            <li className={styles.card} key={item.id}>
              <div className={styles.imageBox}>
                <span className={`${styles.badge} ${!item.inStock ? styles.badgeOut : ""}`}>
                  {item.inStock ? "Bestseller" : "Sold out"}
                </span>

                {img && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className={styles.image}
                    src={`${img.url}?w=700&fm=webp&q=80`}
                    alt={img.alt || item.title}
                    loading="lazy"
                  />
                )}

                <div className={styles.actions}>
                  <button type="button" className={styles.iconBtn} aria-label={`Add ${item.title} to cart`} disabled={!item.inStock}>
                    <CartIcon />
                  </button>
                  <button
                    type="button"
                    className={styles.iconBtn}
                    aria-label={`Save ${item.title}`}
                    aria-pressed={!!liked[item.id]}
                    onClick={() => setLiked((p) => ({ ...p, [item.id]: !p[item.id] }))}
                  >
                    <HeartIcon filled={!!liked[item.id]} />
                  </button>
                </div>
              </div>

              <h3 className={styles.name}>{item.title}</h3>
              {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

              {item.price != null && (
                <p className={styles.price}>
                  {hasDiscount ? (
                    <>
                      {formatPrice(item.discountedPrice)}
                      <span className={styles.oldPrice}>{formatPrice(item.price)}</span>
                    </>
                  ) : (
                    formatPrice(item.price)
                  )}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      <div className={styles.nav}>
        <button type="button" className={styles.navBtn} onClick={() => scrollByCard(-1)} disabled={!canPrev} aria-label="Previous products">
          ←
        </button>
        <button type="button" className={styles.navBtn} onClick={() => scrollByCard(1)} disabled={!canNext} aria-label="Next products">
          →
        </button>
      </div>
    </section>
  );
}