import Link from "next/link";
import Head from "next/head";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

import {
  getAllJobs,
  getJobById,
} from "../../lib/contentful";

export default function CareerDetails({ job }) {
  if (!job) return null;

  const fields = job.fields || {};

  // Replace this with your actual recruitment email.
  const email = "careers@example.com";

  const jobTitle = fields.title || "Open Position";
  const subject = `Application for ${jobTitle}`;

  const body = `Hello,

I would like to apply for the ${jobTitle} role.

Please find my CV attached.

Thank you.`;

  const mailto = `mailto:${email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  return (
    <>
      <Head>
        <title>{jobTitle} | Norden Careers</title>
        <meta
          name="description"
          content={`Learn more about the ${jobTitle} position at Norden and apply to join our team.`}
        />
      </Head>

      <main className="careers-page">
        <article className="job-detail">
          <Link href="/join-us" className="back-link">
            ← Back to Careers
          </Link>

          <header className="job-detail-header">
            {fields.department && (
              <p className="careers-eyebrow">
                {fields.department}
              </p>
            )}

            <h1>{jobTitle}</h1>

            <p className="job-detail-meta">
              {[
                fields.location,
                fields.employmentType,
                fields.category,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>

            {fields.isNew && (
              <span className="new-badge">New</span>
            )}
          </header>

          {fields.description && (
            <section className="job-content-section">
              <h2>About the Role</h2>
              <div className="rich-text">
                {documentToReactComponents(fields.description)}
              </div>
            </section>
          )}

          {fields.responsibilities && (
            <section className="job-content-section">
              <h2>Responsibilities</h2>
              <div className="rich-text">
                {documentToReactComponents(
                  fields.responsibilities
                )}
              </div>
            </section>
          )}

          {fields.qualifications && (
            <section className="job-content-section">
              <h2>Qualifications</h2>
              <div className="rich-text">
                {documentToReactComponents(
                  fields.qualifications
                )}
              </div>
            </section>
          )}

          {fields.benefits && (
            <section className="job-content-section">
              <h2>Benefits</h2>
              <div className="rich-text">
                {documentToReactComponents(fields.benefits)}
              </div>
            </section>
          )}

          <section className="apply-section">
            <h2>Ready to join us?</h2>
            <p>
              Send us your CV and take the next step in your career.
            </p>

            <a href={mailto} className="apply-button">
              Apply Now
            </a>

            <p className="apply-note">
              Your default email app will open with a draft
              application. Attach your CV before sending.
            </p>
          </section>
        </article>
      </main>

      <style jsx>{`
        .careers-page {
          min-height: 70vh;
          padding: 60px 20px 90px;
          background: #faf9f6;
          color: #3a1020;
        }

        .job-detail {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
        }

        .back-link {
          display: inline-block;
          margin-bottom: 35px;
          color: #3a1020;
          text-decoration: none;
        }

        .back-link:hover {
          color: #a45f3a;
        }

        .job-detail-header {
          padding-bottom: 32px;
          border-bottom: 1px solid #e3ddd7;
        }

        .careers-eyebrow {
          margin: 0 0 12px;
          color: #a45f3a;
          font-size: 0.85rem;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .job-detail-header h1 {
          margin: 0 0 18px;
          font-size: clamp(2.2rem, 5vw, 3.7rem);
          font-weight: 400;
          line-height: 1.15;
        }

        .job-detail-meta {
          color: #786d64;
          line-height: 1.7;
        }

        .new-badge {
          display: inline-block;
          margin-top: 8px;
          padding: 5px 9px;
          background: #b96337;
          color: #fff;
          font-size: 0.7rem;
          text-transform: uppercase;
        }

        .job-content-section {
          padding: 30px 0;
          border-bottom: 1px solid #e3ddd7;
        }

        .job-content-section h2,
        .apply-section h2 {
          margin: 0 0 18px;
          font-size: clamp(1.4rem, 3vw, 2rem);
          font-weight: 400;
        }

        .rich-text {
          color: #51463f;
          font-size: 1.05rem;
          line-height: 1.85;
          overflow-wrap: anywhere;
        }

        .apply-section {
          padding: 38px 0 0;
        }

        .apply-section > p {
          color: #74665c;
          line-height: 1.7;
        }

        .apply-button {
          display: inline-block;
          margin-top: 12px;
          padding: 15px 28px;
          background: #3a1020;
          color: #fff;
          text-decoration: none;
          transition: background 0.2s;
        }

        .apply-button:hover {
          background: #a45f3a;
        }

        .apply-note {
          max-width: 600px;
          margin-top: 18px;
          font-size: 0.9rem;
        }

        @media (max-width: 600px) {
          .careers-page {
            padding: 40px 20px 60px;
          }

          .job-detail-header h1 {
            font-size: 2.2rem;
          }

          .rich-text {
            font-size: 1rem;
          }

          .apply-button {
            width: 100%;
            box-sizing: border-box;
            text-align: center;
          }
        }
      `}</style>
    </>
  );
}

export async function getStaticPaths() {
  const jobs = await getAllJobs();

  return {
    paths: jobs.map((job) => ({
      params: {
        id: job.sys.id,
      },
    })),
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const job = await getJobById(params.id);

  if (!job) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      job,
    },
    revalidate: 60,
  };
}