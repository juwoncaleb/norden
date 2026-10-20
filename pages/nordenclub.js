// pages/index.js — whole page in one JS file, styled by styles/club.css
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { EB_Garamond } from "next/font/google";
import Header from "./component/Header";
import Footer from "./component/footer";

const garamond = EB_Garamond({ subsets: ["latin"], display: "swap" });

const steps = [
  {
    title: "Sign up",
    text: "Create an account to be part of The Norden Club.",
  },
  {
    title: "Earn credits",
    text: "Connect with us and be rewarded every step of the way.",
  },
  {
    title: "Redeem credits",
    text: "Enjoy exclusive rewards and savings on your next purchase.",
  },
];

const earn = [
  { credits: 10, text: "Sign up for our mailing list" },
  { credits: 10, text: "Follow us on Instagram" },
  { credits: 150, text: "Spend and be rewarded" },
  { credits: 75, text: "Leave a product review" },
  { credits: 40, text: "Complete our personality quiz" },
  { credits: 20, text: "Complete your profile" },
];

const rewards = [
  { off: "£50 off £1,000", credits: 50 },
  { off: "£100 off £1,500", credits: 100 },
  { off: "£200 off £2,000", credits: 200 },
  { off: "£300 off £2,800", credits: 300 },
];

export default function Page() {
  const [showOffer, setShowOffer] = useState(true);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | error
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(data.error || "Something went wrong.");

      setEmail("");
      setStatus("idle");
      setShowSuccess(true);
    } catch (err) {
      setStatus("error");
      setError(err.message || "Something went wrong. Please try again.");
    }
  }

  // Close modal with Escape
  useEffect(() => {
    if (!showSuccess) return;
    const onKey = (e) => e.key === "Escape" && setShowSuccess(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showSuccess]);

  return (
    <main className={`cc ${garamond.className}`}>
      <Header />
      {/* ---------- Hero ---------- */}
      <section className="cc-top">
        <nav className="cc-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">The Norden Club</span>
        </nav>

        <div className="cc-hero">
          <Image
            src="/bg.jpg"
            alt="Friends relaxing on outdoor rattan furniture"
            fill
            priority
            sizes="100vw"
            className="cc-hero-img"
          />
          <div className="cc-hero-overlay" />

          <div className="cc-hero-content">
            <h1>The Norden Club</h1>
            <p>
              Meet the club designed for you and your home. Get your first £50
              off* when you subscribe to our mailing list. New members only
            </p>
            <div className="cc-actions">
              <Link href="/join" className="cc-hero-btn cc-hero-btn--solid">
                Join now
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
                Get £50 off
              </Link>
            </div>
          )}

          <button className="cc-chat" aria-label="Open chat">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="14" rx="1" />
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
          {steps.map((s) => (
            <li key={s.title}>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- Earn credits ---------- */}
      <section className="cc-band">
        <h2>Earn credits easily</h2>
        <ul className="cc-earn">
          {earn.map((e) => (
            <li key={e.text}>
              <strong>{e.credits} Credits</strong>
              <span>{e.text}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- Redeem ---------- */}
      <section className="cc-band cc-redeem">
        <h2>Here&apos;s how to use your credits</h2>
        <p className="cc-lead">
          Click ‘Redeem’ and apply the voucher at checkout.
        </p>
        <ul className="cc-rewards">
          {rewards.map((r) => (
            <li key={r.off}>
              <strong>{r.off}</strong>
              <span>{r.credits} credits</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- Refer a friend ---------- */}
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
          <h2>Refer a Friend, Get 100 Credits</h2>
          <p>
            Introduce your friends to The Norden Club. Gift them £100 off their
            first purchase and be rewarded with 100 credits.*
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
          {status === "error" && (
            <p className="cc-form-error" role="alert">
              {error}
            </p>
          )}
        </div>
      </section>

      {/* ---------- Success modal ---------- */}
      {showSuccess && (
        <div className="cc-modal" onClick={() => setShowSuccess(false)}>
          <div
            className="cc-modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cc-modal-title"
            onClick={(e) => e.stopPropagation()}
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
              <circle cx="12" cy="12" r="10" />
              <path d="M7.5 12.5l3 3 6-6.5" />
            </svg>
            <h3 id="cc-modal-title">Email submitted successfully</h3>
            <p>
              Thank you. We&apos;ve received your email and will be in touch
              soon.
            </p>
            <button
              className="cc-btn"
              autoFocus
              onClick={() => setShowSuccess(false)}
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
