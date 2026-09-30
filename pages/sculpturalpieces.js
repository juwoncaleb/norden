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
  const items = [];

  while (skip < total) {
    const response = await client.getEntries({
      // Double-check this matches the content type's actual API ID
      // in Contentful (Content model page, not just the display name).
      content_type: "sculpturalPieces",
      limit: pageSize,
      skip,
      order: ["fields.title"],
    });

    total = response.total;
    items.push(...response.items);
    skip += pageSize;
  }

  return { props: { items } };
}

function formatPrice(value) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function SculpturalPiecesListPage({ items }) {
  return (
    <div>
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-10 min-h-[70vh]">
        <h1 className="text-3xl font-serif mb-8">Sculptural Pieces</h1>

        {items.length === 0 ? (
          <p className="text-gray-500 py-10 text-lg">No sculptural pieces found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {items.map((entry) => {
              const item = entry.fields;
              const coverUrl = item.images?.[0]?.fields?.file?.url
                ? `https:${item.images[0].fields.file.url}`
                : "/placeholder.jpg";

              const hasDiscount =
                item.discountedPrice != null &&
                item.discountedPrice < item.price;

              // "tags" may be a single Short Text field rather than a
              // list, so it can come back as a comma-separated string.
              const tagList = Array.isArray(item.tags)
                ? item.tags
                : item.tags
                ? item.tags.split(",").map((t) => t.trim()).filter(Boolean)
                : [];

              return (
                <Link
                  key={entry.sys.id}
                  href={`/sculptural-pieces/${entry.sys.id}`}
                  className="block"
                >
                  <div className="group cursor-pointer">
                    <div className="relative aspect-[4/3] w-full mb-3 bg-stone-100 overflow-hidden">
                      <Image
                        src={coverUrl}
                        alt={item.title || "Product image"}
                        fill
                        className="object-cover group-hover:scale-105 transition"
                      />

                      {!item.inStock && (
                        <span className="absolute left-3 top-3 bg-stone-900 text-stone-50 text-xs px-2.5 py-1">
                          Out of stock
                        </span>
                      )}
                    </div>

                    <h2 className="text-lg font-serif text-stone-900">
                      {item.title}
                    </h2>

                    {item.material && (
                      <p className="text-sm text-stone-500 mt-1">
                        {item.material}
                      </p>
                    )}

                    <div className="mt-2 flex items-baseline gap-2">
                      {hasDiscount ? (
                        <>
                          <span className="text-base text-amber-800">
                            {formatPrice(item.discountedPrice)}
                          </span>
                          <span className="text-sm text-stone-400 line-through">
                            {formatPrice(item.price)}
                          </span>
                        </>
                      ) : (
                        <span className="text-base text-stone-900">
                          {formatPrice(item.price)}
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