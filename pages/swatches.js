
import React, { useState } from "react";
import Head from "next/head";

import Header from "./component/Header";
import Footer from "./component/footer";

// ============================================
// NORDEN SWATCHES
// ============================================

const EMAIL = "info@thenorden.org";

// Sample swatches.
// Replace names, colours and availability with
// Norden's actual fabric and finish catalogue.

const swatches = [
  {
    category: "Bouclé",
    items: [
      { name: "Ivory Bouclé", color: "#E8E1D5" },
      { name: "Cream Bouclé", color: "#D9CFBF" },
      { name: "Oat Bouclé", color: "#BEB09C" },
      { name: "Sand Bouclé", color: "#C5AD91" },
      { name: "Taupe Bouclé", color: "#9C8A79" },
      { name: "Charcoal Bouclé", color: "#56514E" },
    ],
  },
  {
    category: "Velvet",
    items: [
      { name: "Champagne Velvet", color: "#D6BE9A" },
      { name: "Mocha Velvet", color: "#775543" },
      { name: "Chocolate Velvet", color: "#4D3027" },
      { name: "Olive Velvet", color: "#666B4B" },
      { name: "Burgundy Velvet", color: "#65353D" },
      { name: "Midnight Velvet", color: "#303D4D" },
    ],
  },
  {
    category: "Linen",
    items: [
      { name: "Natural Linen", color: "#DCD3BF" },
      { name: "Stone Linen", color: "#BDB5A8" },
      { name: "Warm Beige Linen", color: "#C7B39B" },
      { name: "Mushroom Linen", color: "#A79A88" },
      { name: "Sage Linen", color: "#939D8B" },
      { name: "Ash Linen", color: "#77746D" },
    ],
  },
  {
    category: "Chenille",
    items: [
      { name: "Pearl Chenille", color: "#E3DCCF" },
      { name: "Camel Chenille", color: "#BD9873" },
      { name: "Caramel Chenille", color: "#A56F47" },
      { name: "Cocoa Chenille", color: "#785B4B" },
      { name: "Forest Chenille", color: "#435A4C" },
      { name: "Graphite Chenille", color: "#55565A" },
    ],
  },
  {
    category: "Leather",
    items: [
      { name: "Ivory Leather", color: "#E4D5BE" },
      { name: "Tan Leather", color: "#B67C4E" },
      { name: "Cognac Leather", color: "#9D5B35" },
      { name: "Espresso Leather", color: "#51382E" },
      { name: "Chocolate Leather", color: "#392720" },
      { name: "Black Leather", color: "#252321" },
    ],
  },
  {
    category: "Wood Finishes",
    items: [
      { name: "Natural Oak", color: "#C7A47B" },
      { name: "Light Walnut", color: "#A37A53" },
      { name: "American Walnut", color: "#765033" },
      { name: "Dark Walnut", color: "#493323" },
      { name: "Smoked Oak", color: "#655647" },
      { name: "Ebony", color: "#292521" },
    ],
  },
];

const filters = [
  "All",
  ...swatches.map((group) => group.category),
];

