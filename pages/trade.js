
"use client";

import { useState } from "react";
import Head from "next/head";
import Header from "./component/Header";
import Footer from "./component/footer";

// ============================================
// NORDEN TRADE PROGRAM
// pages/trade.js
// ============================================

const benefits = [
  {
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
    title: "Exclusive trade pricing",
    description:
      "As a Norden trade partner, enjoy access to preferential pricing on qualifying furniture orders. Created for design professionals looking to bring exceptional spaces to life.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
    title: "Dedicated trade support",
    description:
      "Our team is available to assist with furniture selections, quotations, product specifications, project enquiries, and available material swatches.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?auto=format&fit=crop&w=1200&q=85",
    title: "Personalized styling support",
    description:
      "From selecting the right materials to finding furniture that complements your vision, Norden helps you create spaces that feel considered and complete.",
  },
];

const industries = [
  "Interior Designer",
  "Architect",
  "Interior Stylist",
  "Property Developer",
  "Builder / Contractor",
  "Real Estate Agent",
  "Hospitality",
  "Furniture Procurement",
  "Other",
];

// ============================================
// REUSABLE FORM FIELD
// ============================================

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
        maxLength={500}
      />
    </label>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function TradePage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // ==========================================
  // SEND APPLICATION TO BACKEND
  // ==========================================

  async function handleSubmit(event) {
    event.preventDefault();

    if (submitting) return;

    setSubmitting(true);
    setSubmitError("");

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);

    const application = {
      firstName: String(
        formData.get("firstName") || ""
      ).trim(),

      lastName: String(
        formData.get("lastName") || ""
      ).trim(),

      phone: String(
        formData.get("phone") || ""
      ).trim(),

      email: String(
        formData.get("email") || ""
      ).trim(),

      tradingName: String(
        formData.get("tradingName") || ""
      ).trim(),

      businessNumber: String(
        formData.get("businessNumber") || ""
      ).trim(),

      address: String(
        formData.get("address") || ""
      ).trim(),

      industry: String(
        formData.get("industry") || ""
      ).trim(),

      website: String(
        formData.get("website") || ""
      ).trim(),

      social: String(
        formData.get("social") || ""
      ).trim(),

      businessDetails: String(
        formData.get("businessDetails") || ""
      ).trim(),

      consent: formData.get("consent") === "on",

      websiteCheck: String(
        formData.get("websiteCheck") || ""
      ),
    };

    try {
      const response = await fetch(
        "/api/trade-application",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(application),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to submit your application."
        );
      }

      formElement.reset();
      setSubmitted(true);

      // Scroll to application confirmation
      setTimeout(() => {
        document
          .getElementById("join")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 100);
    } catch (error) {
      console.error(
        "Trade application submission error:",
        error
      );

      setSubmitError(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Head>
        <title>
          Norden Trade Program | Norden Furniture
        </title>

        <meta
          name="description"
          content="Join the Norden Trade Program. Discover exclusive trade pricing, furniture sourcing, and dedicated support for interior designers, architects, and design professionals."
        />
      </Head>

      <main className="castlery-page">
        <Header />

        {/* =====================================
            HERO SECTION
        ===================================== */}

        <section
          className="hero"
          aria-label="Norden Trade Program"
        >
          <div className="hero-overlay" />

          <div className="hero-copy">
            <h1>Norden Trade Program</h1>

            <p>
              Exclusive furniture solutions for
              design professionals.
            </p>
          </div>
        </section>

        {/* =====================================
            INTRODUCTION
        ===================================== */}

        <section className="intro">
          <p>
            Great spaces begin with thoughtful
            collaboration. At Norden, we welcome
            interior designers, architects, property
            developers, and trade professionals
            looking for beautifully crafted furniture
            to bring their creative visions to life.
          </p>

          <a className="cta" href="#join">
            Join the program
          </a>
        </section>

        {/* =====================================
            BENEFITS SECTION
        ===================================== */}

        <section
          className="benefits"
          aria-label="Norden Trade Program benefits"
        >
          {benefits.map((benefit) => (
            <article
              className="benefit"
              key={benefit.title}
            >
              <img
                src={benefit.image}
                alt={benefit.title}
                loading="lazy"
              />

              <h2>{benefit.title}</h2>

              <p>{benefit.description}</p>

              {benefit.title ===
                "Exclusive trade pricing" && (
                <small>
                  *Subject to eligibility and
                  applicable terms.
                </small>
              )}
            </article>
          ))}
        </section>

        {/* =====================================
            APPLICATION FORM
        ===================================== */}

        <section className="join" id="join">
          <header className="join-header">
            <h2>Join Norden Trade</h2>

            <p>
              Interested in becoming a Norden trade
              partner? Complete the application below
              and our team will review your details
              and get in touch.
            </p>
          </header>

          {submitted ? (
            /* =================================
                SUCCESS MESSAGE
            ================================= */

            <div
              className="success"
              role="status"
              aria-live="polite"
            >
              <div
                style={{
                  width: "65px",
                  height: "65px",
                  borderRadius: "50%",
                  backgroundColor: "#803d24",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 25px",
                  fontSize: "28px",
                }}
              >
                ✓
              </div>

              <h3>
                Application submitted successfully!
              </h3>

              <p>
                Thank you for your interest in
                Norden Trade.
              </p>

              <p>
                Your application has been sent
                to our team. We'll review your
                information and contact you
                using the details provided.
              </p>

              <button
                type="button"
                className="cta"
                onClick={() => {
                  setSubmitted(false);
                  setSubmitError("");
                }}
                style={{
                  marginTop: "25px",
                }}
              >
                Submit another application
              </button>
            </div>
          ) : (
            /* =================================
                APPLICATION FORM
            ================================= */

            <form
              className="trade-form"
              onSubmit={handleSubmit}
            >
              {/* FIRST NAME */}

              <Field
                label="First Name"
                name="firstName"
                placeholder="Enter First Name"
                required
              />

              {/* LAST NAME */}

              <Field
                label="Last Name"
                name="lastName"
                placeholder="Enter Last Name"
              />

              {/* PHONE */}

              <Field
                label="Contact Number"
                name="phone"
                placeholder="Enter Contact Number"
                required
                type="tel"
              />

              {/* EMAIL */}

              <Field
                label="Email Address"
                name="email"
                placeholder="Enter Email Address"
                required
                type="email"
              />

              {/* BUSINESS NAME */}

              <Field
                label="Trading Name"
                name="tradingName"
                placeholder="Enter Trading Name"
                required
              />

              {/* BUSINESS NUMBER */}

              <Field
                label="Business Number"
                name="businessNumber"
                placeholder="Enter Business Number"
              />

              {/* ADDRESS */}

              <Field
                label="Registered Address"
                name="address"
                placeholder="Enter Registered Address"
                required
              />

              {/* INDUSTRY */}

              <label className="field">
                <span>
                  Industry <b>*</b>
                </span>

                <select
                  name="industry"
                  defaultValue=""
                  required
                >
                  <option value="" disabled>
                    Select your industry
                  </option>

                  {industries.map((industry) => (
                    <option
                      key={industry}
                      value={industry}
                    >
                      {industry}
                    </option>
                  ))}
                </select>
              </label>

              {/* WEBSITE */}

              <Field
                label="Business Website"
                name="website"
                placeholder="https://"
                required
                type="url"
              />

              {/* SOCIAL MEDIA */}

              <Field
                label="Business Facebook/Instagram"
                name="social"
                placeholder="Enter social profile URL"
              />

              {/* BUSINESS DESCRIPTION */}

              <label className="field full">
                <span>
                  Tell us about your business
                </span>

                <textarea
                  name="businessDetails"
                  placeholder="Tell us about your business, the projects you work on, and your furniture requirements."
                  rows={5}
                  maxLength={5000}
                />
              </label>

              {/* HONEYPOT SPAM PROTECTION */}

              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "-9999px",
                  width: "1px",
                  height: "1px",
                  overflow: "hidden",
                }}
              >
                <label>
                  Leave this field empty
                  <input
                    type="text"
                    name="websiteCheck"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </label>
              </div>

              {/* CONSENT */}

              <label className="consent full">
                <input
                  type="checkbox"
                  name="consent"
                  required
                />

                <span>
                  I agree to be contacted by
                  Norden regarding my trade
                  program application.
                </span>
              </label>

              {/* ERROR MESSAGE */}

              {submitError && (
                <div
                  className="full"
                  role="alert"
                  style={{
                    padding: "16px 20px",
                    backgroundColor: "#fff0ed",
                    border: "1px solid #e7b4a9",
                    color: "#a52d20",
                    fontSize: "14px",
                    lineHeight: "1.7",
                  }}
                >
                  {submitError}
                </div>
              )}

              {/* SUBMIT BUTTON */}

              <div className="form-actions full">
                <button
                  className="cta"
                  type="submit"
                  disabled={submitting}
                  aria-busy={submitting}
                  style={{
                    opacity: submitting ? 0.65 : 1,
                    cursor: submitting
                      ? "not-allowed"
                      : "pointer",
                  }}
                >
                  {submitting
                    ? "Sending application..."
                    : "Submit application"}
                </button>

                <p>
                  Fields marked * are required.
                </p>
              </div>
            </form>
          )}
        </section>

        {/* =====================================
            FLOATING CONTACT BUTTON
        ===================================== */}

        <a
          className="chat"
          href="mailto:info@thenorden.org?subject=Norden%20Trade%20Enquiry"
          aria-label="Contact Norden Trade"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M4 4.5h16v12H9l-5 3v-15Z" />
            <path d="M7 8h10M7 12h10" />
          </svg>

          <span>Chat</span>
        </a>

        <Footer />
      </main>
    </>
  );
}
