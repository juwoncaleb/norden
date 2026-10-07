"use client";

import { useState } from "react";

const FAQS = [
  {
    question: "What is Norden?",
    answer:
      "Norden is an interior design and furniture house creating considered pieces for contemporary spaces. Our furniture is designed in-house and produced with attention to material, proportion, craftsmanship and detail.",
  },
  {
    question: "Are Norden pieces ready-made or made-to-order?",
    answer:
      "Our pieces are primarily made-to-order. This means your piece is produced specifically for your order rather than taken from existing stock.",
  },
  {
    question: "Can I customise a Norden piece?",
    answer:
      "Selected pieces may be customised within defined parameters, such as approved dimensions, upholstery or finishes. Customisation depends on the piece and must be confirmed by Norden before your order is placed.",
  },
  {
    question: "Do you offer bespoke furniture?",
    answer:
      "At launch, Norden is focused on our Made-to-Order collection and selected customisation. Bespoke commissions are not currently offered through The Norden Edit. This may evolve as our design and production capabilities grow.",
  },
  {
    question: "How long will my order take?",
    answer:
      "Production timelines vary depending on the piece, materials and level of customisation. Your estimated production timeline will be communicated before your order is confirmed.",
  },
  {
    question: "How do I place an order?",
    answer:
      "Select your preferred piece and submit an enquiry or order request. We will confirm the specifications, pricing, customisation options, payment requirements and estimated timeline before production begins.",
  },
  {
    question: "Can I change my order after placing it?",
    answer:
      "Please contact us as soon as possible. Changes may be possible before production begins, but once production or material procurement has commenced, changes may no longer be possible or may incur additional costs.",
  },
  {
    question: "Do you deliver outside Lagos?",
    answer:
      "Yes. Delivery can be arranged to other locations in Nigeria. Delivery charges and timelines depend on the destination and requirements of the order.",
  },
  {
    question: "Do you offer installation?",
    answer:
      "Where installation is required, this can be arranged as part of your order. Installation requirements and any applicable charges will be communicated beforehand.",
  },
  {
    question: "What if my piece arrives damaged or has a manufacturing defect?",
    answer:
      "Please notify us promptly and provide photographs or other relevant information. We will assess the issue and, where applicable, arrange an appropriate remedy in accordance with our Returns & Refunds and Warranty policies.",
  },
  {
    question: "Will my piece look exactly like the images on the website?",
    answer:
      "Our photography represents the intended design, but natural materials, upholstery, timber, stone and finishes may vary in colour, grain, texture and character. These variations are part of the nature of individually produced furniture.",
  },
  {
    question: "How do I care for my Norden piece?",
    answer:
      "Care instructions will depend on the materials used in your piece. Specific care guidance will be provided where applicable.",
  },
  {
    question: "Can I visit Norden before ordering?",
    answer:
      "Where a showroom, studio or viewing appointment is available, visits can be arranged by appointment. Contact us to enquire.",
  },
  {
    question: "How can I contact Norden?",
    answer:
      "For orders, product enquiries, customisation requests or general enquiries, please visit our Enquire page or contact Norden directly.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      style={{
        maxWidth: 900,
        margin: "60px auto",
        padding: "0 24px",
        fontFamily: "Cormorant Garamond, serif",
      }}
    >
      <h2 style={{ fontSize: 32, marginBottom: 30 }}>
        Frequently Asked Questions
      </h2>

      {FAQS.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={index}
            style={{
              borderBottom: "1px solid #ddd",
              padding: "18px 0",
              cursor: "pointer",
            }}
            onClick={() => toggle(index)}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 style={{ fontSize: 18, margin: 0 }}>
                {faq.question}
              </h3>

              <span
                style={{
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s",
                  fontSize: 18,
                }}
              >
                ⌃
              </span>
            </div>

            <div
              style={{
                maxHeight: isOpen ? 300 : 0,
                overflow: "hidden",
                transition: "max-height 0.4s ease",
              }}
            >
              <p
                style={{
                  marginTop: 12,
                  lineHeight: 1.6,
                  color: "#555",
                  whiteSpace: "pre-line",
                }}
              >
                {faq.answer}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}