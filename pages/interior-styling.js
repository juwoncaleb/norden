
import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";

import Header from "./component/Header";
import Footer from "./component/footer";

// ============================================
// NORDEN INTERIOR STYLING
// ============================================

const EMAIL = "info@thenorden.org";


const images = {
  // HERO - Luxury interior
  hero:
    "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1800",

  // STEP 1 - Consultation
  consultation:
    "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200",

  // STEP 2 - Interior inspiration
  inspiration:
    "https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=1200",

  // STEP 3 - Materials and finishes
  materials:
    "https://images.pexels.com/photos/2082087/pexels-photo-2082087.jpeg?auto=compress&cs=tinysrgb&w=1200",

  // Furniture guidance
  sofa:
    "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=1200",

  // Room styling
  living:
    "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200",

  // Personalized styling
  bedroom:
    "https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=1200",

  // Dining room
  dining:
    "https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=1200",

  // Customization section
  customization:
    "https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg?auto=compress&cs=tinysrgb&w=1200",
};


// ============================================
// EMAIL ENQUIRY LINK
// ============================================

function enquiryLink(service = "Interior Styling") {
  const subject = `Norden ${service} Enquiry`;

  const body = `Hello Norden Team,

I'm interested in your ${service.toLowerCase()} service.

My name:
My location:
Type of space:
Number of rooms:
Furniture I'm interested in:
My preferred style:
My estimated budget:

Please share more information about the available options, pricing, and next steps.

Thank you.`;

  return `mailto:${EMAIL}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}

// ============================================
// CONTENT
// ============================================

const steps = [
  {
    number: "01",
    title: "Tell us about your space.",
    image: images.consultation,
    description:
      "Every beautiful space begins with a conversation. Share your ideas, the room you're working on, and the kind of atmosphere you want to create. We'll help you identify where to begin.",
  },
  {
    number: "02",
    title: "Explore your possibilities.",
    image: images.inspiration,
    description:
      "Discover furniture, colours, textures, and arrangements that complement your lifestyle. We'll help you consider the pieces and combinations that feel right for your home.",
  },
  {
    number: "03",
    title: "Bring your vision together.",
    image: images.materials,
    description:
      "With a clearer direction, you can confidently explore furniture selections, finishes, and the details that turn a collection of pieces into a beautifully considered space.",
  },
];

const services = [
  {
    number: "01",
    title: "Furniture Guidance",
    subtitle: "A good place to begin.",
    image: images.sofa,
    description:
      "Not sure which sofa, dining table, or statement piece is right for your home? Start a conversation with Norden about furniture styles, dimensions, materials, and available options.",
    features: [
      "Furniture recommendations",
      "Product information",
      "Material and finish guidance",
      "Enquiry by email",
    ],
    cta: "ENQUIRE NOW",
  },
  {
    number: "02",
    title: "Room Styling",
    subtitle: "Bring the whole room together.",
    image: images.living,
    description:
      "Explore a more cohesive approach to furnishing your space. From complementary pieces to colours and textures, we'll discuss your ideas and the styling support available.",
    features: [
      "Living room and bedroom styling",
      "Furniture combinations",
      "Colour and texture direction",
      "Available consultation options",
    ],
    cta: "DISCUSS YOUR SPACE",
  },
  {
    number: "03",
    title: "Personalized Styling",
    subtitle: "A space that's distinctly yours.",
    image: images.bedroom,
    description:
      "For spaces that need a more individual approach, share your vision with our team. We'll discuss your requirements and determine the scope, possibilities, and next steps.",
    features: [
      "Personalized furniture selection",
      "Customization enquiries",
      "Multiple-room enquiries",
      "Scope and pricing discussion",
    ],
    cta: "START AN ENQUIRY",
  },
];

const comparison = [
  {
    name: "Furniture recommendations",
    values: [true, true, true],
  },
  {
    name: "Product and material information",
    values: [true, true, true],
  },
  {
    name: "Colour and styling direction",
    values: [true, true, true],
  },
  {
    name: "Room-specific furniture combinations",
    values: [false, true, true],
  },
  {
    name: "Multiple-room styling discussion",
    values: [false, false, true],
  },
  {
    name: "Customization guidance",
    values: [true, true, true],
  },
];

const faqs = [
  {
    question: "What is Norden's interior styling service?",
    answer:
      "Our interior styling enquiries help you explore furniture, colours, materials, and combinations for your home. The exact level of support available will be discussed with our team before proceeding.",
  },
  {
    question: "Is the styling service complimentary?",
    answer:
      "You can contact Norden to discuss your styling needs without committing to a purchase. Please confirm with our team which consultations or additional styling deliverables, if any, are complimentary or paid.",
  },
  {
    question: "Can Norden help me choose furniture for my living room?",
    answer:
      "Yes, you can enquire about sofas, coffee tables, accent chairs, and complementary furniture for your living room. Our team can discuss available products and suitable combinations.",
  },
  {
    question: "Can I request help for more than one room?",
    answer:
      "Yes. Share the rooms you would like to furnish and the support you need. Our team can review the scope and explain the available options.",
  },
  {
    question: "Can I customize furniture during the styling process?",
    answer:
      "Selected Norden furniture may offer customization options. You can discuss preferred fabrics, colours, finishes, or dimensions, subject to product availability and feasibility.",
  },
  {
    question: "Do I need to be in Lagos?",
    answer:
      "Norden is based in Lagos, Nigeria. If you are outside Lagos, contact the team to discuss whether your enquiry can be handled remotely and what delivery arrangements may be available.",
  },
  {
    question: "Will I receive a mood board or floor plan?",
    answer:
      "Mood boards, floor plans, and other detailed design deliverables are not automatically included. Please ask our team whether these are available for your project and whether additional fees apply.",
  },
];

// ============================================
// ICONS
// ============================================

function ArrowIcon({ diagonal = false }) {
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

// ============================================
// MAIN PAGE
// ============================================

export default function InteriorStylingPage() {
  const [activeFaq, setActiveFaq] = useState(null);

  return (
    <>
      <Head>
        <title>
          Interior Styling Service | Norden Furniture Lagos
        </title>
        <meta
          name="description"
          content="Explore furniture and interior styling with Norden, a Lagos-based furniture brand. Discover personalized furniture recommendations, room styling and customization."
        />
      </Head>

      <Header />

      <main className="norden-styling-page bg-[#F8F6F1] text-[#302821]">

        {/* =========================================
            HERO
        ========================================= */}

        <section className="relative flex min-h-[650px] items-center overflow-hidden bg-[#3A332D] text-white md:min-h-[790px]">
          <img
            src={images.hero}
            alt="Beautifully styled contemporary living room"
            className="absolute inset-0 h-full w-full object-cover"
            fetchPriority="high"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />

          <div className="relative z-10 mx-auto w-full max-w-[1500px] px-6 py-24 sm:px-10 lg:px-20">
            <div className="max-w-[800px]">
              <p className="mb-7 text-[11px] uppercase tracking-[4px] text-white/85">
                NORDEN / INTERIOR STYLING
              </p>

              <h1 className="norden-display mb-8 text-[clamp(52px,7.5vw,108px)] leading-[1.02] tracking-[-2px]">
                A home that
                <br />
                feels like
                <br />
                <em>you.</em>
              </h1>

              <p className="norden-body mb-10 max-w-[560px] text-[17px] leading-[1.85] text-white/90 sm:text-[20px]">
                Great spaces are created with intention.
                Discover furniture, textures, and thoughtful
                details that bring warmth, character, and
                personality to your home.
              </p>

              <a
                href={enquiryLink()}
                className="inline-flex min-h-[56px] items-center justify-center gap-10 border border-white bg-white px-7 py-4 text-[11px] uppercase tracking-[2px] text-[#803D24] transition-colors hover:bg-transparent hover:text-white"
              >
                ENQUIRE ABOUT STYLING
                <ArrowIcon diagonal />
              </a>
            </div>
          </div>

          <div className="absolute bottom-8 left-6 hidden items-center gap-4 text-[10px] uppercase tracking-[2px] text-white/75 md:left-20 md:flex">
            <span className="h-px w-10 bg-white/70" />
            DESIGNED FOR LIVING
          </div>
        </section>

        {/* =========================================
            INTRODUCTION
        ========================================= */}

        <section className="mx-auto max-w-[1500px] px-6 py-24 text-center sm:px-10 md:py-36 lg:px-20">
          <p className="mb-6 text-[11px] uppercase tracking-[3px] text-[#8B3F1F]">
            A THOUGHTFUL APPROACH TO LIVING
          </p>

          <h2 className="norden-display mx-auto mb-8 max-w-[950px] text-[clamp(42px,5.8vw,80px)] leading-[1.13]">
            Beautiful spaces
            <br />
            begin with a feeling.
          </h2>

          <p className="norden-body mx-auto max-w-[720px] text-[16px] leading-[1.95] text-[#756C63] sm:text-[19px]">
            Your home should tell your story. Whether you're
            refreshing a quiet corner, choosing the perfect
            sofa, or furnishing an entirely new space,
            Norden helps you explore furniture that feels
            considered, comfortable, and distinctly yours.
          </p>

          <div className="mx-auto mt-12 h-px w-20 bg-[#803D24]" />
        </section>

        {/* =========================================
            HOW IT WORKS
        ========================================= */}

        <section className="bg-[#EEE9E1] px-6 py-24 sm:px-10 md:py-32 lg:px-20">
          <div className="mx-auto max-w-[1500px]">
            <div className="mb-16 text-center">
              <p className="mb-5 text-[11px] uppercase tracking-[3px] text-[#8B3F1F]">
                THE NORDEN EXPERIENCE
              </p>

              <h2 className="norden-display text-[clamp(42px,5.5vw,76px)] leading-[1.12]">
                How it works.
              </h2>

              <p className="norden-body mx-auto mt-6 max-w-[650px] text-[16px] leading-[1.9] text-[#756C63]">
                A simple starting point for creating a space
                that feels more personal.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-10 md:grid-cols-3 lg:gap-8">
              {steps.map((step) => (
                <div key={step.number}>
                  <div className="group relative aspect-[1.15] overflow-hidden bg-[#D9D1C5]">
                    <img
                      src={step.image}
                      alt={step.title}
                      loading="lazy"
                      className="norden-image h-full w-full object-cover"
                    />
                  </div>

                  <div className="mt-8 flex items-start gap-5">
                    <span className="norden-display text-[31px] text-[#9B5B40]">
                      {step.number}
                    </span>

                    <div>
                      <h3 className="norden-display mb-4 text-[29px] leading-[1.2]">
                        {step.title}
                      </h3>

                      <p className="norden-body text-[15px] leading-[1.9] text-[#756C63]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================
            SERVICES
        ========================================= */}

        <section
          id="services"
          className="mx-auto max-w-[1500px] px-6 py-24 sm:px-10 md:py-36 lg:px-20"
        >
          <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="mb-5 text-[11px] uppercase tracking-[3px] text-[#8B3F1F]">
                STYLING WITH NORDEN
              </p>

              <h2 className="norden-display text-[clamp(42px,5.5vw,76px)] leading-[1.12]">
                Find the right
                <br />
                starting point.
              </h2>
            </div>

            <p className="norden-body max-w-[410px] text-[16px] leading-[1.9] text-[#756C63]">
              Every home has different needs. Explore the
              kinds of styling conversations you can start
              with our team.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.number}
                className="flex flex-col border border-[#E4DDD3] bg-[#FBFAF7]"
              >
                <div className="relative aspect-[1.15] overflow-hidden bg-[#E1D8CC]">
                  <img
                    src={service.image}
                    alt={service.title}
                    loading="lazy"
                    className="norden-image h-full w-full object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col p-7 sm:p-9">
                  <div className="mb-7 flex items-center justify-between border-b border-[#E1D9CF] pb-5">
                    <span className="text-[10px] uppercase tracking-[2px] text-[#8B3F1F]">
                      STYLING ENQUIRY
                    </span>

                    <span className="norden-display text-[25px] text-[#A69B8D]">
                      {service.number}
                    </span>
                  </div>

                  <h3 className="norden-display mb-3 text-[36px] leading-[1.15]">
                    {service.title}
                  </h3>

                  <p className="norden-display mb-6 text-[21px] italic text-[#9A664E]">
                    {service.subtitle}
                  </p>

                  <p className="norden-body mb-8 text-[15px] leading-[1.9] text-[#756C63]">
                    {service.description}
                  </p>

                  <div className="mb-10 border-t border-[#E4DDD3] pt-6">
                    {service.features.map((feature) => (
                      <div
                        key={feature}
                        className="mb-4 flex items-start gap-3"
                      >
                        <span className="mt-[2px] text-[#8B3F1F]">
                          ✓
                        </span>

                        <span className="norden-body text-[14px] leading-[1.6] text-[#5E554C]">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <a
                    href={enquiryLink(service.title)}
                    className="mt-auto flex min-h-[54px] items-center justify-between gap-4 bg-[#803D24] px-6 py-4 text-[11px] uppercase tracking-[1.8px] text-white transition-colors hover:bg-[#612D1B]"
                  >
                    {service.cta}
                    <ArrowIcon diagonal />
                  </a>
                </div>
              </article>
            ))}
          </div>

          <p className="norden-body mt-8 text-center text-[13px] leading-[1.8] text-[#81776D]">
            Service availability, scope, pricing, and any
            detailed styling deliverables are confirmed
            directly with the Norden team.
          </p>
        </section>

        {/* =========================================
            BRAND STATEMENT
        ========================================= */}

        <section className="bg-[#803D24] px-6 py-24 text-center text-white sm:px-10 md:py-36">
          <p className="mb-7 text-[11px] uppercase tracking-[3px] text-white/75">
            THE ART OF LIVING WELL
          </p>

          <h2 className="norden-display mx-auto max-w-[1000px] text-[clamp(39px,5.6vw,78px)] leading-[1.16]">
            A well-styled home
            <br />
            isn't about having more.
            <br />
            <em>It's about choosing well.</em>
          </h2>

          <p className="norden-body mx-auto mt-9 max-w-[660px] text-[16px] leading-[1.9] text-white/80 sm:text-[18px]">
            Furniture should feel beautiful, purposeful,
            and completely at home in your space.
          </p>
        </section>

        {/* =========================================
            WHAT TO EXPECT
        ========================================= */}

        <section className="mx-auto max-w-[1300px] px-6 py-24 sm:px-10 md:py-36">
          <div className="mb-14 text-center">
            <p className="mb-5 text-[11px] uppercase tracking-[3px] text-[#8B3F1F]">
              AT A GLANCE
            </p>

            <h2 className="norden-display text-[clamp(42px,5.5vw,72px)]">
              What can we discuss?
            </h2>

            <p className="norden-body mx-auto mt-5 max-w-[650px] text-[15px] leading-[1.9] text-[#756C63]">
              Use this guide to decide what kind of enquiry
              best matches your furniture and styling needs.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#DAD2C8]">
                  <th className="w-[40%] px-4 py-6 text-left text-[12px] font-normal uppercase tracking-[1.5px]">
                    TOPIC
                  </th>

                  {[
                    "Furniture",
                    "Room Styling",
                    "Personalized",
                  ].map((name) => (
                    <th
                      key={name}
                      className="norden-display px-3 py-6 text-center text-[19px] font-normal"
                    >
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {comparison.map((item) => (
                  <tr
                    key={item.name}
                    className="border-b border-[#E5DED4]"
                  >
                    <td className="norden-body px-4 py-6 text-[15px] text-[#5D554E]">
                      {item.name}
                    </td>

                    {item.values.map((available, index) => (
                      <td
                        key={index}
                        className="px-3 py-6 text-center"
                      >
                        <span
                          className={`text-[20px] ${
                            available
                              ? "text-[#803D24]"
                              : "text-[#B8AFA5]"
                          }`}
                        >
                          {available ? "✓" : "—"}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="norden-body mt-6 text-[12px] leading-[1.8] text-[#81776D]">
            This table describes enquiry topics, not guaranteed
            service packages or deliverables.
          </p>
        </section>

        {/* =========================================
            INSPIRATION SECTION
        ========================================= */}

        <section className="bg-[#EEE9E1] px-6 py-24 sm:px-10 md:py-32 lg:px-20">
          <div className="mx-auto max-w-[1500px]">
            <div className="mb-14 text-center">
              <p className="mb-5 text-[11px] uppercase tracking-[3px] text-[#8B3F1F]">
                SPACES TO INSPIRE
              </p>

              <h2 className="norden-display text-[clamp(42px,5.5vw,76px)]">
                The beauty of feeling at home.
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  title: "The Living Room",
                  image: images.living,
                  description: "Made for moments together.",
                  href: "/sofa",
                },
                {
                  title: "The Bedroom",
                  image: images.bedroom,
                  description: "Your personal retreat.",
                  href: "/beds",
                },
                {
                  title: "The Dining Room",
                  image: images.dining,
                  description: "Where stories are shared.",
                  href: "/diningtable",
                },
              ].map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group block"
                >
                  <div className="aspect-[0.9] overflow-hidden bg-[#D8CFC2]">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="norden-image h-full w-full object-cover"
                    />
                  </div>

                  <div className="mt-6 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="norden-display text-[30px]">
                        {item.title}
                      </h3>

                      <p className="norden-body mt-2 text-[14px] text-[#756C63]">
                        {item.description}
                      </p>
                    </div>

                    <ArrowIcon diagonal />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================
            CUSTOMIZATION SERVICE
        ========================================= */}

        <section className="grid grid-cols-1 lg:grid-cols-2">
          <div className="flex min-h-[480px] items-center bg-[#DDD2C2] px-6 py-20 sm:px-12 lg:px-[12%] lg:py-24">
            <div className="max-w-[560px]">
              <p className="mb-6 text-[11px] uppercase tracking-[3px] text-[#803D24]">
                MAKE IT PERSONAL
              </p>

              <h2 className="norden-display mb-8 text-[clamp(42px,5vw,72px)] leading-[1.12]">
                Your furniture.
                <br />
                <em>Your way.</em>
              </h2>

              <p className="norden-body mb-9 text-[16px] leading-[1.95] text-[#625C55]">
                The right furniture becomes even more special
                when it reflects your personal style. Explore
                available customization options, from fabric
                selections to colours, finishes, and the
                details that make a piece feel like yours.
              </p>

              <Link
                href="/customization-service"
                className="inline-flex min-h-[54px] items-center gap-10 bg-[#803D24] px-7 py-4 text-[11px] uppercase tracking-[2px] text-white transition-colors hover:bg-[#612D1B]"
              >
                EXPLORE CUSTOMIZATION
                <ArrowIcon diagonal />
              </Link>
            </div>
          </div>

          <div className="relative min-h-[400px] overflow-hidden bg-[#D3C5B5] lg:min-h-[650px]">
            <img
              src={images.customization}
              alt="Furniture customization and upholstery inspiration"
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
              Your questions,
              <br />
              answered.
            </h2>

            <p className="norden-body max-w-[350px] text-[15px] leading-[1.9] text-[#756C63]">
              Every space is different. If you have a specific
              idea in mind, we'd love to hear about it.
            </p>

            <a
              href={enquiryLink()}
              className="mt-8 inline-flex items-center gap-4 border-b border-[#803D24] pb-3 text-[11px] uppercase tracking-[2px] text-[#803D24]"
            >
              ASK OUR TEAM
              <ArrowIcon diagonal />
            </a>
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

                    <span className="flex h-8 w-8 shrink-0 items-center justify-center text-[25px] font-light text-[#803D24]">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="norden-body max-w-[650px] pb-8 pr-10 text-[15px] leading-[1.9] text-[#756C63]">
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
            YOUR SPACE, REIMAGINED
          </p>

          <h2 className="norden-display mx-auto mb-8 max-w-[950px] text-[clamp(46px,6vw,88px)] leading-[1.1]">
            Let's create a space
            <br />
            you'll love coming home to.
          </h2>

          <p className="norden-body mx-auto mb-12 max-w-[620px] text-[16px] leading-[1.9] text-white/85 sm:text-[18px]">
            Whether you're choosing one beautiful piece
            or bringing an entire room together, we'd
            love to hear what you're imagining.
          </p>

          <a
            href={enquiryLink()}
            className="inline-flex min-h-[56px] items-center justify-center gap-10 border border-white bg-white px-8 py-4 text-[11px] uppercase tracking-[2px] text-[#803D24] transition-colors hover:bg-transparent hover:text-white"
          >
            ENQUIRE ABOUT STYLING
            <ArrowIcon diagonal />
          </a>

          <p className="mt-9 text-[12px] uppercase tracking-[2px] text-white/65">
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

      {/* ============================================
          STYLING
      ============================================ */}

      <style jsx global>{`
        .norden-styling-page {
          overflow-x: hidden;
          scroll-behavior: smooth;
        }

        .norden-styling-page .norden-display {
          font-family: "Radley", Georgia, serif;
          font-weight: 400;
        }

        .norden-styling-page .norden-body {
          font-family: "Radley", Georgia, serif;
          font-weight: 400;
        }

        .norden-styling-page a {
          text-decoration: none;
        }

        .norden-styling-page img {
          display: block;
        }

        .norden-styling-page .norden-image {
          transition: transform 0.7s ease;
        }

        .norden-styling-page .group:hover .norden-image {
          transform: scale(1.045);
        }

        .norden-styling-page button {
          cursor: pointer;
        }

        @media (max-width: 767px) {
          .norden-styling-page .norden-display {
            letter-spacing: -0.6px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .norden-styling-page *,
          .norden-styling-page *::before,
          .norden-styling-page *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
}
