import React from "react";

import FurnitureCarousel from "./component/furniture";
import Header from "./component/Header";
import Footer from "./component/footer";
import FAQ from "./component/faq";
import ImageCarousel from "./component/carousel";
import Link from "next/link";

export default function LandingPage() {
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
      <section className="discount_div flex justify-center">
        <div className="discount_price">
          <p className="discount_head">N 1,000,000 off</p>
          <p>N1,500,000 min.spend</p>
        </div>
        <div className="discount_price">
          <p className="discount_head">N180,000 off</p>
          <p>N1,500,00min.spend</p>
        </div>
        <div className="discount_price">
          <p className="discount_head">$N159,000 off</p>
          <p>N1,500,000 min.spend</p>
        </div>
      </section>
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

      <div className="bestselling">
        <center>
          <p className="modo_shop">Shop the look with NORDEN</p>
          <p className="modo_text">
            Thoughtfully made by people who live in homes, too. That’s why you
            love them so much.
          </p>
          <button className="view_all">View all</button>
        </center>
      </div>

      <FurnitureCarousel />
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
      <FAQ />

      <Footer />
    </div>
  );
}
