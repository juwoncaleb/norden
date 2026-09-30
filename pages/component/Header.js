import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

// Every href matches a file in /pages (pages/beds.js -> "/beds").
// Items marked TODO don't have a page yet.
const NAV_LINKS = [
  { label: "Our Story", href: "/about" },
  // { label: "Blogs", href: "/blog" },
  { label: "Delivery", href: "/delivery" }, // TODO: no page yet
];

const MENU = [
  {
    label: "Headboard",
    items: [
      { label: "Headboard", href: "/headboard" },
      { label: "Signature", href: "/signature" }, // needs pages/signature/index.js
      { label: "Custom", href: "/custom" }, // TODO: no page yet
    ],
  },
  {
    label: "Bedroom",
    items: [
      { label: "Beds", href: "/beds" },
      { label: "Bedside Table", href: "/bedsidetable" },
      { label: "Benches", href: "/benches" },
      { label: "Dressers", href: "/dresser" },
      { label: "Consoles", href: "/consoles" },
    ],
  },
  {
    label: "Living",
    items: [
      { label: "Sofas", href: "/sofa" },
      { label: "Armchair/Lounges", href: "/armchair" },
      { label: "Side tables", href: "/sidetable" },
      { label: "Coffee table", href: "/coffeetable" },
      { label: "Ottomans", href: "/ottomans" },
      { label: "Consoles", href: "/livingconsole" },
      { label: "TV units", href: "/tvunit" },
    ],
  },
  {
    label: "Dining",
    items: [
      { label: "Dining Table", href: "/diningtable" },
      { label: "Dining Chairs", href: "/diningchairs" },
      { label: "Benches", href: "/benches" },
      { label: "Bar/Counter Stools", href: "/bar" },
    ],
  },
  {
    label: "Objects",
    items: [
      { label: "Mirrors", href: "/mirrors" },
      { label: "Lighting", href: "/lighting" },
      { label: "Sculptural pieces", href: "/sculpturalpieces" },
      { label: "Vases", href: "/vase" },
      { label: "Wares", href: "/ware" }, // needs pages/ware/index.js
      { label: "Accessories", href: "/accessories" },
    ],
  },
  {
    label: "Storage",
    items: [
      { label: "Wardrobes", href: "/wardrobes" }, // TODO: no page yet
      { label: "Cabinets", href: "/cabinets" }, // TODO: no page yet
      { label: "Shelving", href: "/shelving" }, // TODO: no page yet
      { label: "Media units", href: "/mediaunits" }, // TODO: no page yet
      { label: "Custom storage", href: "/customstorage" }, // TODO: no page yet
    ],
  },
];

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function Header() {
  const [open, setOpen] = useState(null); // desktop dropdown
  const [drawerOpen, setDrawerOpen] = useState(false); // mobile drawer
  const [accordion, setAccordion] = useState(null); // mobile section
  const navRef = useRef(null);
  const closeBtnRef = useRef(null);
  const closeTimer = useRef(null);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setAccordion(null);
  }, []);

  // Desktop: close on outside click. Everywhere: close on Escape.
  useEffect(() => {
    const onClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpen(null);
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(null);
        closeDrawer();
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [closeDrawer]);

  // Lock page scroll while the mobile drawer is open, and move focus into it
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    if (drawerOpen && closeBtnRef.current) closeBtnRef.current.focus();
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  // If the window is resized up to desktop, close the drawer
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1101px)");
    const onChange = (e) => e.matches && closeDrawer();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [closeDrawer]);

  // Small delay on leave so the desktop dropdown doesn't flicker shut
  const openMenu = (label) => {
    clearTimeout(closeTimer.current);
    setOpen(label);
  };
  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 120);
  };

  // Leading slash = always loads from /public, on every page
  const logo = (
    <img className="modo_logo mt-1 mr-8" src="/norden.png" alt="Logo" />
  );

  return (
    <div>
      <div className="header_div">
        <div className="header_left">
          <Link href="/" className="logo_link">
            {logo}
          </Link>

          {/* DESKTOP NAV */}
          <nav className="desktop_nav" ref={navRef} aria-label="Main">
            {NAV_LINKS.map((link) => (
              <Link key={link.label} href={link.href} className="nav_link">
                {link.label}
              </Link>
            ))}

            {MENU.map((menu) => {
              const isOpen = open === menu.label;
              return (
                <div
                  key={menu.label}
                  className="nav_item"
                  onMouseEnter={() => openMenu(menu.label)}
                  onMouseLeave={scheduleClose}
                >
                  <button
                    type="button"
                    className="nav_trigger"
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : menu.label)}
                  >
                    {menu.label}
                  </button>

                  {isOpen && (
                    <ul className="dropdown_panel">
                      {menu.items.map((item) => (
                        <li key={item.label}>
                          <Link
                            className="dropdown_link"
                            href={item.href}
                            onClick={() => setOpen(null)}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* DESKTOP CONTACT */}
        <div className="desktop_actions flex mt-2">
          <button
            className="contact_us_button"
            onClick={() =>
              window.open(
                "https://wa.me/2348030486766",
                "_blank",
                "noopener,noreferrer",
              )
            }
          >
            Contact Us
          </button>{" "}
        </div>

        {/* HAMBURGER (mobile only) */}
        <button
          type="button"
          className="mobile_toggle"
          aria-label="Open menu"
          aria-expanded={drawerOpen}
          aria-controls="mobile-drawer"
          onClick={() => setDrawerOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* MOBILE DRAWER */}
      <div
        className={`drawer_backdrop ${drawerOpen ? "is_open" : ""}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />
      <aside
        id="mobile-drawer"
        className={`mobile_drawer ${drawerOpen ? "is_open" : ""}`}
        aria-label="Menu"
      >
        <div className="drawer_top">
          <Link href="/" onClick={closeDrawer}>
            <img className="modo_logo" src="/norden.png" alt="Logo" />
          </Link>
          <button
            type="button"
            className="drawer_close"
            aria-label="Close menu"
            ref={closeBtnRef}
            onClick={closeDrawer}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
              <path
                d="M3 3l16 16M19 3L3 19"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </button>
        </div>

        <nav className="drawer_nav" aria-label="Mobile">
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="drawer_row"
                  onClick={closeDrawer}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {MENU.map((menu) => {
              const expanded = accordion === menu.label;
              const id = `drawer-${slugify(menu.label)}`;
              return (
                <li key={menu.label}>
                  <button
                    type="button"
                    className="drawer_row"
                    aria-expanded={expanded}
                    aria-controls={id}
                    onClick={() => setAccordion(expanded ? null : menu.label)}
                  >
                    <span>{menu.label}</span>
                    <span
                      className={`chevron ${expanded ? "is_open" : ""}`}
                      aria-hidden="true"
                    />
                  </button>

                  {expanded && (
                    <ul id={id} className="drawer_sub">
                      {menu.items.map((item) => (
                        <li key={item.label}>
                          <Link href={item.href} onClick={closeDrawer}>
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="drawer_footer">
          <button
            className="contact_us_button"
            onClick={() =>
              window.open(
                "https://wa.me/2348030486766",
                "_blank",
                "noopener,noreferrer",
              )
            }
          >
            Contact Us
          </button>{" "}
        </div>
      </aside>

      <div className="offer_div flex justify-center">
        <div className="flex offer_text">
          <p className="offer_text_arrow">NEW ARRIVALS</p>
          <img
            width="34"
            height="64"
            src="https://img.icons8.com/laces/64/arrow.png"
            alt="arrow"
          />
        </div>
        <div className="flex offer_text">
          <p className="offer_text_arrow"> UP TO 40% OFF SALE</p>
          <img
            width="34"
            height="64"
            src="https://img.icons8.com/laces/64/arrow.png"
            alt="arrow"
          />
        </div>
      </div>
    </div>
  );
}