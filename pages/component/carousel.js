"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const IMAGES = [
  { src: "/r1.jpg", label: "Sofa", href: "/sofa" },
  { src: "/r2.jpg", label: "Dining Table", href: "/diningtable" },
  { src: "/r3.jpg", label: "Bedroom", href: "/beds" },
  { src: "/r4.jpg", label: "Ottomans", href: "/ottomans" },
];

const SLIDE_RATIO = 0.82;
const GAP = 12;
const DRAG_THRESHOLD = 0.2;
const CLICK_TOLERANCE = 6; // px of movement still counted as a click

export default function ImageCarousel() {
  const viewportRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const [slideW, setSlideW] = useState(320);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const startXRef = useRef(0);
  const lastXRef = useRef(0);
  const didDragRef = useRef(false);

  const measure = useCallback(() => {
    if (viewportRef.current) {
      setSlideW(viewportRef.current.offsetWidth * SLIDE_RATIO);
    }
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const baseOffset = -(current * (slideW + GAP));
  const trackOffset = baseOffset + dragOffset;

  const slideHeight = 550;

  const onDragStart = useCallback((x) => {
    setIsDragging(true);
    didDragRef.current = false;
    startXRef.current = x;
    lastXRef.current = x;
  }, []);

  const onDragMove = useCallback(
    (x) => {
      if (!isDragging) return;
      lastXRef.current = x;
      setDragOffset(x - startXRef.current);
    },
    [isDragging]
  );

  const onDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    const delta = lastXRef.current - startXRef.current;
    const threshold = slideW * DRAG_THRESHOLD;

    // Remember if this was a drag, so the link click can be cancelled
    didDragRef.current = Math.abs(delta) > CLICK_TOLERANCE;

    setCurrent((prev) => {
      if (delta < -threshold) return Math.min(IMAGES.length - 1, prev + 1);
      if (delta > threshold) return Math.max(0, prev - 1);
      return prev;
    });

    setDragOffset(0);
  }, [isDragging, slideW]);

  useEffect(() => {
    const move = (e) => onDragMove(e.clientX);
    const up = () => onDragEnd();

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [onDragMove, onDragEnd]);

  // Cancel navigation if the pointer was dragged
  const handleLinkClick = (e) => {
    if (didDragRef.current) {
      e.preventDefault();
      didDragRef.current = false;
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto py-6 px-5 select-none">
      <div
        ref={viewportRef}
        className="overflow-hidden rounded-2xl cursor-grab active:cursor-grabbing"
        onMouseDown={(e) => onDragStart(e.clientX)}
        onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => onDragMove(e.touches[0].clientX)}
        onTouchEnd={onDragEnd}
      >
        <div
          className="flex"
          style={{
            transform: `translateX(${trackOffset}px)`,
            transition: isDragging
              ? "none"
              : "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            willChange: "transform",
          }}
        >
          {IMAGES.map((img, i) => (
            <Link
              key={img.href}
              href={img.href}
              draggable={false}
              onClick={handleLinkClick}
              aria-label={`Shop ${img.label}`}
              className="relative block flex-shrink-0 rounded-2xl overflow-hidden bg-gray-200"
              style={{
                width: slideW || 320,
                height: slideHeight,
                marginRight: GAP,
              }}
            >
              <Image
                src={img.src}
                alt={img.label}
                fill
                className="object-cover pointer-events-none"
                draggable={false}
                priority={i === 0}
              />

              <span className="absolute bottom-3 left-3 text-xs font-medium text-white bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full">
                {img.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}