function makeEnquiry(selected) {
  const subject = "Norden Swatches Enquiry";

  const selections = selected.length
    ? selected.map((item) => `- ${item}`).join("\n")
    : "I would like to enquire about available swatches.";

  const body = `Hello Norden Team,

I'm interested in the following furniture fabrics or finishes:

${selections}

My name:
Furniture I'm interested in:
My location:

Please let me know which samples are available and how I can view or request them.

Thank you.`;

  return `mailto:${EMAIL}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}

export default function SwatchesPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selected, setSelected] = useState([]);

  const visibleGroups =
    activeFilter === "All"
      ? swatches
      : swatches.filter(
          (group) => group.category === activeFilter
        );

  const toggleSwatch = (name) => {
    setSelected((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name]
    );
  };

  return (
    <>
      <Head>
        <title>Furniture Swatches | Norden</title>

        <meta
          name="description"
          content="Explore Norden furniture fabric and finish swatches, including bouclé, velvet, linen, chenille, leather and wood."
        />
      </Head>

      <Header />

      <main className="norden-swatches min-h-screen bg-[#F8F6F1] text-[#302821]">

        {/* PAGE HEADING */}

        <section className="border-b border-[#E6DFD5] px-6 pb-12 pt-20 text-center sm:px-10 md:pb-16 md:pt-28">
          <p className="mb-5 text-[11px] uppercase tracking-[3px] text-[#803D24]">
            NORDEN MATERIAL LIBRARY
          </p>

          <h1 className="swatch-heading text-[clamp(48px,6vw,86px)] leading-[1.1]">
            Swatches.
          </h1>

          <p className="swatch-body mx-auto mt-6 max-w-[570px] text-[17px] leading-[1.8] text-[#756C63]">
            Explore our colours, fabrics and finishes.
            Select your favourites and enquire about
            available samples.
          </p>
        </section>

        {/* FILTERS */}

        <section className="sticky top-0 z-20 border-b border-[#E6DFD5] bg-[#F8F6F1]/95 px-6 py-5 backdrop-blur-md sm:px-10 lg:px-20">
          <div className="mx-auto flex max-w-[1450px] gap-3 overflow-x-auto swatch-filters">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`shrink-0 rounded-full border px-5 py-3 text-[11px] uppercase tracking-[1.5px] transition-colors ${
                  activeFilter === filter
                    ? "border-[#803D24] bg-[#803D24] text-white"
                    : "border-[#D8CFC3] bg-transparent text-[#675A50] hover:border-[#803D24]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        {/* SWATCH COLLECTIONS */}

        <section className="mx-auto max-w-[1450px] px-6 pb-28 pt-14 sm:px-10 md:pt-20 lg:px-20">
          {visibleGroups.map((group) => (
            <div
              key={group.category}
              className="mb-20 last:mb-0"
            >
              <div className="mb-9 flex items-center justify-between border-b border-[#DDD5CA] pb-5">
                <h2 className="swatch-heading text-[35px] sm:text-[44px]">
                  {group.category}
                </h2>

                <span className="text-[11px] uppercase tracking-[2px] text-[#9A8D80]">
                  {group.items.length} COLOURS
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-x-6">
                {group.items.map((item) => {
                  const isSelected = selected.includes(
                    item.name
                  );

                  return (
                    <button
                      type="button"
                      key={item.name}
                      onClick={() =>
                        toggleSwatch(item.name)
                      }
                      aria-pressed={isSelected}
                      className="group block w-full text-left"
                    >
                      <div
                        className={`relative aspect-[0.9] overflow-hidden border-[3px] transition-all duration-200 ${
                          isSelected
                            ? "border-[#803D24]"
                            : "border-transparent group-hover:border-[#C6B8AA]"
                        }`}
                      >
                        {/* COLOUR SWATCH */}

                        <div
                          className="h-full w-full"
                          style={{
                            backgroundColor: item.color,
                          }}
                        />

                        {/* SUBTLE FABRIC TEXTURE */}

                        {group.category !==
                          "Wood Finishes" && (
                          <div className="swatch-texture absolute inset-0" />
                        )}

                        {/* SELECTED INDICATOR */}

                        {isSelected && (
                          <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#803D24] text-[15px] text-white">
                            ✓
                          </span>
                        )}
                      </div>

                      <div className="mt-4 flex items-start justify-between gap-2">
                        <div>
                          <h3 className="swatch-body text-[15px] leading-[1.5]">
                            {item.name}
                          </h3>

                          <p className="mt-1 text-[11px] text-[#93867A]">
                            {group.category}
                          </p>
                        </div>

                        <span
                          className={`mt-1 text-[18px] ${
                            isSelected
                              ? "text-[#803D24]"
                              : "text-[#B5AA9E]"
                          }`}
                        >
                          {isSelected ? "✓" : "+"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        {/* ENQUIRY SECTION */}

        <section className="bg-[#EAE3D8] px-6 py-20 text-center sm:px-10 md:py-28">
          <p className="mb-5 text-[11px] uppercase tracking-[3px] text-[#803D24]">
            YOUR SELECTION
          </p>

          <h2 className="swatch-heading text-[clamp(40px,5vw,68px)] leading-[1.15]">
            Find your perfect finish.
          </h2>

          <p className="swatch-body mx-auto mt-6 max-w-[560px] text-[16px] leading-[1.85] text-[#756C63]">
            Select the swatches you love and contact
            our team to discuss availability.
          </p>

          {selected.length > 0 && (
            <div className="mx-auto mt-9 flex max-w-[750px] flex-wrap justify-center gap-3">
              {selected.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => toggleSwatch(name)}
                  className="flex items-center gap-3 rounded-full border border-[#C9B8A8] bg-[#F8F6F1] px-4 py-2 text-[12px] text-[#594A40]"
                >
                  {name}
                  <span className="text-[#803D24]">
                    ×
                  </span>
                </button>
              ))}
            </div>
          )}

          <a
            href={makeEnquiry(selected)}
            className="mt-10 inline-flex min-h-[54px] items-center justify-center gap-5 bg-[#803D24] px-8 py-4 text-[12px] uppercase tracking-[2px] text-white transition-colors hover:bg-[#612D1B]"
          >
            ENQUIRE ABOUT SWATCHES
            {selected.length > 0 && (
              <span className="border-l border-white/40 pl-4">
                {selected.length}
              </span>
            )}
          </a>
        </section>
      </main>

      <Footer />

      <style jsx global>{`
        .norden-swatches {
          overflow-x: hidden;
        }

        .norden-swatches .swatch-heading,
        .norden-swatches .swatch-body {
          font-family: "Radley", Georgia, serif;
          font-weight: 400;
        }

        .norden-swatches a {
          text-decoration: none;
        }

        .norden-swatches button {
          cursor: pointer;
        }

        .norden-swatches .swatch-filters {
          scrollbar-width: none;
        }

        .norden-swatches .swatch-filters::-webkit-scrollbar {
          display: none;
        }

        .norden-swatches .swatch-texture {
          opacity: 0.14;
          background-image:
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(255, 255, 255, 0.45) 3px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(0, 0, 0, 0.15) 3px
            );
          pointer-events: none;
        }

        @media (max-width: 600px) {
          .norden-swatches .swatch-heading {
            letter-spacing: -0.6px;
          }
        }
      `}</style>
    </>
  );
}
