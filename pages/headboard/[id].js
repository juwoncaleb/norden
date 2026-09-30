import { createClient } from "contentful";
import Header from "../component/Header";
import Footer from "../component/footer";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

export async function getServerSideProps({ params }) {
  try {
    const entry = await client.getEntry(params.id);
    return { props: { entry: JSON.parse(JSON.stringify(entry)) } };
  } catch (err) {
    return { notFound: true };
  }
}

function formatPrice(value) {
  return "₦" + new Intl.NumberFormat("en-NG", {
    maximumFractionDigits: 0,
  }).format(value);
}

export default function HeadboardDetailPage({ entry }) {
  const item = entry.fields;
  const [active, setActive] = useState(0);

  const imageUrls = (item.images || [])
    .map((img) => img?.fields?.file?.url)
    .filter(Boolean)
    .map((url) => `https:${url}`);

  const hasDiscount =
    item.discountedPrice != null && item.discountedPrice < item.price;

  const tagList = Array.isArray(item.tags)
    ? item.tags
    : item.tags
    ? item.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <div>
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-10 min-h-[70vh]">
        <Link
          href="/headboard"
          className="text-sm text-stone-500 hover:text-stone-900"
        >
          ← Back to Headboards
        </Link>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Images */}
          <div>
            <div className="relative aspect-[4/3] w-full bg-stone-100 overflow-hidden">
              <Image
                src={imageUrls[active] || "/placeholder.jpg"}
                alt={item.title || "Product image"}
                fill
                className="object-cover"
              />
            </div>

            {imageUrls.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {imageUrls.map((url, i) => (
                  <button
                    key={url}
                    onClick={() => setActive(i)}
                    className={`relative aspect-square bg-stone-100 overflow-hidden border ${
                      i === active ? "border-stone-900" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={url}
                      alt={`${item.title} ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl font-serif text-stone-900">{item.title}</h1>

            {item.material && (
              <p className="text-stone-500 mt-2">{item.material}</p>
            )}

            <div className="mt-4 flex items-baseline gap-3">
              {hasDiscount ? (
                <>
                  <span className="text-2xl text-amber-800">
                    {formatPrice(item.discountedPrice)}
                  </span>
                  <span className="text-lg text-stone-400 line-through">
                    {formatPrice(item.price)}
                  </span>
                </>
              ) : (
                <span className="text-2xl text-stone-900">
                  {formatPrice(item.price)}
                </span>
              )}
            </div>

            <p
              className={`mt-3 text-sm ${
                item.inStock ? "text-green-700" : "text-stone-500"
              }`}
            >
              {item.inStock ? "In stock" : "Out of stock"}
            </p>

            {typeof item.description === "string" && item.description && (
              <p className="mt-6 text-stone-700 leading-relaxed whitespace-pre-line">
                {item.description}
              </p>
            )}

            {tagList.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
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
        </div>
      </main>

      <Footer />
    </div>
  );
}