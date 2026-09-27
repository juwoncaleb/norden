// FurnitureCarousel.jsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const ITEMS = [
  { id: 1,  image: "/c1.png",  name: "Seb Storage Combination",    subtitle: "Modular Stackable Shelves",           price: "£1,398" },
  { id: 2,  image: "/c2.png",  name: "Vincent Dining Table",        subtitle: "Slim Tabletop, Solid Walnut",          price: "£799"   },
  { id: 3,  image: "/c3.png",  name: "Arcadia Storage Combination", subtitle: "Wood, Tempered Glass, Modular",        price: "£1,498" },
  { id: 4,  image: "/c4.png",  name: "Hamilton Chaise Sofa",        subtitle: "Removable Cushion Covers, Deep Seats", price: "£2,299" },
  { id: 5,  image: "/c5.png",  name: "Owen Chaise Sofa",            subtitle: "Removable Back & Cushion Covers",      price: "£1,899" },
  { id: 6,  image: "/c6.png",  name: "Hugg Rectangular Table",      subtitle: "Nested Seat, Oak Finish",              price: "£649"   },
  { id: 7,  image: "/c7.png",  name: "Cleo Accent Chair",           subtitle: "Boucle Fabric, Swivel Base",           price: "£945"   },
  { id: 8,  image: "/c8.png",  name: "Marlowe Bookcase",            subtitle: "Open Shelving, Smoked Oak",            price: "£1,150" },
  { id: 9,  image: "/c9.png",  name: "Pebble Coffee Table",         subtitle: "Travertine Top, Brass Legs",           price: "£880"   },
  { id: 10, image: "/c10.png", name: "Sienna Floor Lamp",           subtitle: "Linen Shade, Walnut Stem",             price: "£395"   },
  { id: 11, image: "/c11.png", name: "Ember Velvet Bed Frame",      subtitle: "Low Profile, King Size",               price: "£2,100" },
  { id: 12, image: "/c12.png", name: "Alto Media Console",          subtitle: "Sliding Cane Doors, Matte Finish",     price: "£1,275" },
];

const VISIBLE = 5;

export default function FurnitureCarousel() {
  const [offset, setOffset] = useState(0);
  const max = ITEMS.length - VISIBLE;
  const dragStart = useRef(null);
  const dragging = useRef(false);
  const containerRef = useRef(null);

  const prev = useCallback(() => setOffset(o => Math.max(0, o - 1)), []);
  const next = useCallback(() => setOffset(o => Math.min(max, o + 1)), [max]);

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
          Bestsellers
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
          {ITEMS.map((item) => (
            <div key={item.id} style={{
              flexShrink: 0,
              width: `calc((100vw - 48px - ${(VISIBLE - 1) * 24}px) / ${VISIBLE})`,
              minWidth: 220,
            }}>

              {/* Image card */}
              <div style={{
                background: "#ede8de", borderRadius: 2, position: "relative",
                overflow: "hidden", aspectRatio: "3/3.2", display: "flex",
                alignItems: "center", justifyContent: "center", marginBottom: 16,
              }}>
                <span style={{
                  position: "absolute", top: 12, left: 12, background: "#7a2e0e",
                  color: "#fff", fontSize: 10, letterSpacing: "0.12em",
                  textTransform: "uppercase", padding: "4px 8px", fontFamily: "sans-serif",
                }}>Bestseller</span>

                <img
                  src={item.image} alt={item.name} draggable={false}
                  onError={(e) => { e.target.style.display = "none"; }}
                  style={{ maxWidth: "72%", maxHeight: "72%", objectFit: "contain", pointerEvents: "none" }}
                />

                <div style={{
                  position: "absolute", inset: 0, background: "rgba(44,31,14,0)", transition: "background 0.3s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(44,31,14,0.04)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(44,31,14,0)"}
                />

                <div style={{ position: "absolute", bottom: 12, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 8 }}>
                  {["🛒", "♡"].map((icon, i) => (
                    <button key={i} onClick={e => e.stopPropagation()} style={{
                      width: 36, height: 36, borderRadius: "50%", border: "1px solid #c9bfb0",
                      background: "rgba(245,240,232,0.85)", backdropFilter: "blur(4px)",
                      cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center",
                    }}>{icon}</button>
                  ))}
                </div>
              </div>

              <p style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 500, color: "#2c1f0e", lineHeight: 1.3 }}>{item.name}</p>
              <p style={{ margin: "0 0 8px", fontSize: 12, color: "#9b7a52", fontFamily: "sans-serif", letterSpacing: "0.02em" }}>{item.subtitle}</p>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#2c1f0e" }}>{item.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
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
    </section>
  );
}