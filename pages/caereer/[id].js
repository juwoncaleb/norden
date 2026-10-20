
import Link from "next/link";
import Head from "next/head";
import { documentToReactComponents } from
  "@contentful/rich-text-react-renderer";

import {
  getAllJobs,
  getJobById,
} from "../../lib/contentful";

export default function CareerDetails({ job }) {
  const fields = job.fields;

  const email = "careers@example.com"; // Replace with your recruitment email.

  const subject = `Application for ${fields.title || "Open Position"}`;

  const body = `Hello,

I would like to apply for the ${fields.title || "open position"} role.

Please find my CV attached.

Thank you.`;

  const mailto = `mailto:${email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  return (
    <>
      <Head>
        <title>{fields.title} | Careers</title>
        <meta
          name="description"
          content={`Learn more about the ${fields.title} position and apply to join our team.`}
        />
      </Head>

      <main className="careers-page">
        <article className="job-detail">
          <Link href="/career" className="back-link">
            ← All Careers
          </Link>

          <header className="job-detail-header">
            {fields.department && (
              <p className="careers-eyebrow">
                {fields.department}
              </p>
            )}

            <h1>{fields.title}</h1>

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
                {documentToReactComponents(fields.responsibilities)}
              </div>
            </section>
          )}

          {fields.qualifications && (
            <section className="job-content-section">
              <h2>Qualifications</h2>
              <div className="rich-text">
                {documentToReactComponents(fields.qualifications)}
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
              Your email application will open in your default
              email app. Remember to attach your CV before sending.
            </p>
          </section>
        </article>
      </main>
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
