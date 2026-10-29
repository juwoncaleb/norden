
import React from "react";
import Head from "next/head";
import Link from "next/link";

import Header from "./component/Header";
import Footer from "./component/footer";

import { getAllJobs } from "../lib/contentful";

export default function Career({ jobs = [] }) {
  return (
    <div className="career-page">
      <Head>
        <title>Careers | Norden</title>
        <meta
          name="description"
          content="Explore career opportunities at Norden."
        />

        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Header />

      <main>
        {/* CAREERS HERO */}
        <section className="career-hero">
          <div className="career-hero-content">
            <p className="eyebrow">CAREERS AT NORDEN</p>

            <h1>
              Build something
              <br />
              meaningful with us.
            </h1>

            <p className="hero-description">
              Join our team and help us create thoughtful spaces,
              meaningful experiences, and exceptional products.
            </p>

            <a
              href="#open-positions"
              className="positions-button"
            >
              See Open Positions
            </a>
          </div>
        </section>

        {/* OPEN POSITIONS */}
        <section
          id="open-positions"
          className="open-positions"
        >
          <div className="section-heading">
            <p className="eyebrow">JOIN OUR TEAM</p>
            <h2>Open Positions</h2>
            <p>
              Explore our available roles and find an
              opportunity that suits you.
            </p>
          </div>

          {jobs.length > 0 ? (
            <div className="jobs-list">
              {jobs.map((job) => {
                const fields = job.fields || {};

                return (
                  <Link
                    href={`/career/${job.sys.id}`}
                    className="job-card"
                    key={job.sys.id}
                  >
                    <div className="job-main">
                      <div className="job-title-row">
                        <h3>
                          {fields.title ||
                            "Untitled position"}
                        </h3>

                        {fields.isNew && (
                          <span className="new-badge">
                            New
                          </span>
                        )}
                      </div>

                      <p className="job-meta">
                        {[
                          fields.location,
                          fields.employmentType,
                        ]
                          .filter(Boolean)
                          .join(" · ") ||
                          "Details available"}
                      </p>

                      {fields.department && (
                        <p className="job-department">
                          {fields.department}
                        </p>
                      )}
                    </div>

                    <span
                      className="job-arrow"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="no-jobs">
              <h3>
                No open positions at the moment
              </h3>
              <p>
                We do not have any published vacancies
                right now. Please check back soon.
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .career-page {
          font-family: "Cormorant Garamond", Georgia, serif;
        }

        .career-hero {
          background: #f5f2ed;
          min-height: 480px;
          padding: 100px 8%;
          display: flex;
          align-items: center;
        }

        .career-hero-content {
          max-width: 780px;
        }

        .eyebrow {
          font-family: Arial, sans-serif;
          font-size: 12px;
          letter-spacing: 2px;
          margin-bottom: 20px;
        }

        .career-hero h1 {
          font-size: clamp(42px, 6vw, 76px);
          line-height: 1.08;
          font-weight: 500;
          margin: 0 0 24px;
        }

        .hero-description {
          max-width: 560px;
          font-size: 19px;
          line-height: 1.7;
          margin-bottom: 32px;
        }

        .positions-button {
          display: inline-block;
          background: #222;
          color: #fff;
          text-decoration: none;
          padding: 15px 25px;
          font-family: Arial, sans-serif;
          font-size: 14px;
          transition: background 0.2s ease;
        }

        .positions-button:hover {
          background: #555;
        }

        .open-positions {
          padding: 85px 8% 100px;
          scroll-margin-top: 30px;
        }

        .section-heading {
          margin-bottom: 35px;
        }

        .section-heading h2 {
          font-size: clamp(36px, 5vw, 54px);
          font-weight: 500;
          margin: 0 0 12px;
        }

        .section-heading > p:last-child {
          font-size: 18px;
          line-height: 1.6;
        }

        .jobs-list {
          border-top: 1px solid #ddd;
        }

        .job-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 27px 5px;
          border-bottom: 1px solid #ddd;
          color: inherit;
          text-decoration: none;
          transition: padding 0.2s ease;
        }

        .job-card:hover {
          padding-left: 12px;
          padding-right: 12px;
        }

        .job-title-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .job-title-row h3 {
          font-size: clamp(23px, 3vw, 30px);
          font-weight: 500;
          margin: 0;
        }

        .new-badge {
          background: #e9e4db;
          padding: 5px 9px;
          font-family: Arial, sans-serif;
          font-size: 11px;
        }

        .job-meta {
          font-family: Arial, sans-serif;
          color: #666;
          font-size: 14px;
          margin: 10px 0 0;
        }

        .job-department {
          font-family: Arial, sans-serif;
          color: #666;
          font-size: 13px;
          margin: 7px 0 0;
        }

        .job-arrow {
          font-size: 27px;
          flex-shrink: 0;
        }

        .no-jobs {
          padding: 35px 0;
          border-top: 1px solid #ddd;
          border-bottom: 1px solid #ddd;
        }

        .no-jobs h3 {
          font-size: 25px;
          font-weight: 500;
        }

        .no-jobs p {
          font-size: 17px;
          line-height: 1.6;
        }

        @media (max-width: 600px) {
          .career-hero {
            min-height: 400px;
            padding: 70px 6%;
          }

          .open-positions {
            padding: 65px 6%;
          }

          .hero-description {
            font-size: 17px;
          }

          .job-card {
            padding: 23px 0;
          }
        }
      `}</style>
    </div>
  );
}

export async function getStaticProps() {
  const jobs = await getAllJobs();

  return {
    props: {
      jobs: JSON.parse(JSON.stringify(jobs || [])),
    },
    revalidate: 60,
  };
}
