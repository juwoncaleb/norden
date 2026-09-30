import React from "react";

import Header from "./component/Header";
import Footer from "./component/footer";

export default function delivery() {
  return (
    <div className="delivery_div ml-10 mr-10">
      <Header />

      <div className="delivery_div">
        <p className="delivery_font">Delivery</p>

        <div className="delivery_texts">
          <p className="mb-10">Last updated: Feb 25, 2025</p>
          <div>
            At Norden, we take pride in the manufacturing of our furniture. It
            is our goal to deliver your purchase to you in the quickest and most
            efficient way possible. All our products are fully packaged for safe
            transit and will be handled by professional third-party delivery
            carriers. We work with multiple specialist delivery partners to
            ensure your order reaches you safely and on time. This may result in
            your order having multiple shipments from separate delivery
            partners. Kindly note that shipping cost is calculated per shipment
            (not per total order), based on the warehouse location that your
            product(s) is shipped from.​Speed of delivery depends on the type of
            product, product availability, and proximity to metropolitan areas.
            To help you with your purchasing decision, you may find out more
            about delivery lead times on each individual product page.​ You may
            enter your zip code on any product page to check if we deliver to
            your area. If your area is currently unavailable, we recommend
            subscribing to our newsletter or following us on social media to
            stay informed about our latest updates. All shipments are delivered
            Monday to Friday between 9:00 am and 7:00 pm, with specified hours
            on Saturdays in selected cities. If you wish to request to see if a
            Saturday delivery is possible for your area, please reach out to us
            before your order has been processed. Kindly note, not all requests
            can be fulfilled. Please note that it is your responsibility to
            check that your items will fit through doors, staircases and
            elevators in their packaging before you place your order. Product
            and package dimensions are included in the product description on
            our website. Failed delivery due to inability to access your home
            will result in additional delivery charges. Please note that while
            we may be able to have your order shipped to a freight forwarder,
            once the shipment is in their hands, Norden is released of all
            responsibility for issues that may arise during and as a result of
            the freight forwarding process.
          </div>
        </div>

      
      </div>

      <Footer />
    </div>
  );
}
