
"use client";

import { useState } from "react";
import Header from "./component/Header";
import Footer from "./component/footer";

const benefits = [
  {
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
    title: "Exclusive trade pricing",
    description:
      "As a trade partner, you can enjoy preferential pricing on qualifying orders. Designed exclusively for the trade community, apply now to access these benefits.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
    title: "Dedicated trade support",
    description:
      "Our Trade Specialists are here to provide support for orders, quotations, furniture advice, and complimentary swatches delivery.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?auto=format&fit=crop&w=1200&q=85",
    title: "Complimentary styling support",
    description:
      "Consider our Interior Stylists as part of your team. They work with you to perfect the details, ensuring every piece fits your design narrative.",
  },
];

const industries = [
  "Interior Designer",
  "Architect",
  "Interior Stylist",
  "Property Developer",
  "Builder / Contractor",
  "Real Estate Agent",
  "Other",
];

function Field({
  label,
  name,
  placeholder,
  required = false,
  type = "text",
}) {
  return (
    <label className="field">
      <span>
        {label}
        {required && <b> *</b>}
      </span>

      <input
        name={name}
        type={type}
        placeholder={placeholder || `Enter ${label}`}
        required={required}
      />
    </label>
  );
}

export default function Home() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main  className="castlery-page">
        <Header/>
      {/* HERO SECTION */}
      <section className="hero" aria-label="Castlery Trade Program">
        <div className="hero-overlay" />

        <div className="hero-copy">
          <h1>Castlery Trade Program</h1>

          <p>
            Get exclusive access and pricing for your next project.
          </p>
        </div>
      </section>

      {/* INTRODUCTION SECTION */}
      <section className="intro">
        <p>
          We welcome interior designers, architects, and trade
          professionals who need a trusted partner to bring their
          design visions to life, with B Corp certified standards
          behind every step.
        </p>

        <a className="cta" href="#join">
          Join the program
        </a>
      </section>

      {/* BENEFITS SECTION */}
      <section className="benefits" aria-label="Trade program benefits">
        {benefits.map((benefit) => (
          <article className="benefit" key={benefit.title}>
            <img
              src={benefit.image}
              alt={benefit.title}
              loading="lazy"
            />

            <h2>{benefit.title}</h2>

            <p>{benefit.description}</p>

            {benefit.title === "Exclusive trade pricing" && (
              <small>*T&amp;Cs apply.</small>
            )}
          </article>
        ))}
      </section>

      {/* APPLICATION FORM */}
      <section className="join" id="join">
        <header className="join-header">
          <h2>Join Our Program</h2>

          <p>
            Ready to join our trade discount furniture program?
            Fill out the form below, and we’ll get back to you
            as soon as possible.
          </p>
        </header>

        {submitted ? (
          <div className="success" role="status">
            <h3>Thank you for your interest.</h3>

            <p>
              Your application has been validated in this demo.
              Connect the form to a backend to receive applications.
            </p>

            <button
              type="button"
              onClick={() => setSubmitted(false)}
            >
              Submit another application
            </button>
          </div>
        ) : (
          <form className="trade-form" onSubmit={handleSubmit}>
            <Field
              label="First Name"
              name="firstName"
              placeholder="Enter First Name"
              required
            />

            <Field
              label="Last Name"
              name="lastName"
              placeholder="Enter Last Name"
            />

            <Field
              label="Contact Number"
              name="phone"
              placeholder="Enter Contact Number (no space or dash)"
              required
              type="tel"
            />

            <Field
              label="Email Address"
              name="email"
              placeholder="Enter Email Address"
              required
              type="email"
            />

            <Field
              label="Trading Name"
              name="tradingName"
              placeholder="Enter Trading Name"
              required
            />

            <Field
              label="Business Number"
              name="businessNumber"
              placeholder="Enter Business Number"
            />

            <Field
              label="Registered Address"
              name="address"
              placeholder="Enter Registered Address"
              required
            />

            <label className="field">
              <span>
                Industry <b>*</b>
              </span>

              <select
                name="industry"
                defaultValue="Interior Designer"
                required
              >
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </label>

            <Field
              label="Business Website"
              name="website"
              placeholder="https://"
              required
              type="url"
            />

            <Field
              label="Business Facebook/Instagram"
              name="social"
              placeholder="Enter social profile URL"
            />

            <label className="field full">
              <span>Tell us about your business</span>

              <textarea
                name="businessDetails"
                placeholder="Tell us about your business and projects."
                rows={4}
              />
            </label>

            <label className="consent full">
              <input type="checkbox" required />

              <span>
                I agree to be contacted about my trade program
                application.
              </span>
            </label>

            <div className="form-actions full">
              <button className="cta" type="submit">
                Submit application
              </button>

              <p>Fields marked * are required.</p>
            </div>
          </form>
        )}
      </section>

      {/* FLOATING CHAT BUTTON */}
      <a
        className="chat"
        href="mailto:trade@example.com"
        aria-label="Chat with us"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 4.5h16v12H9l-5 3v-15Z" />
          <path d="M7 8h10M7 12h10" />
        </svg>

        <span>Chat</span>
      </a>
      <Footer/>
    </main>
  );
}
