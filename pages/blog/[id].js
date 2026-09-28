import Image from "next/image";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS } from "@contentful/rich-text-types";
import Header from "../component/Header";
import Footer from "../component/footer";
import { getBlogById } from "@/lib/contentful";

export async function getServerSideProps({ params }) {
  const blog = await getBlogById(params.id);

  if (!blog) {
    return { notFound: true };
  }

  return {
    props: {
      // Strips undefined values so Next can serialize the data
      blog: JSON.parse(JSON.stringify(blog)),
    },
  };
}

// Plain (non-async) renderers. Linked entries/assets are already
// resolved because we fetch with include: 10.
const renderOptions = {
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const file = node.data?.target?.fields?.file;
      if (!file?.url) return null;

      return (
        <img
          src={`https:${file.url}`}
          alt={node.data.target.fields.title ?? ""}
          className="rounded-md my-6"
        />
      );
    },
  },
};

export default function BlogDetails({ blog }) {
  const post = blog.fields;

  const imageUrl = post.Background?.fields?.file?.url
    ? `https:${post.Background.fields.file.url}`
    : "/placeholder.jpg";

  return (
    <div>
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-serif mb-6">{post.title}</h1>

        <div className="relative w-full h-[400px] mb-8">
          <Image
            src={imageUrl}
            alt={post.title || ""}
            fill
            className="object-cover rounded-md"
          />
        </div>

        <div className="prose max-w-none">
          {post.blog && documentToReactComponents(post.blog, renderOptions)}
        </div>
      </main>

      <Footer />
    </div>
  );
}