import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Lounge() {
  return (
    <div>
      <Header />
      <div className="lounge_div">
        <div className="flex justify-between lounge_head">
          <div>
            <div className="flex g ">
              <img className="lounge_test_img" src="./pfp.jpg" />
              <img className="lounge_test_img" src="./pfp.jpg" />
              <img className="lounge_test_img" src="./pfp.jpg" />
              <div>
                <p className="lounge_ciient">1000+</p>
                <p className="satisfied_client_text">Satisfied Guest</p>
              </div>
            </div>
            <div className="lounge_head_Sub_text">
              <p>
                Crafted just for you, every dish is a celebration of taste,
                creativity, and sophistication.
              </p>
            </div>
          </div>

          <div>
            <p className="lounge_header_text">Elevate Your Experience </p>
            <p className="lounge_header_text">
              with <span className="culinnary">Culinary Excellence</span>
            </p>
          </div>
        </div>
        <div class="background-image"></div>
        <div className="loung_video flex justify-around">
          <div>
            <p className="lounge_sub_text">From Our Kitchen </p>
            <p className="lounge_sub_text">
              with <span className="culinnary">to Your Heart</span>
            </p>
            <div className="lounge_head_Sub_vide">
              <p>
                From romantic dinners to family celebrations, my services are
                designed to suit any occasion. Whether you prefer a multi-course
                fine dining experience, or a themed menu, I will work with you
                to create a menu that reflects your vision.
              </p>
              <div className="flex justify-between">
                <div className="flex gap-6 mt-8">
                  <button className="menu_btn">Menu</button>
                  <button className="lounge_contact">Contact us</button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-6">
            <video
              className="ricevideo"
              src="/rice.mp4"
              autoPlay
              loop
              muted
              playsInline
              width="100%"
            />
            <img className="trad_food" src="./trad.jpg" />
          </div>{" "}
        </div>
        <div className="menu_list">
          <center>
            <p className="lounge_sub_text">
              Made with Love Served with{" "}
              <span className="culinnary">with Care </span>
            </p>
            <p className="lounge_pre">
              Whether you prefer a multi-course fine dining experience, a casual
              brunch, or a themed menu, I will work with you to create a menu
              that reflects your vision.
            </p>

            <div className="grid grid-cols-5 food_div gap-10">
              <div>
                <img className="food" src="./fufu.jpg" />
                <p className="food_cat">Breakfast</p>
                <p className="learn">Learn more</p>
              </div>
              <div>
                <img className="food" src="./yam.jpg" />
                <p className="food_cat">Lunch</p>
                <p className="learn">Learn more</p>
              </div>
              <div>
                <img className="food" src="./moi.jpg" />
                <p className="food_cat">Dinner</p>
                <p className="learn">Learn more</p>
              </div>
              <div>
                <img className="food" src="./fufu.jpg" />
                <p className="food_cat">Desert</p>
                <p className="learn">Learn more</p>
              </div>
              <div>
                <img className="food" src="./martel.jpg" />
                <p className="food_cat">Alcohol</p>
                <p className="learn">Learn more</p>
              </div>
            </div>
          </center>
          <div className="grid drinks_tab henny_div grid-cols-2">
            <img className="barc barcadi" src="./barca.jpg" />
            <div className="">
              <img className="barc" src="./henny.jpg" />
            </div>
          </div>

          <center>
            <p className="lounge_header_text_food">
              It’s more than cooking—
              <img className="text_food" src="./fufu.jpg" alt="fufu" />
              it’s our way of helping people
              <img className="text_food" src="./spag.jpg" alt="fufu" /> share
              moments that matter
            </p>
          </center>
        </div>
        <div class="ofada_meal">
          <button class="book_now">Book Now</button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
