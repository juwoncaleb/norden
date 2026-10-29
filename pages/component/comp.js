
import React from "react";
import Link from "next/link";

export default function InteriorStylingSection() {
  return (
    <section className="styling-section grid w-full grid-cols-1 overflow-hidden md:grid-cols-2">

      {/* LEFT CONTENT */}
      <div className="styling-content flex w-full items-center bg-[#f6f3e7] px-6 py-14 text-[#33251f] sm:px-10 md:min-h-[560px] md:px-[10%] md:py-16 lg:px-[11%]">
        <div className="styling-inner w-full max-w-[700px]">

          {/* HEADING */}
          <h2 className="styling-heading mb-7 text-[30px] font-normal leading-tight tracking-[-1px] sm:text-[36px] lg:text-[42px]">
            Complimentary interior styling service
          </h2>

          {/* DESCRIPTION */}
          <p className="styling-description mb-10 text-[17px] leading-[1.6] text-[#493c34] sm:text-[19px] lg:text-[22px]">
            From the smallest details to complete room
            transformations, discover a more considered
            approach to your space. Let Norden help you
            select furniture, colours, and finishes that
            bring your vision together beautifully.
          </p>

          {/* BUTTON */}
          <Link
            href="/interior-styling"
            className="styling-button inline-flex min-h-[50px] items-center justify-center rounded-[10px] bg-[#803d24] px-7 py-3 text-[15px] font-normal uppercase tracking-[2px] text-white no-underline transition-all duration-300 hover:bg-[#632d1b]"
          >
            Learn More
          </Link>

        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div className="styling-image relative h-[300px] w-full overflow-hidden sm:h-[400px] md:h-[560px]">
        <img
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85"
          alt="Beautifully styled contemporary living room with premium furniture"
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      {/* ADDITIONAL STYLING */}
      <style jsx>{`
        .styling-section {
          width: 100%;
        }

        .styling-image img {
          display: block;
          transition: transform 0.6s ease;
        }

        .styling-image:hover img {
          transform: scale(1.025);
        }

        .styling-heading {
          font-family: "Radley", Georgia, serif;
          font-weight: 400;
        }

        .styling-description {
          font-family: "Radley", Georgia, serif;
          font-weight: 400;
        }

        @media (max-width: 767px) {
          .styling-content {
            min-height: 340px;
          }

          .styling-heading {
            font-size: 30px;
            margin-bottom: 22px;
          }

          .styling-description {
            font-size: 17px;
            line-height: 1.6;
            margin-bottom: 30px;
          }
        }

        @media (max-width: 400px) {
          .styling-content {
            padding-top: 45px;
            padding-bottom: 45px;
          }

          .styling-heading {
            font-size: 28px;
          }

          .styling-description {
            font-size: 16px;
          }
        }
      `}</style>
    </section>
  );
}
