import Image from "next/image";
import Link from "next/link";
import { getAllBlogs } from "@/lib/contentful";
import Header from "./component/Header";
import Footer from "./component/footer";

export async function getServerSideProps() {
  const blogs = await getAllBlogs();

  return {
    props: {
      // Strips undefined values so Next can serialize the data
      blogs: JSON.parse(JSON.stringify(blogs)),
    },
  };
}

export default function BlogListPage({ blogs }) {
  return (
    <div>
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-10 min-h-[70vh]">
        <h1 className="text-3xl font-serif mb-8">Blog</h1>

        {blogs.length === 0 ? (
          <p className="text-gray-500 py-10 text-lg">No blog posts found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((item) => {
              const post = item.fields;

              const thumbnailUrl = post.Thumbnail?.fields?.file?.url
                ? `https:${post.Thumbnail.fields.file.url}`
                : "/placeholder.jpg";

              return (
                <Link key={item.sys.id} href={`/blog/${item.sys.id}`}>
                  <div className="cursor-pointer group">
                    <div className="relative aspect-video w-full mb-3 bg-stone-100 rounded-md overflow-hidden">
                      <Image
                        src={thumbnailUrl}
                        alt={post.title || "Blog thumbnail"}
                        fill
                        className="object-cover group-hover:scale-105 transition"
                      />
                    </div>

                    <h2 className="text-lg font-serif font-semibold text-stone-900">
                      {post.title}
                    </h2>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}