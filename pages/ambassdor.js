"use client";

import Footer from "./component/footer";
import Header from "./component/Header";

export default function AmbassadorPage() {
  const requirements = [
    {
      image: "/abt1.avif",
      alt: "Contemporary NÓRDEN furniture in a beautifully styled interior",
      text: "Based in Nigeria, with a strong connection to the Nigerian design and lifestyle community",
    },
    {
      image: "/ap1.jpeg",
      alt: "Beautiful contemporary NÓRDEN furniture and decor",
      text: "Have a keen eye for aesthetics, interiors, design and contemporary living",
    },
    {
      image: "/ap2.jpg",
      alt: "Contemporary living room with neutral furniture",
      text: "Love timeless, modern furniture and are looking to create a thoughtfully designed space",
    },
  ];

  const perks = [
    {
      image: "/l1.jpg",
      alt: "Elegant contemporary living room with NÓRDEN furniture",
      text: "Access to NÓRDEN furniture and exclusive products to help you create a space that feels uniquely yours",
    },
    {
      image: "/l4.jpg",
      alt: "Contemporary living room furniture",
      text: "Opportunities for multiple collaborations, campaigns and giveaways designed to engage and reward your audience",
    },
    {
      image: "/l2.jpg",
      alt: "NÓRDEN furniture and interior design",
      text: "Be featured across NÓRDEN's digital platforms and introduced to our growing community of design-conscious customers",
    },
  ];

  return (
    <main className="ambassador-page">
      {/* HERO SECTION */}
      <Header />

      <section className="ambassador-hero">
        <div className="ambassador-hero-image">
          <img
            src="/l1.jpg"
            alt="Creator relaxing in a contemporary NÓRDEN living space"
          />
        </div>

        <div className="ambassador-hero-content">
          <h1>NÓRDEN Ambassador Program</h1>

          <p>
            We are looking for creators who share our appreciation for
            thoughtful design, beautiful spaces and contemporary living.
            If you have a strong sense of style and an engaged audience,
            we would love to create something meaningful with you.
          </p>

          <a
            className="ambassador-apply-button"
            href="/ambassador/apply"
          >
            <span>APPLY NOW</span>

            <span
              className="ambassador-arrow"
              aria-hidden="true"
            >
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
            <article
              className="ambassador-card"
              key={item.text}
            >
              <img
                src={item.image}
                alt={item.alt}
              />

              <div className="ambassador-card-content">
                <span
                  className="ambassador-location-icon"
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                    <circle
                      cx="12"
                      cy="10"
                      r="2.5"
                    />
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
        <h2>NÓRDEN Ambassador Perks</h2>

        <div className="ambassador-grid">
          {perks.map((item) => (
            <article
              className="ambassador-card"
              key={item.text}
            >
              <img
                src={item.image}
                alt={item.alt}
              />

              <div className="ambassador-card-content">
                <span
                  className="ambassador-location-icon"
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                    <circle
                      cx="12"
                      cy="10"
                      r="2.5"
                    />
                  </svg>
                </span>

                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}