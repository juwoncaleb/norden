
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./bestseller.module.scss";

// No next/font/google import.
// The font is loaded through your global CSS/SCSS.

const formatPrice = (n) =>
  `₦${Number(n).toLocaleString("en-US")}`;

export default function Bestsellers({ items = [] }) {
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    setCanPrev(el.scrollLeft > 4);
    setCanNext(
      el.scrollLeft + el.clientWidth < el.scrollWidth - 4
    );
  }, []);

  useEffect(() => {
    updateArrows();

    const el = trackRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateArrows, {
      passive: true,
    });

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

    const gap =
      parseFloat(getComputedStyle(el).columnGap) || 0;

    const step = card
      ? card.offsetWidth + gap
      : el.clientWidth * 0.8;

    el.scrollBy({
      left: dir * step,
      behavior: "smooth",
    });
  };

  if (!items.length) return null;

  return (
    <section
      className={styles.section}
      style={{
        fontFamily:
          '"Cormorant Garamond", Georgia, serif',
      }}
    >
      <div className={styles.header}>
        <p className={styles.eyebrow}>
          Curated Collection
        </p>

        <h2 className={styles.title}>
          Bestsellers
        </h2>
      </div>

      <ul className={styles.track} ref={trackRef}>
        {items.map((item) => {
          const img = item.images?.[0];

          const subtitle =
            item.material || item.tags;

          const hasDiscount =
            item.discountedPrice != null &&
            item.discountedPrice < item.price;

          return (
            <li
              className={styles.card}
              key={item.id}
            >
              <div className={styles.imageBox}>
                <span
                  className={`${styles.badge} ${
                    !item.inStock
                      ? styles.badgeOut
                      : ""
                  }`}
                >
                  {item.inStock
                    ? "Bestseller"
                    : "Sold out"}
                </span>

                {img && (
                  <img
                    className={styles.image}
                    src={`${img.url}?w=700&fm=webp&q=80`}
                    alt={img.alt || item.title}
                    loading="lazy"
                  />
                )}
              </div>

              <h3 className={styles.name}>
                {item.title}
              </h3>

              {subtitle && (
                <p className={styles.subtitle}>
                  {subtitle}
                </p>
              )}

              {item.price != null && (
                <p className={styles.price}>
                  {hasDiscount ? (
                    <>
                      {formatPrice(
                        item.discountedPrice
                      )}

                      <span
                        className={styles.oldPrice}
                      >
                        {formatPrice(item.price)}
                      </span>
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
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => scrollByCard(-1)}
          disabled={!canPrev}
          aria-label="Previous products"
        >
          ←
        </button>

        <button
          type="button"
          className={styles.navBtn}
          onClick={() => scrollByCard(1)}
          disabled={!canNext}
          aria-label="Next products"
        >
          →
        </button>
      </div>
    </section>
  );
}
