import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types";

import { getBlogById } from "@/lib/contentful";
import Header from "../component/Header";
import Footer from "../component/footer";

const toUrl = (url) => (url?.startsWith("//") ? `https:${url}` : url);

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

      return (
        <img
          src={toUrl(file.url)}
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
  const blog = await getBlogById(params.id);

  if (!blog) {
    return { notFound: true };
  }

  return {
    props: { blog: JSON.parse(JSON.stringify(blog)) },
  };
}

export default function BlogDetails({ blog }) {
  const fields = blog.fields || {};
  const title = fields.title || "Blog Post";
  const thumbnailUrl = toUrl(fields.thumbnail?.fields?.file?.url);

  // Finds the rich text field automatically, whatever it's named
  const richTextKey = Object.keys(fields).find(
    (key) => fields[key]?.nodeType === "document"
  );
  const content = richTextKey ? fields[richTextKey] : null;

  const published = new Date(fields.date || blog.sys.createdAt);
  const dateLabel = isNaN(published)
    ? null
    : published.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  return (
    <>
      <Head>
        <title>{`${title} | Nórden Blog`}</title>
        <meta name="description" content={`Read "${title}" on the Nórden blog.`} />
        {thumbnailUrl && <meta property="og:image" content={thumbnailUrl} />}
      </Head>

      <Header />

      <main className="mx-auto min-h-screen max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
        <Link
          href="/blog"
          className="mb-8 inline-block text-sm font-medium text-gray-600 transition hover:text-black"
        >
          ← All Posts
        </Link>

        <header className="mb-8 text-left">
          <h1 className="text-3xl font-serif leading-tight text-gray-900 sm:text-5xl">
            {title}
          </h1>
          {dateLabel && (
            <p className="mt-4 text-sm text-gray-500 sm:text-base">{dateLabel}</p>
          )}
        </header>

        {thumbnailUrl && (
          <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-md bg-stone-100">
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}

        <article className="text-left">
          {content ? (
            documentToReactComponents(content, renderOptions)
          ) : (
            <p className="text-gray-500">This post has no content yet.</p>
          )}
        </article>
      </main>

      <Footer />
    </>
  );
}