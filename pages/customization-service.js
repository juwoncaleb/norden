
import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "./component/Header";
import Footer from "./component/footer";

// Replace these image paths with your own Norden images
// Place the images inside public/images/customization/

const images = {
  hero: "/images/customization/hero.jpg",
  fabric: "/images/customization/fabric.jpg",
  leather: "/images/customization/leather.jpg",
  craftsmanship: "/images/customization/craftsmanship.jpg",
  sofa: "/images/customization/sofa.jpg",
  bed: "/images/customization/bed.jpg",
  dining: "/images/customization/dining.jpg",
  living: "/images/customization/living.jpg",
};

const features = [
  {
    number: "01",
    eyebrow: "THE MATERIAL",
    title: "A fabric that feels like you.",
    description:
      "Every home has its own rhythm. From quiet evenings to lively gatherings, the right upholstery makes all the difference. Explore a thoughtful selection of textures, colours, and finishes to complement the way you live.",
    details:
      "Choose from beautifully textured fabrics, soft neutrals, expressive tones, and carefully considered upholstery options. Our team will help you find a finish that feels right for your space.",
    image: images.fabric,
    label: "Fabric & upholstery",
  },
  {
    number: "02",
    eyebrow: "THE FINISH",
    title: "It's all in the details.",
    description:
      "Sometimes, the smallest detail changes everything. A warmer wood tone. A richer finish. A texture that brings the room together. Norden gives you the freedom to explore the details that make a piece truly yours.",
    details:
      "Discover available finishes and material combinations, selected to bring warmth, balance, and individuality to your furniture.",
    image: images.leather,
    label: "Colours & finishes",
  },
  {
    number: "03",
    eyebrow: "THE CRAFT",
    title: "Made with intention.",
    description:
      "Beautiful furniture should do more than fill a room. It should feel considered, comfortable, and personal. From the first conversation to the finishing touches, we pay attention to the things that matter.",
    details:
      "Our Lagos-based team works with you to understand your preferences and guide you through the customization options available for your selected piece.",
    image: images.craftsmanship,
    label: "Thoughtful craftsmanship",
  },
];

const collections = [
  {
    title: "Sofas",
    subtitle: "Comfort, made personal.",
    image: images.sofa,
    href: "/sofa",
  },
  {
    title: "Beds & Headboards",
    subtitle: "A bedroom that feels like yours.",
    image: images.bed,
    href: "/beds",
  },
  {
    title: "Dining",
    subtitle: "Made for gathering.",
    image: images.dining,
    href: "/diningtable",
  },
  {
    title: "Living",
    subtitle: "Details that define a space.",
    image: images.living,
    href: "/armchair",
  },
];

const process = [
  {
    number: "01",
    title: "Find your favourite",
    description:
      "Explore Norden's furniture collections and choose the piece that speaks to your space.",
  },
  {
    number: "02",
    title: "Make it personal",
    description:
      "Tell us what you have in mind. We'll guide you through the materials, colours, and available customization options.",
  },
  {
    number: "03",
    title: "Confirm the details",
    description:
      "We'll review your preferred specifications, pricing, and estimated production timeline before your order is confirmed.",
  },
  {
    number: "04",
    title: "Made for your space",
    description:
      "Once everything is approved, your furniture moves into production, with the details considered from start to finish.",
  },
];

const faqs = [
  {
    question: "Can I customize any Norden furniture?",
    answer:
      "Customization depends on the furniture piece and the options available for that design. Contact our team with the product you're interested in, and we'll help you explore what's possible.",
  },
  {
    question: "Can I choose a different fabric or colour?",
    answer:
      "For selected furniture pieces, alternative fabrics, colours, and finishes may be available. Our team can walk you through the options before you place an order.",
  },
  {
    question: "How long does customization take?",
    answer:
      "Production timelines vary depending on the furniture design, selected materials, and complexity of the request. We'll communicate an estimated timeline before confirming your order.",
  },
  {
    question: "Can I request custom dimensions?",
    answer:
      "Some designs may accommodate dimensional adjustments. Share your preferred measurements with us, and we'll confirm whether the changes are possible.",
  },
  {
    question: "Do you deliver outside Lagos?",
    answer:
      "Norden is based in Lagos. For delivery outside Lagos, contact our team to confirm available delivery arrangements for your location.",
  },
];

