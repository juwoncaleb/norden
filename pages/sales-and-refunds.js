
import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";

import Header from "./component/Header";
import Footer from "./component/footer";

// ============================================
// NORDEN SALES & REFUNDS PAGE
// ============================================

const EMAIL = "info@thenorden.org";

// IMPORTANT:
// Confirm the policy details marked "To be confirmed"
// with Norden before publishing this page.
// These are not yet established company policies.

const POLICY = {
  lastUpdated: "29 October 2026",

  returnWindow: "To be confirmed",
  damageReportingWindow: "To be confirmed",
  refundProcessingTime: "To be confirmed",
  cancellationDeadline: "To be confirmed",
  restockingFee: "To be confirmed",

  currency: "Nigerian Naira (NGN)",
  paymentProvider: "Paystack",
};

function enquiryLink(topic = "Sales and Refunds") {
  const subject = `Norden - ${topic}`;

  const body = `Hello Norden Team,

I would like assistance with ${topic.toLowerCase()}.

Full name:
Order number:
Email used for purchase:
Product:
Date of purchase:
Details of my enquiry:

Thank you.`;

  return `mailto:${EMAIL}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}

const sections = [
  {
    id: "returns",
    number: "01",
    title: "Returns & Exchanges",
    paragraphs: [
      "We want you to feel confident when purchasing furniture from Norden. If you experience an issue with your order or believe an item may be eligible for return, please contact our team so we can review your request.",
      "Return eligibility depends on the product, its condition, the circumstances of the request, and the terms confirmed at purchase. Applicable consumer rights remain unaffected.",
    ],
    points: [
      {
        label: "Return request period",
        value: POLICY.returnWindow,
      },
      {
        label: "Product condition",
        value:
          "The item should be protected from further damage and made available for inspection where reasonably required.",
      },
      {
        label: "Proof of purchase",
        value:
          "Please provide your order number or other purchase confirmation.",
      },
      {
        label: "Packaging",
        value:
          "Keep the original packaging where possible to help protect furniture during collection or transportation.",
      },
    ],
    note:
      "A change-of-mind return is different from a claim involving damaged, defective, or incorrectly supplied goods. Norden will review each request according to its applicable obligations.",
  },
  {
    id: "damages",
    number: "02",
    title: "Damaged or Incorrect Items",
    paragraphs: [
      "We take care in preparing furniture for delivery. If your item arrives damaged, appears defective, or is different from what you ordered, please contact Norden promptly.",
      "Where possible, include photographs of the item, packaging, and the affected area. This helps our team understand the issue and determine the appropriate next steps.",
    ],
    points: [
      {
        label: "Reporting timeframe",
        value: POLICY.damageReportingWindow,
      },
      {
        label: "Information required",
        value:
          "Order number, photographs, a description of the issue, and your contact details.",
      },
      {
        label: "Resolution",
        value:
          "Following assessment, appropriate remedies may include repair, replacement, refund, or another resolution required by applicable law.",
      },
    ],
    note:
      "A reporting timeframe does not override any non-excludable statutory rights.",
  },
  {
    id: "custom",
    number: "03",
    title: "Custom & Made-to-Order Furniture",
    paragraphs: [
      "Some Norden furniture may be produced or customized to your selected dimensions, upholstery, colour, finish, or other specifications.",
      "Because these pieces are prepared for individual orders, change-of-mind cancellations or returns may be subject to different conditions from standard stocked furniture. Any restrictions and applicable charges should be confirmed before your order is finalized.",
      "If a custom product arrives damaged, defective, or does not match the agreed specifications, please contact us. Customization does not remove applicable consumer protections.",
    ],
    link: {
      label: "EXPLORE CUSTOMIZATION",
      href: "/customization-service",
    },
  },
  {
    id: "refunds",
    number: "04",
    title: "Refunds",
    paragraphs: [
      "Where a refund is approved, Norden will confirm the refund amount, any applicable deductions, and the expected processing timeline.",
      "Refunds will ordinarily be directed to the original payment method where supported and appropriate. The time taken for funds to appear may also depend on your bank or payment provider.",
    ],
    points: [
      {
        label: "Refund processing period",
        value: POLICY.refundProcessingTime,
      },
      {
        label: "Refund method",
        value:
          "Original payment method where possible, or another agreed method.",
      },
      {
        label: "Delivery charges",
        value:
          "Refundability depends on the circumstances and applicable law.",
      },
      {
        label: "Restocking or handling fees",
        value: POLICY.restockingFee,
      },
    ],
  },
  {
    id: "cancellations",
    number: "05",
    title: "Order Changes & Cancellations",
    paragraphs: [
      "If you need to change or cancel an order, contact Norden as soon as possible. We will review the order's current status and advise whether your request can be accommodated.",
      "Changes to furniture dimensions, fabrics, finishes, delivery details, or quantities may affect the price and expected delivery timeline.",
      "Once production or delivery preparation has started, certain changes may no longer be possible. Any applicable cancellation charges must be disclosed and consistent with applicable law.",
    ],
    points: [
      {
        label: "Cancellation deadline",
        value: POLICY.cancellationDeadline,
      },
      {
        label: "Made-to-order products",
        value:
          "Eligibility and charges depend on the agreed order terms and production stage.",
      },
    ],
  },
  {
    id: "payments",
    number: "06",
    title: "Prices & Payments",
    paragraphs: [
      `Prices on the Norden website are displayed in ${POLICY.currency}, unless otherwise indicated. Delivery charges and other applicable costs should be disclosed during checkout before payment is completed.`,
      `Online payments may be processed through ${POLICY.paymentProvider}. Available payment methods will be displayed at checkout.`,
      "An order confirmation acknowledges receipt of your order. If Norden cannot fulfil an accepted and paid order, our team will contact you regarding the available resolution, including a refund where appropriate.",
    ],
  },
  {
    id: "delivery",
    number: "07",
    title: "Delivery & Receiving Your Order",
    paragraphs: [
      "Delivery availability, charges, and estimated timelines may vary according to your location, the furniture ordered, and whether the product is in stock or made to order.",
      "Please ensure your delivery information is accurate and that access arrangements are suitable for the furniture being delivered.",
      "We encourage customers to inspect their furniture upon arrival and contact our team if there is a concern. Any estimated delivery timeline should be treated according to the terms agreed at purchase.",
    ],
    link: {
      label: "VIEW DELIVERY INFORMATION",
      href: "/delivery",
    },
  },
  {
    id: "product-details",
    number: "08",
    title: "Product Information & Variations",
    paragraphs: [
      "Norden aims to present product descriptions, dimensions, materials, and photographs as accurately as possible.",
      "Furniture made with natural materials, handcrafted finishes, or individually dyed textiles may display variations in grain, texture, colour, and pattern.",
      "Screen settings and lighting conditions may also influence how a product's colour appears online. We encourage customers to review product details carefully and contact us with questions before ordering.",
      "Natural variations do not automatically indicate a defect, but products must still meet their agreed descriptions and applicable quality requirements.",
    ],
  },
  {
    id: "promotions",
    number: "09",
    title: "Promotions & Discount Codes",
    paragraphs: [
      "From time to time, Norden may offer promotional pricing, special discounts, or voucher codes.",
      "Each promotion may have its own eligibility requirements, validity period, exclusions, and redemption conditions. These should be communicated alongside the relevant offer.",
      "Where an order includes a discount, any approved refund will be calculated with reference to the amount paid and applicable legal requirements.",
    ],
  },
  {
    id: "warranty",
    number: "10",
    title: "Product Warranty",
    paragraphs: [
      "Certain Norden products may be covered by a product warranty or guarantee. The scope and duration depend on the specific product and the warranty terms supplied with it.",
      "A warranty is separate from any rights customers may have under applicable consumer protection laws.",
    ],
    link: {
      label: "VIEW OUR WARRANTY",
      href: "/warranty",
    },
  },
];

const faq = [
  {
    question: "How do I request a return?",
    answer:
      "Email info@thenorden.org with your order number, product details, and the reason for your request. Our team can review your enquiry and explain the next steps.",
  },
  {
    question: "Can I cancel a custom furniture order?",
    answer:
      "Custom furniture cancellations depend on the agreed order terms and the production stage. Contact Norden promptly to discuss your request. Applicable consumer rights still apply.",
  },
  {
    question: "What happens if my furniture arrives damaged?",
    answer:
      "Contact Norden promptly with your order number, a description of the damage, and clear photographs where possible. We will assess the issue and discuss the appropriate remedy.",
  },
  {
    question: "How long does a refund take?",
    answer:
      "The refund processing timeframe is still to be confirmed. Once a refund is approved, Norden should communicate the expected timeline and method of payment.",
  },
  {
    question: "Can I exchange a sofa for a different colour?",
    answer:
      "Exchange availability depends on the product and the circumstances. Please contact Norden before arranging any return or replacement.",
  },
  {
    question: "Are delivery fees refundable?",
    answer:
      "This depends on the reason for the return, the delivery service provided, and applicable consumer protection requirements.",
  },
];

function ArrowIcon() {
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
      <path d="M5 19 19 5" />
      <path d="M8 5h11v11" />
    </svg>
  );
}

export default function SalesAndRefundsPage() {
  const [activeFaq, setActiveFaq] = useState(null);

  return (
    <>
      <Head>
        <title>
          Sales & Refunds | Norden Furniture
        </title>

        <meta
          name="description"
          content="Learn about Norden's sales and refunds information, including furniture returns, order cancellations, payments, delivery and customer enquiries."
        />
      </Head>

      <Header />

      <main className="norden-policy bg-[#F8F6F1] text-[#302821]">
        {/* HERO */}

        <section className="bg-[#EDE7DC] px-6 py-20 sm:px-10 md:py-28 lg:px-20">
          <div className="mx-auto max-w-[1450px]">
            <div className="mb-9 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[2px] text-[#8B7668]">
              <Link href="/">HOME</Link>
              <span>/</span>
              <span className="text-[#803D24]">
                SALES & REFUNDS
              </span>
            </div>

          
            <h1 className="policy-display max-w-[1000px] text-[clamp(50px,7vw,100px)] leading-[1.05] tracking-[-2px]">
              Sales &
              <br />
              <em>Refunds.</em>
            </h1>

            <p className="policy-body mt-9 max-w-[700px] text-[17px] leading-[1.9] text-[#6C6157] sm:text-[19px]">
              Everything you need to know about shopping
              with Norden, from placing your order to
              understanding returns, refunds, and
              after-sales support.
            </p>

            <p className="mt-9 text-[11px] uppercase tracking-[2px] text-[#8B7668]">
              LAST UPDATED: {POLICY.lastUpdated}
            </p>
          </div>
        </section>

        {/* INTRODUCTION */}

        <section className="mx-auto max-w-[1450px] px-6 py-16 sm:px-10 md:py-24 lg:px-20">
          <div className="max-w-[920px]">
            <p className="mb-5 text-[11px] uppercase tracking-[3px] text-[#803D24]">
              SHOP WITH CONFIDENCE
            </p>

            <h2 className="policy-display mb-7 text-[clamp(35px,4vw,55px)] leading-[1.18]">
              A thoughtful experience,
              <br />
              beyond the furniture.
            </h2>

            <p className="policy-body text-[16px] leading-[1.95] text-[#6C6157]">
              At Norden, we believe that choosing
              furniture should feel considered and
              reassuring. This page explains the topics
              customers should understand before and
              after making a purchase.
            </p>

            <p className="policy-body mt-5 text-[16px] leading-[1.95] text-[#6C6157]">
              Please review the information carefully
              and contact our team if you need
              clarification about a particular order.
              Nothing on this page limits rights that
              cannot legally be excluded.
            </p>
          </div>
        </section>

        {/* IMPORTANT DRAFT NOTICE */}

        <section className="mx-auto max-w-[1290px] px-6 pb-10 sm:px-10">
          <div className="border-l-[3px] border-[#803D24] bg-[#EEE7DC] px-6 py-6 sm:px-9">
            <h3 className="policy-display mb-3 text-[25px]">
              Policy details awaiting confirmation
            </h3>

            <p className="policy-body text-[15px] leading-[1.85] text-[#665C53]">
              The return period, damage reporting period,
              refund processing timeline, cancellation
              deadline, and any restocking charges have
              not yet been confirmed by Norden. These
              must be finalized before this page is
              published as binding customer terms.
            </p>
          </div>
        </section>

        {/* MAIN POLICY CONTENT */}

        <section className="mx-auto grid max-w-[1450px] grid-cols-1 gap-14 px-6 pb-28 sm:px-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-20 lg:px-20">
          {/* SIDEBAR */}

          <aside className="hidden lg:block">
            <div className="sticky top-8 border-t border-[#D8CFC3] pt-7">
              <p className="mb-7 text-[11px] uppercase tracking-[3px] text-[#803D24]">
                ON THIS PAGE
              </p>

              <nav className="flex flex-col gap-5">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="policy-body flex items-start gap-4 text-[14px] leading-[1.5] text-[#766C62] transition hover:text-[#803D24]"
                  >
                    <span className="text-[#A58B7A]">
                      {section.number}
                    </span>

                    {section.title}
                  </a>
                ))}
              </nav>

              <a
                href={enquiryLink()}
                className="mt-10 inline-flex items-center gap-3 border-b border-[#803D24] pb-3 text-[11px] uppercase tracking-[2px] text-[#803D24]"
              >
                CONTACT NORDEN
                <ArrowIcon />
              </a>
            </div>
          </aside>

          {/* POLICY SECTIONS */}

          <div className="min-w-0">
            {sections.map((section) => (
              <article
                id={section.id}
                key={section.id}
                className="scroll-mt-8 border-t border-[#D8CFC3] py-12 first:pt-9 md:py-16"
              >
                <div className="mb-6 flex items-start gap-5">
                  <span className="policy-display pt-1 text-[24px] text-[#A66E53]">
                    {section.number}
                  </span>

                  <h2 className="policy-display text-[clamp(30px,3.5vw,48px)] leading-[1.15]">
                    {section.title}
                  </h2>
                </div>

                <div className="max-w-[820px]">
                  {section.paragraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className="policy-body mb-5 text-[15px] leading-[1.95] text-[#6C6157] sm:text-[16px]"
                    >
                      {paragraph}
                    </p>
                  ))}

                  {section.points && (
                    <div className="my-9 border-y border-[#E1D9CF]">
                      {section.points.map((point) => (
                        <div
                          key={point.label}
                          className="grid grid-cols-1 gap-2 border-b border-[#E1D9CF] py-5 last:border-b-0 sm:grid-cols-[190px_minmax(0,1fr)] sm:gap-7"
                        >
                          <p className="policy-body text-[15px] text-[#33251F]">
                            {point.label}
                          </p>

                          <p className="policy-body text-[15px] leading-[1.75] text-[#756C63]">
                            {point.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.note && (
                    <div className="mt-7 bg-[#EEE9E1] px-6 py-6">
                      <p className="policy-body text-[14px] leading-[1.9] text-[#665C53]">
                        {section.note}
                      </p>
                    </div>
                  )}

                  {section.link && (
                    <Link
                      href={section.link.href}
                      className="mt-7 inline-flex items-center gap-5 border-b border-[#803D24] pb-3 text-[11px] uppercase tracking-[2px] text-[#803D24]"
                    >
                      {section.link.label}
                      <ArrowIcon />
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CUSTOMER SUPPORT */}

        <section className="bg-[#EAE3D8] px-6 py-20 sm:px-10 md:py-28 lg:px-20">
          <div className="mx-auto grid max-w-[1300px] grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-5 text-[11px] uppercase tracking-[3px] text-[#803D24]">
                WE'RE HERE TO HELP
              </p>

              <h2 className="policy-display text-[clamp(39px,5vw,68px)] leading-[1.12]">
                Need help with
                <br />
                <em>an order?</em>
              </h2>
            </div>

            <div>
              <p className="policy-body mb-8 max-w-[530px] text-[17px] leading-[1.9] text-[#6C6157]">
                Whether you have a question about a
                purchase, a delivery, or a refund
                request, our team can help you
                understand the next steps.
              </p>

              <a
                href={enquiryLink("Order Support")}
                className="inline-flex min-h-[54px] items-center gap-9 bg-[#803D24] px-7 py-4 text-[11px] uppercase tracking-[2px] text-white transition-colors hover:bg-[#612D1B]"
              >
                CONTACT CUSTOMER SUPPORT
                <ArrowIcon />
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}

        <section className="mx-auto grid max-w-[1450px] grid-cols-1 gap-12 px-6 py-24 sm:px-10 md:py-32 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-20">
          <div>
            <p className="mb-5 text-[11px] uppercase tracking-[3px] text-[#803D24]">
              FREQUENTLY ASKED QUESTIONS
            </p>

            <h2 className="policy-display text-[clamp(40px,5vw,68px)] leading-[1.1]">
              Your questions,
              <br />
              <em>answered.</em>
            </h2>

            <p className="policy-body mt-7 max-w-[360px] text-[15px] leading-[1.9] text-[#756C63]">
              Find answers to common questions
              about furniture orders, returns,
              refunds, and cancellations.
            </p>
          </div>

          <div className="border-t border-[#D8CFC3]">
            {faq.map((item, index) => {
              const isOpen = activeFaq === index;

              return (
                <div
                  key={item.question}
                  className="border-b border-[#D8CFC3]"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() =>
                      setActiveFaq(isOpen ? null : index)
                    }
                    className="flex w-full items-center justify-between gap-6 py-7 text-left"
                  >
                    <span className="policy-display text-[21px] leading-[1.4] sm:text-[25px]">
                      {item.question}
                    </span>

                    <span className="flex h-9 w-9 shrink-0 items-center justify-center text-[26px] text-[#803D24]">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="policy-body max-w-[650px] pb-8 pr-10 text-[15px] leading-[1.9] text-[#756C63]">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* FINAL CTA */}

        <section className="bg-[#803D24] px-6 py-24 text-center text-white sm:px-10 md:py-32">
          <p className="mb-7 text-[11px] uppercase tracking-[3px] text-white/75">
            NORDEN CUSTOMER EXPERIENCE
          </p>

          <h2 className="policy-display mx-auto mb-8 max-w-[900px] text-[clamp(42px,6vw,80px)] leading-[1.12]">
            Thoughtful furniture.
            <br />
            <em>Thoughtful service.</em>
          </h2>

          <p className="policy-body mx-auto mb-11 max-w-[620px] text-[17px] leading-[1.9] text-white/85">
            Have a question about our sales
            and refunds information? We'd
            love to hear from you.
          </p>

          <a
            href={enquiryLink()}
            className="inline-flex min-h-[56px] items-center justify-center gap-9 border border-white bg-white px-8 py-4 text-[11px] uppercase tracking-[2px] text-[#803D24] transition-colors hover:bg-transparent hover:text-white"
          >
            SEND AN ENQUIRY
            <ArrowIcon />
          </a>

          <p className="mt-9 text-[12px] tracking-[2px] text-white/65">
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

      {/* PAGE STYLES */}

      <style jsx global>{`
        .norden-policy {
          overflow-x: hidden;
          scroll-behavior: smooth;
        }

        .norden-policy .policy-display {
          font-family: "Radley", Georgia, serif;
          font-weight: 400;
        }

        .norden-policy .policy-body {
          font-family: "Radley", Georgia, serif;
          font-weight: 400;
        }

        .norden-policy a {
          text-decoration: none;
        }

        .norden-policy button {
          cursor: pointer;
        }

        @media (max-width: 767px) {
          .norden-policy .policy-display {
            letter-spacing: -0.5px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .norden-policy *,
          .norden-policy *::before,
          .norden-policy *::after {
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
}
