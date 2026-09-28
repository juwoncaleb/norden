"use client";

import { useState, useEffect } from "react";

const COLUMNS = [
  {
    title: "What's Popular",
    links: [
      "Under the bed Storage",
      "Spill-Resistant Furniture",
      "Solid Wood Furniture",
      "Small Sofas",
      "Small Dining Tables",
      "Storage Solutions",
      "Modern Farmhouse",
      "Kid-Friendly Furniture",
    ],
  },
  {
    title: "About Us",
    links: [
      "Our Story",
      "Contact Us",
      "Sustainability",
      "Trade Program",
      "Ambassador Program",
      "Affiliate Program",
      "Careers",
      "Blog",
      "Press",
    ],
  },
  {
    title: "Shopping With Us",
    links: [
      "My Rewards",
      "Refer a Friend",
      "Free Swatches",
      "Delivery",
      "Product Guarantee",
      "Sales and Refunds",
      "Help Center",
      "Try Web AR",
    ],
  },
];

const SOCIAL = ["f", "p", "ig"];

const LEGAL = [
  "Privacy",
  "Terms",
  "Promo Terms*",
  "The Norden Club Terms",
  "Sitemap",
  "Accessibility Statement",
  "Cookies",
];

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

// Styles live here so the footer works without any stylesheet import.
// Breakpoints: 900px (tablet) and 600px (phone).
// Keep 600px in sync with the matchMedia query in the component.
const CSS = `
.site_footer,
.site_footer * { box-sizing: border-box; }

.site_footer {
  background: #8b3f1f;
  color: #f5f0e8;
  padding: 60px 48px 30px;
  font-family: 'Cormorant Garamond', serif;
}

/* ---------- top grid ---------- */
.footer_grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr 1.5fr;
  gap: 40px;
}
.footer_col { min-width: 0; }

.footer_h {
  margin: 0;
  font-size: inherit;
  font-weight: inherit;
}
.footer_heading {
  margin: 0 0 14px;
  font-size: 18px;
  font-weight: 400;
}

/* heading becomes a button on phones only */
.footer_toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 0;
  padding: 18px 0;
  background: none;
  border: 0;
  color: inherit;
  font: inherit;
  font-size: 18px;
  text-align: left;
  cursor: pointer;
}
.footer_toggle:focus-visible {
  outline: 2px solid #f5f0e8;
  outline-offset: 2px;
}
.footer_chevron {
  width: 9px;
  height: 9px;
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  transform: rotate(45deg);
  transition: transform 0.2s ease;
}
.footer_chevron.is_open { transform: rotate(-135deg); }

.footer_list {
  margin: 0;
  padding: 0;
  list-style: none;
}
.footer_link {
  margin: 6px 0;
  font-size: 14px;
  opacity: 0.9;
  cursor: pointer;
}
.footer_link:hover {
  opacity: 1;
  text-decoration: underline;
}

/* ---------- newsletter column ---------- */
.footer_email {
  position: relative;
  margin-top: 16px;
}
.footer_email input {
  width: 100%;
  padding: 10px 40px 10px 0;
  background: transparent;
  border: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  color: #fff;
  font-size: 14px;
  outline: none;
}
.footer_email input::placeholder { color: rgba(245, 240, 232, 0.7); }
.footer_email input:focus { border-bottom-color: #f5f0e8; }
.footer_email button {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 50%;
  background: #f5f0e8;
  color: #8b3f1f;
  cursor: pointer;
}

.footer_social_block { margin-top: 30px; }
.footer_social {
  display: flex;
  gap: 16px;
  margin-top: 10px;
}
.footer_social_icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  font-size: 12px;
  cursor: pointer;
}
.footer_hashtag {
  margin: 12px 0 0;
  font-size: 12px;
}
.footer_logo {
  margin-top: 30px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  text-align: center;
  letter-spacing: 0.4em;
  font-size: 18px;
}

/* ---------- bottom bar ---------- */
.footer_bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
  margin-top: 50px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  font-size: 13px;
}
.footer_legal {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 18px;
}
.footer_legal span { cursor: pointer; }

/* ---------- tablet ---------- */
@media (max-width: 900px) {
  .site_footer { padding: 48px 32px 28px; }
  .footer_grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 36px 28px;
  }
  .footer_newsletter {
    grid-column: 1 / -1;
    max-width: 480px;
  }
  .footer_bottom { margin-top: 40px; }
}

/* ---------- phone ---------- */
@media (max-width: 600px) {
  .site_footer { padding: 8px 20px 24px; }
  .footer_grid {
    grid-template-columns: 1fr;
    gap: 0;
  }
  .footer_col { border-bottom: 1px solid rgba(255, 255, 255, 0.25); }

  .footer_list {
    display: none;
    padding-bottom: 14px;
  }
  .footer_list.is_open { display: block; }
  .footer_link {
    margin: 0;
    padding: 9px 0;
    font-size: 15px;
  }

  .footer_newsletter {
    max-width: none;
    padding: 28px 0 8px;
    border-bottom: 0;
  }
  /* 16px stops iOS Safari zooming in when the field is focused */
  .footer_email input { font-size: 16px; }
  .footer_social_icon {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }

  .footer_bottom {
    flex-direction: column;
    gap: 14px;
    margin-top: 24px;
    font-size: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .footer_chevron { transition: none; }
}
`;

export default function Footer() {
  const [openCol, setOpenCol] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Only used to switch the column headings between a plain heading
  // (desktop/tablet) and an accordion button (phone)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 600px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <footer className="site_footer">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* TOP GRID */}
      <div className="footer_grid">
        {COLUMNS.map((col) => {
          const isOpen = openCol === col.title;
          const id = `footer-${slugify(col.title)}`;

          return (
            <div key={col.title} className="footer_col">
              {isMobile ? (
                <h4 className="footer_h">
                  <button
                    type="button"
                    className="footer_heading footer_toggle"
                    aria-expanded={isOpen}
                    aria-controls={id}
                    onClick={() => setOpenCol(isOpen ? null : col.title)}
                  >
                    {col.title}
                    <span
                      className={`footer_chevron ${isOpen ? "is_open" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                </h4>
              ) : (
                <h4 className="footer_heading">{col.title}</h4>
              )}

              <ul
                id={id}
                className={`footer_list ${isOpen ? "is_open" : ""}`}
              >
                {col.links.map((item) => (
                  // Swap for <a href="..."> once you have the routes
                  <li key={item} className="footer_link">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        {/* NEWSLETTER + SOCIAL + LOGO */}
        <div className="footer_col footer_newsletter">
          <h4 className="footer_heading">Enjoy 50 off your first order</h4>

          <div className="footer_email">
            <input
              type="email"
              aria-label="Email address"
              placeholder="Enter your email"
            />
            <button type="button" aria-label="Subscribe">
              →
            </button>
          </div>

          <div className="footer_social_block">
            <h4 className="footer_heading">Social</h4>
            <div className="footer_social">
              {SOCIAL.map((icon) => (
                <div key={icon} className="footer_social_icon">
                  {icon}
                </div>
              ))}
            </div>
            <p className="footer_hashtag">#AtHomewithNorden</p>
          </div>

          <div className="footer_logo">NÓRDEN</div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="footer_bottom">
        <div className="footer_legal">
          {LEGAL.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <div>© 2026 Norden. All rights reserved.</div>
      </div>
    </footer>
  );
}