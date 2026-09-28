import React from "react";
import Footer from "./component/footer";
import Header from "./component/Header";
import Product from "./component/about";

export default function About() {
  return (
    <div className="overflow-x-hidden">
      <Header />

      <section className="hero">
        <video className="video-bg" autoPlay loop muted playsInline>
          <source src="/0426.mp4" type="video/mp4" />
        </video>

        <div className="overlay"></div>

        <div className="hero-content px-6">
          <h1 className="text-2xl sm:text-3xl md:text-5xl leading-snug md:leading-tight">
            Since launching in 2013, we’ve always believed that furniture gets
            better with living.
          </h1>
        </div>
      </section>

      {/* Section 1: image + text */}
      <div className="flex flex-col md:flex-row w-full md:h-screen">
        <div className="w-full md:w-1/2 h-72 sm:h-96 md:h-full">
          <img
            src="/abt1.avif"
            alt="About"
            className="w-full h-full object-cover"
          />
        </div>

        <div
          className="w-full md:w-1/2 md:h-full flex items-center justify-center text-center px-6 py-12 md:px-8 md:py-0"
          style={{ backgroundColor: "#844025" }}
        >
          <p className="text-white text-base md:text-lg leading-relaxed max-w-md abt_text1">
            Our design process begins with a simple truth: furniture should be
            built for how people actually live. We craft our pieces with
            inventive details that will make you wonder how you ever lived
            without them.
          </p>
        </div>
      </div>

      {/* Section 2: text + video (video shows first on mobile) */}
      <div className="flex flex-col md:flex-row w-full md:h-screen">
        <div className="order-2 md:order-1 w-full md:w-1/2 md:h-full flex items-center justify-center px-6 py-12 md:px-10 md:py-0">
          <div className="max-w-md abt_2 text-white text-center">
            <p className="crafted mb-4">Crafted For Living</p>
            <p className="text-base md:text-lg leading-relaxed">
              Every piece is designed to bring warmth, function, and character
              into your home. We believe great furniture should feel effortless,
              timeless, and deeply lived in.
            </p>
          </div>
        </div>

        <div className="order-1 md:order-2 w-full md:w-1/2 h-72 sm:h-96 md:h-full relative overflow-hidden">
          <video
            src="/obss.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
      </div>

      <Product />
      <Footer />
    </div>
  );
}