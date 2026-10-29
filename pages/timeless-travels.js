
import React from "react";
import Head from "next/head";
import Link from "next/link";

import Header from "./component/Header";
import Footer from "./component/footer";

// ============================================
// NORDEN TIMELESS TRAVELS
// ============================================

const EMAIL = "info@thenorden.org";

// Tie-dye and adire-inspired furniture photographs.
// Third-party images are for visual reference.
// Obtain permission or use licensed images before
// publishing them commercially.

const images = {
  hero:
    "https://images.squarespace-cdn.com/content/v1/597f5817b8a79b2cf8601aba/1506107059846-JB807VFKXDAN9R9XJDX5/Shibori%2BSofa%2B2.jpg?format=1000w",

  textile:
    "https://images.squarespace-cdn.com/content/v1/679620b23526c33fa3feedee/1749320727088-OIDLY6PVGGQWIPFRVVUL/IMG_8899.jpeg",

  furniture:
    "https://www.dustydeco.com/cdn/shop/files/DD_PRODUCT_JAN_27_SVEDBERG_TIE_DYE_0196_8444648e-0b0e-47a9-a911-f033716fb606.jpg?v=1740039159",

  interior:
    "https://www.etoffe.com/117203/shibori-fabric-scion.jpg",

  detail:
    "https://mixfurniture.com/images/productimages/indigo-mud-cloth-club-chair-22735.jpg",
};

// ============================================
// EMAIL ENQUIRY
// ============================================

