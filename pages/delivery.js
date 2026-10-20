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
    title: "How we deliver",
    paragraphs: [
      "At Norden, we take pride in manufacturing our furniture, and our goal is to get your purchase to you as quickly and efficiently as possible. Every product is fully packaged for safe transit and handled by professional third-party carriers.",
      "We work with several specialist partners, so your order may arrive in multiple shipments. Shipping is charged per shipment rather than per order, based on the warehouse each product ships from.",
    ],
  },
  {
    title: "Delivery times",
    paragraphs: [
      "Speed of delivery depends on the type of product, its availability, and proximity to metropolitan areas. Lead times are listed on each product page, where you can also enter your zip code to check whether we deliver to your area.",
      "If your area is not covered yet, subscribe to our newsletter or follow us on social media for updates. Made-to-order pieces take longer than items we hold in stock, and any extended lead time will be shown clearly before you check out.",
    ],
  },
  {
    title: "Delivery days and hours",
    paragraphs: [
      "Shipments are delivered Monday to Friday, 9:00 am to 7:00 pm, with limited hours on Saturdays in selected cities. To request a Saturday delivery, contact us before your order is processed, though we cannot guarantee every request.",
      "Our carrier will contact you to arrange a delivery window once your order is ready to leave the warehouse. Please keep your phone nearby on the day so that nothing delays the delivery.",
    ],
  },
  {
    title: "Delivery charges",
    paragraphs: [
      "Delivery fees are calculated at checkout based on the size and weight of your items, the warehouse they ship from, and your delivery address. Because a single order can ship from more than one location, you may see more than one delivery charge.",
    ],
    list: [
      "Charges are applied per shipment, not per order.",
      "Remote or hard-to-reach areas may carry an additional fee, shown before you pay.",
      "Any promotional offers or credits are applied to the products in your order, and do not always cover delivery fees.",
    ],
  },
  {
    title: "Getting ready for your delivery",
    paragraphs: [
      "It is your responsibility to confirm that your items will fit through doors, staircases and elevators in their packaging before you order. Product and package dimensions are included in each product description.",
      "Before delivery day, please measure your entrances and hallways, clear a path to the room of your choice, and move any fragile items out of the way. If you live in an apartment building, check whether you need to book an elevator or loading bay in advance.",
    ],
  },
  {
    title: "When your order arrives",
    paragraphs: [
      "Please inspect each package in front of the delivery team before signing. If you see any damage to the packaging or the product, note it on the delivery receipt and take photos as soon as possible.",
    ],
    list: [
      "Check that the number of packages matches your delivery notice.",
      "Look for visible damage, such as dents, tears or water marks.",
      "Report any damage, missing parts or errors to us within 48 hours of delivery so we can put it right quickly.",
    ],
  },
  {
    title: "Missed deliveries and access issues",
    paragraphs: [
      "If we cannot access your home at the time of delivery, additional charges will apply. This includes situations where nobody is available to receive the order, the items cannot fit through the entrance, or the delivery address is incorrect.",
      "If your order is shipped to a freight forwarder, Norden is not responsible for any issues that arise once the shipment is in their hands.",
    ],
  },
  {
    title: "Need help?",
    paragraphs: [
      "If you have any questions about your delivery, our team is happy to help. Email us at info@norden.org with your order number and we will get back to you as soon as we can.",
    ],
  },
];

export default function Delivery() {
  return (
    <div className={cormorant.className}>
      <Header />

      <div className="delivery_div" style={pageStyle}>
        <p className="delivery_font">Delivery</p>

        <div className="delivery_texts">
          <p className="mb-10">Last updated: Feb 25, 2025</p>

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