
import React, { useState } from "react";
import Header from "./component/Header";
import Footer from "./component/footer";
import Image from "next/image";
import Link from "next/link";

export default function Refer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [showOffer, setShowOffer] = useState(true);

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/refer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          data.error || "Something went wrong. Please try again."
        );
      }

      setStatus("success");
      setEmail("");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  return (
    <div className="cc">
      <Header />

      <div className="cc-top">
        <nav className="cc-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>

          <svg
            width="8"
            height="14"
            viewBox="0 0 8 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M1 1l6 6-6 6"
              stroke="currentColor"
              strokeWidth="1.2"
            />
          </svg>

          <span aria-current="page">Refer a friend</span>
        </nav>
      </div>

      <section className="cc-refer">
        <div className="cc-refer-img">
          <Image
            src="/ap1.jpeg"
            alt="Friends sharing a meal at an outdoor table"
            fill
            sizes="(max-width: 800px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
          />
        </div>

        <div className="cc-refer-body">
          <h2>Refer a friend, get 100 credits</h2>

          <p>
            Introduce your friends to The Norden Club.
            Gift them £100 off their first purchase and
            be rewarded with 100 credits.*
          </p>

          <form onSubmit={onSubmit} className="cc-form">
            <label htmlFor="refer-email" className="cc-sr">
              Email
            </label>

            <input
              id="refer-email"
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "sending"}
            />

            <button
              type="submit"
              className="cc-btn"
              disabled={status === "sending"}
            >
              {status === "sending" ? "Sending…" : "Submit"}
            </button>
          </form>

          {status === "success" && (
            <p className="cc-form-success" role="status">
              Thank you! Your referral has been sent.
            </p>
          )}

          {status === "error" && (
            <p className="cc-form-error" role="alert">
              {error}
            </p>
          )}
        </div>
      </section>

      {showOffer && (
        <div className="cc-offer">
          <button
            type="button"
            className="cc-close"
            aria-label="Close offer"
            onClick={() => setShowOffer(false)}
          >
            ×
          </button>

          <Link href="/" className="cc-offer-tab">
            Get £50 off
          </Link>
        </div>
      )}

      <button type="button" className="cc-chat">
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          aria-hidden="true"
        >
          <path d="M4 4h16v13H9l-5 4V4z" />
          <path d="M8 9h8M8 12.5h8" />
        </svg>
        Chat
      </button>

      <Footer />

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&display=swap");

        .cc {
          font-family: "Cormorant Garamond", Georgia, serif;
        }
      `}</style>
    </div>
  );
}
