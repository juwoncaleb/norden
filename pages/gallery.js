import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function gallery() {
  return (
    <div>
      <Header />
      <div className="lounge_div terms_and_con">
        <p className="lounge_header_text  text-center ">
          Photos & Videos{" "}
        </p>
        <p className="text-center next mb-20">We would love to have you next !</p>

        <div className="grid grid-cols-3 gap-10">
          <img src="./date.jpg" />
          <video
            className="wedding"
            src="/ed.mp4"
            autoPlay
            loop
            muted
            playsInline
            width="100%"
          />
          <img className="kneel" src="./kneel.jpg" />
          <img className="kneel" src="./agba.jpg" />

          <img className="kneel" src="./sop.jpg" />
          <video
            className="wedding"
            src="/par.mp4"
            autoPlay
            loop
            muted
            playsInline
            width="100%"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
