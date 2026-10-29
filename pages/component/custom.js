
import React from "react";
import Link from "next/link";

export default function CustomizationSection() {
  return (
    <section className="customization-section grid w-full grid-cols-1 overflow-hidden md:grid-cols-2">
      {/* LEFT IMAGE */}
      <div className="customization-image relative h-[300px] w-full overflow-hidden sm:h-[400px] md:h-[560px]">
        <img
          src="./fabric.avif"
          alt="Norden premium furniture fabric samples"
          className="h-full w-full object-cover"
        />
      </div>

      {/* RIGHT CONTENT */}
      <div className="customization-content flex w-full items-center bg-[#803d24] px-6 py-14 text-white sm:px-10 md:min-h-[560px] md:px-[10%] md:py-16 lg:px-[11%]">
        <div className="customization-inner w-full max-w-[700px]">
          <h2 className="customization-heading mb-7 text-[30px] font-normal leading-tight tracking-[-1px] text-white sm:text-[36px] lg:text-[42px]">
            Customization service
          </h2>

          <p className="customization-description mb-10 text-[17px] leading-[1.55] text-white sm:text-[19px] lg:text-[22px]">
            Start with a favorite. Customize our bestsellers
            with materials designed for real life–spills,
            pets, and everything in between.
          </p>

       
<Link
  href="/customization-service"
  className="customization-button inline-flex min-h-[50px] items-center justify-center rounded-[10px] border border-white bg-transparent px-5 py-3 text-[15px] font-normal uppercase tracking-[2px] text-white no-underline transition-all duration-300 hover:bg-white hover:text-[#803d24]"
>
  Learn More
</Link>

        </div>
      </div>

      {/* ADDITIONAL JSX STYLING */}
      <style jsx>{`
        .customization-section {
          width: 100%;
        }

        .customization-image img {
          display: block;
          transition: transform 0.6s ease;
        }

        .customization-image:hover img {
          transform: scale(1.025);
        }

        .customization-heading {
          font-family: "Radley", Georgia, serif;
        }

        .customization-description {
          font-family: "Radley", Georgia, serif;
        }

        @media (max-width: 767px) {
          .customization-content {
            min-height: 340px;
          }

          .customization-heading {
            font-size: 30px;
            margin-bottom: 22px;
          }

          .customization-description {
            font-size: 17px;
            line-height: 1.6;
            margin-bottom: 30px;
          }
        }

        @media (max-width: 400px) {
          .customization-content {
            padding-top: 45px;
            padding-bottom: 45px;
          }

          .customization-heading {
            font-size: 28px;
          }

          .customization-description {
            font-size: 16px;
          }
        }
      `}</style>
    </section>
  );
}
