// import React from "react";

// import Accordion from "./component/Accordion"; // Ensure Accordion.js lives inside /component
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import Header from "./component/Header";
// import Footer from "./component/footer";

// export default function About() {
//   let settings = {
//     dots: false,
//     infinite: true,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000,
//     pauseOnHover: false,
//   };
//   return (
//     <div className="about_us_page">
//       <Header/>      <div className="div_line">
//         <div className="page_container explore mt-20">
//           <div className="page_container">
//             <p className="reviews">EXPLORE ROOM</p>
//           </div>
//           <div className="flex gap-14 abt_head justify-between page_container">
//             <div>
//               <img className="abt_img" src="./tv.jpg" />
//               <div className="about_heading">
//                 <p className="abt_top_text">
//                   Diam nec placerat faucibus purus. Sit amet diam malesuada
//                   cursus faucibus elementum laoreet porttitor enim. Egestas quis
//                 </p>
//                 <div className="flex justify-between gap-2 mt-6">
//                   <button className="abt_btns flex">
//                     40 luxury bed{" "}
//                     <img
//                       className="room_icon ml-2"
//                       width="25"
//                       height="50"
//                       src="https://img.icons8.com/ios/50/bedroom.png"
//                       alt="bedroom"
//                     />
//                   </button>
//                   <button className="abt_btns gue flex">
//                     10k total guest{" "}
//                   </button>
//                   <button className="abt_btns about_book flex">
//                     <p>Book now</p>
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div>
//               <div className="about_heading">
//                 <p className="ab_head">
//                   Hotel Cruise is your gateway to a peaceful and luxurious
//                   vacation.
//                 </p>
//                 <p className="abt_sub_text">
//                   Diam nec placerat faucibus purus. Sit amet diam malesuada
//                   cursus faucibus elementum laoreet porttitor enim. Egestas quis
//                 </p>
//               </div>

//               <img className="abt_img" src="./liv.jpg" />
//             </div>
//           </div>
//         </div>

//         <div className="flex services abt_serv page_container gap-20 justify-between">
//           <img className="ward" src="./int.jpg" />
//           <div className="service_tab">
//             <p className="service_text">OUR SERVICES</p>
//             <div>
//               <div className="flex">
//                 <p className="services_header mr-10">1.</p>
//                 <div className="service_head_text">
//                   <p className="services_header">Daily Housekeeping</p>
//                   <p>
//                     Semper vulputate commodo urna id. Est feugiat aliquam
//                     bibendum nulla mauris elit. Eu maecenas neque nibh purus.
//                   </p>
//                 </div>
//               </div>
//               <div className="flex">
//                 <p className="services_header mr-10">2.</p>
//                 <div className="service_head_text">
//                   <p className="services_header">Daily Housekeeping</p>
//                   <p>
//                     Semper vulputate commodo urna id. Est feugiat aliquam
//                     bibendum nulla mauris elit. Eu maecenas neque nibh purus.
//                   </p>
//                 </div>
//               </div>
//               <div className="flex">
//                 <p className="services_header mr-10">3.</p>
//                 <div className="service_head_text">
//                   <p className="services_header">Daily Housekeeping</p>
//                   <p>
//                     Semper vulputate commodo urna id. Est feugiat aliquam
//                     bibendum nulla mauris elit. Eu maecenas neque nibh purus.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="page_container choose">
//           <p className="reviews ">WHY CHOOSE US</p>

//           <div className="grid grid-cols-3 gap-2 mt-10">
//             <div className="abt_card">
//               <img
//                 width="40"
//                 height="96"
//                 src="https://img.icons8.com/parakeet-line/96/FFFFFF/conference-call.png"
//                 alt="conference-call"
//               />
//               <p className="card_header">Memorable Experiences</p>
//               <p className="card_sub_text">
//                 Enim a diam id id. Arcu nec urna accumsan sit pellentesque.
//                 Suscipit sit sed mauris cras in Consequat eget varius massa.
//               </p>
//             </div>
//             <div className="image-container">
//               <img className="abt_ward" src="./ward.jpg" />
//             </div>
//             <div className="abt_card">
//               <img
//                 width="40"
//                 height="100"
//                 src="https://img.icons8.com/ios/100/FFFFFF/building.png"
//                 alt="building"
//               />
//               <p className="card_header">Memorable Experiences</p>
//               <p className="card_sub_text">
//                 Enim a diam id id. Arcu nec urna accumsan sit pellentesque.
//                 Suscipit sit sed mauris cras in Consequat eget varius massa.
//               </p>
//             </div>
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="carousel">
//               <Slider {...settings}>
//                 <div>
//                   <img className="caroul_img" src="./bed.jpg" />
//                 </div>
//                 <div>
//                   <img className="caroul_img" src="./du.jpg" />
//                 </div>
//                 <div>
//                   <img className="caroul_img" src="./hus.jpg" />
//                 </div>
//                 <div>
//                   <img className="caroul_img" src="./liv.jpg" />
//                 </div>
//                 <div>
//                   <img className="caroul_img" src="./rev.jpg" />
//                 </div>
//                 <div>
//                   <img className="caroul_img" src="./delux.jpg" />
//                 </div>
//               </Slider>
//             </div>
//             <div className="abt_card caro_abt">
//               <p className="spscial">Be Part of Something Special</p>

