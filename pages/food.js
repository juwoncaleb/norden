import React, { useState } from "react";
import Header from "./components/Header";
import Menu from "./components/Menu";
import Footer from "./components/Footer";

export default function Food() {
  return (
    <div>
      <Header />
      <div class="food_menu">
        <button class="dec">
          From our kitchen to your table, <br /> with love and flavor
        </button>
      </div>
      <div className="menu_item mb-14">
        <p className="text-center our_head">Our Menu</p>
        <p className="cul text-center">
          Welcome to our menu, where culinary delights <br /> and exceptional
          flavors take center stage
        </p>
      </div>
      <Menu />
      <Footer/>
    </div>
  );
}
