"use client";

import { useState } from "react";

const FAQS = [
  {
    question: "Who are we?",
    answer: `Born in Singapore in 2013, we design furniture that lives with you—and gets better with time.

We obsess over the details most people overlook: the warmth of real teak, the cool elegance of marble, the curve of a chair that just feels right. Every piece is made to last—functional, timeless, and ready to grow with you.`,
  },
  {
    question: "What types of modern furniture can you find here?",
    answer: `Explore thoughtfully designed furniture for every room:

• Living room: sofas, coffee tables, storage  
• Bedroom: bed frames, dressers, nightstands  
• Dining: tables, chairs, full sets  
• Accessories: rugs, mirrors, lighting`,
  },
  {
    question: "Do you offer furniture bundles?",
    answer: `Yes. We curate furniture bundles so you can get matching pieces for your space with ease.`,
  },
  {
    question: "Can I design my room before buying?",
    answer: `Yes. Use our Room Designer Tool to plan your layout, mix pieces, and preview your space before purchasing.`,
  },
   {
    question: "Can I design my room before buying?",
    answer: `Yes. Use our Room Designer Tool to plan your layout, mix pieces, and preview your space before purchasing.`,
  },
   {
    question: "Can I design my room before buying?",
    answer: `Yes. Use our Room Designer Tool to plan your layout, mix pieces, and preview your space before purchasing.`,
  },
   {
    question: "Can I design my room before buying?",
    answer: `Yes. Use our Room Designer Tool to plan your layout, mix pieces, and preview your space before purchasing.`,
  }
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
        fontFamily: "'Cormorant Garamond', serif",
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
            {/* Question */}
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

            {/* Answer */}
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