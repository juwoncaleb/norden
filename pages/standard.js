import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function standard() {
  return (
    <div>
      <Header />
      <center>
        <p className="lounge_header_text room_header  text-center ">
          Standard room{" "}
        </p>
        <img className="room_hero" src="./rev.jpg" />
        <hr className="room_divider" />
      </center>
      <div className="page_container">
        <p className="text-left room_Det_tex">Room Details</p>
        <div className="flex justify-between">
          <div className="flex justify-between mt-4">
            <div className="flex justify-between">
              <div className="flex">
                <img
                  className="room_icon"
                  width="25"
                  height="64"
                  src="https://img.icons8.com/external-outline-berkahicon/64/external-floor-linely-interior-design-outline-berkahicon-3.png"
                  alt="external-floor-linely-interior-design-outline-berkahicon-3"
                />
                <p className="hotel_dets"> 400 sq ft</p>
              </div>
              <div className="flex">
                <img
                  className="room_icon"
                  width="25"
                  height="50"
                  src="https://img.icons8.com/ios/50/bedroom.png"
                  alt="bedroom"
                />
                <p className="hotel_dets"> 1 bed</p>
              </div>
              <div className="flex">
                <img
                  className="room_icon"
                  width="25"
                  height="64"
                  src="https://img.icons8.com/pastel-glyph/64/user-male-circle.png"
                  alt="user-male-circle"
                />
                <p className="hotel_dets"> 3 people</p>
              </div>
              <div className="flex mone">
                <img
                  width="30"
                  height="100"
                  className="cash_icon"
                  src="https://img.icons8.com/carbon-copy/100/cash-in-hand.png"
                  alt="cash-in-hand"
                />
                <p className="price ml-4">N35,000/Night</p>
              </div>
            </div>
          </div>
          <div className="flex">
            <button className="booking_btn_">Book Now !</button>
          </div>
        </div>
        <hr className="finite_line" />
        <p className="text-left room_Det_tex">Amenities</p>
        <div className="grid grid-cols-3 amenities_div ">
          <div className="amenities_box">
            <div className=" flex justify-between">
              <p>Free Wifi</p>
              <img
                width="28"
                height="48"
                src="https://img.icons8.com/fluency-systems-regular/48/wifi--v1.png"
                alt="wifi--v1"
              />
            </div>
            <p className="mt-4 amenities_text">
              Vestibulum pretium tortor purus ut nulla pulvinar neque.
            </p>
          </div>
          <div className="amenities_box">
            <div className=" flex justify-between">
              <p>Laundry</p>
              <img
                width="28"
                height="48"
                src="https://img.icons8.com/ios/100/washing-machine.png"
                alt="washing-machine"
              />
            </div>
            <p className="mt-4 amenities_text">
              Vestibulum pretium tortor purus ut nulla pulvinar neque.
            </p>
          </div>
          <div className="amenities_box">
            <div className=" flex justify-between">
              <p>Complimentary Meal</p>
              <img
                width="28"
                height="48"
                src="https://img.icons8.com/ios/100/meal.png"
                alt="meal"
              />
            </div>
            <p className="mt-4 amenities_text">
              Vestibulum pretium tortor purus ut nulla pulvinar neque.
            </p>
          </div>
          <div className="amenities_box">
            <div className=" flex justify-between">
              <p>Gym & Health</p>

              <img
                width="28"
                height="48"
                src="https://img.icons8.com/dotty/80/dumbbell.png"
                alt="dumbbell"
              />
             
            </div>
            <p className="mt-4 amenities_text">
              Vestibulum pretium tortor purus ut nulla pulvinar neque.
            </p>
          </div>
          <div className="amenities_box">
            <div className=" flex justify-between">
              <p>Free Wifi</p>
              <img
                width="28"
                height="48"
                src="https://img.icons8.com/fluency-systems-regular/48/wifi--v1.png"
                alt="wifi--v1"
              />
            </div>
            <p className="mt-4 amenities_text">
              Vestibulum pretium tortor purus ut nulla pulvinar neque.
            </p>
          </div>
          <div className="amenities_box">
            <div className=" flex justify-between">
              <p>Free Wifi</p>
              <img
                width="28"
                height="48"
                src="https://img.icons8.com/fluency-systems-regular/48/wifi--v1.png"
                alt="wifi--v1"
              />
            </div>
            <p className="mt-4 amenities_text">
              Vestibulum pretium tortor purus ut nulla pulvinar neque.
            </p>
          </div>
        </div>
        <hr className="finite_line" />
        <p className="text-left room_Det_tex mb-14">Photos</p>
        <div className="grid grid-cols-3 gap-6">
          <img src="./wd.jpg" />
          <img src="./toi.jpg" />
          <img src="./chair.jpg" />
          <img src="./wd.jpg" />
        </div>
      </div>
      <Footer />
    </div>
  );
}