function ArrowIcon({ diagonal = false }) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {diagonal ? (
        <>
          <path d="M5 19 19 5" />
          <path d="M8 5h11v11" />
        </>
      ) : (
        <>
          <path d="M4 12h16" />
          <path d="m13 5 7 7-7 7" />
        </>
      )}
    </svg>
  );
}

export default function CustomizationServicePage() {
  const [activeFaq, setActiveFaq] = useState(null);

  return (
    <>
      <Head>
        <title>Customization Service | Norden Furniture Lagos</title>
        <meta
          name="description"
          content="Discover furniture customization with Norden, Lagos. Explore upholstery, colours, finishes and personalized furniture for your home."
        />
      </Head>

      <Header />

      <main className="norden-custom-page bg-[#F8F6F1] text-[#28251F]">
        {/* =========================================
            HERO
        ========================================= */}

        <section className="relative flex min-h-[620px] items-center overflow-hidden bg-[#332C26] text-white md:min-h-[760px]">
          <div className="absolute inset-0">
            <img
              src={images.hero}
              alt="Beautifully styled Norden furniture"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/10" />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-[1500px] px-6 py-28 sm:px-10 lg:px-20">
            <div className="max-w-[760px]">
              <p className="mb-7 text-[11px] uppercase tracking-[4px] text-white/85 sm:text-[12px]">
                NORDEN / CUSTOMIZATION SERVICE
              </p>

              <h1 className="norden-display mb-7 text-[clamp(56px,8vw,116px)] leading-[0.98] tracking-[-3px]">
                Made for
                <br />
                your space.
              </h1>

              <p className="norden-body mb-10 max-w-[530px] text-[17px] leading-[1.8] text-white/90 sm:text-[20px]">
                Your home is a reflection of you. Your furniture
                should be, too. Discover thoughtful customization
                with Norden, where the details are yours to define.
              </p>

              <a
                href="#discover"
                className="inline-flex min-h-[54px] items-center justify-between gap-12 border border-white px-7 py-4 text-[11px] uppercase tracking-[2px] text-white transition-colors duration-300 hover:bg-white hover:text-[#332C26]"
              >
                EXPLORE CUSTOMIZATION
                <ArrowIcon />
              </a>
            </div>
          </div>

          <div className="absolute bottom-8 left-6 z-10 hidden items-center gap-4 text-[10px] uppercase tracking-[2px] text-white/75 md:left-20 md:flex">
            <span className="h-px w-10 bg-white/70" />
            DESIGNED FOR LIVING
          </div>
        </section>

        {/* =========================================
            INTRODUCTION
        ========================================= */}

        <section
          id="discover"
          className="mx-auto max-w-[1500px] px-6 py-24 text-center sm:px-10 md:py-36 lg:px-20"
        >
          <p className="mb-6 text-[11px] uppercase tracking-[3px] text-[#8B3F1F]">
            A MORE PERSONAL APPROACH
          </p>

          <h2 className="norden-display mx-auto mb-8 max-w-[950px] text-[clamp(40px,5.5vw,78px)] leading-[1.13] tracking-[-1.5px]">
            Your home. Your taste.
            <br />
            Your Norden.
          </h2>

          <p className="norden-body mx-auto max-w-[680px] text-[16px] leading-[1.95] text-[#726C64] sm:text-[19px]">
            We believe the most beautiful spaces are the ones that
            feel deeply personal. Whether you're drawn to timeless
            neutrals, rich textures, or a statement finish,
            customization allows you to create furniture that
            belongs in your world.
          </p>

          <div className="mx-auto mt-12 h-[1px] w-20 bg-[#8B3F1F]" />
        </section>

        {/* =========================================
            MATERIALS / FEATURES
        ========================================= */}

        <section className="border-t border-[#E8E2D9]">
          {features.map((feature, index) => (
            <div
              key={feature.number}
              className={`grid min-h-[580px] grid-cols-1 lg:grid-cols-2 ${
                index % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""
              }`}
            >
              <div className="relative min-h-[360px] overflow-hidden bg-[#E8E2D9] sm:min-h-[480px] lg:min-h-[650px]">
                <img
                  src={feature.image}
                  alt={feature.label}
                  loading="lazy"
                  className="norden-feature-image absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute bottom-6 left-6 bg-[#F8F6F1]/95 px-5 py-3 text-[10px] uppercase tracking-[2px] text-[#332C26] sm:bottom-9 sm:left-9">
                  {feature.label}
                </div>
              </div>

              <div className="flex items-center bg-[#F8F6F1] px-6 py-20 sm:px-12 lg:px-[12%] lg:py-24">
                <div className="w-full max-w-[560px]">
                  <div className="mb-12 flex items-center justify-between border-b border-[#DED7CC] pb-5">
                    <span className="text-[11px] tracking-[2px] text-[#8B3F1F]">
                      {feature.eyebrow}
                    </span>
                    <span className="norden-display text-[26px] text-[#A69B8D]">
                      {feature.number}
                    </span>
                  </div>

                  <h2 className="norden-display mb-7 text-[clamp(38px,4vw,64px)] leading-[1.12] tracking-[-1px]">
                    {feature.title}
                  </h2>

                  <p className="norden-body mb-6 text-[16px] leading-[1.9] text-[#625C55]">
                    {feature.description}
                  </p>

                  <p className="norden-body mb-10 text-[14px] leading-[1.9] text-[#898076]">
                    {feature.details}
                  </p>

                  <Link
                    href="/sofa"
                    className="inline-flex items-center gap-5 border-b border-[#8B3F1F] pb-3 text-[11px] uppercase tracking-[2px] text-[#8B3F1F] transition-all hover:gap-7"
                  >
                    EXPLORE FURNITURE
                    <ArrowIcon diagonal />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* =========================================
            BRAND STATEMENT
        ========================================= */}

        <section className="bg-[#803D24] px-6 py-24 text-center text-white sm:px-10 md:py-36">
          <p className="mb-7 text-[11px] uppercase tracking-[3px] text-white/75">
            THE NORDEN PHILOSOPHY
          </p>

          <h2 className="norden-display mx-auto max-w-[1050px] text-[clamp(39px,5.5vw,78px)] leading-[1.15] tracking-[-1px]">
            Furniture isn't just something you own.
            <br />
            <em>It's something you live with.</em>
          </h2>

          <p className="norden-body mx-auto mt-8 max-w-[660px] text-[16px] leading-[1.9] text-white/80 sm:text-[18px]">
            From slow Sunday mornings to the moments worth
            celebrating, we create pieces designed to become
            part of your everyday life.
          </p>
        </section>

        {/* =========================================
            HOW IT WORKS
        ========================================= */}

        <section className="mx-auto max-w-[1500px] px-6 py-24 sm:px-10 md:py-36 lg:px-20">
          <div className="mb-16 grid gap-6 md:grid-cols-2 md:items-end">
            <div>
              <p className="mb-5 text-[11px] uppercase tracking-[3px] text-[#8B3F1F]">
                THE PROCESS
              </p>
              <h2 className="norden-display text-[clamp(42px,5vw,72px)] leading-[1.12]">
                Your vision,
                <br />
                thoughtfully realized.
              </h2>
            </div>

            <p className="norden-body max-w-[430px] text-[16px] leading-[1.9] text-[#726C64] md:ml-auto">
              Customization should feel exciting, not complicated.
              Our process is designed to help you make confident
              choices, every step of the way.
            </p>
          </div>

          <div className="grid grid-cols-1 border-t border-[#DDD5CA] sm:grid-cols-2 lg:grid-cols-4">
            {process.map((step) => (
              <div
                key={step.number}
                className="border-b border-[#DDD5CA] px-1 py-9 sm:px-6 lg:border-r lg:px-8 first:pl-1 last:border-r-0"
              >
                <span className="norden-display mb-10 block text-[43px] text-[#B2A99D]">
                  {step.number}
                </span>

                <h3 className="norden-display mb-5 text-[27px] leading-tight">
                  {step.title}
                </h3>

                <p className="norden-body text-[14px] leading-[1.9] text-[#777068]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================
            COLLECTIONS
        ========================================= */}

        <section className="bg-[#EDE9E1] px-6 py-24 sm:px-10 md:py-32 lg:px-20">
          <div className="mx-auto max-w-[1500px]">
            <div className="mb-14 flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div>
                <p className="mb-5 text-[11px] uppercase tracking-[3px] text-[#8B3F1F]">
                  DISCOVER NORDEN
                </p>

                <h2 className="norden-display text-[clamp(42px,5vw,72px)] leading-[1.1]">
                  Find your starting point.
                </h2>
              </div>

              <p className="norden-body max-w-[400px] text-[15px] leading-[1.9] text-[#726C64]">
                Begin with a piece you love. Explore our collections
                and discover the customization possibilities
                available for your favourites.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2">
              {collections.map((collection) => (
                <Link
                  href={collection.href}
                  key={collection.title}
                  className="group block"
                >
                  <div className="relative aspect-[1.2] overflow-hidden bg-[#DAD3C8]">
                    <img
                      src={collection.image}
                      alt={`Norden ${collection.title}`}
                      loading="lazy"
                      className="norden-collection-image h-full w-full object-cover"
                    />

                    <span className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#F8F6F1] text-[#28251F] transition-colors group-hover:bg-[#803D24] group-hover:text-white">
                      <ArrowIcon diagonal />
                    </span>
                  </div>

                  <div className="mt-6 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="norden-display text-[30px] sm:text-[35px]">
                        {collection.title}
                      </h3>

                      <p className="norden-body mt-2 text-[14px] text-[#777068]">
                        {collection.subtitle}
                      </p>
                    </div>

                    <span className="mt-2 text-[10px] uppercase tracking-[1.5px] text-[#8B3F1F]">
                      EXPLORE
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================
            LAGOS / LOCAL STORY
        ========================================= */}

        <section className="grid grid-cols-1 lg:grid-cols-2">
          <div className="flex min-h-[460px] items-center bg-[#DDD2C2] px-6 py-20 sm:px-12 lg:px-[12%] lg:py-28">
            <div className="max-w-[560px]">
              <p className="mb-6 text-[11px] uppercase tracking-[3px] text-[#8B3F1F]">
                ROOTED IN LAGOS
              </p>

              <h2 className="norden-display mb-8 text-[clamp(42px,5vw,72px)] leading-[1.1]">
                Inspired by the way
                <em> you live.</em>
              </h2>

              <p className="norden-body mb-7 text-[16px] leading-[1.95] text-[#625C55]">
                Lagos is a city of character, energy, and
                individuality. No two homes tell quite the same
                story, and we believe furniture should celebrate
                that difference.
              </p>

              <p className="norden-body text-[16px] leading-[1.95] text-[#625C55]">
                At Norden, we bring a personal approach to furniture,
                helping you explore pieces, materials, and finishes
                that feel right for your home.
              </p>
            </div>
          </div>

          <div className="relative min-h-[440px] bg-[#C4B5A3] lg:min-h-[650px]">
            <img
              src={images.living}
              alt="Norden furniture for contemporary Lagos homes"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </section>

        {/* =========================================
            FAQ
        ========================================= */}

        <section className="mx-auto grid max-w-[1500px] grid-cols-1 gap-12 px-6 py-24 sm:px-10 md:py-36 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24 lg:px-20">
          <div>
            <p className="mb-5 text-[11px] uppercase tracking-[3px] text-[#8B3F1F]">
              GOOD TO KNOW
            </p>

            <h2 className="norden-display mb-7 text-[clamp(42px,5vw,68px)] leading-[1.1]">
              A few things
              <br />
              you might ask.
            </h2>

            <p className="norden-body max-w-[340px] text-[15px] leading-[1.9] text-[#777068]">
              Have something more specific in mind? Our team
              would be happy to discuss your ideas.
            </p>
          </div>

          <div className="border-t border-[#DDD5CA]">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;

              return (
                <div
                  key={faq.question}
                  className="border-b border-[#DDD5CA]"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setActiveFaq(isOpen ? null : index)
                    }
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 py-7 text-left"
                  >
                    <span className="norden-display text-[21px] leading-[1.4] sm:text-[25px]">
                      {faq.question}
                    </span>

                    <span className="flex h-8 w-8 shrink-0 items-center justify-center text-[25px] font-light text-[#8B3F1F]">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="norden-body max-w-[640px] pb-8 pr-10 text-[15px] leading-[1.9] text-[#777068]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================
            FINAL CTA
        ========================================= */}

        <section className="bg-[#803D24] px-6 py-24 text-center text-white sm:px-10 md:py-36">
          <p className="mb-7 text-[11px] uppercase tracking-[3px] text-white/75">
            LET'S MAKE SOMETHING PERSONAL
          </p>

          <h2 className="norden-display mx-auto mb-8 max-w-[850px] text-[clamp(46px,6vw,88px)] leading-[1.1]">
            Your dream piece
            <br />
            starts here.
          </h2>

          <p className="norden-body mx-auto mb-12 max-w-[570px] text-[16px] leading-[1.9] text-white/85 sm:text-[18px]">
            Have a colour, fabric, or finish in mind? Tell us
            what you're imagining. We'd love to help you
            bring it to life.
          </p>

          <Link
            href="/contact"
            className="inline-flex min-h-[56px] items-center justify-center gap-12 border border-white bg-white px-8 py-4 text-[11px] uppercase tracking-[2px] text-[#803D24] transition-colors hover:bg-transparent hover:text-white"
          >
            ENQUIRE ABOUT CUSTOMIZATION
            <ArrowIcon diagonal />
          </Link>

          <p className="mt-8 text-[12px] tracking-[1px] text-white/65">
            NORDEN · LAGOS, NIGERIA
          </p>
        </section>
      </main>

      <Footer />

      <style jsx global>{`
        .norden-custom-page {
          overflow-x: hidden;
        }

        .norden-custom-page .norden-display {
          font-family: "Radley", Georgia, serif;
          font-weight: 400;
        }

        .norden-custom-page .norden-body {
          font-family: "Radley", Georgia, serif;
          font-weight: 400;
        }

        .norden-custom-page a {
          text-decoration: none;
        }

        .norden-custom-page .norden-feature-image,
        .norden-custom-page .norden-collection-image {
          transition: transform 0.7s ease;
        }

        .norden-custom-page .norden-feature-image:hover,
        .norden-custom-page a.group:hover .norden-collection-image {
          transform: scale(1.045);
        }

        .norden-custom-page button {
          cursor: pointer;
        }

        @media (max-width: 767px) {
          .norden-custom-page .norden-display {
            letter-spacing: -0.6px;
          }

          .norden-custom-page .norden-feature-image:hover {
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .norden-custom-page *,
          .norden-custom-page *::before,
          .norden-custom-page *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
}
