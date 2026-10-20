import Head from "next/head";
import Link from "next/link";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types";

import Header from "../../component/Header";
import Footer from "../../component/footer";
import { getJobById } from "@/lib/contentful";

// Custom Render Options to match Contentful styling exactly
const renderOptions = {
  renderMark: {
    [MARKS.BOLD]: (text) => (
      <strong className="font-semibold text-gray-900">{text}</strong>
    ),
    [MARKS.ITALIC]: (text) => <em className="italic">{text}</em>,
    [MARKS.UNDERLINE]: (text) => <u className="underline">{text}</u>,
  },
  renderNode: {
    [BLOCKS.HEADING_1]: (node, children) => (
      <h1 className="mt-8 mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        {children}
      </h1>
    ),
    [BLOCKS.HEADING_2]: (node, children) => (
      <h2 className="mt-6 mb-3 text-2xl font-bold tracking-tight text-gray-900">
        {children}
      </h2>
    ),
    [BLOCKS.HEADING_3]: (node, children) => (
      <h3 className="mt-5 mb-2 text-xl font-semibold text-gray-900">
        {children}
      </h3>
    ),
    [BLOCKS.HEADING_4]: (node, children) => (
      <h4 className="mt-4 mb-2 text-lg font-semibold text-gray-900">
        {children}
      </h4>
    ),
    [BLOCKS.PARAGRAPH]: (node, children) => (
      <p className="mb-4 text-base leading-relaxed text-gray-700">{children}</p>
    ),
    [BLOCKS.UL_LIST]: (node, children) => (
      <ul className="mb-4 my-2 list-disc pl-6 space-y-1 text-gray-700">
        {children}
      </ul>
    ),
    [BLOCKS.OL_LIST]: (node, children) => (
      <ol className="mb-4 my-2 list-decimal pl-6 space-y-1 text-gray-700">
        {children}
      </ol>
    ),
    [BLOCKS.LIST_ITEM]: (node, children) => <li>{children}</li>,
    [BLOCKS.QUOTE]: (node, children) => (
      <blockquote className="my-4 border-l-4 border-gray-300 pl-4 italic text-gray-600">
        {children}
      </blockquote>
    ),
    [BLOCKS.HR]: () => <hr className="my-8 border-gray-200" />,
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const file = node.data?.target?.fields?.file;
      if (!file?.url) return null;

      const imageUrl = file.url.startsWith("//")
        ? `https:${file.url}`
        : file.url;

      return (
        <img
          src={imageUrl}
          alt={node.data.target.fields.title ?? ""}
          className="my-6 h-auto max-w-full rounded-md"
          loading="lazy"
        />
      );
    },
    [INLINES.HYPERLINK]: (node, children) => (
      <a
        href={node.data.uri}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline hover:text-blue-800"
      >
        {children}
      </a>
    ),
  },
};

export async function getServerSideProps({ params }) {
  const job = await getJobById(params.id);

  if (!job) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      job: JSON.parse(JSON.stringify(job)),
    },
  };
}

export default function CareerDetails({ job }) {
  const fields = job.fields || {};

  const title = fields.title || "Open Position";
  const email = "careers@example.com";

  const subject = `Application for ${title}`;
  const body = `Hello,\n\nI would like to apply for the ${title} role.\n\nPlease find my CV attached.\n\nThank you.`;

  const mailto = `mailto:${email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  const jobMeta = [
    fields.location,
    fields.employmentType,
    fields.category,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <Head>
        <title>{title} | Careers</title>
        <meta
          name="description"
          content={`Learn more about the ${title} position and how to apply.`}
        />
      </Head>

      <Header />

      <main className="careers-page mx-auto min-h-screen max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
        {/* Back link */}
        <Link
          href="/career"
          className="mb-8 inline-block text-sm font-medium text-gray-600 transition hover:text-black"
        >
          ← All Careers
        </Link>

        {/* Job header */}
        <header className="mb-10 text-left">
          {fields.department && (
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gray-500">
              {fields.department}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-serif leading-tight text-gray-900 sm:text-5xl">
              {title}
            </h1>

            {fields.isNew && (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                New
              </span>
            )}
          </div>

          {jobMeta && (
            <p className="mt-4 text-sm text-gray-500 sm:text-base">
              {jobMeta}
            </p>
          )}

          <div className="mt-6">
            <a
              href={mailto}
              className="inline-block rounded-md bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Apply for this role
            </a>
          </div>
        </header>

        {/* Job details */}
        <article className="rounded-lg border border-gray-100 bg-white p-5 text-left sm:p-8">
          {fields.description && (
            <section className="mb-10">
              <div className="text-left">
                {documentToReactComponents(
                  fields.description,
                  renderOptions
                )}
              </div>
            </section>
          )}

          {fields.responsibilities && (
            <section className="mb-10">
              <h2 className="mb-4 text-2xl font-serif text-gray-900">
                Responsibilities
              </h2>
              <div className="text-left">
                {documentToReactComponents(
                  fields.responsibilities,
                  renderOptions
                )}
              </div>
            </section>
          )}

          {fields.qualifications && (
            <section className="mb-10">
              <h2 className="mb-4 text-2xl font-serif text-gray-900">
                Qualifications
              </h2>
              <div className="text-left">
                {documentToReactComponents(
                  fields.qualifications,
                  renderOptions
                )}
              </div>
            </section>
          )}

          {fields.benefits && (
            <section className="mb-10">
              <h2 className="mb-4 text-2xl font-serif text-gray-900">
                Benefits
              </h2>
              <div className="text-left">
                {documentToReactComponents(
                  fields.benefits,
                  renderOptions
                )}
              </div>
            </section>
          )}
        </article>

        {/* Application section */}
        <section className="mt-10 rounded-lg bg-gray-900 px-6 py-10 text-center text-white sm:px-10">
          <h2 className="text-2xl font-serif sm:text-3xl">
            Interested in joining us?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-300 sm:text-base">
            We would love to hear from you. Send us your application for
            this position.
          </p>

          <a
            href={mailto}
            className="mt-6 inline-block rounded-md bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-200"
          >
            Apply Now
          </a>
        </section>
      </main>

      <Footer />
    </>
  );
}