"use client";

import { useRef } from "react";

export default function Product() {
  const scrollRef = useRef(null);

  const slides = [
    {
      image: "/ap1.jpeg",
      title: "A better home, without costing the planet.",
      button: "SUSTAINABILITY",
    },
    {
      image: "/ap2.jpg",
      title: "Furniture that brings warmth into every corner.",
      button: "ALL PRODUCTS",
    },
    {
      image: "/ap3.jpg",
      title: "Gather beautifully around timeless design.",
      button: "DINING ROOM",
    },
    {
      image: "/ap4.jpg",
      title: "Comfort shaped for the way you really live.",
      button: "LIVING ROOM",
    },
    {
      image: "/l1.png",
      title: "Details that make everyday spaces feel special.",
      button: "OUR STORY",
    },
  ];

  const handleWheel = (e) => {
    if (!scrollRef.current) return;

    // prevent vertical scroll only when hovering this section
    e.preventDefault();
    scrollRef.current.scrollLeft += e.deltaY;
  };

  return (
    <section className="w-full bg-[#f7f3ee] py-10">
      <div
        ref={scrollRef}
        onWheel={handleWheel}
        className="flex gap-6 overflow-x-auto overflow-y-hidden px-6 pb-6 scroll-smooth"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="group relative min-w-[85%] md:min-w-[48%] lg:min-w-[32%] h-[520px] md:h-[620px] overflow-hidden flex-shrink-0"
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02] group-hover:brightness-75"
            />

            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition duration-500" />

            <div className="absolute bottom-10 left-8 right-8 text-white">
              <p className="max-w-[320px] slidetext leading-tight font-light mb-6">
                {slide.title}
              </p>

              <button className="bg-[#f8f3eb] text-[#844025] px-6 py-3 rounded-xl tracking-[0.2em] text-sm hover:bg-white transition">
                {slide.button}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* scrollbar styling */}
      <style jsx>{`
        div::-webkit-scrollbar {
          height: 8px;
        }

        div::-webkit-scrollbar-track {
          background: #ede7df;
          border-radius: 9999px;
        }

        div::-webkit-scrollbar-thumb {
          background: #844025;
          border-radius: 9999px;
        }

        div::-webkit-scrollbar-thumb:hover {
          background: #6f321c;
        }
      `}</style>
    </section>
  );
}