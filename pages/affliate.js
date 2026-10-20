import Footer from "./component/footer";
import Header from "./component/Header";


export default function AffiliatePage() {
  const benefits = [
    {
      icon: "support",
      text: "Get access to personalised marketing support to boost conversion rates.",
    },
    {
      icon: "growth",
      text: "The more you sell, the more you make. Enjoy performance bonuses through higher commission rates with no commission cap.",
    },
    {
      icon: "commission",
      text: "All products are eligible for commissions and come with a minimum of 30-day tracking window, making it easier to close the sale.",
    },
  ];

  return (
    <main className="affiliate-page">
      {/* HERO SECTION */}
      <Header/>
      <section className="affiliate-hero">
        <div className="affiliate-hero-image">
          <img
            src="./abt1.avif"
            alt="A woman relaxing outdoors on contemporary Nordenfurniture"
          />
        </div>

        <div className="affiliate-hero-content">
          <h1>Become a NordenAffiliate</h1>

          <p>
            Share about your favourite Nordenproducts and earn commission.
            It is as simple as that.
          </p>

          <a
            href="https://www.castlery.com/"
            className="affiliate-apply-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>APPLY NOW</span>
            <svg
              viewBox="0 0 32 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 10H28M19 2L28 10L19 18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="affiliate-how">
        <div className="affiliate-how-inner">
          <h2>How It Works</h2>

          <p>
            Whether you are a media partner, content site or network, youll
            earn a competitive commission rate for every qualified purchase
            made through your affiliate link on your website, newsletters or
            social media. With a wide range of home décor and furniture on
            Castlery, all you have to do is choose a product and use our
            linking tools to direct your audience to your recommendations.
          </p>
        </div>
      </section>

      {/* AFFILIATE BENEFITS */}
      <section className="affiliate-benefits">
        <div className="affiliate-benefits-grid">
          {benefits.map((benefit) => (
            <article className="affiliate-benefit-card" key={benefit.icon}>
              <div className="affiliate-benefit-icon">
                {benefit.icon === "support" && (
                  <svg viewBox="0 0 160 160" fill="none" aria-hidden="true">
                    <rect
                      x="39"
                      y="12"
                      width="82"
                      height="133"
                      rx="13"
                      stroke="currentColor"
                      strokeWidth="6"
                    />
                    <path
                      d="M65 15L72 27H101L108 15M72 132H89"
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M116 50C137 50 151 65 151 83C151 101 137 116 119 116L100 124L106 108C91 102 82 91 82 77C82 62 97 50 116 50Z"
                      fill="#f8f7f5"
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M116 65V100M99 82H133"
                      stroke="currentColor"
                      strokeWidth="7"
                      strokeLinecap="round"
                    />
                  </svg>
                )}

                {benefit.icon === "growth" && (
                  <svg viewBox="0 0 160 160" fill="none" aria-hidden="true">
                    <path
                      d="M19 144H146"
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    <rect
                      x="30"
                      y="109"
                      width="24"
                      height="35"
                      rx="3"
                      stroke="currentColor"
                      strokeWidth="6"
                    />
                    <rect
                      x="72"
                      y="83"
                      width="25"
                      height="61"
                      rx="3"
                      stroke="currentColor"
                      strokeWidth="6"
                    />
                    <rect
                      x="115"
                      y="53"
                      width="24"
                      height="91"
                      rx="3"
                      stroke="currentColor"
                      strokeWidth="6"
                    />
                    <path
                      d="M40 85L94 32L109 47L144 12M121 12H144V35"
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}

                {benefit.icon === "commission" && (
                  <svg viewBox="0 0 180 160" fill="none" aria-hidden="true">
                    <circle
                      cx="111"
                      cy="37"
                      r="34"
                      stroke="currentColor"
                      strokeWidth="6"
                    />
                    <circle
                      cx="99"
                      cy="26"
                      r="5"
                      stroke="currentColor"
                      strokeWidth="5"
                    />
                    <circle
                      cx="123"
                      cy="48"
                      r="5"
                      stroke="currentColor"
                      strokeWidth="5"
                    />
                    <path
                      d="M91 57L132 16"
                      stroke="currentColor"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M20 90H48L70 103H111C119 103 124 109 124 115C124 121 119 126 111 126H84L116 138L163 116C170 113 176 117 176 123C176 127 173 131 168 134L120 153C113 156 105 156 98 153L52 135H20V90Z"
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>

              <p>{benefit.text}</p>
            </article>
          ))}
        </div>
      </section>
      <Footer/>
    </main>
  );
}
