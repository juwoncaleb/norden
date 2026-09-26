import React from "react";

export default function Header() {
  return (
    <div>
      <div className="header_div flex justify-around">
        <div className="flex">
          <img className="modo_logo mt-1 mr-8" src="https://ik.imagekit.io/MM/modo.png" />
          <p className="mr-2 mt-2 ml-2">New</p>
          <p className="mr-4 mt-2 ml-4">Sofa</p>
          <p className="mr-4 mt-2 ml-4">Tables</p>
          <p className="mr-4 mt-2 ml-4">Chairs</p>
          <p className="mr-4 mt-2 ml-4">Beds</p>
          <p className="mr-4 mt-2 ml-4">Storage</p>
          <p className="mr-4 mt-2 ml-4">Furniture Sets</p>
          <p className="mr-4 mt-2 ml-4">Outdoors</p>
          <p className="mr-4 mt-2 ml-4">Accessories</p>
          <p className="mr-4 mt-2 ml-4">Tools</p>
          <p className="mr-4 mt-2 ml-4">Sale</p>
        </div>

        {/* ICONS */}
        <div className="flex mt-2">
          <img
            className="header_icon"
            width="20"
            height="20"
            src="https://img.icons8.com/ios/50/search--v1.png"
            alt="search--v1"
          />
          <img
            className="header_icon"
            width="20"
            height="50"
            src="https://img.icons8.com/ios/50/gender-neutral-user--v1.png"
            alt="gender-neutral-user--v1"
          />
          <img
            className="header_icon"
            width="20"
            height="50"
            src="https://img.icons8.com/ios/50/like--v1.png"
            alt="like--v1"
          />
          <img
            className="header_icon"
            width="20"
            height="50"
            src="https://img.icons8.com/ios/50/shopping-bag--v1.png"
            alt="shopping-bag--v1"
          />
        </div>
      </div>
      <div className="offer_div flex justify-center">
        <div className="flex offer_text">
          <p className="offer_text_arrow">NEW ARRIVALS</p>
          <img
            width="34"
            height="64"
            src="https://img.icons8.com/laces/64/arrow.png"
            alt="arrow"
          />
        </div>
        <div className="flex offer_text">
          <p className="offer_text_arrow"> UP TO 40% OFF SALE</p>
          <img
            width="34"
            height="64"
            src="https://img.icons8.com/laces/64/arrow.png"
            alt="arrow"
          />
        </div>
      </div>
    </div>
  );
}
