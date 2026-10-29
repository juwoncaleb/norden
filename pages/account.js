
import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

import Header from "./component/Header";
import Footer from "./component/footer";

const menuItems = [
  { name: "My Account", href: "/account", icon: "user" },
  { name: "My Orders", href: "/orders", icon: "package" },
  { name: "My Likes", href: "/likes", icon: "heart" },
  { name: "Help & Support", href: "/contact", icon: "help" },
];

function Icon({ name, size = 20 }) {
  const icons = {
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3-6 8-6s8 2 8 6" />
      </>
    ),
    package: (
      <>
        <path d="m3 7 9-4 9 4v10l-9 4-9-4V7Z" />
        <path d="m3 7 9 4 9-4M12 11v10" />
      </>
    ),
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
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
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    logout: (
      <>
        <path d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5" />
        <path d="m14 16 4-4-4-4M8 12h10" />
      </>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name] || icons.user}
    </svg>
  );
}

function QuickCard({ icon, title, description, href }) {
  return (
    <Link href={href} className="account-quick-card">
      <div className="account-card-top">
        <span className="account-card-icon">
          <Icon name={icon} size={25} />
        </span>
        <Icon name="arrow" size={19} />
      </div>

      <h3>{title}</h3>
      <p>{description}</p>
    </Link>
  );
}

