
import React from "react";

import Header from "./component/Header";
import Footer from "./component/footer";

// Load the font through CSS instead of next/font/google.
// This avoids the Google Fonts build-time dependency on Vercel.

const pageStyle = {
  paddingTop: "80px",
  paddingBottom: "80px",
  fontFamily: '"Cormorant Garamond", Georgia, serif',
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
    title: "How we deliver",
    paragraphs: [
      "At NÓRDEN, we take pride in creating thoughtfully designed furniture for modern Nigerian spaces. Our goal is to get your order to you safely, efficiently and in excellent condition. Every product is carefully packaged before leaving our facility and delivered through trusted logistics and delivery partners.",
      "Depending on the products in your order and where they are being dispatched from, your order may arrive in more than one delivery. If this happens, our team will keep you informed throughout the process.",
    ],
  },
  {
    title: "Delivery times",
    paragraphs: [
      "Delivery times depend on the product, its availability, your location and whether the piece is made to order. Estimated delivery timelines are provided on the relevant product page or communicated by our team before your order is confirmed.",
      "Orders within Lagos generally have shorter delivery times, while deliveries to other parts of Nigeria may require additional transit time.",
      "Made-to-order and customised pieces may take longer to produce and deliver than items currently available in stock. Any applicable production or delivery lead time will be communicated before you complete your purchase.",
    ],
  },
  {
    title: "Delivery days and hours",
    paragraphs: [
      "Deliveries are generally made Monday to Saturday during our available delivery hours. Our delivery team or logistics partner will contact you before delivery to confirm a suitable delivery window.",
      "Please ensure that the phone number provided with your order is active and available around the expected delivery date so that our team can reach you if necessary.",
      "While we will always do our best to meet the agreed delivery window, delivery times may occasionally change due to traffic, weather, logistics or other circumstances outside our control.",
    ],
  },
  {
    title: "Delivery charges",
    paragraphs: [
      "Delivery fees are determined by the size and quantity of your furniture, your delivery location and the logistics requirements of your order. Applicable delivery charges will be communicated or displayed before your order is completed.",
    ],
    list: [
      "Delivery charges may vary between Lagos and other parts of Nigeria.",
      "Large, heavy or particularly fragile items may require specialised delivery and handling.",
      "Locations that are difficult to access may attract an additional delivery or handling charge.",
      "Any applicable delivery fee will be communicated before your order is dispatched.",
      "Promotional discounts or NÓRDEN rewards may apply to the product price but may not cover delivery charges unless specifically stated.",
    ],
  },
  {
    title: "Getting ready for your delivery",
    paragraphs: [
      "Before placing your order, please make sure that your furniture can be safely brought into your home. This includes checking doorways, corridors, staircases, elevators, balconies and other access points.",
      "Furniture dimensions are provided on the relevant product page. We strongly recommend measuring your access points before ordering, particularly for large sofas, tables, beds, wardrobes and other oversized pieces.",
      "Before delivery day, please clear a suitable path to the room where the furniture will be placed and remove fragile or valuable items from the delivery route.",
      "If you live in an apartment, estate or building with controlled access, please confirm any visitor registration, parking, loading bay or elevator requirements with your building management before delivery.",
    ],
  },
  {
    title: "When your order arrives",
    paragraphs: [
      "Please inspect your furniture and its packaging as soon as possible after delivery. If you notice any visible damage, missing components or incorrect items, notify the NÓRDEN team promptly so that we can investigate and assist you.",
    ],
    list: [
      "Check that the number of packages or items received matches your order.",
      "Inspect the packaging for visible dents, tears, stains or other signs of damage.",
      "Inspect the furniture itself for visible damage before the delivery team leaves where reasonably possible.",
      "Take clear photographs or videos of any damage you notice.",
      "Report damage, missing parts or incorrect items to us within 48 hours of delivery.",
    ],
  },
  {
    title: "Missed deliveries and access issues",
    paragraphs: [
      "Someone should be available to receive your order at the agreed delivery time. If our delivery team cannot complete the delivery because nobody is available, the address is incorrect, access is restricted, or the furniture cannot safely enter the property, an additional delivery charge may apply for a subsequent delivery attempt.",
      "NÓRDEN cannot be held responsible for delays or failed deliveries caused by inaccurate delivery information, restricted building access or circumstances that prevent our delivery team from safely accessing the property.",
    ],
  },
  {
    title: "Deliveries outside Lagos",
    paragraphs: [
      "We deliver to selected locations across Nigeria. Delivery availability, timelines and charges may vary depending on your location.",
      "For deliveries outside Lagos, additional transit time may be required. Certain large, fragile or made-to-order pieces may also have specific delivery requirements or geographic restrictions.",
      "If you are unsure whether we deliver to your location, please contact our team before placing your order and we will be happy to assist.",
    ],
  },
  {
    title: "Need help?",
    paragraphs: [
      "If you have any questions about your delivery, our team is happy to help. Please contact us through the contact details provided on our website and include your order number where applicable.",
      "Our team will provide you with the most accurate information regarding your order, delivery timeline and delivery requirements.",
    ],
  },
];

export default function Delivery() {
  return (
    <div
      style={{
        fontFamily: '"Cormorant Garamond", Georgia, serif',
      }}
    >
      <Header />

      <div className="delivery_div" style={pageStyle}>
        <p className="delivery_font">Delivery</p>

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
                <p key={i} className="mb-6">
                  {text}
                </p>
              ))}

              {section.list && (
                <ul
                  className="delivery_list mb-6"
                  style={listStyle}
                >
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
