import React from "react";

import Header from "./component/Header";
import Footer from "./component/footer";

export default function Delivery() {
  return (
    <div>
      <Header />

      <div className="delivery_div">
        <p className="delivery_font">Delivery</p>

        <div className="delivery_texts">
          <p className="mb-10">Last updated: Feb 25, 2025</p>

          <p className="mb-6">
            At Norden, we take pride in manufacturing our furniture, and our
            goal is to get your purchase to you as quickly and efficiently as
            possible. Every product is fully packaged for safe transit and
            handled by professional third-party carriers. We work with several
            specialist partners, so your order may arrive in multiple shipments.
            Shipping is charged per shipment rather than per order, based on the
            warehouse each product ships from.
          </p>

          <p className="mb-6">
            Speed of delivery depends on the type of product, its availability,
            and proximity to metropolitan areas. Lead times are listed on each
            product page, where you can also enter your zip code to check
            whether we deliver to your area. If your area isn't covered yet,
            subscribe to our newsletter or follow us on social media for
            updates. Shipments are delivered Monday to Friday, 9:00 am to 7:00
            pm, with limited hours on Saturdays in selected cities. To request a
            Saturday delivery, contact us before your order is processed, though
            we can't guarantee every request.
          </p>

          <p className="mb-6">
            It is your responsibility to confirm that your items will fit
            through doors, staircases and elevators in their packaging before
            you order. Product and package dimensions are included in each
            product description. If we can't access your home at the time of
            delivery, additional charges will apply. If your order is shipped to
            a freight forwarder, Norden is not responsible for any issues that
            arise once the shipment is in their hands.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
