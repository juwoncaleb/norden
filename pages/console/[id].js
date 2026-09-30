import { useState } from "react";
import { createClient } from "contentful";
import Header from "../component/Header";
import Footer from "../component/footer";

// Requires these in your .env.local:
// CONTENTFUL_SPACE_ID=xxxx
// CONTENTFUL_ACCESS_TOKEN=xxxx
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

export async function getServerSideProps({ params }) {
  try {
    const entry = await client.getEntry(params.id);
    return { props: { item: entry } };
  } catch {
    // getEntry throws (404) when the id doesn't exist
    return { props: { item: null } };
  }
}

function formatPrice(value) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

function imageUrl(image, width) {
  const url = image?.fields?.file?.url;
  if (!url) return null;
  return `https:${url}${width ? `?w=${width}` : ""}`;
}

export default function ConsolesDetailPage({ item }) {
  const [activeImage, setActiveImage] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  if (!item) {
    return (
      <div>
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-20 text-center">
          <p>Product not found</p>
        </main>
        <Footer />
      </div>
    );
  }

  const fields = item.fields;
  const images = fields.images || [];

  // "tags" is a single Short Text field, not a list, so it can come
  // back as a comma-separated string.
  const tagList = Array.isArray(fields.tags)
    ? fields.tags
    : fields.tags
    ? fields.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const hasDiscount =
    fields.discountedPrice != null && fields.discountedPrice < fields.price;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div>
      <Header />

      <div className="sd-wrapper">
        {/* GALLERY */}
        <div className="sd-gallery">
          <div className="sd-thumbs">
            {images.map((img, i) => (
              <button
                key={i}
                className={`sd-thumb ${i === activeImage ? "active" : ""}`}
                onClick={() => setActiveImage(i)}
              >
                <img src={imageUrl(img, 120)} alt={`view ${i + 1}`} />
              </button>
            ))}
          </div>

          <div
            className={`sd-main-image ${zoom ? "zoomed" : ""}`}
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
            onMouseMove={handleMouseMove}
          >
            {images[activeImage] && (
              <img
                src={imageUrl(images[activeImage], 1200)}
                alt={fields.title}
                style={
                  zoom
                    ? {
                        transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                        transform: "scale(2)",
                      }
                    : {}
                }
              />
            )}
          </div>
        </div>

        {/* INFO */}
        <div className="sd-info">
          {tagList[0] && <span className="sd-badge">{tagList[0]}</span>}

          <h1 className="sd-title">{fields.title}</h1>

          <div className="sd-price">
            {hasDiscount ? (
              <>
                <span className="sd-price-current">
                  {formatPrice(fields.discountedPrice)}
                </span>
                <span className="sd-price-original">
                  {formatPrice(fields.price)}
                </span>
              </>
            ) : (
              <span className="sd-price-current">
                {formatPrice(fields.price)}
              </span>
            )}
          </div>

          {fields.description && (
            <p className="sd-desc">{fields.description}</p>
          )}

          {/* META */}
          <div className="sd-meta">
            {fields.material && (
              <div className="sd-meta-row">
                <span>Material</span>
                <span>{fields.material}</span>
              </div>
            )}

            <div className="sd-meta-row">
              <span>Availability</span>
              <span className={fields.inStock ? "in" : "out"}>
                {fields.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}