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
          <div>
            <p className="crafted abt_text1 mb-4 text-white">Our Story</p>
            <p className="text-white text-base md:text-lg leading-relaxed max-w-md abt_text1">
              Our Story Nórden began with a belief that a well-designed space
              should do more than look beautiful. It should understand the
              people who live within it. Based in Lagos, Nigeria, we are an
              interior design and furniture-making company creating considered
              spaces and enduring pieces for everyday life. We bring together
              thoughtful design, skilled craftsmanship and an understanding of
              how people truly use their homes. Our work begins with listening.
              We consider how a room should feel, how a piece will be used and
              how every material, proportion and detail will contribute to the
              experience of the space. The result is design that feels personal,
              purposeful and quietly distinctive.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: text + video (video shows first on mobile) */}
      <div className="flex flex-col md:flex-row w-full md:h-screen">
        <div className="order-2 md:order-1 w-full md:w-1/2 md:h-full flex items-center justify-center px-6 py-12 md:px-10 md:py-0">
          <div className="max-w-md abt_2 text-white text-center">
            <p className="crafted mb-4">Nórden Atelier</p>
            <p className="text-base md:text-lg leading-relaxed">
              Every space communicates. Through proportion, material, light,
              texture and form, it can create calm, invite conversation,
              encourage rest or make everyday moments feel more meaningful. At
              Nórden, we treat design as a language. Every line, finish and
              carefully considered detail becomes part of what a space says—and
              how it makes you feel. Our interior design practice creates spaces
              shaped around the people who use them. From private homes to
              hospitality and commercial environments, we oversee the journey
              from concept and space planning to material selection, furniture
              design, styling and final installation.
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
          <div>
            <p className="crafted abt_text1 mb-4 text-white"> Nórden Atelier</p>
            <p className="text-white text-base md:text-lg leading-relaxed max-w-md abt_text1">
              Our production workshop is where ideas become tangible. Here,
              skilled hands work across upholstery, woodworking and furniture
              finishing to create pieces with character, comfort and lasting
              quality. Discover Our Craft.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full md:h-screen">
        <div className="order-2 md:order-1 w-full md:w-1/2 md:h-full flex items-center justify-center px-6 py-12 md:px-10 md:py-0">
          <div className="max-w-md abt_2 text-white text-center">
            <p className="crafted mb-4"> Nórden House</p>
            <p className="text-base md:text-lg leading-relaxed">
              Our collection of original furniture and objects is designed to
              bring beauty, comfort and intention into everyday living. Each
              piece reflects Nórden’s approach to proportion, material and quiet
              individuality.
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
          <div>
            <p className="crafted abt_text1 mb-4 text-white"> Nórden Atelier</p>
            <p className="text-white text-base md:text-lg leading-relaxed max-w-md abt_text1">
              Designed for living. Made to belong. We create furniture and
              interiors that are not simply placed in a space, but become part
              of the life lived within it.
            </p>
          </div>
        </div>
      </div>

      <Product />
      <Footer />
    </div>
  );
}