function emailLink(
  subject = "Timeless Travels Furniture Enquiry"
) {
  const body = `Hello Norden Team,

I'm interested in learning more about Timeless Travels and tie-dye-inspired furniture.

My name:
Furniture I'm interested in:
Preferred colours or patterns:
Preferred dimensions:
My location:
Additional details:

Please share more information about available designs, customization options, pricing, and production timelines.

Thank you.`;

  return `mailto:${EMAIL}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}

// ============================================
// ARROW ICON
// ============================================

function ArrowIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 19 19 5" />
      <path d="M8 5h11v11" />
    </svg>
  );
}

// ============================================
// INSPIRATION CONTENT
// ============================================

const inspirations = [
  {
    number: "01",
    title: "The beauty of colour.",
    description:
      "Tie-dye celebrates the unexpected. Rich pigments, flowing transitions, and expressive combinations create textiles that feel alive. Whether subtle or bold, colour can transform the personality of a room.",
  },
  {
    number: "02",
    title: "Patterns with a story.",
    description:
      "Across generations, textile traditions have carried meaning through pattern and technique. From Nigerian adire to contemporary interpretations of resist-dyed fabrics, these artistic expressions continue to inspire modern interiors.",
  },
  {
    number: "03",
    title: "A contemporary expression.",
    description:
      "Imagine a statement armchair, an upholstered bench, or a sofa accented with richly patterned cushions. Traditional textile influences can sit beautifully alongside clean silhouettes and contemporary materials.",
  },
];

// ============================================
// MAIN PAGE
// ============================================

export default function TimelessTravelsPage() {
  return (
    <>
      <Head>
        <title>
          Timeless Travels | Norden Furniture Lagos
        </title>

        <meta
          name="description"
          content="Explore Timeless Travels by Norden, a celebration of tie-dye-inspired furniture, expressive textiles, colour, and contemporary interiors."
        />
      </Head>

      <Header />

      <main className="timeless-page bg-[#F8F6F1] text-[#302821]">

        {/* =========================================
            HERO
        ========================================= */}

        <section className="relative flex min-h-[650px] items-center overflow-hidden bg-[#352D27] text-white md:min-h-[780px]">
          <img
            src={images.hero}
            alt="Indigo shibori tie-dye upholstered sofa"
            className="absolute inset-0 h-full w-full object-cover"
            fetchPriority="high"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/15" />

          <div className="relative z-10 mx-auto w-full max-w-[1500px] px-6 py-24 sm:px-10 lg:px-20">
            <div className="max-w-[850px]">
              <p className="mb-7 text-[11px] uppercase tracking-[4px] text-white/85">
                NORDEN / ART & CULTURE
              </p>

              <h1 className="timeless-display mb-8 text-[clamp(58px,8vw,118px)] leading-[0.98] tracking-[-2px]">
                Timeless
                <br />
                <em>Travels.</em>
              </h1>

              <p className="timeless-body mb-10 max-w-[570px] text-[18px] leading-[1.85] text-white/90 sm:text-[21px]">
                A journey through colour, culture, and craft.
                Where the expressive beauty of tie-dye meets
                the timeless language of furniture.
              </p>

              <a
                href="#story"
                className="inline-flex min-h-[55px] items-center gap-10 border border-white bg-white px-7 py-4 text-[11px] uppercase tracking-[2px] text-[#803D24] transition-colors hover:bg-transparent hover:text-white"
              >
                EXPLORE THE STORY
                <ArrowIcon />
              </a>
            </div>
          </div>
        </section>

        {/* =========================================
            INTRODUCTION
        ========================================= */}

        <section
          id="story"
          className="mx-auto max-w-[1500px] px-6 py-24 text-center sm:px-10 md:py-36 lg:px-20"
        >
          <p className="mb-6 text-[11px] uppercase tracking-[3px] text-[#803D24]">
            AN EXPLORATION OF TEXTILE ART
          </p>

          <h2 className="timeless-display mx-auto mb-8 max-w-[1050px] text-[clamp(42px,5.8vw,80px)] leading-[1.12]">
            Some stories are told
            <br />
            <em>through fabric.</em>
          </h2>

          <p className="timeless-body mx-auto max-w-[730px] text-[16px] leading-[1.95] text-[#756C63] sm:text-[19px]">
            Fabric has always been more than a material.
            It carries memories, traditions, and creative
            expression. Timeless Travels explores how
            the fluid patterns and distinctive character
            of tie-dye can inspire furniture that feels
            both artistic and deeply personal.
          </p>

          <div className="mx-auto mt-12 h-px w-20 bg-[#803D24]" />
        </section>

        {/* =========================================
            ADIRE TEXTILE STORY
        ========================================= */}

        <section className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative min-h-[400px] overflow-hidden bg-[#D7C8B7] lg:min-h-[660px]">
            <img
              src={images.textile}
              alt="Adire-inspired upholstered furniture with Nigerian textile patterns"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          <div className="flex items-center bg-[#EAE3D8] px-6 py-20 sm:px-12 lg:px-[12%]">
            <div className="max-w-[570px]">
              <p className="mb-6 text-[11px] uppercase tracking-[3px] text-[#803D24]">
                THE ART OF TIE-DYE
              </p>

              <h2 className="timeless-display mb-8 text-[clamp(40px,5vw,70px)] leading-[1.13]">
                An expression
                <br />
                of individuality.
              </h2>

              <p className="timeless-body mb-6 text-[16px] leading-[1.95] text-[#625C55]">
                Tie-dye is a family of textile techniques
                that use folding, binding, stitching, or
                other forms of resist to create patterns
                through dyeing.
              </p>

              <p className="timeless-body text-[16px] leading-[1.95] text-[#625C55]">
                In Nigeria, adire is one of the country's
                celebrated resist-dyeing traditions. Its
                expressive patterns and rich cultural
                history offer inspiration for contemporary
                spaces that embrace heritage and creativity.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================
            CREATIVE INSPIRATION
        ========================================= */}

        <section className="mx-auto max-w-[1500px] px-6 py-24 sm:px-10 md:py-36 lg:px-20">
          <div className="mb-16 text-center">
            <p className="mb-5 text-[11px] uppercase tracking-[3px] text-[#803D24]">
              THE CREATIVE INSPIRATION
            </p>

            <h2 className="timeless-display text-[clamp(42px,5.5vw,75px)]">
              Tradition meets imagination.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-10 border-t border-[#DDD5CA] md:grid-cols-3">
            {inspirations.map((item) => (
              <div
                key={item.number}
                className="border-b border-[#DDD5CA] py-10"
              >
                <span className="timeless-display mb-9 block text-[45px] text-[#A66E53]">
                  {item.number}
                </span>

                <h3 className="timeless-display mb-6 text-[32px] leading-[1.2]">
                  {item.title}
                </h3>

                <p className="timeless-body text-[15px] leading-[1.9] text-[#756C63]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================
            TIE-DYE FURNITURE
        ========================================= */}

        <section className="grid grid-cols-1 lg:grid-cols-2">
          <div className="flex items-center bg-[#803D24] px-6 py-20 text-white sm:px-12 lg:px-[12%]">
            <div className="max-w-[570px]">
              <p className="mb-6 text-[11px] uppercase tracking-[3px] text-white/75">
                FROM TEXTILE TO FURNITURE
              </p>

              <h2 className="timeless-display mb-8 text-[clamp(42px,5vw,72px)] leading-[1.12]">
                Art you can
                <br />
                <em>live with.</em>
              </h2>

              <p className="timeless-body mb-7 text-[16px] leading-[1.95] text-white/85">
                A beautifully patterned fabric can change
                the entire feeling of a furniture piece.
                Imagine a soft sofa brought to life with
                expressive cushions, a striking accent
                chair, or an upholstered bench that
                becomes the focal point of a room.
              </p>

              <p className="timeless-body mb-10 text-[16px] leading-[1.95] text-white/85">
                Timeless Travels invites you to explore
                the possibilities of combining expressive
                textiles with Norden's contemporary
                furniture aesthetic.
              </p>

              <Link
                href="/sofa"
                className="inline-flex min-h-[54px] items-center gap-9 border border-white px-7 py-4 text-[11px] uppercase tracking-[2px] text-white transition-colors hover:bg-white hover:text-[#803D24]"
              >
                EXPLORE SOFAS
                <ArrowIcon />
              </Link>
            </div>
          </div>

          <div className="relative min-h-[430px] overflow-hidden bg-[#D2C3B4] lg:min-h-[690px]">
            <img
              src={images.furniture}
              alt="Tie-dye upholstered contemporary furniture"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </section>

        {/* =========================================
            TIE-DYE FURNITURE GALLERY
        ========================================= */}

        <section className="bg-[#EEE9E1] px-6 py-24 sm:px-10 md:py-32 lg:px-20">
          <div className="mx-auto max-w-[1500px]">
            <div className="mb-14 text-center">
              <p className="mb-5 text-[11px] uppercase tracking-[3px] text-[#803D24]">
                FURNITURE INSPIRATION
              </p>

              <h2 className="timeless-display text-[clamp(42px,5.5vw,76px)] leading-[1.12]">
                The art of pattern.
              </h2>

              <p className="timeless-body mx-auto mt-6 max-w-[660px] text-[16px] leading-[1.9] text-[#756C63]">
                From statement sofas to richly patterned
                accent chairs, discover the creative
                possibilities of textile-inspired furniture.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
              {[
                {
                  title: "The Shibori Sofa",
                  image: images.hero,
                  description:
                    "Indigo patterns meet contemporary comfort.",
                },
                {
                  title: "The Tie-Dye Statement",
                  image: images.furniture,
                  description:
                    "Expressive upholstery with an artistic edge.",
                },
                {
                  title: "The Indigo Chair",
                  image: images.detail,
                  description:
                    "A bold accent inspired by traditional textiles.",
                },
              ].map((item) => (
                <div key={item.title}>
                  <div className="aspect-[0.85] overflow-hidden bg-[#D7CABC]">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="timeless-gallery-image h-full w-full object-cover"
                    />
                  </div>

                  <h3 className="timeless-display mt-6 text-[30px]">
                    {item.title}
                  </h3>

                  <p className="timeless-body mt-3 text-[15px] leading-[1.8] text-[#756C63]">
                    {item.description}
                  </p>

                  <a
                    href={emailLink(
                      `Enquiry About ${item.title}`
                    )}
                    className="mt-6 inline-flex items-center gap-4 border-b border-[#803D24] pb-3 text-[11px] uppercase tracking-[2px] text-[#803D24]"
                  >
                    ENQUIRE ABOUT THIS STYLE
                    <ArrowIcon />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================
            BRAND PHILOSOPHY
        ========================================= */}

        <section className="bg-[#803D24] px-6 py-24 text-center text-white sm:px-10 md:py-36">
          <p className="mb-7 text-[11px] uppercase tracking-[3px] text-white/75">
            THE NORDEN PERSPECTIVE
          </p>

          <h2 className="timeless-display mx-auto max-w-[1050px] text-[clamp(40px,5.6vw,78px)] leading-[1.16]">
            A home should be
            <br />
            more than beautiful.
            <br />
            <em>It should tell your story.</em>
          </h2>

          <p className="timeless-body mx-auto mt-9 max-w-[700px] text-[17px] leading-[1.9] text-white/80">
            From timeless furniture silhouettes to the
            expressive beauty of textiles, we believe
            great design creates room for individuality.
          </p>
        </section>

        {/* =========================================
            CUSTOMIZATION
        ========================================= */}

        <section className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative min-h-[400px] overflow-hidden bg-[#D2C3B4] lg:min-h-[650px]">
            <img
              src={images.interior}
              alt="Shibori-patterned upholstery and textile inspiration"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          <div className="flex items-center bg-[#DDD2C2] px-6 py-20 sm:px-12 lg:px-[12%]">
            <div className="max-w-[570px]">
              <p className="mb-6 text-[11px] uppercase tracking-[3px] text-[#803D24]">
                MAKE IT YOUR OWN
              </p>

              <h2 className="timeless-display mb-8 text-[clamp(42px,5vw,70px)] leading-[1.12]">
                Your space.
                <br />
                Your expression.
              </h2>

              <p className="timeless-body mb-9 text-[16px] leading-[1.95] text-[#625C55]">
                Whether you love bold patterns or subtle
                accents, textiles can add warmth and
                personality to your home. Explore how
                furniture finishes, upholstery, and
                thoughtful styling choices can work
                together to create a distinctive space.
              </p>

              <Link
                href="/customization-service"
                className="inline-flex min-h-[54px] items-center gap-9 bg-[#803D24] px-7 py-4 text-[11px] uppercase tracking-[2px] text-white transition-colors hover:bg-[#612D1B]"
              >
                EXPLORE CUSTOMIZATION
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================
            FINAL EMAIL ENQUIRY
        ========================================= */}

        <section className="bg-[#803D24] px-6 py-24 text-center text-white sm:px-10 md:py-36">
          <p className="mb-7 text-[11px] uppercase tracking-[3px] text-white/75">
            DISCOVER THE POSSIBILITIES
          </p>

          <h2 className="timeless-display mx-auto mb-8 max-w-[900px] text-[clamp(46px,6vw,86px)] leading-[1.1]">
            Bring a little more
            <br />
            <em>colour into your world.</em>
          </h2>

          <p className="timeless-body mx-auto mb-12 max-w-[650px] text-[17px] leading-[1.9] text-white/85">
            Inspired by tie-dye and expressive textiles?
            Tell us what you're imagining. Contact
            Norden to discuss furniture designs, available
            upholstery options, and customization
            possibilities.
          </p>

          <a
            href={emailLink()}
            className="inline-flex min-h-[56px] items-center justify-center gap-10 border border-white bg-white px-8 py-4 text-[11px] uppercase tracking-[2px] text-[#803D24] transition-colors hover:bg-transparent hover:text-white"
          >
            ENQUIRE ABOUT TIMELESS TRAVELS
            <ArrowIcon />
          </a>

          <p className="mt-8 text-[12px] tracking-[1px] text-white/65">
            NORDEN · LAGOS, NIGERIA
          </p>

          <a
            href={`mailto:${EMAIL}`}
            className="mt-4 inline-block text-[14px] text-white/85 underline underline-offset-4"
          >
            {EMAIL}
          </a>
        </section>
      </main>

      <Footer />

      {/* =========================================
          PAGE STYLES
      ========================================= */}

      <style jsx global>{`
        .timeless-page {
          overflow-x: hidden;
          scroll-behavior: smooth;
        }

        .timeless-page .timeless-display {
          font-family: "Radley", Georgia, serif;
          font-weight: 400;
        }

        .timeless-page .timeless-body {
          font-family: "Radley", Georgia, serif;
          font-weight: 400;
        }

        .timeless-page img {
          display: block;
        }

        .timeless-page a {
          text-decoration: none;
        }

        .timeless-page .timeless-gallery-image {
          transition: transform 0.7s ease;
        }

        .timeless-page .timeless-gallery-image:hover {
          transform: scale(1.04);
        }

        @media (max-width: 767px) {
          .timeless-page .timeless-display {
            letter-spacing: -0.6px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .timeless-page *,
          .timeless-page *::before,
          .timeless-page *::after {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
}
