
import React from "react";
import Link from "next/link";

export default function TimelessTravelsSection() {
  const furnitureImage =
    "https://images.squarespace-cdn.com/content/v1/679620b23526c33fa3feedee/1749320727088-OIDLY6PVGGQWIPFRVVUL/IMG_8899.jpeg";

  return (
    <section className="timeless-section grid w-full grid-cols-1 overflow-hidden md:grid-cols-2">
      {/* LEFT CONTENT */}
      <div className="timeless-content flex w-full items-center bg-[#f6f3e7] px-6 py-14 text-[#33251f] sm:px-10 md:min-h-[560px] md:px-[10%] md:py-16 lg:px-[11%]">
        <div className="w-full max-w-[700px]">
          <p className="mb-5 text-[11px] uppercase tracking-[3px] text-[#803d24]">
            THE ART OF PATTERN
          </p>

          <h2 className="timeless-heading mb-7 text-[38px] font-normal leading-tight tracking-[-1px] sm:text-[44px] lg:text-[58px]">
            Timeless Travels
          </h2>

          <p className="timeless-description mb-10 text-[17px] leading-[1.65] text-[#493c34] sm:text-[19px] lg:text-[21px]">
            A celebration of colour, culture, and craftsmanship.
            Discover the expressive beauty of tie-dye-inspired
            furniture, where traditional textile artistry meets
            contemporary living. Every pattern tells a story,
            and every piece brings character into your home.
          </p>

          <Link
            href="/timeless-travels"
            className="inline-flex min-h-[52px] items-center justify-center rounded-[10px] bg-[#803d24] px-7 py-3 text-[13px] uppercase tracking-[2px] text-white no-underline transition-all duration-300 hover:bg-[#632d1b]"
          >
            Discover the Story
          </Link>
        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div className="timeless-image relative h-[350px] w-full overflow-hidden sm:h-[440px] md:h-[560px]">
        <img
          src={furnitureImage}
          alt="Adire-inspired upholstered furniture featuring traditional Nigerian textile patterns"
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <style jsx>{`
        .timeless-heading,
        .timeless-description {
          font-family: "Radley", Georgia, serif;
          font-weight: 400;
        }

        .timeless-image img {
          display: block;
          transition: transform 0.7s ease;
        }

        .timeless-image:hover img {
          transform: scale(1.04);
        }

        @media (max-width: 767px) {
          .timeless-content {
            min-height: 340px;
          }

          .timeless-heading {
            font-size: 38px;
          }

          .timeless-description {
            font-size: 17px;
          }
        }

        @media (max-width: 400px) {
          .timeless-content {
            padding-top: 45px;
            padding-bottom: 45px;
          }

          .timeless-heading {
            font-size: 35px;
          }

          .timeless-description {
            font-size: 16px;
          }
        }
      `}</style>
    </section>
  );
}
