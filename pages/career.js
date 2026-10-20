import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Cormorant_Garamond } from "next/font/google";

import Header from "./component/Header";
import Footer from "./component/footer";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Change these to match your site
const IMAGE_SRC = "/join-us.jpeg"; // put your photo in /public
const OPEN_POSITIONS_URL = "/careers";

export default function JoinUs() {
  return (
    <div className={cormorant.className}>
      <Header />

      <main className="join">
        <div className="join-text">
          <h1>Come join us!</h1>

          <p>
            At Norden, we design and make quality, beautiful furniture for real
            life: the kind that helps people shape spaces they can truly live
            in, grow in, and feel good coming home to.
          </p>

          <p>
            We take pride in manufacturing our own pieces, and we bring that
            same care to the way we work. We are building Norden with the same
            ambition we bring to our designs: creating something better, more
            thoughtful, and made to last.
          </p>

          <p>
            We are growing and looking for people who want to build something
            with real staying power. Around here, good ideas are heard,
            initiative goes far, and ambitious self-starters have room to make
            their mark.
          </p>

          <p>
            If making an impact gets you out of bed in the morning, come join
            us.
          </p>

          <Link href={OPEN_POSITIONS_URL} className="join-btn">
            See Open Positions
          </Link>
        </div>

      </main>

      <Footer />

      <style jsx>{`
        .join {
          display: grid;
          grid-template-columns: 1fr minmax(320px, 32%);
          min-height: 640px;
          background: #faf9f6;
          color: #3a1020;
        }

        .join-text {
          align-self: center;
          max-width: 820px;
          padding: clamp(40px, 6vw, 80px) clamp(20px, 3vw, 40px);
        }

        h1 {
          margin: 0 0 clamp(24px, 4vw, 48px);
          font-weight: 400;
          font-size: clamp(2.2rem, 4vw, 3rem);
          line-height: 1.1;
        }

        p {
          margin: 0 0 24px;
          font-size: clamp(1.15rem, 1.6vw, 1.35rem);
          line-height: 1.5;
        }

        .join-text :global(.join-btn) {
          display: inline-block;
          margin-top: clamp(16px, 3vw, 32px);
          padding: 16px 26px;
          border: 1px solid #3a1020;
          color: #3a1020;
          text-decoration: none;
          font-size: 1.15rem;
          transition: background 0.2s, color 0.2s;
        }

        .join-text :global(.join-btn:hover) {
          background: #3a1020;
          color: #fff;
        }

        .join-img {
          position: relative;
          min-height: 420px;
        }

        /* Tablet and mobile: stack with the photo on top */
        @media (max-width: 800px) {
          .join {
            grid-template-columns: 1fr;
            min-height: 0;
          }

          .join-img {
            order: -1;
            min-height: 0;
            aspect-ratio: 4 / 3;
          }

          .join-text {
            max-width: none;
            padding: 32px 20px 48px;
          }
        }

        /* Small phones: full-width button */
        @media (max-width: 480px) {
          .join-text :global(.join-btn) {
            display: block;
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}