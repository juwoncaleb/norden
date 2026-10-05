"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const COLUMNS = [
  {
    title: "What's Popular",
    links: [
      { label: "Sofas", href: "/sofa" },
      { label: "Armchairs / Lounges", href: "/armchair" },
      { label: "Beds", href: "/beds" },
      { label: "Bedside Tables", href: "/bedsidetable" },
      { label: "Coffee Tables", href: "/coffeetable" },
      { label: "Dining Tables", href: "/diningtable" },
      { label: "Dining Chairs", href: "/diningchairs" },
      { label: "Mirrors", href: "/mirrors" },
    ],
  },
  {
    title: "Shopping With Us",
    links: [
      { label: "Signature Headboards", href: "/signature" },
      { label: "Custom Headboards", href: "/custom" },
      { label: "Benches", href: "/benches" },
      { label: "Dressers", href: "/dresser" },
      { label: "Consoles", href: "/consoles" },
      { label: "Side Tables", href: "/sidetable" },
      { label: "Ottomans", href: "/ottomans" },
      { label: "TV Units", href: "/tvunit" },
      { label: "Bar & Counter Stools", href: "/bar" },
    ],
  },
  {
    title: "About Us",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Delivery", href: "/delivery" },
      { label: "Contact Us", href: "https://wa.me/2348068520499" },
      { label: "TC", href: "/custom" },
    ],
  },
];

const SOCIAL = [
  { label: "f", name: "Facebook" },
  { label: "p", name: "Pinterest" },
  { label: "ig", name: "Instagram", href: "https://instagram.com/norden.hq" },
];

const LEGAL = [
  { label: "Privacy" },
  { label: "Terms" },
  { label: "Promo Terms*" },
  { label: "The Norden Club Terms" },
  { label: "Sitemap", href: "/sitemap" },
  { label: "Accessibility Statement" },
  { label: "Cookies" },
];

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const isExternal = (href) => /^https?:\/\//.test(href);

const CSS = `
.site_footer,
.site_footer * {
  box-sizing: border-box;
}

.site_footer {
  background: #8b3f1f;
  color: #f5f0e8;
  padding: 60px 48px 30px;
  font-family: 'Cormorant Garamond', serif;
}

/* =========================
   FOOTER GRID
========================= */

.footer_grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr 1.5fr;
  gap: 40px;
}

.footer_col {
  min-width: 0;
}

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

/* =========================
   MOBILE ACCORDION BUTTON
========================= */

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

/* =========================
   CHEVRON
========================= */

.footer_chevron {
  width: 9px;
  height: 9px;

  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;

  transform: rotate(45deg);

  transition: transform 0.2s ease;
}

.footer_chevron.is_open {
  transform: rotate(-135deg);
}

/* =========================
   LINKS
========================= */

.footer_list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.footer_link {
  margin: 6px 0;
  font-size: 14px;
  opacity: 0.9;
}

.footer_link a {
  color: inherit;
  text-decoration: none;
}

.footer_link a:hover {
  opacity: 1;
  text-decoration: underline;
}

/* =========================
   NEWSLETTER
========================= */

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

.footer_email input::placeholder {
  color: rgba(245, 240, 232, 0.7);
}

.footer_email input:focus {
  border-bottom-color: #f5f0e8;
}

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

/* =========================
   SOCIAL
========================= */

.footer_social_block {
  margin-top: 30px;
}

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

  color: inherit;
  text-decoration: none;

  font-size: 12px;

  cursor: pointer;
}

.footer_hashtag {
  margin: 12px 0 0;
  font-size: 12px;
}

/* =========================
   FOOTER LOGO
========================= */

.footer_logo {
  margin-top: 30px;
  padding: 20px;

  border: 1px solid rgba(255, 255, 255, 0.6);

  text-align: center;

  letter-spacing: 0.4em;

  font-size: 18px;
}

/* =========================
   BOTTOM
========================= */

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

.footer_legal span {
  cursor: pointer;
}

.footer_legal a {
  color: inherit;
  text-decoration: none;
}

.footer_legal a:hover {
  text-decoration: underline;
}

/* =========================
   TABLET
========================= */

@media (max-width: 900px) {

  .site_footer {
    padding: 48px 32px 28px;
  }

  .footer_grid {
    grid-template-columns: repeat(3, 1fr);

    gap: 36px 28px;
  }

  .footer_newsletter {
    grid-column: 1 / -1;

    max-width: 480px;
  }

  .footer_bottom {
    margin-top: 40px;
  }
}

/* =========================
   MOBILE
========================= */

@media (max-width: 600px) {

  .site_footer {
    padding: 8px 20px 24px;
  }

  .footer_grid {
    grid-template-columns: 1fr;

    gap: 0;
  }

  .footer_col {
    border-bottom: 1px solid rgba(255, 255, 255, 0.25);
  }

  .footer_list {
    display: none;

    padding-bottom: 14px;
  }

  .footer_list.is_open {
    display: block;
  }

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

  .footer_email input {
    font-size: 16px;
  }

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

/* =========================
   REDUCED MOTION
========================= */

@media (prefers-reduced-motion: reduce) {

  .footer_chevron {
    transition: none;
  }
}
`;