//               <p className="card_sub_te">
//                 Enim a diam id id. Arcu nec urna accumsan sit pellentesque.
//                 Suscipit sit sed mauris cras in Consequat eget varius massa.
//               </p>
//               <div>
//                 <button
//                   className="contact_btn2 
// "
//                 >
//                   Book a Room
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="page_container">
//           <div className="flex mt-20 mb-8 justify-between">
//             <div>
//               <p className="tet">TESTIMONIALS</p>
//               <p className="reviews">CUSTOMER REVIEWS</p>
//             </div>
//             <div>
//               <button className="view_reviews">View All Reviews</button>
//             </div>
//           </div>
//         </div>
//         <div className="flex justify-between page_container testimonial_tab gap-10">
//           <img className="robe" src="./ward.jpg" />
//           <div className="testimonial_div">
//             <p className="testinomola_text">
//               Ac porttitor gravida non commodo etiam ornare. Eget feugiat sed
//               ullamcorper vestibulum non pellentesque nisl mattis. Odio turpis
//               donec praesent tellus amet viverra nec mattis amet. Urna ut sit
//               sed molestie enim. Facilisis luctus pulvinar ut fermentum neque
//               consequat. Molestie porttitor.
//             </p>
//             <hr className="testimonail_line" />
//             <div className="flex justify-between">
//               <div className="flex ">
//                 <img className="testimonial_img mr-8" src="./pfp.jpg" />
//                 <div>
//                   <p className="testimonial_person">Soneye omojuwon</p>
//                   <p className="testimonial_occ">Ceo</p>
//                 </div>
//               </div>
//               <div className="flex">
//                 <img
//                   className="arrowss lan"
//                   width="30"
//                   height="50"
//                   src="https://img.icons8.com/ios/100/circled-chevron-left.png"
//                   alt="circled-chevron-left"
//                 />
//                 <img
//                   className="arrowss lan"
//                   width="30"
//                   height="50"
//                   src="https://img.icons8.com/ios/100/circled-chevron-left.png"
//                   alt="circled-chevron-left"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="page_container">
//           <div className="flex mt-20 mb-8 justify-between">
//             <div>
//               <p className="tet">Frequently asked Questions</p>
//               <p className="reviews">HAVE ANY QUESTIONS ?</p>
//             </div>
//           </div>

//           <div className="flex justify-between">
//             <div>
//               <img src="./chair.jpg" />
//             </div>
//             <Accordion />
//           </div>
//         </div>

//         <div className="hook abt_hotel page_container">
//           <center>
//             <img
//               className="hotel"
//               src="/hotel.svg"
//               alt="Hotel Icon"
//               width={70}
//               height={100}
//             />
//             <div className="hotel_div">
//               <p className="hotel_header">
//                 SURPRISE YOUR LOVED ONES WITH HOTEL CRUISE GIFT CARDS.
//               </p>
//             </div>
//           </center>
//           <div className="flex justify-between gap-10">
//             <img className="tv" src="./tv.jpg" />
//             <div className="card_div">
//               <p>
//                 Sed gravida fringilla malesuada vel eleifend enim urna maecenas
//                 id. Neque turpis volutpat mollis donec odio velit faucibus. Non
//                 nibh dapibus faucibus diam fringilla volutpat sollicitudin.
//               </p>
//               <button className="reservation">Make a reservation</button>
//             </div>
//             <img className="hall" src="./int.jpg" />
//           </div>
//         </div>
//       </div>
//       <Footer/>
//     </div>
//   );
// }
