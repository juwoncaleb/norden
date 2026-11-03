
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// ============================================
// FOOTER COLUMNS
// ============================================

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
      { label: "The Norden Club", href: "/nordenclub" },
      { label: "Refer", href: "/refer" },
      { label: "Product Guarantee", href: "/guarantee" },
      { label: "Delivery", href: "/delivery" },
      { label: "Sales & Refunds", href: "/sales-and-refunds" },
      { label: "Swatches", href: "/swatches" },
      { label: "Interior Styling", href: "/interior-styling" },
      {
        label: "Customization Service",
        href: "/customization-service",
      },
      { label: "Timeless Travels", href: "/timeless-travels" },
    ],
  },
  {
    title: "About Us",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Career", href: "/career" },
      { label: "Trade", href: "/trade" },
      { label: "Ambassador", href: "/ambassdor" },
      { label: "Affiliate", href: "/affliate" },
      {
        label: "Contact Us",
        href: "https://wa.me/2348068520499",
      },
      { label: "TC", href: "/tc" },
    ],
  },
];

// ============================================
// SOCIAL MEDIA
// Real SVG platform logos — no installation
// ============================================

const SOCIAL = [
  {
    name: "Facebook",
    href: "https://web.facebook.com/profile.php?id=100080173489561&sk=followers",
    icon: "facebook",
  },
  {
    name: "Pinterest",
    href: "https://www.pinterest.com/TheNorden1/?actingBusinessId=1144407092720364361",
    icon: "pinterest",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/thenorden_hq",
    icon: "instagram",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@thenorden_hq?lang=en",
    icon: "tiktok",
  },
];
// ============================================
// LEGAL LINKS
// ============================================

const LEGAL = [
  { label: "Privacy" },
  { label: "Terms" },
  { label: "Promo Terms*" },
  { label: "The Norden Club Terms" },
  { label: "Sitemap", href: "/sitemap" },
  { label: "Accessibility Statement" },
  { label: "Cookies" },
];

const slugify = (text) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const isExternal = (href) => /^https?:\/\//.test(href);

// ============================================
// FOOTER STYLES
// ============================================

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

/* FOOTER GRID */

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

/* MOBILE ACCORDION */

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

/* CHEVRON */

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

/* LINKS */

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

/* NEWSLETTER */

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
  font-size: 18px;
  cursor: pointer;
}

/* SOCIAL SECTION */

.footer_social_block {
  margin-top: 30px;
}

.footer_social {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 10px;
}

/* ACTUAL PLATFORM ICONS */

.footer_social_icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  background: transparent;
  color: #f5f0e8;
  text-decoration: none;
  cursor: pointer;
  transition:
    background 0.25s ease,
    border-color 0.25s ease,
    transform 0.25s ease;
}

.footer_social_icon img {
  display: block;
  width: 17px;
  height: 17px;
  object-fit: contain;
  transition: transform 0.25s ease;
}

.footer_social_icon:hover {
  background: rgba(245, 240, 232, 0.15);
  border-color: #f5f0e8;
  transform: translateY(-3px);
}

.footer_social_icon:hover img {
  transform: scale(1.1);
}

.footer_social_icon:focus-visible {
  outline: 2px solid #f5f0e8;
  outline-offset: 4px;
}

.footer_hashtag {
  margin: 12px 0 0;
  font-size: 12px;
}

/* FOOTER LOGO */

.footer_logo {
  margin-top: 30px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  text-align: center;
  letter-spacing: 0.4em;
  font-size: 18px;
}

/* BOTTOM BAR */

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

/* TABLET */

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

/* MOBILE */

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
    width: 40px;
    height: 40px;
  }

  .footer_social_icon img {
    width: 18px;
    height: 18px;
  }

  .footer_bottom {
    flex-direction: column;
    gap: 14px;
    margin-top: 24px;
    font-size: 12px;
  }
}

/* REDUCED MOTION */

@media (prefers-reduced-motion: reduce) {
  .footer_chevron,
  .footer_social_icon,
  .footer_social_icon img {
    transition: none;
  }

  .footer_social_icon:hover {
    transform: none;
  }
}
`;

// ============================================
// FOOTER COMPONENT
// ============================================

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

      {/* FOOTER GRID */}

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
                    onClick={() =>
                      setOpenCol(
                        isOpen ? null : column.title
                      )
                    }
                  >
                    {column.title}

                    <span
                      className={`footer_chevron ${
                        isOpen ? "is_open" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                </h4>
              ) : (
                <h4 className="footer_heading">
                  {column.title}
                </h4>
              )}

              {/* LINKS */}

              <ul
                id={id}
                className={`footer_list ${
                  isOpen ? "is_open" : ""
                }`}
              >
                {column.links.map((item) => (
                  <li
                    key={item.label}
                    className="footer_link"
                  >
                    {isExternal(item.href) ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link href={item.href}>
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        {/* NEWSLETTER */}

        <div className="footer_col footer_newsletter">
          <h4 className="footer_heading">
            Get Early access
          </h4>

          <div className="footer_email">
            <input
              type="email"
              aria-label="Email address"
              placeholder="Enter your email"
            />

            <button
              type="button"
              aria-label="Subscribe"
            >
              →
            </button>
          </div>

          {/* SOCIAL MEDIA */}

          <div className="footer_social_block">
            <h4 className="footer_heading">
              Social
            </h4>

            <div className="footer_social">
              {SOCIAL.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="footer_social_icon"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow Norden on ${social.name}`}
                  title={social.name}
                >
                  <img
                    src={`https://cdn.simpleicons.org/${social.icon}/f5f0e8`}
                    alt=""
                    width="17"
                    height="17"
                    loading="lazy"
                  />
                </a>
              ))}
            </div>

            <p className="footer_hashtag">
              #AtHomewithNorden
            </p>
          </div>

          {/* NORDEN LOGO */}

          <div className="footer_logo">
            NÓRDEN
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}

      <div className="footer_bottom">
        <div className="footer_legal">
          {LEGAL.map((item) =>
            item.href ? (
              <Link
                key={item.label}
                href={item.href}
              >
                {item.label}
              </Link>
            ) : (
              <span key={item.label}>
                {item.label}
              </span>
            )
          )}
        </div>

        <div>
          © 2026 Norden. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
