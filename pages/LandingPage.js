import React from "react";
import FurnitureCarousel from "./component/furniture";


import Header from "./component/Header";
import Footer from "./component/footer";
import FAQ from "./component/faq";
import ImageCarousel from "./component/carousel";
import Link from "next/link";
import CustomizationSection from "./component/custom";
import InteriorStylingSection from "./component/comp";
import TimelessTravelsSection from "./component/time";



export default function LandingPage({entries}) {
  return (
    <div>
      <Header />
      {/* HERO SECTION (video) */}
      <section className="hero">
        <video className="video-bg" autoPlay loop muted playsInline>
          <source src="/bkvideo.mp4" type="video/mp4" />
        </video>

        <div className="overlay"></div>

        <div className="hero-content">
          <h1>The language of Space - Norden ​</h1>
          <Link href="./sofa">
            <button className="seebtn">See More</button>
          </Link>
        </div>
      </section>
      

      {/* NORMAL CONTENT BELOW */}
      {/* <section className="discount_div flex justify-center">
        <div className="discount_price">
          <p className="discount_head">N 1,000,000 off</p>
          <p>N1,500,000 min.spend</p>
        </div>
        <div className="discount_price">
          <p className="discount_head">N180,000 off</p>
          <p>N1,500,00min.spend</p>
        </div>
        <div className="discount_price">
          <p className="discount_head">N159,000 off</p>
          <p>N1,500,000 min.spend</p>
        </div>
      </section> */}
      <div className="carousel_img">
        {/* TEXTS */}
        <div className="image__text">
          <p className="img_txt">
            From unexpected plus-ones to evenings that don’t go according to
            plan, these are the pieces that hold everyday chaos together so you
            can stay exactly where you want to be: in the moment.
          </p>
          <Link href="./sofa">
            <button className="selling">Explore the collection</button>
          </Link>
        </div>

        <div className="carousel_wrap">
          <ImageCarousel />
        </div>
      </div>
      
      
      <CustomizationSection/>

    <div className="bestselling">
        <center>
          <p className="modo_shop">Shop the look with NORDEN</p>
          <p className="modo_text">
            Thoughtfully made by people who live in homes, too. That’s why you
            love them so much.
          </p>
          <Link href="./sofa">
          <button className="view_all">View all</button>

          </Link>
        </center>
      </div>



      <section
        className="background_div h-screen bg-cover bg-center flex items-center justify-center relative"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative text-center text-white max-w-2xl px-4">
          <h1 className="text-2xl md:text-4xl leading-relaxed mb-6">
            A good piece of furniture opens your eyes to the spaces you already
            have, and all the life that’s waiting to be lived in them.
          </h1>

          <Link href='./about'>
            <button className="border border-white px-6 py-3 hover:bg-white hover:text-black transition">
              READ OUR STORY
            </button>
          </Link>
        </div>
      </section>
        <div className="flex flex-col md:flex-row w-full md:h-screen">
              <div className="order-2 md:order-1 w-full md:w-1/2 md:h-full flex items-center justify-center px-6 py-12 md:px-10 md:py-0">
                <div className="max-w-md abt_2 text-white text-center">
                  <p className="crafted mb-4">Nórden Studio </p>
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
            <FurnitureCarousel entries={entries} title="Bestsellers" />
      
           <InteriorStylingSection/>

      <FAQ />
<TimelessTravelsSection/>
      <Footer />
    </div>
  );
}
