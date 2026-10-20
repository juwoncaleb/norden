
import Head from "next/head";
import Link from "next/link";

import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types";

import { getAllJobs, getJobById } from "../../lib/contentful";

const richTextOptions = {
  renderMark: {
    [MARKS.BOLD]: (text) => <strong>{text}</strong>,
    [MARKS.ITALIC]: (text) => <em>{text}</em>,
    [MARKS.UNDERLINE]: (text) => <u>{text}</u>,
    [MARKS.CODE]: (text) => <code className="inline-code">{text}</code>,
  },

  renderNode: {
    [BLOCKS.PARAGRAPH]: (_, children) => (
      <p className="rt-paragraph">{children}</p>
    ),

    [BLOCKS.HEADING_1]: (_, children) => (
      <h2 className="rt-heading rt-heading-1">{children}</h2>
    ),

    [BLOCKS.HEADING_2]: (_, children) => (
      <h2 className="rt-heading">{children}</h2>
    ),

    [BLOCKS.HEADING_3]: (_, children) => (
      <h3 className="rt-heading rt-heading-3">{children}</h3>
    ),

    [BLOCKS.HEADING_4]: (_, children) => (
      <h4 className="rt-heading rt-heading-4">{children}</h4>
    ),

    [BLOCKS.UL_LIST]: (_, children) => (
      <ul className="rt-list">{children}</ul>
    ),

    [BLOCKS.OL_LIST]: (_, children) => (
      <ol className="rt-list rt-ordered-list">{children}</ol>
    ),

    [BLOCKS.LIST_ITEM]: (_, children) => (
      <li>{children}</li>
    ),

    [BLOCKS.QUOTE]: (_, children) => (
      <blockquote className="rt-quote">{children}</blockquote>
    ),

    [BLOCKS.HR]: () => <hr className="rt-divider" />,

    [INLINES.HYPERLINK]: (node, children) => {
      const url = node.data.uri;
      const isExternal = /^https?:\/\//i.test(url);

      return (
        <a
          href={url}
          className="rt-link"
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    },

    [INLINES.ENTRY_HYPERLINK]: (node, children) => (
      <Link
        href={`/careers/${node.data.target.sys.id}`}
        className="rt-link"
      >
        {children}
      </Link>
    ),
  },
};

function RichText({ content }) {
  if (!content) return null;

  return (
    <div className="rich-text">
      {documentToReactComponents(content, richTextOptions)}
    </div>
  );
}

export default function CareerDetails({ job }) {
  const fields = job.fields;

  // Replace with your actual recruitment email.
  const email = "careers@example.com";

  const subject = `Application for ${
    fields.title || "Open Position"
  }`;

  const body = `Hello,

I would like to apply for the ${
    fields.title || "open position"
  } role.

Please find my CV attached.

Thank you.`;

  const mailto =
    `mailto:${email}?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;

  return (
    <>
      <Head>
        <title>
          {fields.title || "Career Opportunity"} | Norden
        </title>

        <meta
          name="description"
          content={`Learn more about the ${
            fields.title || "open position"
          } position at Norden.`}
        />
      </Head>

      <main className="careers-page">
        <article className="job-detail">
          <Link href="/career" className="back-link">
            ← All Careers
          </Link>

          <header className="job-header">
            {fields.department && (
              <p className="eyebrow">{fields.department}</p>
            )}

            <h1>{fields.title || "Open Position"}</h1>

            <div className="job-meta">
              {[
                fields.location,
                fields.employmentType,
                fields.category,
              ]
                .filter(Boolean)
                .map((item, index) => (
                  <span key={`${item}-${index}`}>{item}</span>
                ))}
            </div>

            {fields.isNew && <span className="badge">New</span>}
          </header>

          {fields.description && (
            <section className="content-section">
              <h2>About the Role</h2>
              <RichText content={fields.description} />
            </section>
          )}

          {fields.responsibilities && (
            <section className="content-section">
              <h2>Responsibilities</h2>
              <RichText content={fields.responsibilities} />
            </section>
          )}

          {fields.qualifications && (
            <section className="content-section">
              <h2>Qualifications</h2>
              <RichText content={fields.qualifications} />
            </section>
          )}

          {fields.benefits && (
            <section className="content-section">
              <h2>Benefits</h2>
              <RichText content={fields.benefits} />
            </section>
          )}

          <section className="apply-section">
            <h2>Ready to join us?</h2>

            <p>
              Send us your CV and take the next step in your career.
            </p>

            <a href={mailto} className="apply-button">
              Apply Now <span aria-hidden="true">↗</span>
            </a>

            <p className="apply-note">
              Your email application will open in your default
              email app. Remember to attach your CV before sending.
            </p>
          </section>
        </article>
      </main>

      <style jsx>{`
        .careers-page {
          min-height: 100vh;
          padding: clamp(30px, 6vw, 80px) 20px;
          background: #faf9f6;
          color: #3a1020;
        }

        .job-detail {
          max-width: 850px;
          margin: 0 auto;
        }

        .back-link {
          display: inline-block;
          margin-bottom: 40px;
          color: #3a1020;
          text-decoration: none;
          transition: color 0.2s;
        }

        .back-link:hover {
          color: #a45f3a;
        }

        .job-header {
          padding-bottom: 35px;
          border-bottom: 1px solid #e3ddd7;
        }

        .eyebrow {
          margin-bottom: 12px;
          color: #a45f3a;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-size: 0.85rem;
        }

        .job-header h1 {
          margin: 12px 0 20px;
          font-size: clamp(2.3rem, 5vw, 4rem);
          font-weight: 400;
          line-height: 1.12;
          overflow-wrap: anywhere;
        }

        .job-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 20px 0;
        }

        .job-meta span {
          padding: 7px 12px;
          background: #eee8df;
          color: #62504c;
          font-size: 0.9rem;
        }

        .badge {
          display: inline-block;
          padding: 6px 10px;
          background: #a45f3a;
          color: white;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .content-section {
          padding: 34px 0;
          border-bottom: 1px solid #e3ddd7;
        }

        .content-section > h2,
        .apply-section h2 {
          margin: 0 0 22px;
          font-size: clamp(1.6rem, 3vw, 2.1rem);
          font-weight: 400;
          line-height: 1.3;
        }

        .rich-text {
          color: #594b49;
          font-size: 1.08rem;
          line-height: 1.9;
          overflow-wrap: anywhere;
          word-break: normal;
        }

        /* Paragraph spacing */
        .rich-text :global(.rt-paragraph) {
          margin: 0 0 20px;
        }

        .rich-text :global(.rt-paragraph:last-child) {
          margin-bottom: 0;
        }

        /* Headings inside Contentful rich text */
        .rich-text :global(.rt-heading) {
          margin: 32px 0 14px;
          color: #3a1020;
          font-size: 1.55rem;
          font-weight: 500;
          line-height: 1.4;
        }

        .rich-text :global(.rt-heading:first-child) {
          margin-top: 0;
        }

        .rich-text :global(.rt-heading-1) {
          font-size: 1.9rem;
        }

        .rich-text :global(.rt-heading-3) {
          font-size: 1.3rem;
        }

        .rich-text :global(.rt-heading-4) {
          font-size: 1.12rem;
        }

        /* Bulleted and numbered lists */
        .rich-text :global(.rt-list) {
          margin: 18px 0 26px;
          padding-left: 28px;
        }

        .rich-text :global(.rt-list li) {
          padding-left: 7px;
          margin-bottom: 12px;
        }

        .rich-text :global(.rt-list li::marker) {
          color: #a45f3a;
        }

        .rich-text :global(.rt-ordered-list li::marker) {
          font-weight: 600;
        }

        .rich-text :global(.rt-list ul),
        .rich-text :global(.rt-list ol) {
          margin-top: 12px;
          margin-bottom: 12px;
        }

        /* Blockquotes */
        .rich-text :global(.rt-quote) {
          margin: 28px 0;
          padding: 18px 24px;
          border-left: 3px solid #a45f3a;
          background: #f0ebe4;
          color: #3a1020;
          font-size: 1.05rem;
          font-style: italic;
        }

        .rich-text :global(.rt-quote p) {
          margin: 0 0 12px;
        }

        .rich-text :global(.rt-quote p:last-child) {
          margin-bottom: 0;
        }

        /* Links */
        .rich-text :global(.rt-link) {
          color: #8c482d;
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 4px;
          overflow-wrap: anywhere;
        }

        .rich-text :global(.rt-link:hover) {
          color: #3a1020;
        }

        .rich-text :global(strong) {
          color: #3a1020;
          font-weight: 700;
        }

        .rich-text :global(em) {
          font-style: italic;
        }

        .rich-text :global(.inline-code) {
          padding: 3px 6px;
          border-radius: 3px;
          background: #eee8df;
          font-family: monospace;
          font-size: 0.9em;
        }

        .rich-text :global(.rt-divider) {
          margin: 28px 0;
          border: 0;
          border-top: 1px solid #ded5cb;
        }

        .apply-section {
          margin-top: 24px;
          padding: 34px;
          background: #eee8df;
        }

        .apply-section h2 {
          margin-bottom: 12px;
        }

        .apply-section > p {
          line-height: 1.8;
        }

        .apply-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin: 12px 0;
          padding: 15px 28px;
          background: #3a1020;
          color: white;
          text-decoration: none;
          transition: background 0.2s;
        }

        .apply-button:hover {
          background: #a45f3a;
        }

        .apply-note {
          margin-top: 14px;
          color: #786d64;
          font-size: 0.9rem;
        }

        @media (max-width: 600px) {
          .careers-page {
            padding: 28px 20px 45px;
          }

          .back-link {
            margin-bottom: 28px;
          }

          .content-section {
            padding: 26px 0;
          }

          .rich-text {
            font-size: 1rem;
            line-height: 1.8;
          }

          .rich-text :global(.rt-heading) {
            margin-top: 26px;
          }

          .rich-text :global(.rt-quote) {
            padding: 16px;
            margin: 22px 0;
          }

          .apply-section {
            padding: 24px 20px;
          }

          .apply-button {
            display: flex;
            width: 100%;
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
      params: { id: job.sys.id },
    })),
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const job = await getJobById(params.id);

  if (!job) {
    return { notFound: true };
  }

  return {
    props: { job },
    revalidate: 60,
  };
}
