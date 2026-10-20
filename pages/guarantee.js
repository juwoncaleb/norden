import React from "react";
import { Cormorant_Garamond } from "next/font/google";

import Header from "./component/Header";
import Footer from "./component/footer";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const pageStyle = { paddingTop: "80px", paddingBottom: "80px" };

const headingStyle = {
  margin: "0 0 14px",
  fontSize: "1.8rem",
  fontWeight: 700,
  lineHeight: 1.2,
};

const listStyle = {
  margin: "0 0 24px",
  paddingLeft: "1.4em",
  listStyle: "disc",
};

const sections = [
  {
    title: "Our promise",
    paragraphs: [
      "At Norden, we design and manufacture our furniture to last. Every piece is made with care, checked before it leaves us, and backed by our product guarantee. If something is not right, we will work with you to fix it.",
    ],
  },
  {
    title: "What is covered",
    paragraphs: [
      "Our guarantee covers defects in materials and workmanship that appear under normal home use. Coverage depends on the part of the product:",
    ],
    list: [
      "Frames and structure: 5 years.",
      "Upholstery, fabric seams and cushion fillings: 1 year.",
      "Finishes, hardware and moving mechanisms: 1 year.",
      "Accessories and soft furnishings: 90 days.",
    ],
  },
  {
    title: "What is not covered",
    paragraphs: [
      "The guarantee is designed to protect you from manufacturing faults, so it does not cover damage caused after delivery. This includes:",
    ],
    list: [
      "Normal wear and tear, such as gradual fading, softening of cushions or light surface marks.",
      "Stains, spills, burns, scratches, pet damage or damage from sharp objects.",
      "Damage from misuse, overloading, or assembly that does not follow our instructions.",
      "Exposure to direct sunlight, moisture, extreme heat or cold, or use outdoors unless the product is made for it.",
      "Repairs or changes made by anyone other than Norden or an approved partner.",
      "Products bought from unauthorised sellers, or used commercially.",
    ],
  },
  {
    title: "How to make a claim",
    paragraphs: [
      "Making a claim is simple. Email us at info@norden.org with the details below, and our team will review it as quickly as possible.",
    ],
    list: [
      "Your order number, or proof of purchase.",
      "A short description of the problem.",
      "Clear photos or a short video showing the issue and the whole product.",
    ],
  },
  {
    title: "What happens next",
    paragraphs: [
      "Once we have reviewed your claim, we will choose the best solution for you. Depending on the issue, we may repair the item, send replacement parts, replace the product, or offer a refund or credit if a repair or replacement is not possible.",
      "In some cases we may ask for an inspection or for the faulty item to be returned. If we do, we will arrange this with you and cover the cost of collection for approved claims.",
    ],
  },
  {
    title: "Looking after your furniture",
    paragraphs: [
      "A little care goes a long way. Keep your furniture away from direct heat and strong sunlight, clean spills straight away, and follow the care instructions that come with your product. Rotating and plumping cushions regularly helps them keep their shape and wear evenly.",
    ],
  },
  {
    title: "Your legal rights",
    paragraphs: [
      "This guarantee is in addition to your legal rights as a consumer, and does not affect them. Nothing in this guarantee limits any rights that you have under the law in your country.",
    ],
  },
  {
    title: "Need help?",
    paragraphs: [
      "If you have a question about your guarantee, email us at info@norden.org and we will be glad to help.",
    ],
  },
];

export default function ProductGuarantee() {
  return (
    <div className={cormorant.className}>
      <Header />

      <div className="delivery_div" style={pageStyle}>
        <p className="delivery_font">Product Guarantee</p>

        <div className="delivery_texts">
          <p className="mb-10">Last updated: Oct 20, 2026</p>

          {sections.map((section) => (
            <section key={section.title} className="mb-10">
              <h2 className="delivery_heading" style={headingStyle}>{section.title}</h2>

              {section.paragraphs.map((text, i) => (
                <p key={i} className="mb-6">
                  {text}
                </p>
              ))}

              {section.list && (
                <ul className="delivery_list mb-6" style={listStyle}>
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}