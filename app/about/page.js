import React from "react";
import Footer from "../component/footer";
import Product from "../component/about";
import Header from "../component/Header";

export default function about() {
  return (
    <div>
      <Header/>
      <section className="hero">
        <video className="video-bg" autoPlay loop muted playsInline>
          <source src="/0426.mp4" type="video/mp4" />
        </video>

        <div className="overlay"></div>

        <div className="hero-content">
          <h1>
            Since launching in 2013, we’ve always believed that furniture gets
            better with living.​
          </h1>
        </div>
      </section>
      <div className="flex h-screen w-full">
        <div className="w-1/2 h-full">
          <img
            src="./abt1.avif"
            alt="About"
            className="w-full h-full object-cover"
          />
        </div>

        <div
          className="w-1/2 h-full flex items-center justify-center text-center px-8"
          style={{ backgroundColor: "#844025" }}
        >
          <p className="text-white text-lg leading-relaxed max-w-md abt_text1">
            Our design process begins with a simple truth: furniture should be
            built for how people actually live. We craft our pieces with
            inventive details that will make you wonder how you ever lived
            without them.
          </p>
        </div>
      </div>

      <div className="flex h-screen w-full">
        <div
          className="w-1/2 h-full flex items-center justify-center px-10"
          style={{ backgroundColor: "" }}
        >
          <div className="max-w-md abt_2 text-white text-center">
            <p className="crafted mb-4">Crafted For Living</p>
            <p className="text-lg leading-relaxed">
              Every piece is designed to bring warmth, function, and character
              into your home. We believe great furniture should feel effortless,
              timeless, and deeply lived in.
            </p>
          </div>
        </div>

        <div className="w-1/2 h-full relative overflow-hidden">
          <video
            src="./obss.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
      </div>
      <Product/>
      <Footer/>
    </div>
  );
}
