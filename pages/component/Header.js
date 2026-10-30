import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import { useCartStore } from "../../store/cartStore";

// ============================================
// NAVIGATION
// ============================================

const NAV_LINKS = [
  { label: "Our Story", href: "/about" },
    { label: "Swatches", href: "/swatches" },

  { label: "Delivery", href: "/delivery" },
];

const MENU = [
  {
    label: "Headboard",
    items: [
      { label: "Headboard", href: "/headboard" },
      { label: "Signature", href: "/signature" },
      { label: "Custom", href: "/custom" },
    ],
  },
  {
    label: "Bedroom",
    items: [
      { label: "Beds", href: "/beds" },
      { label: "Bar", href: "/bar" },
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
      { label: "Side Tables", href: "/sidetable" },
      { label: "Coffee Table", href: "/coffeetable" },
      { label: "Ottomans", href: "/ottomans" },
      { label: "Consoles", href: "/livingconsole" },
      { label: "TV Units", href: "/tvunit" },
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
      { label: "Sculptural Pieces", href: "/sculpturalpieces" },
      { label: "Vases", href: "/vase" },
      { label: "Wares", href: "/ware" },
      { label: "Accessories", href: "/accessories" },
    ],
  },
  {
    label: "Storage",
    items: [
      { label: "Wardrobes", href: "/wardrobes" },
      { label: "Cabinets", href: "/cabinets" },
      { label: "Shelving", href: "/shelving" },
      { label: "Media Units", href: "/mediaunits" },
      { label: "Custom Storage", href: "/customstorage" },
    ],
  },
];

const PROFILE_LINKS = [
  { label: "My Account", href: "/account", icon: "user" },
  { label: "My Likes", href: "/likes", icon: "heart" },
  { label: "My Orders", href: "/orders", icon: "package" },
  {
    label: "My Addresses",
    href: "/account/addresses",
    icon: "pin",
  },
  { label: "Help & Support", href: "/contact", icon: "help" },
];

const DESKTOP_QUERY = "(min-width: 1241px)";

// ============================================
// ICONS
// ============================================

function Icon({ name, size = 23 }) {
  const icons = {
    search: (
      <>
        <circle cx="11" cy="11" r="7.5" />
        <path d="m20.5 20.5-4.1-4.1" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3-6 8-6s8 2 8 6" />
      </>
    ),
    cart: (
      <>
        <path d="M3 4h2l2.3 11.2a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L21.5 8H6" />
        <circle cx="10" cy="20" r="1" />
        <circle cx="18" cy="20" r="1" />
      </>
    ),
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
    ),
    package: (
      <>
        <path d="m3 7 9-4 9 4v10l-9 4-9-4V7Z" />
        <path d="m3 7 9 4 9-4M12 11v10" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    help: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4" />
        <path d="M12 17h.01" />
      </>
    ),
    logout: (
      <>
        <path d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5" />
        <path d="m14 16 4-4-4-4M8 12h10" />
      </>
    ),
    close: <path d="M5 5l14 14M19 5L5 19" />,
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name] || icons.user}
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 48 48"
      aria-hidden="true"
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.25 5.48-4.76 7.18l7.73 6C44.42 38.03 46.98 31.88 46.98 24.55z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.2A23.9 23.9 0 0 0 0 24c0 3.87.93 7.51 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

// ============================================
// SEARCH HELPERS
// ============================================

function formatPrice(value) {
  if (value == null || value === "") return null;

  const number = Number(value);
  if (!Number.isFinite(number)) return null;

  return `₦${number.toLocaleString("en-NG", {
    maximumFractionDigits: 0,
  })}`;
}

