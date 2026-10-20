
"use client";

import Footer from "./component/footer";
import Header from "./component/Header";


export default function AmbassadorPage() {
  const requirements = [
    {
      image: "./abt1.avif",
      alt: "New York City skyline",
      text: "Based in the United Kingdom",
    },
    {
      image: "./ap1.jpeg",
      alt: "Beautiful contemporary furniture and decor",
      text: "Have a keen eye for aesthetics",
    },
    {
      image: "./ap2.jpg",
      alt: "Contemporary living room with neutral furniture",
      text: "Seeking timeless and modern contemporary furniture to furnish a new or existing space",
    },
  ];

  const perks = [
    {
      image: "./l1.jpg",
      alt: "Elegant contemporary living room furniture",
      text: "Up to £3,500 worth of Nordenfurniture for you to furnish your space",
    },
    {
      image: "./l4.jpg",
      alt: "Contemporary living room furniture",
      text: "Opportunities for multiple collaborations and hosting giveaways that would excite and reward your followers",
    },
    {
      image: "./l2.jpg",
      alt: "Website displayed on a desktop computer",
      text: "Exclusive landing page featured on Castlery's sites and distributed to our audiences",
    },
  ];

  return (
    <main className="ambassador-page">
      {/* HERO SECTION */}
      <Header/>
      <section className="ambassador-hero">
        <div className="ambassador-hero-image">
          <img
            src="./l1.jpg"
            alt="A creator relaxing on a contemporary cream sofa"
          />
        </div>

        <div className="ambassador-hero-content">
          <h1>NordenAmbassador Program</h1>

          <p>
            We are looking for creators to spotlight our furniture to their
            dedicated followers. If you are a modern millennial passionate
            about pursuing the goals and milestones that matter to you and
            have a keen eye for aesthetics, we want to work with you!
          </p>

          <a
            className="ambassador-apply-button"
            href="https://www.castlery.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>APPLY NOW</span>
            <span className="ambassador-arrow" aria-hidden="true">
              →
            </span>
          </a>
        </div>
      </section>

      {/* JOIN US SECTION */}
      <section className="ambassador-section join-us-section">
        <h2>Join Us If You Are:</h2>

        <div className="ambassador-grid">
          {requirements.map((item) => (
            <article className="ambassador-card" key={item.text}>
              <img src={item.image} alt={item.alt} />

              <div className="ambassador-card-content">
                <span className="ambassador-location-icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                </span>

                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* PERKS SECTION */}
      <section className="ambassador-section perks-section">
        <h2>NordenAmbassador Perks</h2>

        <div className="ambassador-grid">
          {perks.map((item) => (
            <article className="ambassador-card" key={item.text}>
              <img src={item.image} alt={item.alt} />

              <div className="ambassador-card-content">
                <span className="ambassador-location-icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                </span>

                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <Footer/>
    </main>
  );
}
