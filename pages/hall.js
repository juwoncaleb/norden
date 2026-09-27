import React from "react";
import HallHero from "./components/hallHero";
import Header from "./components/Header";
import ImageGrid from "./components/hallSections";
import Footer from "./components/Footer";
import Accordion from "./components/faq";

export default function Hall() {
  return (
    <div>
      <Header />
      <HallHero />
      <div className="loung_video mb-20 flex justify-around">
        <div>
          <p className="lounge_sub_text">Congratulations on finding your</p>
          <p className="lounge_sub_text">
            forever person -{" "}
            <span className="culinnary"> let’s throw a party!</span>
          </p>
          <div className="lounge_head_Sub_vide">
            <p>
              From romantic dinners to family celebrations, my services are
              designed to suit any occasion. Whether you prefer a multi-course
              fine dining experience, or a themed menu, I will work with you to
              create a menu that reflects your vision.
            </p>
            <div className="flex justify-between">
              <div className="flex gap-6 mt-8">
                <button className="menu_btn">Book a tour</button>
                <button className="lounge_contact">Gallery</button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-6">
          <video
            className="ricevideo"
            src="/prayer.mp4"
            autoPlay
            loop
            muted
            playsInline
            width="100%"
          />
          <img className="trad_food" src="./wed.jpg" />
        </div>{" "}
      </div>
      <div className="loung_video changing_room_div gap-20 flex justify-between">
        <img className="changing_room" src="./change.jpg" />
        <div>
          <p className="lounge_sub_text text-center mb-8">Why Pipple event</p>
          <p className="whypiple ">
            1. Separate Ceremony & Reception spaces…this means no awkward room
            flips during your event.
          </p>
          <p className="whypiple ">
            2. Separate Ceremony & Reception spaces…this means no awkward room
            flips during your event.
          </p>{" "}
          <p className="whypiple ">
            3. Separate Ceremony & Reception spaces…this means no awkward room
            flips during your event.
          </p>{" "}
          <p className="whypiple ">
            4. Separate Ceremony & Reception spaces…this means no awkward room
            flips during your event.
          </p>
        </div>
      </div>

      <div className="loung_video changing_room_div gap-20 flex justify-between">
        <div>
          <p className="lounge_sub_text text-center mb-8">Spacious car park</p>
          <p className="whypiple ">
            1. Separate Ceremony & Reception spaces…this means no awkward room
            flips during your event.
          </p>
          <p className="whypiple ">
            2. Separate Ceremony & Reception spaces…this means no awkward room
            flips during your event.
          </p>{" "}
          <p className="whypiple ">
            3. Separate Ceremony & Reception spaces…this means no awkward room
            flips during your event.
          </p>{" "}
          <p className="whypiple ">
            4. Separate Ceremony & Reception spaces…this means no awkward room
            flips during your event.
          </p>
        </div>
        <img className="changing_room" src="./carpark.jpg" />
      </div>

      <div className="loung_video changing_room_div gap-20 flex justify-between">
        <img className="changing_room" src="./safe.jpg" />
        <div>
          <p className="lounge_sub_text text-center mb-8">
            You are safe with us.
          </p>
          <p className="whypiple ">
            1. Separate Ceremony & Reception spaces…this means no awkward room
            flips during your event.
          </p>
          <p className="whypiple ">
            2. Separate Ceremony & Reception spaces…this means no awkward room
            flips during your event.
          </p>{" "}
          <p className="whypiple ">
            3. Separate Ceremony & Reception spaces…this means no awkward room
            flips during your event.
          </p>{" "}
          <p className="whypiple ">
            4. Separate Ceremony & Reception spaces…this means no awkward room
            flips during your event.
          </p>
        </div>
      </div>
      <ImageGrid />
      <div className="page_container">
        <p className="lounge_header_text mt-20">Frequently Asked Questions</p>
        <Accordion />
      </div>
      <Footer />
    </div>
  );
}