export default function Account() {
  const { data: session, status } = useSession();

  const user = session?.user;
  const firstName = user?.name?.trim().split(/\s+/)[0] || "there";

  return (
    <>
      <Head>
        <title>My Account | NÓRDEN</title>
        <meta
          name="description"
          content="Manage your NÓRDEN account, orders and saved furniture."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <Header />

      <main className="norden-account">
        <div className="account-container">
          <div className="account-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>My Account</span>
          </div>

          {status === "loading" ? (
            <div className="account-loading">
              Loading your account...
            </div>
          ) : !session ? (
            <div className="account-login">
              <span className="account-eyebrow">
                THE NÓRDEN EXPERIENCE
              </span>

              <h1>Your space, your NÓRDEN.</h1>

              <p>
                Sign in to manage your account, revisit your
                favourite furniture and enjoy a more personal
                shopping experience.
              </p>

              <button
                type="button"
                onClick={() =>
                  signIn("google", { callbackUrl: "/account" })
                }
              >
                Continue with Google
              </button>

              <Link href="/">Continue Shopping</Link>
            </div>
          ) : (
            <>
              <div className="account-page-heading">
                <span className="account-eyebrow">
                  YOUR PERSONAL SPACE
                </span>

                <h1>My Account</h1>

                <p>
                  Everything you love about NÓRDEN, all in one place.
                </p>
              </div>

              <div className="account-layout">
                {/* SIDEBAR */}
                <aside className="account-sidebar">
                  <div className="account-sidebar-user">
                    <div className="account-avatar">
                      {user?.image ? (
                        <img
                          src={user.image}
                          alt=""
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <Icon name="user" size={28} />
                      )}
                    </div>

                    <div className="account-user-info">
                      <strong>
                        {user?.name || "NÓRDEN Customer"}
                      </strong>
                      <span>{user?.email}</span>
                    </div>
                  </div>

                  <nav className="account-sidebar-links">
                    {menuItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={
                          item.href === "/account"
                            ? "account-side-link active"
                            : "account-side-link"
                        }
                      >
                        <Icon name={item.icon} size={19} />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </nav>

                  <button
                    type="button"
                    className="account-logout"
                    onClick={() =>
                      signOut({ callbackUrl: "/" })
                    }
                  >
                    <Icon name="logout" size={19} />
                    Log Out
                  </button>
                </aside>

                {/* MAIN DASHBOARD */}
                <div className="account-main">
                  <section className="account-welcome">
                    <div className="account-welcome-content">
                      <span className="account-eyebrow">
                        WELCOME TO NÓRDEN
                      </span>

                      <h2>Good to see you, {firstName}.</h2>

                      <p>
                        Discover thoughtfully made furniture,
                        revisit the pieces you love and manage
                        your NÓRDEN experience from here.
                      </p>

                      <Link href="/sofa">
                        Explore the Collection
                        <Icon name="arrow" size={18} />
                      </Link>
                    </div>

                    <span className="account-watermark">N</span>
                  </section>

                  {/* PERSONAL INFORMATION */}
                  <section className="account-section">
                    <div className="account-section-heading">
                      <span className="account-eyebrow">
                        PERSONAL INFORMATION
                      </span>
                      <h2>Account Details</h2>
                    </div>

                    <div className="account-details">
                      <div className="account-detail-row">
                        <span>Full Name</span>
                        <strong>
                          {user?.name || "Not provided"}
                        </strong>
                      </div>

                      <div className="account-detail-row">
                        <span>Email Address</span>
                        <strong>
                          {user?.email || "Not provided"}
                        </strong>
                      </div>

                      <div className="account-detail-row">
                        <span>Sign-in Method</span>
                        <strong>Google</strong>
                      </div>

                      <p className="account-detail-note">
                        Your name and email are provided by your
                        connected Google account.
                      </p>
                    </div>
                  </section>

                  {/* QUICK LINKS */}
                  <section className="account-section">
                    <div className="account-section-heading">
                      <span className="account-eyebrow">
                        YOUR NÓRDEN EXPERIENCE
                      </span>
                      <h2>Explore Your Account</h2>
                    </div>

                    <div className="account-quick-grid">
                      <QuickCard
                        icon="package"
                        title="My Orders"
                        description="Review your purchases and order history."
                        href="/orders"
                      />

                      <QuickCard
                        icon="heart"
                        title="My Likes"
                        description="Find the furniture and objects you've saved."
                        href="/likes"
                      />

                  
                    </div>
                  </section>

                  {/* SUPPORT */}
                  <section className="account-support">
                    <div>
                      <span className="account-eyebrow">
                        HERE TO HELP
                      </span>

                      <h2>Need a little assistance?</h2>

                      <p>
                        Have questions about your order or our
                        furniture? We are here to help.
                      </p>
                    </div>

                    <Link href="/contact">
                      Contact Support
                      <Icon name="arrow" size={18} />
                    </Link>
                  </section>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />

      <style jsx global>{`
        .norden-account {
          min-height: 80vh;
          padding: 45px 0 100px;
          background: #fbf9f4;
          color: #292523;
          font-family: "Radley", Georgia, serif;
        }

        .norden-account *,
        .norden-account *::before,
        .norden-account *::after {
          box-sizing: border-box;
        }

        .account-container {
          width: min(1380px, 90%);
          margin: 0 auto;
        }

        .account-breadcrumb {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 60px;
          color: #817973;
          font-family: Arial, sans-serif;
          font-size: 12px;
        }

        .account-breadcrumb a {
          color: inherit;
          text-decoration: none;
        }

        .account-breadcrumb a:hover {
          color: #3c101e;
        }

        .account-eyebrow {
          display: block;
          color: #3c101e;
          font-family: Arial, sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 2px;
        }

        .account-page-heading {
          margin-bottom: 45px;
        }

        .account-page-heading h1 {
          margin: 15px 0 12px;
          font-size: clamp(42px, 5vw, 65px);
          font-weight: 400;
          line-height: 1.1;
        }

        .account-page-heading p {
          color: #817973;
          font-family: Arial, sans-serif;
          font-size: 14px;
        }

        .account-layout {
          display: grid;
          grid-template-columns: 285px minmax(0, 1fr);
          gap: 45px;
          align-items: start;
        }

        /* SIDEBAR */

        .account-sidebar {
          background: #fff;
          border: 1px solid #e9e2d8;
        }

        .account-sidebar-user {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 25px 20px;
          border-bottom: 1px solid #e9e2d8;
        }

        .account-avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 54px;
          height: 54px;
          flex-shrink: 0;
          border-radius: 50%;
          overflow: hidden;
          background: #f6f3e7;
          color: #3c101e;
        }

        .account-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .account-user-info {
          display: flex;
          flex-direction: column;
          gap: 5px;
          min-width: 0;
        }

        .account-user-info strong {
          font-size: 16px;
          font-weight: 400;
          overflow-wrap: anywhere;
        }

        .account-user-info span {
          color: #817973;
          font-family: Arial, sans-serif;
          font-size: 10px;
          overflow-wrap: anywhere;
        }

        .account-sidebar-links {
          padding: 15px 0;
        }

        .account-side-link {
          display: flex;
          align-items: center;
          gap: 15px;
          min-height: 53px;
          padding: 12px 22px;
          color: #403a36;
          font-size: 15px;
          text-decoration: none;
          transition: 0.2s ease;
        }

        .account-side-link:hover {
          background: #f6f3e7;
          color: #3c101e;
        }

        .account-side-link.active {
          background: #f4eeeb;
          border-left: 3px solid #3c101e;
          padding-left: 19px;
          color: #3c101e;
        }

        .account-logout {
          display: flex;
          align-items: center;
          gap: 15px;
          width: 100%;
          padding: 20px 22px;
          border: 0;
          border-top: 1px solid #e9e2d8;
          background: transparent;
          color: #3c101e;
          font-family: "Radley", Georgia, serif;
          font-size: 15px;
          text-align: left;
          cursor: pointer;
        }

        .account-logout:hover {
          background: #f4eeeb;
        }

        /* WELCOME */

        .account-main {
          min-width: 0;
        }

        .account-welcome {
          position: relative;
          display: flex;
          align-items: center;
          min-height: 285px;
          padding: 45px 50px;
          margin-bottom: 55px;
          overflow: hidden;
          background: #3c101e;
          color: #fff;
        }

        .account-welcome-content {
          position: relative;
          z-index: 2;
          max-width: 540px;
        }

        .account-welcome .account-eyebrow {
          color: #e5c9c5;
        }

        .account-welcome h2 {
          margin: 15px 0;
          font-size: clamp(30px, 3vw, 43px);
          font-weight: 400;
          line-height: 1.2;
        }

        .account-welcome p {
          max-width: 440px;
          margin: 0;
          color: #e4d6d6;
          font-family: Arial, sans-serif;
          font-size: 13px;
          line-height: 1.9;
        }

        .account-welcome-content a {
          display: inline-flex;
          align-items: center;
          gap: 15px;
          margin-top: 25px;
          padding-bottom: 7px;
          border-bottom: 1px solid #e6d3d3;
          color: #fff;
          font-size: 15px;
          text-decoration: none;
        }

        .account-watermark {
          position: absolute;
          right: 20px;
          bottom: -95px;
          color: rgba(255, 255, 255, 0.055);
          font-family: Georgia, serif;
          font-size: 370px;
          line-height: 1;
          pointer-events: none;
        }

        /* SECTIONS */

        .account-section {
          margin-bottom: 60px;
        }

        .account-section-heading {
          margin-bottom: 22px;
        }

        .account-section-heading h2 {
          margin: 10px 0 0;
          font-size: 30px;
          font-weight: 400;
        }

        .account-details {
          background: #fff;
          border: 1px solid #e9e2d8;
        }

        .account-detail-row {
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-height: 90px;
          padding: 20px 28px;
          border-bottom: 1px solid #e9e2d8;
        }

        .account-detail-row span {
          color: #817973;
          font-family: Arial, sans-serif;
          font-size: 11px;
        }

        .account-detail-row strong {
          color: #292523;
          font-family: Arial, sans-serif;
          font-size: 14px;
          font-weight: 500;
          overflow-wrap: anywhere;
        }

        .account-detail-note {
          margin: 0;
          padding: 18px 28px;
          color: #817973;
          background: #fcfaf7;
          font-family: Arial, sans-serif;
          font-size: 11px;
          line-height: 1.8;
        }

        /* QUICK CARDS */

        .account-quick-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .account-quick-card {
          display: block;
          min-height: 205px;
          padding: 28px;
          background: #fff;
          border: 1px solid #e9e2d8;
          color: #292523;
          text-decoration: none;
          transition: 0.2s ease;
        }

        .account-quick-card:hover {
          border-color: #cbb5b7;
          transform: translateY(-3px);
          box-shadow: 0 12px 25px rgba(60, 16, 30, 0.05);
        }

        .account-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #3c101e;
        }

        .account-card-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 46px;
          height: 46px;
          background: #f6efec;
        }

        .account-quick-card h3 {
          margin: 22px 0 9px;
          font-size: 22px;
          font-weight: 400;
        }

        .account-quick-card p {
          margin: 0;
          color: #817973;
          font-family: Arial, sans-serif;
          font-size: 12px;
          line-height: 1.8;
        }

        /* SUPPORT */

        .account-support {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          padding: 35px 38px;
          background: #f6f3e7;
          border: 1px solid #e9e2d8;
        }

        .account-support h2 {
          margin: 10px 0;
          font-size: 27px;
          font-weight: 400;
        }

        .account-support p {
          max-width: 440px;
          margin: 0;
          color: #817973;
          font-family: Arial, sans-serif;
          font-size: 12px;
          line-height: 1.8;
        }

        .account-support > a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          flex-shrink: 0;
          min-height: 48px;
          padding: 12px 22px;
          background: #3c101e;
          color: white;
          font-size: 14px;
          text-decoration: none;
        }

        .account-support > a:hover {
          background: #5b1b30;
        }

        /* LOGIN */

        .account-login {
          max-width: 620px;
          margin: 40px auto 100px;
          padding: 65px 40px;
          background: #fff;
          border: 1px solid #e9e2d8;
          text-align: center;
        }

        .account-login h1 {
          margin: 20px 0;
          font-size: clamp(36px, 5vw, 55px);
          font-weight: 400;
        }

        .account-login p {
          max-width: 410px;
          margin: 0 auto 30px;
          color: #817973;
          font-family: Arial, sans-serif;
          font-size: 13px;
          line-height: 1.9;
        }

        .account-login button {
          display: block;
          margin: 0 auto 25px;
          padding: 15px 35px;
          background: #3c101e;
          border: 1px solid #3c101e;
          color: #fff;
          font-family: "Radley", Georgia, serif;
          font-size: 16px;
          cursor: pointer;
        }

        .account-login > a {
          color: #3c101e;
          font-size: 14px;
          text-decoration: underline;
        }

        .account-loading {
          padding: 100px 20px;
          text-align: center;
          color: #817973;
        }

        /* RESPONSIVE */

        @media (max-width: 1100px) {
          .account-layout {
            grid-template-columns: 240px minmax(0, 1fr);
            gap: 25px;
          }

          .account-welcome {
            padding: 35px;
          }
        }

        @media (max-width: 800px) {
          .account-layout {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .account-sidebar-links {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            padding: 10px;
          }

          .account-side-link {
            padding: 12px;
          }

          .account-side-link.active {
            padding-left: 9px;
          }
        }

        @media (max-width: 600px) {
          .norden-account {
            padding: 25px 0 55px;
          }

          .account-container {
            width: 92%;
          }

          .account-breadcrumb {
            margin-bottom: 35px;
          }

          .account-page-heading h1 {
            font-size: 42px;
          }

          .account-sidebar-user {
            padding: 20px;
          }

          .account-side-link {
            gap: 9px;
            min-height: 47px;
            font-size: 13px;
          }

          .account-welcome {
            min-height: 270px;
            padding: 30px 25px;
            margin-bottom: 40px;
          }

          .account-welcome h2 {
            font-size: 32px;
          }

          .account-watermark {
            right: -25px;
            bottom: -50px;
            font-size: 250px;
          }

          .account-section-heading h2 {
            font-size: 27px;
          }

          .account-detail-row {
            padding: 18px 20px;
          }

          .account-quick-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .account-quick-card {
            min-height: 165px;
            padding: 23px;
          }

          .account-support {
            flex-direction: column;
            align-items: flex-start;
            padding: 28px 25px;
          }

          .account-support > a {
            width: 100%;
          }

          .account-login {
            padding: 45px 25px;
          }
        }
      `}</style>
    </>
  );
}
