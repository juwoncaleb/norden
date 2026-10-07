// FurnitureCarousel.jsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

const VISIBLE = 5;

function formatPrice(value) {
  return "₦" + new Intl.NumberFormat("en-NG", { maximumFractionDigits: 0 }).format(value);
}

// Turns a raw Contentful entry into the shape the cards need
function toCardItem(entry) {
  const f = entry.fields;
  const imageUrl = f.images?.[0]?.fields?.file?.url;
  const tags = Array.isArray(f.tags)
    ? f.tags
    : f.tags
    ? f.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  return {
    id: entry.sys.id,
    image: imageUrl ? `https:${imageUrl}` : "/placeholder.jpg",
    name: f.title,
    subtitle: f.material || "",
    price: f.price,
    discountedPrice: f.discountedPrice,
    inStock: f.inStock,
    isBestseller: tags.some((t) => t.toLowerCase() === "bestseller"),
  };
}

// `entries` = raw Contentful entries (response.items)
export default function FurnitureCarousel({ entries = [], title = "Bestsellers" }) {
  const items = entries.map(toCardItem);

  const [offset, setOffset] = useState(0);
  const max = Math.max(0, items.length - VISIBLE);
  const dragStart = useRef(null);
  const dragging = useRef(false);
  const containerRef = useRef(null);

  const prev = useCallback(() => setOffset((o) => Math.max(0, o - 1)), []);
  const next = useCallback(() => setOffset((o) => Math.min(max, o + 1)), [max]);

  const onMouseDown = (e) => { dragStart.current = e.clientX; dragging.current = false; };
  const onMouseMove = (e) => {
    if (dragStart.current === null) return;
    if (Math.abs(e.clientX - dragStart.current) > 5) dragging.current = true;
  };
  const onMouseUp = (e) => {
    if (dragStart.current === null) return;
    const delta = e.clientX - dragStart.current;
    if (Math.abs(delta) > 40) delta < 0 ? next() : prev();
    dragStart.current = null;
  };
  const onTouchStart = (e) => { dragStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (dragStart.current === null) return;
    const delta = e.changedTouches[0].clientX - dragStart.current;
    if (Math.abs(delta) > 40) delta < 0 ? next() : prev();
    dragStart.current = null;
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  if (items.length === 0) return null;

  return (
    <section className="furniture" style={{
      background: "#f5f0e8", fontFamily: "'Cormorant Garamond', Georgia, serif",
      padding: "56px 0 48px", userSelect: "none",
    }}>

      {/* Header */}
      <div style={{ paddingLeft: 48, marginBottom: 36 }}>
        <p style={{ fontSize: 11, letterSpacing: "0.2em", color: "#9b7a52", textTransform: "uppercase", margin: "0 0 6px" }}>
          Curated Collection
        </p>
        <h2 style={{ fontSize: 36, fontWeight: 400, color: "#2c1f0e", margin: 0, letterSpacing: "-0.01em" }}>
          {title}
        </h2>
      </div>

      {/* Track */}
      <div
        ref={containerRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{ overflow: "hidden", cursor: "grab", paddingLeft: 48 }}
      >
        <div style={{
          display: "flex", gap: 24,
          transition: "transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          transform: `translateX(calc(-${offset} * (100% / ${VISIBLE} + 24px / ${VISIBLE} * (${VISIBLE} - 1) / ${VISIBLE})))`,
          willChange: "transform",
        }}>
          {items.map((item) => {
            const hasDiscount = item.discountedPrice != null && item.discountedPrice < item.price;
            const badge = !item.inStock ? "Out of stock" : item.isBestseller ? "Bestseller" : null;

            return (
              <Link
                key={item.id}
                href={`/diningtable/${item.id}`}
                draggable={false}
                onClick={(e) => { if (dragging.current) e.preventDefault(); }}
                style={{
                  flexShrink: 0,
                  width: `calc((100vw - 48px - ${(VISIBLE - 1) * 24}px) / ${VISIBLE})`,
                  minWidth: 220,
                  textDecoration: "none",
                  display: "block",
                }}
              >

                {/* Image card */}
                <div style={{
                  background: "#ede8de", borderRadius: 2, position: "relative",
                  overflow: "hidden", aspectRatio: "3/3.2", display: "flex",
                  alignItems: "center", justifyContent: "center", marginBottom: 16,
                }}>
                  {badge && (
                    <span style={{
                      position: "absolute", top: 12, left: 12,
                      background: item.inStock ? "#7a2e0e" : "#2c1f0e",
                      color: "#fff", fontSize: 10, letterSpacing: "0.12em",
                      textTransform: "uppercase", padding: "4px 8px", fontFamily: "sans-serif",
                    }}>{badge}</span>
                  )}

                  <img
                    src={item.image} alt={item.name || "Product image"} draggable={false}
                    onError={(e) => { e.target.style.display = "none"; }}
                    style={{ maxWidth: "72%", maxHeight: "72%", objectFit: "contain", pointerEvents: "none" }}
                  />

                  <div style={{ position: "absolute", bottom: 12, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 8 }}>
                    {["🛒", "♡"].map((icon, i) => (
                      <button key={i} onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} style={{
                        width: 36, height: 36, borderRadius: "50%", border: "1px solid #c9bfb0",
                        background: "rgba(245,240,232,0.85)", backdropFilter: "blur(4px)",
                        cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center",
                      }}>{icon}</button>
                    ))}
                  </div>
                </div>

                <p style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 500, color: "#2c1f0e", lineHeight: 1.3 }}>{item.name}</p>
                {item.subtitle && (
                  <p style={{ margin: "0 0 8px", fontSize: 12, color: "#9b7a52", fontFamily: "sans-serif", letterSpacing: "0.02em" }}>{item.subtitle}</p>
                )}
                <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#2c1f0e", display: "flex", gap: 8, alignItems: "baseline" }}>
                  {hasDiscount ? (
                    <>
                      <span>{formatPrice(item.discountedPrice)}</span>
                      <span style={{ fontSize: 13, fontWeight: 400, color: "#9b7a52", textDecoration: "line-through" }}>
                        {formatPrice(item.price)}
                      </span>
                    </>
                  ) : (
                    <span>{formatPrice(item.price)}</span>
                  )}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Arrows */}
      {max > 0 && (
        <div style={{ display: "flex", gap: 8, paddingLeft: 48, marginTop: 36 }}>
          {[
            { label: "←", action: prev, disabled: offset === 0 },
            { label: "→", action: next, disabled: offset === max },
          ].map(({ label, action, disabled }) => (
            <button
              key={label} onClick={action} disabled={disabled}
              style={{
                width: 40, height: 40, borderRadius: "50%", border: "1.5px solid",
                borderColor: disabled ? "#d9cfc2" : "#7a2e0e",
                background: "transparent",
                color: disabled ? "#d9cfc2" : "#7a2e0e",
                fontSize: 16, cursor: disabled ? "default" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s",
              }}
            >{label}</button>
          ))}
        </div>
      )}
    </section>
  );
}