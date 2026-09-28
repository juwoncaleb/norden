import React from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "./component/Header";
import Footer from "./component/footer";
import styles from "../styles/_sitemap.module.scss";

const groups = [
  {
    title: "Living Room",
    links: [
      { label: "All Sofas", href: "/sofa" },
      { label: "Armchairs", href: "/armchair" },
      { label: "Ottomans", href: "/ottomans" },
      { label: "Coffee Tables", href: "/coffeetable" },
      { label: "Side Tables", href: "/sidetable" },
      { label: "TV Units", href: "/tvunit" },
      { label: "Living Consoles", href: "/livingconsole" },
      { label: "Consoles", href: "/consoles" },
    ],
  },
  {
    title: "Dining",
    links: [
      { label: "Dining Tables", href: "/diningtable" },
      { label: "Dining Chairs", href: "/diningchairs" },
      { label: "Bar & Stools", href: "/bar" },
      { label: "Benches", href: "/benches" },
    ],
  },
  {
    title: "Bedroom",
    links: [
      { label: "All Beds", href: "/beds" },
      { label: "Bedside Tables", href: "/bedsidetable" },
      { label: "Dressers", href: "/dresser" },
    ],
  },
  {
    title: "Decor",
    links: [
      { label: "Lighting", href: "/lighting" },
      { label: "Mirrors", href: "/mirrors" },
      { label: "Vases", href: "/vase" },
      { label: "Sculptural Pieces", href: "/sculpturalpieces" },
      { label: "Accessories", href: "/accessories" },
    ],
  },
  {
    title: "Collections",
    links: [
      { label: "Signature Collection", href: "/signature" },
      { label: "Custom Orders", href: "/custom" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Delivery", href: "/delivery" },
    ],
  },
];

export default function Sitemap() {
  return (
    <div className={styles.page}>
      <Head>
        <title>Sitemap</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Header />

      <main className={styles.main}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">&gt;</span>
          <span>Sitemap</span>
        </nav>

        <h1 className={styles.title}>Sitemap</h1>

        <h2 className={styles.heading}>Category</h2>

        <div className={styles.grid}>
          {groups.map((group) => (
            <section key={group.title} className={styles.group}>
              <h3 className={styles.groupTitle}>{group.title}</h3>
              <ul>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}