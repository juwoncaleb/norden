
"use client";

import Head from "next/head";
import Header from "./component/Header";
import Footer from "./component/footer";

// ==========================================
// NORDEN AMBASSADOR PROGRAM
// pages/ambassdor.js
// ==========================================

const EMAIL = "info@thenorden.org";

function createEmailLink(subject, body) {
  return `mailto:${EMAIL}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}

const APPLY_LINK = createEmailLink(
  "Norden Ambassador Application",
  `Hello Norden Team,

I would love to be considered for the Norden Ambassador Program.

Full Name:
Phone Number:
Location:
Instagram Handle:
TikTok Handle:
Other Social Media:
Number of Followers:
Content Category:

Tell us a little about yourself:


Why would you like to collaborate with Norden?


Links to your previous work:


Thank you for considering my application.`
);

const COLLAB_LINK = createEmailLink(
  "Norden Ambassador Collaboration Enquiry",
  `Hello Norden Team,

I would love to explore a collaboration with Norden.

My Name:
Social Media Handle:
Location:
Collaboration Idea:

Additional Details:


Thank you.`
);

const requirements = [
  {
    number: "01",
    image: "/abt1.avif",
    title: "A connection to our community",
    text:
      "You're based in Nigeria and have a genuine connection with people who appreciate design, lifestyle, and beautiful living.",
  },
  {
    number: "02",
    image: "/ap1.jpeg",
    title: "An eye for thoughtful design",
    text:
      "You notice the details. You appreciate interiors, beautiful furniture, and spaces that feel considered and personal.",
  },
  {
    number: "03",
    image: "/ap2.jpg",
    title: "A distinctive creative voice",
    text:
      "You bring your own personality and perspective to the content you create, with an audience that values your recommendations.",
  },
];

const perks = [
  {
    number: "01",
    image: "/l1.jpg",
    title: "Beautiful furniture",
    text:
      "Explore opportunities to showcase selected Norden pieces and bring thoughtful design into your own space.",
  },
  {
    number: "02",
    image: "/l4.jpg",
    title: "Creative partnerships",
    text:
      "Collaborate on original campaigns, content experiences, and creative projects that reflect your personal style.",
  },
  {
    number: "03",
    image: "/l2.jpg",
    title: "Shared visibility",
    text:
      "Discover opportunities to have your work featured across Norden's digital platforms and connect with our growing community.",
  },
];

function ArrowIcon({ diagonal = false }) {
  return diagonal ? (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 19 19 5" />
      <path d="M8 5h11v11" />
    </svg>
  ) : (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 12h16" />
      <path d="m13 5 7 7-7 7" />
    </svg>
  );
}

function Button({
  href,
  children,
  light = false,
  outline = false,
}) {
  return (
    <a
      href={href}
      className={`na-button ${
        light
          ? "na-button-light"
          : outline
          ? "na-button-outline"
          : "na-button-primary"
      }`}
    >
      <span>{children}</span>
      <ArrowIcon />
    </a>
  );
}

function SectionHeading({
  eyebrow,
  title,
  italic,
  description,
}) {
  return (
    <div className="na-section-heading">
      <div>
        <span className="na-eyebrow">{eyebrow}</span>

        <h2>
          {title}
          <br />
          <em>{italic}</em>
        </h2>
      </div>

      {description && <p>{description}</p>}
    </div>
  );
}

function EditorialCard({ item }) {
  return (
    <article className="na-card">
      <div className="na-card-image">
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
        />
      </div>

      <div className="na-card-content">
        <span className="na-card-number">
          {item.number}
        </span>

        <h3>{item.title}</h3>

        <p>{item.text}</p>
      </div>
    </article>
  );
}

export default function AmbassadorPage() {
  return (
    <>
      <Head>
        <title>
          Norden Ambassador Program | Norden Furniture
        </title>

        <meta
          name="description"
          content="Join the Norden Ambassador Program. Collaborate with a contemporary furniture brand and celebrate beautiful spaces, thoughtful design, and modern living."
        />
      </Head>

      <Header />

      <main className="norden-ambassador">

        {/* ====================================
            HERO
        ==================================== */}

        <section className="na-hero">
          <div className="na-hero-copy">
            <div className="na-hero-copy-inner">
              <div className="na-hero-topline">
                <span className="na-line" />
                <span>THE NORDEN COMMUNITY</span>
              </div>

              <h1>
                A home for
                <br />
                <em>creative minds.</em>
              </h1>

              <p className="na-hero-description">
                Beautiful spaces deserve to be shared.
                Join a community of creators who celebrate
                thoughtful design, timeless furniture,
                and the art of living beautifully.
              </p>

              <Button href={APPLY_LINK}>
                BECOME AN AMBASSADOR
              </Button>

              <div className="na-hero-footnote">
                <span>CREATIVITY. COMMUNITY. DESIGN.</span>
                <span>EST. NORDEN</span>
              </div>
            </div>
          </div>

          <div className="na-hero-visual">
            <img
              src="/l1.jpg"
              alt="Contemporary Norden furniture in a beautiful living space"
              fetchPriority="high"
            />

            <div className="na-hero-visual-overlay" />

            <div className="na-image-caption">
              <span>NÓRDEN</span>
              <span>THE ART OF LIVING</span>
            </div>
          </div>
        </section>

        {/* ====================================
            INTRODUCTION
        ==================================== */}

        <section className="na-intro">
          <span className="na-eyebrow">
            MORE THAN A PARTNERSHIP
          </span>

          <h2>
            Good design brings
            <br />
            <em>people together.</em>
          </h2>

          <p>
            At Norden, we believe a home is more
            than a collection of beautiful objects.
            It's a reflection of the people who
            live in it, the moments they share,
            and the stories they create.
          </p>

          <p>
            Our Ambassador Program is an invitation
            to creators who share this philosophy.
            People who appreciate thoughtful
            interiors, have an authentic creative
            voice, and love inspiring others
            through beautiful living.
          </p>

          <div className="na-intro-divider">
            <span />
            <span>NÓRDEN</span>
            <span />
          </div>
        </section>

        {/* ====================================
            WHO WE'RE LOOKING FOR
        ==================================== */}

        <section className="na-section">
          <SectionHeading
            eyebrow="THE PEOPLE BEHIND THE STORIES"
            title="Could this be"
            italic="your community?"
            description="We're looking for creative individuals who share our appreciation for good design and meaningful connections."
          />

          <div className="na-card-grid">
            {requirements.map((item) => (
              <EditorialCard
                key={item.number}
                item={item}
              />
            ))}
          </div>
        </section>

        {/* ====================================
            EDITORIAL FEATURE
        ==================================== */}

        <section className="na-feature">
          <div className="na-feature-image">
            <img
              src="/l4.jpg"
              alt="Beautifully styled contemporary furniture"
              loading="lazy"
            />

            <div className="na-feature-image-label">
              <span>NÓRDEN</span>
              <span>MADE FOR LIVING</span>
            </div>
          </div>

          <div className="na-feature-copy">
            <div className="na-feature-inner">
              <span className="na-eyebrow">
                YOUR PERSPECTIVE MATTERS
              </span>

              <h2>
                Create stories
                <br />
                worth
                <br />
                <em>sharing.</em>
              </h2>

              <p>
                The most compelling spaces aren't
                simply styled. They're lived in,
                experienced, and made personal.
              </p>

              <p>
                We want to work with people who
                bring their own perspective to
                furniture and interiors, creating
                content that feels natural,
                inspiring, and unmistakably theirs.
              </p>

              <Button href={COLLAB_LINK}>
                LET'S COLLABORATE
              </Button>
            </div>
          </div>
        </section>

        {/* ====================================
            AMBASSADOR BENEFITS
        ==================================== */}

        <section className="na-section na-perks-section">
          <SectionHeading
            eyebrow="THE NORDEN EXPERIENCE"
            title="A partnership"
            italic="with possibilities."
            description="Every collaboration is different. Together, we can explore opportunities that reflect your creativity and our shared appreciation for beautiful living."
          />

          <div className="na-card-grid">
            {perks.map((item) => (
              <EditorialCard
                key={item.number}
                item={item}
              />
            ))}
          </div>
        </section>

        {/* ====================================
            MINI EDITORIAL BANNER
        ==================================== */}

        <section className="na-statement">
          <div className="na-statement-inner">
            <span className="na-eyebrow">
              AN INVITATION TO CREATE
            </span>

            <p>
              "The most beautiful spaces are the ones
              that feel like <em>you.</em>"
            </p>

            <span className="na-statement-signature">
              NÓRDEN
            </span>
          </div>
        </section>

        {/* ====================================
            FINAL APPLICATION
        ==================================== */}

        <section className="na-final">
          <div className="na-final-content">
            <span className="na-eyebrow na-eyebrow-light">
              JOIN OUR COMMUNITY
            </span>

            <h2>
              Your story.
              <br />
              <em>Our next chapter.</em>
            </h2>

            <p>
              If you see beauty in the everyday
              and love sharing it with others,
              we'd love to hear from you.
              Tell us who you are and what
              inspires you.
            </p>

            <Button href={APPLY_LINK} light>
              APPLY TO BECOME AN AMBASSADOR
            </Button>

            <a
              href={COLLAB_LINK}
              className="na-final-contact"
            >
              HAVE A QUESTION? GET IN TOUCH
              <ArrowIcon diagonal />
            </a>
          </div>

          <div className="na-final-decoration">
            <span>NÓRDEN</span>
          </div>
        </section>

      </main>

      <Footer />

      {/* ====================================
          ALL PAGE STYLES
      ==================================== */}

      <style jsx global>{`
        /* ===================================
           BASE
        =================================== */

        .norden-ambassador,
        .norden-ambassador * {
          box-sizing: border-box;
        }

        .norden-ambassador {
          width: 100%;
          overflow: hidden;
          background: #f8f6f1;
          color: #302821;
          font-family: "Radley", Georgia, serif;
        }

        .norden-ambassador h1,
        .norden-ambassador h2,
        .norden-ambassador h3,
        .norden-ambassador p {
          margin-top: 0;
          font-weight: 400;
        }

        .norden-ambassador a {
          text-decoration: none;
        }

        .norden-ambassador em {
          font-weight: 400;
        }

        .na-eyebrow {
          display: block;
          color: #803d24;
          font-family: Arial, sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 3px;
          line-height: 1.7;
        }

        .na-eyebrow-light {
          color: rgba(255,255,255,0.8);
        }

        /* ===================================
           BUTTONS
        =================================== */

        .na-button {
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          gap: 35px;
          min-height: 57px;
          padding: 17px 27px;
          border: 1px solid transparent;
          font-family: Arial, sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 1.7px;
          line-height: 1.4;
          transition:
            background 0.25s ease,
            color 0.25s ease,
            border-color 0.25s ease;
        }

        .na-button svg {
          flex-shrink: 0;
          transition: transform 0.25s ease;
        }

        .na-button:hover svg {
          transform: translateX(5px);
        }

        .na-button-primary {
          background: #803d24;
          color: white;
          border-color: #803d24;
        }

        .na-button-primary:hover {
          background: #602c1b;
          border-color: #602c1b;
        }

        .na-button-light {
          background: white;
          color: #803d24;
          border-color: white;
        }

        .na-button-light:hover {
          background: transparent;
          color: white;
        }

        .na-button-outline {
          background: transparent;
          color: #803d24;
          border-color: #803d24;
        }

        .na-button-outline:hover {
          background: #803d24;
          color: white;
        }

        /* ===================================
           HERO
        =================================== */

        .na-hero {
          display: grid;
          grid-template-columns: 48% 52%;
          min-height: 730px;
          background: #f3eee6;
        }

        .na-hero-copy {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 0;
          padding: 95px 8%;
        }

        .na-hero-copy-inner {
          width: 100%;
          max-width: 580px;
        }

        .na-hero-topline {
          display: flex;
          align-items: center;
          gap: 16px;
          color: #803d24;
          font-family: Arial, sans-serif;
          font-size: 10px;
          letter-spacing: 2.5px;
        }

        .na-line {
          width: 40px;
          height: 1px;
          flex-shrink: 0;
          background: #a77b66;
        }

        .na-hero h1 {
          margin: 35px 0 29px;
          font-size: clamp(55px, 5.8vw, 94px);
          line-height: 1.06;
          letter-spacing: -2px;
          color: #302821;
        }

        .na-hero h1 em {
          color: #803d24;
        }

        .na-hero-description {
          max-width: 470px;
          margin-bottom: 38px;
          color: #70645a;
          font-size: 18px;
          line-height: 1.9;
        }

        .na-hero-footnote {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 15px;
          margin-top: 85px;
          padding-top: 20px;
          border-top: 1px solid #d7ccbf;
          color: #9c8a7b;
          font-family: Arial, sans-serif;
          font-size: 9px;
          letter-spacing: 1.7px;
        }

        .na-hero-visual {
          position: relative;
          min-height: 730px;
          overflow: hidden;
          background: #d8cbbd;
        }

        .na-hero-visual > img {
          display: block;
          width: 100%;
          height: 100%;
          position: absolute;
          inset: 0;
          object-fit: cover;
          object-position: center;
        }

        .na-hero-visual-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            transparent 65%,
            rgba(0,0,0,0.35) 100%
          );
        }

        .na-image-caption {
          position: absolute;
          bottom: 35px;
          left: 35px;
          right: 35px;
          display: flex;
          justify-content: space-between;
          gap: 20px;
          color: white;
          font-family: Arial, sans-serif;
          font-size: 10px;
          letter-spacing: 2px;
        }

        /* ===================================
           INTRODUCTION
        =================================== */

        .na-intro {
          max-width: 1000px;
          margin: 0 auto;
          padding: 140px 25px 130px;
          text-align: center;
        }

        .na-intro h2 {
          margin: 26px 0 37px;
          font-size: clamp(45px, 5.5vw, 76px);
          line-height: 1.14;
          letter-spacing: -1px;
        }

        .na-intro h2 em {
          color: #803d24;
        }

        .na-intro > p {
          max-width: 760px;
          margin: 0 auto 22px;
          color: #74695e;
          font-size: 18px;
          line-height: 1.95;
        }

        .na-intro-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin-top: 65px;
          color: #a88e7c;
          font-family: Arial, sans-serif;
          font-size: 11px;
          letter-spacing: 3px;
        }

        .na-intro-divider span:first-child,
        .na-intro-divider span:last-child {
          width: 70px;
          height: 1px;
          background: #d4c9bd;
        }

        /* ===================================
           SECTIONS
        =================================== */

        .na-section {
          max-width: 1500px;
          margin: 0 auto;
          padding: 55px 6% 145px;
        }

        .na-section-heading {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 50px;
          margin-bottom: 60px;
        }

        .na-section-heading h2 {
          margin: 25px 0 0;
          font-size: clamp(43px, 5.2vw, 75px);
          line-height: 1.12;
          letter-spacing: -1px;
        }

        .na-section-heading h2 em {
          color: #803d24;
        }

        .na-section-heading > p {
          max-width: 350px;
          margin-bottom: 7px;
          color: #74695e;
          font-size: 16px;
          line-height: 1.9;
        }

        /* ===================================
           CARDS
        =================================== */

        .na-card-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 27px;
        }

        .na-card {
          min-width: 0;
        }

        .na-card-image {
          aspect-ratio: 0.88;
          overflow: hidden;
          background: #e2d8cc;
        }

        .na-card-image img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.7s ease;
        }

        .na-card:hover img {
          transform: scale(1.045);
        }

        .na-card-content {
          padding: 25px 2px;
        }

        .na-card-number {
          display: block;
          margin-bottom: 18px;
          color: #a66e53;
          font-size: 25px;
        }

        .na-card h3 {
          max-width: 360px;
          margin-bottom: 16px;
          font-size: clamp(25px, 2.4vw, 33px);
          line-height: 1.2;
        }

        .na-card p {
          max-width: 385px;
          color: #766a60;
          font-size: 16px;
          line-height: 1.85;
        }

        /* ===================================
           FEATURE SECTION
        =================================== */

        .na-feature {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 720px;
        }

        .na-feature-image {
          position: relative;
          min-height: 720px;
          overflow: hidden;
          background: #d8cbbd;
        }

        .na-feature-image > img {
          position: absolute;
          inset: 0;
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .na-feature-image-label {
          position: absolute;
          bottom: 30px;
          left: 30px;
          right: 30px;
          display: flex;
          justify-content: space-between;
          gap: 20px;
          color: white;
          font-family: Arial, sans-serif;
          font-size: 10px;
          letter-spacing: 2px;
          text-shadow: 0 1px 10px rgba(0,0,0,0.3);
        }

        .na-feature-copy {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eae3d8;
          padding: 90px 12%;
        }

        .na-feature-inner {
          max-width: 560px;
        }

        .na-feature h2 {
          margin: 27px 0 32px;
          font-size: clamp(48px, 5.5vw, 79px);
          line-height: 1.1;
          letter-spacing: -1px;
        }

        .na-feature h2 em {
          color: #803d24;
        }

        .na-feature p {
          max-width: 510px;
          margin-bottom: 22px;
          color: #665b52;
          font-size: 17px;
          line-height: 1.9;
        }

        .na-feature .na-button {
          margin-top: 18px;
        }

        /* ===================================
           PERKS
        =================================== */

        .na-perks-section {
          padding-top: 145px;
        }

        /* ===================================
           STATEMENT
        =================================== */

        .na-statement {
          background: #e9e1d6;
          padding: 115px 25px;
          text-align: center;
        }

        .na-statement-inner {
          max-width: 1050px;
          margin: 0 auto;
        }

        .na-statement p {
          margin: 32px auto;
          font-size: clamp(35px, 5vw, 66px);
          line-height: 1.25;
          letter-spacing: -1px;
        }

        .na-statement p em {
          color: #803d24;
        }

        .na-statement-signature {
          color: #9e8778;
          font-family: Arial, sans-serif;
          font-size: 11px;
          letter-spacing: 4px;
        }

        /* ===================================
           FINAL CTA
        =================================== */

        .na-final {
          position: relative;
          overflow: hidden;
          background: #803d24;
          color: white;
          padding: 140px 25px 130px;
          text-align: center;
        }

        .na-final-content {
          position: relative;
          z-index: 2;
          max-width: 1000px;
          margin: 0 auto;
        }

        .na-final h2 {
          margin: 27px auto 35px;
          font-size: clamp(49px, 6.7vw, 96px);
          line-height: 1.09;
          letter-spacing: -1.5px;
        }

        .na-final > .na-final-content > p {
          max-width: 630px;
          margin: 0 auto 43px;
          color: rgba(255,255,255,0.86);
          font-size: 18px;
          line-height: 1.9;
        }

        .na-final-contact {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          width: fit-content;
          margin: 38px auto 0;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(255,255,255,0.7);
          color: white;
          font-family: Arial, sans-serif;
          font-size: 10px;
          letter-spacing: 2px;
        }

        .na-final-decoration {
          position: absolute;
          bottom: -75px;
          left: 0;
          right: 0;
          color: rgba(255,255,255,0.035);
          font-family: Georgia, serif;
          font-size: clamp(150px, 27vw, 420px);
          line-height: 1;
          letter-spacing: 10px;
          pointer-events: none;
          white-space: nowrap;
        }

        /* ===================================
           TABLET
        =================================== */

        @media (max-width: 1100px) {
          .na-hero {
            grid-template-columns: 50% 50%;
            min-height: 650px;
          }

          .na-hero-copy {
            padding: 75px 7%;
          }

          .na-hero h1 {
            font-size: clamp(48px, 5.4vw, 70px);
          }

          .na-hero-visual {
            min-height: 650px;
          }

          .na-card-grid {
            gap: 18px;
          }

          .na-feature-copy {
            padding: 75px 9%;
          }

          .na-feature h2 {
            font-size: clamp(43px, 5vw, 65px);
          }
        }

        /* ===================================
           MOBILE
        =================================== */

        @media (max-width: 700px) {
          .na-hero {
            display: flex;
            flex-direction: column;
            min-height: auto;
          }

          .na-hero-copy {
            order: 1;
            padding: 80px 25px 65px;
          }

          .na-hero h1 {
            margin: 27px 0;
            font-size: clamp(48px, 11vw, 69px);
            line-height: 1.09;
            letter-spacing: -1px;
          }

          .na-hero-description {
            font-size: 16px;
            line-height: 1.85;
          }

          .na-hero-footnote {
            margin-top: 60px;
            font-size: 8px;
          }

          .na-hero-visual {
            order: 2;
            min-height: 440px;
            height: 55vh;
            max-height: 620px;
          }

          .na-image-caption {
            bottom: 22px;
            left: 22px;
            right: 22px;
            font-size: 9px;
          }

          .na-intro {
            padding: 95px 25px;
          }

          .na-intro h2 {
            font-size: clamp(41px, 9vw, 57px);
          }

          .na-intro > p {
            font-size: 16px;
          }

          .na-intro-divider {
            margin-top: 45px;
          }

          .na-section {
            padding: 35px 25px 95px;
          }

          .na-section-heading {
            display: block;
            margin-bottom: 40px;
          }

          .na-section-heading h2 {
            font-size: clamp(42px, 9vw, 60px);
          }

          .na-section-heading > p {
            margin-top: 24px;
            font-size: 15px;
          }

          .na-card-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .na-card-image {
            aspect-ratio: 1.02;
          }

          .na-card-content {
            padding: 22px 0;
          }

          .na-card h3 {
            font-size: 29px;
          }

          .na-feature {
            grid-template-columns: 1fr;
          }

          .na-feature-image {
            min-height: 450px;
          }

          .na-feature-copy {
            padding: 85px 25px;
          }

          .na-feature h2 {
            font-size: clamp(45px, 10vw, 65px);
          }

          .na-feature p {
            font-size: 16px;
          }

          .na-perks-section {
            padding-top: 95px;
          }

          .na-statement {
            padding: 95px 25px;
          }

          .na-statement p {
            font-size: clamp(35px, 8vw, 52px);
          }

          .na-final {
            padding: 100px 25px 115px;
          }

          .na-final h2 {
            font-size: clamp(45px, 10vw, 67px);
          }

          .na-final > .na-final-content > p {
            font-size: 16px;
          }

          .na-button {
            gap: 20px;
            padding: 17px 20px;
            font-size: 10px;
          }

          .na-final-decoration {
            bottom: -35px;
            font-size: 30vw;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .norden-ambassador *,
          .norden-ambassador *::before,
          .norden-ambassador *::after {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
}
