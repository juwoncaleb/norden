import { createClient } from "contentful";
import Header from "./component/Header";
import Footer from "./component/footer";
import Image from "next/image";
import Link from "next/link";

// Requires these in your .env.local:
// CONTENTFUL_SPACE_ID=xxxx
// CONTENTFUL_ACCESS_TOKEN=xxxx
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

export async function getServerSideProps() {
  const pageSize = 100;
  let skip = 0;
  let total = Infinity;
  const sofas = [];

  while (skip < total) {
    const response = await client.getEntries({
      content_type: "sofa",
      limit: pageSize,
      skip,
      order: ["fields.title"],
    });

    total = response.total;
    sofas.push(...response.items);
    skip += pageSize;
  }

  return { props: { sofas } };
}

function formatPrice(value) {
  return "₦" + new Intl.NumberFormat("en-NG", {
    maximumFractionDigits: 0,
  }).format(value);
}
export default function SofaListPage({ sofas }) {
  return (
    <div>
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-10 min-h-[70vh]">
        <h1 className="text-3xl font-serif mb-8">Sofas</h1>

        {sofas.length === 0 ? (
          <p className="text-gray-500 py-10 text-lg">No sofas found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {sofas.map((item) => {
              const sofa = item.fields;
              const coverUrl = sofa.images?.[0]?.fields?.file?.url
                ? `https:${sofa.images[0].fields.file.url}`
                : "/placeholder.jpg";

              const hasDiscount =
                sofa.discountedPrice != null &&
                sofa.discountedPrice < sofa.price;

              // "tags" is a single Short Text field in Contentful, not a
              // list, so it can come back as a comma-separated string.
              const tagList = Array.isArray(sofa.tags)
                ? sofa.tags
                : sofa.tags
                ? sofa.tags.split(",").map((t) => t.trim()).filter(Boolean)
                : [];

              return (
                <Link key={item.sys.id} href={`/sofa/${item.sys.id}`} className="block">
                <div className="group cursor-pointer">
                  <div className="relative aspect-[4/3] w-full mb-3 bg-stone-100 overflow-hidden">
                    <Image
                      src={coverUrl}
                      alt={sofa.title || "Sofa image"}
                      fill
                      className="object-cover group-hover:scale-105 transition"
                    />

                    {!sofa.inStock && (
                      <span className="absolute left-3 top-3 bg-stone-900 text-stone-50 text-xs px-2.5 py-1">
                        Out of stock
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg font-serif text-stone-900">
                    {sofa.title}
                  </h2>

                  {sofa.material && (
                    <p className="text-sm text-stone-500 mt-1">
                      {sofa.material}
                    </p>
                  )}

                  <div className="mt-2 flex items-baseline gap-2">
                    {hasDiscount ? (
                      <>
                        <span className="text-base text-amber-800">
                          {formatPrice(sofa.discountedPrice)}
                        </span>
                        <span className="text-sm text-stone-400 line-through">
                          {formatPrice(sofa.price)}
                        </span>
                      </>
                    ) : (
                      <span className="text-base text-stone-900">
                        {formatPrice(sofa.price)}
                      </span>
                    )}
                  </div>

                  {tagList.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {tagList.map((tag) => (
                        <li
                          key={tag}
                          className="border border-stone-200 text-stone-500 text-xs px-2 py-0.5"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  )}
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