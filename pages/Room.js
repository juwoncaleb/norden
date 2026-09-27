import React from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";

export default function Room() {
  return (
    <div>
      <Header />
      <div className="flex page_container justify-between mt-20">
        <p className="reviews">EXPLORE ROOM</p>
      </div>

      <div className="flex gap-10 mt-10  page_container justify-between">
        <div>
          <img src="./liv.jpg" />
          <div className="flex mt-4">
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
          </div>
          <p className="mt-2 Hotel_class">Pent house room</p>
        </div>

        <div>
          <img src="./hus.jpg" />
          <div className="flex mt-4">
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
          </div>
          <p className="mt-2 Hotel_class">Master room</p>
        </div>
        
      </div>
      <div className="flex gap-10 mt-10  page_container justify-between">
        <div>
          <img src="./bed.jpg" />
          <div className="flex mt-4">
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
          </div>
          <p className="mt-2 Hotel_class">Standard room</p>
        </div>

        <div className="mb-20 ">
          <img src="./rev.jpg" />
          <div className="flex mt-4">
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
          </div>
          <p className="mt-2 Hotel_class">Deluxe room</p>
        </div>
        
      </div>
      <Footer />
    </div>
  );
}