export default function Footer() {
  const [openCol, setOpenCol] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 600px)");

    const updateScreen = () => {
      setIsMobile(mediaQuery.matches);
    };

    updateScreen();

    mediaQuery.addEventListener("change", updateScreen);

    return () => {
      mediaQuery.removeEventListener("change", updateScreen);
    };
  }, []);

  return (
    <footer className="site_footer">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* =========================
          FOOTER GRID
      ========================= */}

      <div className="footer_grid">
        {COLUMNS.map((column) => {
          const isOpen = openCol === column.title;
          const id = `footer-${slugify(column.title)}`;

          return (
            <div key={column.title} className="footer_col">
              {/* MOBILE HEADING */}
              {isMobile ? (
                <h4 className="footer_h">
                  <button
                    type="button"
                    className="footer_heading footer_toggle"
                    aria-expanded={isOpen}
                    aria-controls={id}
                    onClick={() => setOpenCol(isOpen ? null : column.title)}
                  >
                    {column.title}

                    <span
                      className={`footer_chevron ${isOpen ? "is_open" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                </h4>
              ) : (
                /* DESKTOP HEADING */
                <h4 className="footer_heading">{column.title}</h4>
              )}

              {/* LINKS */}
              <ul
                id={id}
                className={`footer_list ${isOpen ? "is_open" : ""}`}
              >
                {column.links.map((item) => (
                  <li key={item.label} className="footer_link">
                    {isExternal(item.href) ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link href={item.href}>{item.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        {/* =========================
            NEWSLETTER
        ========================= */}

        <div className="footer_col footer_newsletter">
          <h4 className="footer_heading">The language of space</h4>

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

          {/* SOCIAL */}
          <div className="footer_social_block">
            <h4 className="footer_heading">Social</h4>

            <div className="footer_social">
              {SOCIAL.map((icon) =>
                icon.href ? (
                  <a
                    key={icon.label}
                    href={icon.href}
                    className="footer_social_icon"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={icon.name}
                  >
                    {icon.label}
                  </a>
                ) : (
                  <div
                    key={icon.label}
                    className="footer_social_icon"
                    aria-label={icon.name}
                  >
                    {icon.label}
                  </div>
                )
              )}
            </div>

            <p className="footer_hashtag">#AtHomewithNorden</p>
          </div>

          {/* LOGO */}
          <div className="footer_logo">NÓRDEN</div>
        </div>
      </div>

      {/* =========================
          BOTTOM BAR
      ========================= */}

      <div className="footer_bottom">
        <div className="footer_legal">
          {LEGAL.map((item) =>
            item.href ? (
              <Link key={item.label} href={item.href}>
                {item.label}
              </Link>
            ) : (
              <span key={item.label}>{item.label}</span>
            )
          )}
        </div>

        <div>© 2026 Norden. All rights reserved.</div>
      </div>
    </footer>
  );
}