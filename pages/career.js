import Link from "next/link";
import { Cormorant_Garamond } from "next/font/google";

import Header from "./component/Header";
import Footer from "./component/footer";
import { getAllJobs } from "../lib/contentful";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function JoinUs({ jobs = [] }) {
  return (
    <div className={cormorant.className}>
      <Header />

      <main className="join">
        <section className="join-text">
          <h1>Come join us!</h1>

          <p>
            At Norden, we design and make quality, beautiful furniture
            for real life: the kind that helps people shape spaces they
            can truly live in, grow in, and feel good coming home to.
          </p>

          <p>
            We take pride in manufacturing our own pieces, and we bring
            that same care to the way we work. We are building Norden
            with the same ambition we bring to our designs: creating
            something better, more thoughtful, and made to last.
          </p>

          <p>
            We are growing and looking for people who want to build
            something with real staying power. Around here, good ideas
            are heard, initiative goes far, and ambitious self-starters
            have room to make their mark.
          </p>

          <p>
            If making an impact gets you out of bed in the morning,
            come join us.
          </p>

          <a href="#open-positions" className="join-btn">
            See Open Positions
          </a>
        </section>

        {/* Jobs retrieved from Contentful */}
        <section id="open-positions" className="positions">
          <div className="positions-heading">
            <p className="eyebrow">CAREERS AT NORDEN</p>
            <h2>Open Positions</h2>
            <p>Find your next opportunity and grow with us.</p>
          </div>

          {jobs.length === 0 ? (
            <p className="no-jobs">
              There are no open positions at the moment.
              Please check back soon.
            </p>
          ) : (
            jobs.map((job) => {
              const fields = job.fields || {};

              return (
                <Link
                  href={`/career/${job.sys.id}`}
                  className="job-link"
                  key={job.sys.id}
                >
                  <div className="job-info">
                    <h3>
                      {fields.title || "Open Position"}

                      {fields.isNew && (
                        <span className="new-badge">New</span>
                      )}
                    </h3>

                    <p>
                      {[
                        fields.department,
                        fields.location,
                        fields.employmentType,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>

                  <span
                    className="job-arrow"
                    aria-hidden="true"
                  >
                    ↗
                  </span>
                </Link>
              );
            })
          )}
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .join {
          background: #faf9f6;
          color: #3a1020;
        }

        .join-text {
          max-width: 1000px;
          margin: 0 auto;
          padding: clamp(48px, 7vw, 90px)
            clamp(20px, 5vw, 60px);
        }

        .join-text h1 {
          margin: 0 0 36px;
          font-weight: 400;
          font-size: clamp(2.4rem, 5vw, 3.6rem);
          line-height: 1.1;
        }

        .join-text > p {
          max-width: 850px;
          margin: 0 0 24px;
          font-size: clamp(1.1rem, 1.6vw, 1.3rem);
          line-height: 1.7;
        }

        .join-btn {
          display: inline-block;
          margin-top: 16px;
          padding: 15px 26px;
          border: 1px solid #3a1020;
          color: #3a1020;
          text-decoration: none;
          font-size: 1.1rem;
          transition: background 0.2s, color 0.2s;
        }

        .join-btn:hover {
          background: #3a1020;
          color: #fff;
        }

        .positions {
          scroll-margin-top: 30px;
          padding: 70px clamp(20px, 5vw, 60px) 90px;
          background: #fff;
          color: #3a1020;
        }

        .positions-heading {
          max-width: 1000px;
          margin: 0 auto 42px;
        }

        .eyebrow {
          color: #a45f3a;
          font-size: 0.8rem;
          letter-spacing: 2px;
        }

        .positions-heading h2 {
          margin: 12px 0;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 400;
        }

        .positions-heading > p:last-child {
          color: #74665c;
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .job-link {
          display: flex;
          max-width: 1000px;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin: 0 auto;
          padding: 24px 0;
          border-bottom: 1px solid #e3ddd7;
          color: #3a1020;
          text-decoration: none;
          transition: color 0.2s;
        }

        .positions-heading + .job-link {
          border-top: 1px solid #e3ddd7;
        }

        .job-link:hover {
          color: #a45f3a;
        }

        .job-info {
          min-width: 0;
        }

        .job-info h3 {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
          margin: 0 0 8px;
          font-size: clamp(1.15rem, 2.5vw, 1.5rem);
          font-weight: 400;
          line-height: 1.5;
        }

        .job-info p {
          margin: 0;
          color: #786d64;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .new-badge {
          display: inline-block;
          padding: 5px 8px;
          background: #b96337;
          color: #fff;
          font-family: Arial, sans-serif;
          font-size: 0.65rem;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .job-arrow {
          flex-shrink: 0;
          font-size: 1.5rem;
        }

        .no-jobs {
          max-width: 1000px;
          margin: 0 auto;
          padding: 28px 0;
          border-top: 1px solid #e3ddd7;
          color: #74665c;
          line-height: 1.7;
        }

        @media (max-width: 600px) {
          .join-text {
            padding: 42px 20px 55px;
          }

          .join-text > p {
            line-height: 1.65;
          }

          .join-btn {
            display: block;
            width: 100%;
            box-sizing: border-box;
            text-align: center;
          }

          .positions {
            padding: 48px 20px 60px;
          }

          .job-link {
            padding: 20px 0;
            gap: 12px;
          }

          .job-info p {
            font-size: 0.85rem;
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
      jobs,
    },
    revalidate: 60,
  };
}