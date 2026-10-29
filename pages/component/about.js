
"use client";

import { useRef } from "react";
import Link from "next/link";

export default function Product() {
  const scrollRef = useRef(null);

  // ============================================
  // NORDEN FURNITURE COLLECTIONS
  // ============================================

  const slides = [
    {
      image:
        "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=1200",
      title:
        "Sink into comfort with sofas designed for beautiful everyday living.",
      button: "EXPLORE SOFAS",
      href: "/sofa",
    },
    {
      image:
        "https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=1200",
      title:
        "Make every gathering memorable with timeless dining tables.",
      button: "DINING TABLES",
      href: "/diningtable",
    },
    {
      image:
        "https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=1200",
      title:
        "Create a restful retreat with beautifully crafted beds.",
      button: "EXPLORE BEDS",
      href: "/beds",
    },
    {
      image:
        "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200",
      title:
        "Discover statement headboards that bring elegance to your bedroom.",
      button: "HEADBOARDS",
      href: "/headboard",
    },
    {
      image:
        "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200",
      title:
        "Bring character and comfort into your space with beautiful accent chairs.",
      button: "ACCENT CHAIRS",
      href: "/armchair",
    },
    {
      image:
        "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1200",
      title:
        "Elevate your living space with coffee tables that make a statement.",
      button: "COFFEE TABLES",
      href: "/coffeetable",
    },
    {
      image:
        "https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=1200",
      title:
        "The perfect finishing touch for a bedroom that feels like home.",
      button: "BEDSIDE TABLES",
      href: "/bedsidetable",
    },
  ];

  // ============================================
  // HORIZONTAL SCROLL
  // ============================================

  const handleWheel = (e) => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;

    const canScroll =
      container.scrollWidth > container.clientWidth;

    if (!canScroll) return;

    const delta =
      Math.abs(e.deltaY) > Math.abs(e.deltaX)
        ? e.deltaY
        : e.deltaX;

    const maxScroll =
      container.scrollWidth - container.clientWidth;

    const nextScroll = container.scrollLeft + delta;

    // Allow normal vertical scrolling at the ends
    if (
      (delta < 0 && container.scrollLeft <= 0) ||
      (delta > 0 && container.scrollLeft >= maxScroll)
    ) {
      return;
    }

    e.preventDefault();

    container.scrollLeft = Math.max(
      0,
      Math.min(nextScroll, maxScroll)
    );
  };

  // ============================================
  // SCROLL BUTTONS
  // ============================================

  const scroll = (direction) => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;

    const card = container.querySelector(
      ".norden-product-slide"
    );

    const scrollAmount = card
      ? card.getBoundingClientRect().width + 24
      : 400;

    container.scrollBy({
      left:
        direction === "left"
          ? -scrollAmount
          : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="norden-product-section w-full bg-[#f7f3ee] py-12 md:py-20">

      {/* SECTION HEADER */}

      <div className="mb-10 flex flex-col gap-6 px-6 md:mb-12 md:flex-row md:items-end md:justify-between md:px-10 lg:px-16">
        <div>
          <p className="mb-4 text-[11px] uppercase tracking-[3px] text-[#844025]">
            DISCOVER NORDEN
          </p>

          <h2 className="norden-section-heading text-[36px] font-normal leading-[1.15] text-[#302821] sm:text-[45px] lg:text-[56px]">
            Explore our collections.
          </h2>

          <p className="norden-section-description mt-4 max-w-[550px] text-[16px] leading-[1.8] text-[#72675f]">
            Thoughtfully designed furniture for every
            corner of your home.
          </p>
        </div>

        {/* DESKTOP ARROWS */}

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll collections left"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-[#844025] text-[#844025] transition hover:bg-[#844025] hover:text-white"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll collections right"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-[#844025] text-[#844025] transition hover:bg-[#844025] hover:text-white"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* ============================================
          PRODUCT SLIDER
      ============================================ */}

      <div
        ref={scrollRef}
        onWheel={handleWheel}
        className="norden-product-scroll flex gap-6 overflow-x-auto overflow-y-hidden px-6 pb-6 scroll-smooth md:px-10 lg:px-16"
        style={{
          WebkitOverflowScrolling: "touch",
          overscrollBehaviorX: "contain",
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="norden-product-slide group relative h-[520px] min-w-[85%] flex-shrink-0 overflow-hidden sm:min-w-[60%] md:h-[620px] md:min-w-[48%] lg:min-w-[32%]"
          >
            {/* IMAGE */}

            <img
              src={slide.image}
              alt={slide.button}
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
            />

            {/* IMAGE OVERLAY */}

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent transition duration-500 group-hover:from-black/80" />

            {/* CONTENT */}

            <div className="absolute bottom-10 left-7 right-7 z-10 text-white md:left-9 md:right-9">
              <span className="mb-5 block text-[11px] uppercase tracking-[3px] text-white/80">
                NORDEN COLLECTION
              </span>

              <p className="norden-slide-text mb-8 max-w-[380px] text-[28px] font-normal leading-[1.2] sm:text-[32px] lg:text-[35px]">
                {slide.title}
              </p>

              {/* LINK TO CATEGORY PAGE */}

              <Link
                href={slide.href}
                className="inline-flex min-h-[50px] items-center justify-center rounded-[10px] bg-[#f8f3eb] px-6 py-3 text-[12px] uppercase tracking-[2px] text-[#844025] no-underline transition-all duration-300 hover:bg-white"
              >
                {slide.button}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* MOBILE SCROLL INDICATOR */}

      <div className="mt-4 flex items-center justify-center gap-2 md:hidden">
        <span className="h-[2px] w-10 bg-[#844025]" />
        <span className="h-[2px] w-5 bg-[#844025]/30" />
        <span className="h-[2px] w-5 bg-[#844025]/30" />
      </div>

      {/* ============================================
          STYLES
      ============================================ */}

      <style jsx>{`
        .norden-product-section {
          width: 100%;
        }

        .norden-section-heading,
        .norden-section-description,
        .norden-slide-text {
          font-family: "Radley", Georgia, serif;
        }

        .norden-product-scroll {
          scrollbar-width: thin;
          scrollbar-color: #844025 #ede7df;
        }

        .norden-product-scroll::-webkit-scrollbar {
          height: 7px;
        }

        .norden-product-scroll::-webkit-scrollbar-track {
          background: #ede7df;
          border-radius: 9999px;
        }

        .norden-product-scroll::-webkit-scrollbar-thumb {
          background: #844025;
          border-radius: 9999px;
        }

        .norden-product-scroll::-webkit-scrollbar-thumb:hover {
          background: #6f321c;
        }

        @media (max-width: 767px) {
          .norden-product-slide {
            height: 510px;
          }
        }

        @media (max-width: 400px) {
          .norden-product-slide {
            height: 470px;
          }

          .norden-slide-text {
            font-size: 26px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .norden-product-section * {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
}
