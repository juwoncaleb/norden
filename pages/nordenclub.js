// pages/index.js — whole page in one JS file, styled by styles/club.css

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { EB_Garamond } from "next/font/google";
import Header from "./component/Header";
import Footer from "./component/footer";

const garamond = EB_Garamond({
  subsets: ["latin"],
  display: "swap",
});

const steps = [
  {
    title: "Join NÓRDEN",
    text: "Create an account and become part of The NÓRDEN Club.",
  },
  {
    title: "Earn rewards",
    text: "Shop NÓRDEN, engage with us and earn rewards along the way.",
  },
  {
    title: "Enjoy your rewards",
    text: "Redeem your rewards on selected NÓRDEN furniture and future purchases.",
  },
];

const earn = [
  {
    credits: 10,
    text: "Join the NÓRDEN mailing list",
  },
  {
    credits: 10,
    text: "Follow NÓRDEN on Instagram",
  },
  {
    credits: 150,
    text: "Purchase NÓRDEN furniture",
  },
  {
    credits: 75,
    text: "Leave a product review",
  },
  {
    credits: 40,
    text: "Complete our furniture style quiz",
  },
  {
    credits: 20,
    text: "Complete your NÓRDEN profile",
  },
];

const rewards = [
  {
    off: "₦25,000 off ₦500,000",
    credits: 50,
  },
  {
    off: "₦50,000 off ₦1,000,000",
    credits: 100,
  },
  {
    off: "₦100,000 off ₦2,000,000",
    credits: 200,
  },
  {
    off: "₦150,000 off ₦3,000,000",
    credits: 300,
  },
];

export default function Page() {
  const [showOffer, setShowOffer] = useState(true);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();

    if (status === "sending") return;

    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/refer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          data.error || "Something went wrong. Please try again."
        );
      }

      setEmail("");
      setStatus("idle");
      setShowSuccess(true);
    } catch (err) {
      setStatus("error");
      setError(
        err.message || "Something went wrong. Please try again."
      );
    }
  }

  // Close success modal with Escape
  useEffect(() => {
    if (!showSuccess) return;

    const onKey = (e) => {
      if (e.key === "Escape") {
        setShowSuccess(false);
      }
    };

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [showSuccess]);

  return (
    <main className={`cc ${garamond.className}`}>
      <Header />

      {/* ---------- Hero ---------- */}
      <section className="cc-top">
        <nav className="cc-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>

          <span aria-hidden="true">›</span>

          <span aria-current="page">
            The NÓRDEN Club
          </span>
        </nav>

        <div className="cc-hero">
          <Image
            src="/bg.jpg"
            alt="NÓRDEN furniture in a contemporary Lagos home"
            fill
            priority
            sizes="100vw"
            className="cc-hero-img"
          />

          <div className="cc-hero-overlay" />

          <div className="cc-hero-content">
            <h1>The NÓRDEN Club</h1>

            <p>
              A rewards programme created for people who love
              thoughtful furniture and beautiful spaces. Join
              The NÓRDEN Club and enjoy exclusive rewards,
              member offers and early access to new collections.
            </p>

            <div className="cc-actions">
              <Link
                href="/join"
                className="cc-hero-btn cc-hero-btn--solid"
              >
                Join the Club
              </Link>
            </div>
          </div>

          {showOffer && (
            <div className="cc-offer">
              <button
                className="cc-close"
                onClick={() => setShowOffer(false)}
                aria-label="Dismiss offer"
              >
                ×
              </button>

              <Link href="/join" className="cc-offer-tab">
                Join NÓRDEN
              </Link>
            </div>
          )}

          <button
            className="cc-chat"
            aria-label="Chat with NÓRDEN"
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <rect
                x="3"
                y="4"
                width="18"
                height="14"
                rx="1"
              />
              <path d="M7 9h10M7 13h7M8 18l-2 3v-3" />
            </svg>

            <span>Chat</span>
          </button>
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="cc-band cc-tint">
        <h2>How it works</h2>

        <ol className="cc-steps">
          {steps.map((step) => (
            <li key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- Earn rewards ---------- */}
      <section className="cc-band">
        <h2>Earn NÓRDEN Credits</h2>

        <p className="cc-lead">
          Earn credits as you shop and engage with NÓRDEN.
          The more you collect, the more you can enjoy.
        </p>

        <ul className="cc-earn">
          {earn.map((item) => (
            <li key={item.text}>
              <strong>
                {item.credits}{" "}
                {item.credits === 1 ? "Credit" : "Credits"}
              </strong>

              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- Redeem ---------- */}
      <section className="cc-band cc-redeem">
        <h2>Turn your credits into rewards</h2>

        <p className="cc-lead">
          Redeem your NÓRDEN Credits and apply your reward
          when purchasing eligible furniture.
        </p>

        <ul className="cc-rewards">
          {rewards.map((reward) => (
            <li key={reward.off}>
              <strong>{reward.off}</strong>
              <span>{reward.credits} credits</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- Refer a friend ---------- */}
      <section className="cc-refer">
        <div className="cc-refer-img">
          <Image
            src="/ap1.jpeg"
            alt="NÓRDEN furniture styled in a contemporary home"
            fill
            sizes="(max-width: 800px) 100vw, 50vw"
            style={{
              objectFit: "cover",
            }}
          />
        </div>

        <div className="cc-refer-body">
          <h2>
            Share NÓRDEN. Get Rewarded.
          </h2>

          <p>
            Know someone who would love NÓRDEN? Introduce
            them to us and earn 100 NÓRDEN Credits when they
            make their first qualifying purchase.
          </p>

          <form
            onSubmit={onSubmit}
            className="cc-form"
          >
            <label
              htmlFor="refer-email"
              className="cc-sr"
            >
              Email
            </label>

            <input
              id="refer-email"
              type="email"
              required
              placeholder="Enter your email address"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              disabled={status === "sending"}
            />

            <button
              type="submit"
              className="cc-btn"
              disabled={status === "sending"}
            >
              {status === "sending"
                ? "Sending…"
                : "Refer a Friend"}
            </button>
          </form>

          {status === "error" && (
            <p
              className="cc-form-error"
              role="alert"
            >
              {error}
            </p>
          )}
        </div>
      </section>

      {/* ---------- Success modal ---------- */}
      {showSuccess && (
        <div
          className="cc-modal"
          onClick={() =>
            setShowSuccess(false)
          }
        >
          <div
            className="cc-modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cc-modal-title"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <svg
              className="cc-modal-icon"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
              />

              <path d="M7.5 12.5l3 3 6-6.5" />
            </svg>

            <h3 id="cc-modal-title">
              Referral received
            </h3>

            <p>
              Thank you for sharing NÓRDEN.
              We&apos;ve received your details and
              will take it from here.
            </p>

            <button
              className="cc-btn"
              autoFocus
              onClick={() =>
                setShowSuccess(false)
              }
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}