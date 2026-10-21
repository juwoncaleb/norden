import React from "react";
import { Cormorant_Garamond } from "next/font/google";

import Header from "./component/Header";
import Footer from "./component/footer";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const pageStyle = {
  paddingTop: "80px",
  paddingBottom: "80px",
};

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
      "At NÓRDEN, we design and manufacture our furniture with quality, comfort and longevity in mind. Every piece is carefully made and inspected before it leaves our facility. Our product guarantee is designed to give you confidence in your purchase. If something is not right due to a manufacturing defect, we will work with you to find an appropriate solution.",
    ],
  },
  {
    title: "What is covered",
    paragraphs: [
      "Our product guarantee covers manufacturing defects in materials and workmanship that arise under normal residential use. Coverage depends on the component of the product:",
    ],
    list: [
      "Frames and structural components: 5 years.",
      "Upholstery, fabric seams and cushion fillings: 1 year.",
      "Finishes, hardware and moving mechanisms: 1 year.",
      "Accessories and soft furnishings: 90 days.",
    ],
  },
  {
    title: "What is not covered",
    paragraphs: [
      "Our guarantee is intended to protect you against manufacturing defects. It does not cover damage or deterioration caused by normal use, improper care or circumstances outside the intended use of the product. This includes:",
    ],
    list: [
      "Normal wear and tear, including gradual fading, natural softening of cushions or minor surface marks.",
      "Stains, spills, burns, scratches, pet damage or damage caused by sharp or abrasive objects.",
      "Damage caused by misuse, overloading, improper handling or incorrect assembly.",
      "Damage caused by direct sunlight, excessive moisture, extreme heat or cold, or outdoor use unless the product is specifically designed for outdoor use.",
      "Damage caused by moving, transporting or storing the furniture after delivery.",
      "Repairs, alterations or modifications carried out by anyone other than NÓRDEN or an approved service partner.",
      "Products purchased from unauthorised sellers.",
      "Products used for commercial purposes unless the product was specifically purchased and approved for commercial use.",
    ],
  },
  {
    title: "How to make a claim",
    paragraphs: [
      "If you believe your product has a manufacturing defect, please contact the NÓRDEN team with the details of your purchase. Our team will review your claim and advise you on the next steps.",
    ],
    list: [
      "Your order number or proof of purchase.",
      "A short description of the issue.",
      "Clear photographs showing the problem.",
      "A short video where the issue is difficult to demonstrate through photographs.",
      "Photographs showing the overall condition of the product where relevant.",
    ],
  },
  {
    title: "What happens next",
    paragraphs: [
      "Once we receive your claim, our team will assess the issue and determine the most appropriate solution. Depending on the nature of the problem, we may repair the item, provide replacement parts, replace the affected product or offer another appropriate remedy.",
      "In some cases, we may need to inspect the furniture before determining the solution. If a collection or inspection is required for an approved guarantee claim, we will coordinate the process with you.",
      "The final resolution will depend on the nature of the defect, the availability of replacement parts or products, and the circumstances of the claim.",
    ],
  },
  {
    title: "Looking after your NÓRDEN furniture",
    paragraphs: [
      "Proper care will help your furniture maintain its appearance, comfort and condition for years to come. Follow the care instructions provided with your product and use furniture only for its intended purpose.",
      "Keep furniture away from excessive heat and prolonged direct sunlight where possible. Clean spills promptly and use only appropriate cleaning products for the material. For upholstered furniture, regularly rotate and gently plump cushions where applicable to help maintain their shape and ensure even wear.",
    ],
  },
  {
    title: "Your legal rights",
    paragraphs: [
      "This product guarantee is provided in addition to any rights you may have under applicable Nigerian consumer protection laws. Nothing in this guarantee is intended to exclude or limit any legal rights that cannot lawfully be excluded or limited.",
    ],
  },
  {
    title: "Need help?",
    paragraphs: [
      "If you have a question about your NÓRDEN product guarantee or would like to make a claim, please contact our customer care team through the contact details provided on our website. Please include your order number where applicable so that we can assist you as quickly as possible.",
    ],
  },
];

export default function ProductGuarantee() {
  return (
    <div className={cormorant.className}>
      <Header />

      <div
        className="delivery_div"
        style={pageStyle}
      >
        <p className="delivery_font">
          Product Guarantee
        </p>

        <div className="delivery_texts">
          <p className="mb-10">
            Last updated: October 21, 2026
          </p>

          {sections.map((section) => (
            <section
              key={section.title}
              className="mb-10"
            >
              <h2
                className="delivery_heading"
                style={headingStyle}
              >
                {section.title}
              </h2>

              {section.paragraphs.map((text, i) => (
                <p
                  key={i}
                  className="mb-6"
                >
                  {text}
                </p>
              ))}

              {section.list && (
                <ul
                  className="delivery_list mb-6"
                  style={listStyle}
                >
                  {section.list.map((item) => (
                    <li key={item}>
                      {item}
                    </li>
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