function SearchPanel({
  query,
  setQuery,
  results,
  loading,
  error,
  close,
  inputRef,
}) {
  const hasQuery = query.trim().length >= 2;

  return (
    <div className="header_search_popover" role="search">
      <div className="header_search_form">
        <Icon name="search" size={19} />

        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search our collection..."
          aria-label="Search products"
          autoComplete="off"
        />

        <button
          type="button"
          className="search_close"
          aria-label="Close search"
          onClick={close}
        >
          <Icon name="close" size={17} />
        </button>
      </div>

      <div className="search_suggestions" aria-live="polite">
        {!hasQuery ? (
          <div className="search_empty_hint">
            Discover sofas, tables, beds and more.
          </div>
        ) : loading ? (
          <div className="search_status">
            <span className="search_mini_spinner" />
            Searching our collection...
          </div>
        ) : error ? (
          <div className="search_no_results">
            Search is temporarily unavailable.
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="search_suggestions_title">
              PRODUCTS
              <span>{results.length} results</span>
            </div>

            {results.map((product, index) => {
              const discounted =
                product.discountedPrice != null &&
                product.price != null &&
                Number(product.discountedPrice) <
                  Number(product.price);

              const price = discounted
                ? product.discountedPrice
                : product.price;

              return (
                <Link
                  key={`${product.id || index}-${index}`}
                  href={product.href || "#"}
                  className="search_result_item"
                  onClick={close}
                >
                  <div className="search_product_thumbnail">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title || "Furniture"}
                        loading="lazy"
                      />
                    ) : (
                      <Icon name="search" />
                    )}
                  </div>

                  <div className="search_result_info">
                    <span className="search_result_name">
                      {product.title}
                    </span>

                    <span className="search_result_category">
                      {String(product.category || "Furniture")
                        .replace(/([a-z])([A-Z])/g, "$1 $2")
                        .replace(/[-_]/g, " ")}
                    </span>

                    <div className="search_result_prices">
                      {formatPrice(price) && (
                        <span className="search_current_price">
                          {formatPrice(price)}
                        </span>
                      )}

                      {discounted && (
                        <span className="search_old_price">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                  </div>

                  <Icon name="arrow" size={17} />
                </Link>
              );
            })}
          </>
        ) : (
          <div className="search_no_results">
            No matching products found.
            <span>Try a different product name.</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// ACCOUNT BUTTON
// ============================================

function ProfileButton({
  session,
  isOpen,
  setIsOpen,
  openLogin,
  logout,
}) {
  const profileRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleOutside(event) {
      if (!profileRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, [isOpen, setIsOpen]);

  return (
    <div
      ref={profileRef}
      className={`header_profile_wrap ${
        isOpen ? "is_open" : ""
      }`}
      onMouseEnter={() => {
        if (
          session &&
          window.matchMedia(DESKTOP_QUERY).matches
        ) {
          setIsOpen(true);
        }
      }}
      onMouseLeave={() => {
        if (window.matchMedia(DESKTOP_QUERY).matches) {
          setIsOpen(false);
        }
      }}
    >
      <button
        type="button"
        className="header_account_button"
        aria-label={session ? "Account menu" : "Sign in"}
        aria-expanded={session ? isOpen : undefined}
        onClick={() => {
          if (!session) {
            openLogin();
          } else {
            setIsOpen((previous) => !previous);
          }
        }}
      >
        {session?.user?.image ? (
          <img
            src={session.user.image}
            alt=""
            className="header_account_avatar"
            referrerPolicy="no-referrer"
          />
        ) : (
          <Icon name="user" size={24} />
        )}
      </button>

      {session && (
        <div className="header_profile_dropdown">
          <div className="header_profile_identity">
            <strong>
              {session.user?.name || "NÓRDEN Customer"}
            </strong>
            <span>{session.user?.email}</span>
          </div>

          <div className="header_profile_links">
            {PROFILE_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="header_profile_item"
                onClick={() => setIsOpen(false)}
              >
                <Icon name={item.icon} size={17} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <button
            type="button"
            className="header_profile_item header_profile_logout"
            onClick={logout}
          >
            <Icon name="logout" size={17} />
            <span>Log Out</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================
// CART BUTTON
// ============================================

function CartButton({ count, onClick }) {
  return (
    <button
      type="button"
      className="header_cart_button"
      aria-label={`Shopping cart, ${count} items`}
      onClick={onClick}
    >
      <Icon name="cart" size={25} />

      <span className="header_cart_count">
        {count > 99 ? "99+" : count}
      </span>
    </button>
  );
}

// ============================================
// LIKE BUTTON
// ============================================

function LikeButton({ onClick }) {
  return (
    <Link
      href="/likes"
      className="header_like_button"
      aria-label="My Likes"
      title="My Likes"
      onClick={onClick}
    >
      <Icon name="heart" size={24} />
    </Link>
  );
}

// ============================================
// MAIN HEADER
// ============================================

export default function Header() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const cartItems = useCartStore(
    (state) => state.items ?? []
  );

  const [hydrated, setHydrated] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accordion, setAccordion] = useState(null);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);

  const [accountOpen, setAccountOpen] = useState(false);
  const [desktopProfileOpen, setDesktopProfileOpen] =
    useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] =
    useState(false);

  const [pageLoading, setPageLoading] = useState(false);

  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const desktopSearchInputRef = useRef(null);
  const mobileSearchInputRef = useRef(null);
  const modalCloseRef = useRef(null);
  const menuTimer = useRef(null);
  const loadingTimer = useRef(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const cartCount =
    hydrated && Array.isArray(cartItems)
      ? cartItems.reduce(
          (sum, item) =>
            sum +
            Math.max(
              0,
              Number(item.quantity ?? 1) || 0
            ),
          0
        )
      : 0;

  // ============================================
  // HEADER ACTIONS
  // ============================================

  function closeAll() {
    clearTimeout(menuTimer.current);

    setOpenMenu(null);
    setDrawerOpen(false);
    setAccordion(null);
    setSearchOpen(false);
    setAccountOpen(false);
    setDesktopProfileOpen(false);
    setMobileProfileOpen(false);
  }

  function closeSearch() {
    setSearchOpen(false);
    setSearchQuery("");
  }

  function openLogin() {
    closeAll();
    setAccountOpen(true);
  }

  function handleCheckout() {
    closeAll();
    router.push("/checkout");
  }

  function handleLogout() {
    closeAll();
    signOut({ callbackUrl: "/" });
  }

  function toggleSearch() {
    setOpenMenu(null);
    setDrawerOpen(false);
    setDesktopProfileOpen(false);
    setMobileProfileOpen(false);
    setSearchOpen((previous) => !previous);
  }

  // ============================================
  // LIVE SEARCH
  // ============================================

  useEffect(() => {
    const query = searchQuery.trim();

    if (!searchOpen || query.length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      setSearchError(false);
      return;
    }

    const controller = new AbortController();

    setSearchLoading(true);
    setSearchError(false);

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Search failed");
        }

        const data = await response.json();

        if (!controller.signal.aborted) {
          setSearchResults(
            Array.isArray(data.results)
              ? data.results
              : []
          );
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error(error);
          setSearchError(true);
          setSearchResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setSearchLoading(false);
        }
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery, searchOpen]);

  // ============================================
  // FOCUS SEARCH
  // ============================================

  useEffect(() => {
    if (!searchOpen) return;

    const timer = setTimeout(() => {
      const desktop = window
        .matchMedia(DESKTOP_QUERY)
        .matches;

      if (desktop) {
        desktopSearchInputRef.current?.focus();
      } else {
        mobileSearchInputRef.current?.focus();
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [searchOpen]);

  // ============================================
  // CLOSE ON ESCAPE / OUTSIDE CLICK
  // ============================================

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        closeAll();
      }
    }

    function handleOutside(event) {
      const insideDesktop =
        searchRef.current?.contains(event.target);

      const insideMobile =
        mobileSearchRef.current?.contains(
          event.target
        );

      const searchButton = event.target.closest(
        ".mobile_search_button, .header_search_button"
      );

      if (
        !insideDesktop &&
        !insideMobile &&
        !searchButton
      ) {
        setSearchOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    document.addEventListener(
      "mousedown",
      handleOutside
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
      document.removeEventListener(
        "mousedown",
        handleOutside
      );
    };
  }, []);

  // ============================================
  // PAGE LOADING
  // ============================================

  useEffect(() => {
    function start(url, options = {}) {
      if (
        options.shallow ||
        url === router.asPath
      ) {
        return;
      }

      clearTimeout(loadingTimer.current);

      loadingTimer.current = setTimeout(() => {
        setPageLoading(true);
      }, 150);

      closeAll();
    }

    function end() {
      clearTimeout(loadingTimer.current);
      setPageLoading(false);
    }

    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", end);
    router.events.on("routeChangeError", end);

    return () => {
      clearTimeout(loadingTimer.current);

      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", end);
      router.events.off("routeChangeError", end);
    };
  }, [router]);

  // ============================================
  // RESPONSIVE MENU RESET
  // ============================================

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY);

    function onChange() {
      setDesktopProfileOpen(false);
      setMobileProfileOpen(false);
      setSearchOpen(false);
      setDrawerOpen(false);
      setOpenMenu(null);
    }

    if (media.addEventListener) {
      media.addEventListener("change", onChange);

      return () => {
        media.removeEventListener("change", onChange);
      };
    }

    media.addListener(onChange);

    return () => media.removeListener(onChange);
  }, []);

  // ============================================
  // PREVENT SCROLL WHEN DRAWER/MODAL OPEN
  // ============================================

  useEffect(() => {
    if (!drawerOpen && !accountOpen) return;

    const previous =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [drawerOpen, accountOpen]);

  useEffect(() => {
    if (accountOpen) {
      modalCloseRef.current?.focus();
    }
  }, [accountOpen]);

  const commonSearchProps = {
    query: searchQuery,
    setQuery: setSearchQuery,
    results: searchResults,
    loading: searchLoading,
    error: searchError,
    close: closeSearch,
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="header_wrapper">
      {/* PAGE LOADER */}

      {pageLoading && (
        <div
          className="page_loader"
          role="status"
        >
          <div className="page_loader_spinner" />
          <span className="sr_only">
            Loading
          </span>
        </div>
      )}

      {/* HEADER */}

      <header className="header_div">
        <div className="header_left">
          <Link
            href="/"
            className="logo_link"
            onClick={closeAll}
          >
            <img
              src="/norden.png"
              alt="NÓRDEN"
              className="modo_logo"
            />
          </Link>

          {/* DESKTOP NAVIGATION */}

          <nav
            className="desktop_nav"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav_link"
                onClick={closeAll}
              >
                {link.label}
              </Link>
            ))}

            {MENU.map((menu) => (
              <div
                key={menu.label}
                className="nav_item"
                onMouseEnter={() => {
                  clearTimeout(menuTimer.current);
                  setOpenMenu(menu.label);
                }}
                onMouseLeave={() => {
                  clearTimeout(menuTimer.current);

                  menuTimer.current = setTimeout(
                    () => setOpenMenu(null),
                    120
                  );
                }}
              >
                <button
                  type="button"
                  className="nav_trigger"
                  aria-expanded={
                    openMenu === menu.label
                  }
                  onClick={() => {
                    setOpenMenu(
                      openMenu === menu.label
                        ? null
                        : menu.label
                    );
                  }}
                >
                  {menu.label}
                </button>

                {openMenu === menu.label && (
                  <ul className="dropdown_panel">
                    {menu.items.map((item) => (
                      <li
                        key={`${menu.label}-${item.href}-${item.label}`}
                      >
                        <Link
                          href={item.href}
                          className="dropdown_link"
                          onClick={closeAll}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* =====================================
            DESKTOP ACTIONS
            SEARCH - ACCOUNT - LIKE - CART
        ===================================== */}

        <div className="desktop_actions">
          <div
            className="header_search_container"
            ref={searchRef}
          >
            <button
              type="button"
              className="header_search_button"
              aria-label="Search products"
              aria-expanded={searchOpen}
              onClick={toggleSearch}
            >
              <Icon name="search" size={23} />
            </button>

            {searchOpen && (
              <SearchPanel
                {...commonSearchProps}
                inputRef={desktopSearchInputRef}
              />
            )}
          </div>

          <ProfileButton
            session={session}
            isOpen={desktopProfileOpen}
            setIsOpen={setDesktopProfileOpen}
            openLogin={openLogin}
            logout={handleLogout}
          />

          <LikeButton onClick={closeAll} />

          <CartButton
            count={cartCount}
            onClick={handleCheckout}
          />
        </div>

        {/* =====================================
            MOBILE ACTIONS
            SEARCH - ACCOUNT - LIKE - CART - MENU
        ===================================== */}

        <div className="mobile_header_actions">
          <button
            type="button"
            className="mobile_search_button"
            aria-label="Search products"
            aria-expanded={searchOpen}
            onClick={toggleSearch}
          >
            <Icon name="search" size={22} />
          </button>

          <ProfileButton
            session={session}
            isOpen={mobileProfileOpen}
            setIsOpen={setMobileProfileOpen}
            openLogin={openLogin}
            logout={handleLogout}
          />

          <LikeButton onClick={closeAll} />

          <CartButton
            count={cartCount}
            onClick={handleCheckout}
          />

          <button
            type="button"
            className="mobile_toggle"
            aria-label="Open navigation"
            aria-expanded={drawerOpen}
            onClick={() => {
              setSearchOpen(false);
              setDrawerOpen(true);
            }}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {/* MOBILE SEARCH */}

        {searchOpen && (
          <div
            className="mobile_search_popover"
            ref={mobileSearchRef}
          >
            <SearchPanel
              {...commonSearchProps}
              inputRef={mobileSearchInputRef}
            />
          </div>
        )}
      </header>

      {/* MOBILE DRAWER BACKDROP */}

      <div
        className={`drawer_backdrop ${
          drawerOpen ? "is_open" : ""
        }`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* MOBILE DRAWER */}

      <aside
        className={`mobile_drawer ${
          drawerOpen ? "is_open" : ""
        }`}
        aria-label="Mobile navigation"
        aria-hidden={!drawerOpen}
        inert={!drawerOpen}
      >
        <div className="drawer_top">
          <Link href="/" onClick={closeAll}>
            <img
              src="/norden.png"
              alt="NÓRDEN"
              className="modo_logo"
            />
          </Link>

          <button
            type="button"
            className="drawer_close"
            aria-label="Close navigation"
            onClick={() => setDrawerOpen(false)}
          >
            <Icon name="close" />
          </button>
        </div>

        <nav className="drawer_nav">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="drawer_row"
              onClick={closeAll}
            >
              {link.label}
            </Link>
          ))}

          {MENU.map((menu) => (
            <div
              key={menu.label}
              className="drawer_group"
            >
              <button
                type="button"
                className="drawer_row"
                aria-expanded={
                  accordion === menu.label
                }
                onClick={() => {
                  setAccordion(
                    accordion === menu.label
                      ? null
                      : menu.label
                  );
                }}
              >
                <span>{menu.label}</span>

                <span
                  className={`chevron ${
                    accordion === menu.label
                      ? "is_open"
                      : ""
                  }`}
                />
              </button>

              {accordion === menu.label && (
                <ul className="drawer_sub">
                  {menu.items.map((item) => (
                    <li
                      key={`${menu.label}-${item.href}`}
                    >
                      <Link
                        href={item.href}
                        onClick={closeAll}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>

        <div className="drawer_footer">
          <button
            type="button"
            className="drawer_checkout"
            onClick={handleCheckout}
          >
            <Icon name="cart" size={19} />
            View Cart ({cartCount})
          </button>
        </div>
      </aside>

      {/* =====================================
          GOOGLE ACCOUNT MODAL
      ===================================== */}

      {accountOpen && (
        <div
          className="account_modal_backdrop"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              setAccountOpen(false);
            }
          }}
        >
          <div
            className="account_modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-modal-title"
          >
            <button
              ref={modalCloseRef}
              type="button"
              className="account_modal_close"
              aria-label="Close"
              onClick={() => setAccountOpen(false)}
            >
              <Icon name="close" />
            </button>

            <span className="account_eyebrow">
              WELCOME TO NÓRDEN
            </span>

            {status === "loading" ? (
              <div className="account_loading">
                <div className="account_spinner" />
                Loading your account...
              </div>
            ) : session ? (
              <div className="account_logged_in">
                <div className="account_profile_avatar">
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt=""
                    />
                  ) : (
                    <Icon name="user" size={32} />
                  )}
                </div>

                <h2 id="account-modal-title">
                  {session.user?.name ||
                    "Your Account"}
                </h2>

                <p className="account_email">
                  {session.user?.email}
                </p>

                <button
                  type="button"
                  className="account_signout_button"
                  onClick={handleLogout}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <h2 id="account-modal-title">
                  Your space, your NÓRDEN.
                </h2>

                <p className="account_description">
                  Sign in to save your favourite
                  pieces, manage your account and
                  explore your orders.
                </p>

                <button
                  type="button"
                  className="account_google_button"
                  onClick={() => signIn("google")}
                >
                  <GoogleIcon />
                  Continue with Google
                </button>

                <p className="account_disclaimer">
                  By continuing, you agree to our
                  terms and privacy policy.
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* =====================================
          LIKE ICON STYLES
          EMBEDDED DIRECTLY IN HEADER.JS
      ===================================== */}

      <style jsx global>{`
        .header_like_button {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 40px;
          height: 40px;
          min-width: 40px;
          flex-shrink: 0;
          padding: 0;
          margin: 0;
          color: #292523;
          background: transparent;
          border: none;
          border-radius: 0;
          text-decoration: none;
          cursor: pointer;
          transition:
            color 0.25s ease,
            transform 0.25s ease;
        }

        .header_like_button svg {
          display: block;
          width: 24px;
          height: 24px;
          stroke: currentColor;
          fill: none;
          transition:
            stroke 0.25s ease,
            transform 0.25s ease;
        }

        .header_like_button:hover {
          color: #65000b;
        }

        .header_like_button:hover svg {
          transform: scale(1.1);
        }

        .header_like_button:focus-visible {
          outline: 2px solid #65000b;
          outline-offset: 3px;
        }

        .desktop_actions .header_like_button,
        .mobile_header_actions .header_like_button {
          display: inline-flex !important;
          visibility: visible !important;
          opacity: 1 !important;
        }

        @media (max-width: 1240px) {
          .mobile_header_actions .header_like_button {
            width: 34px;
            height: 36px;
            min-width: 34px;
          }

          .mobile_header_actions .header_like_button svg {
            width: 22px;
            height: 22px;
          }
        }

        @media (max-width: 600px) {
          .mobile_header_actions .header_like_button {
            width: 30px;
            height: 34px;
            min-width: 30px;
          }

          .mobile_header_actions .header_like_button svg {
            width: 21px;
            height: 21px;
          }
        }

        @media (max-width: 360px) {
          .mobile_header_actions .header_like_button {
            width: 27px;
            min-width: 27px;
          }

          .mobile_header_actions .header_like_button svg {
            width: 19px;
            height: 19px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .header_like_button,
          .header_like_button svg {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}