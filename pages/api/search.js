
import { createClient } from "contentful";
import Fuse from "fuse.js";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

// Contentful content type IDs and their website routes.
// IDs must match the API identifiers in Contentful.
const PRODUCT_TYPES = [
  { id: "accessories", route: "accessories" },
  { id: "armChair", route: "armchair" },
  { id: "bar", route: "bar" },
  { id: "beds", route: "beds" },
  { id: "bedsideTable", route: "bedsidetable" },
  { id: "benches", route: "benches" },
  { id: "coffeeTable", route: "coffeetable" },
  { id: "consoles", route: "consoles" },
  { id: "custom", route: "custom" },
  { id: "diningChairs", route: "diningchairs" },
  { id: "diningTable", route: "diningtable" },
  { id: "dressers", route: "dresser" },
  { id: "essential", route: "essential" },
  { id: "headboard", route: "headboard" },
  { id: "lighting", route: "lighting" },
  { id: "livingConsole", route: "livingconsole" },
  { id: "mirrors", route: "mirrors" },
  { id: "ottomans", route: "ottomans" },
  { id: "sculpturalPieces", route: "sculpturalpieces" },
  { id: "signature", route: "signature" },
  { id: "sofa", route: "sofa" },
  { id: "tvUnit", route: "tvunit" },
];

// Safely turn Contentful fields into searchable text.
function toText(value) {
  if (typeof value === "string") return value;

  if (Array.isArray(value)) {
    return value.map(toText).join(" ");
  }

  if (value && typeof value === "object") {
    return Object.values(value).map(toText).join(" ");
  }

  return "";
}

// Get first product image.
function getImage(fields) {
  const image =
    fields.images?.[0] ||
    fields.image ||
    fields.thumbnail;

  const url = image?.fields?.file?.url;

  if (!url) return null;

  return url.startsWith("//")
    ? `https:${url}`
    : url;
}

// Fetch every entry from one Contentful model.
async function fetchEntries(contentType) {
  const items = [];
  let skip = 0;
  const limit = 100;
  let total = Infinity;

  while (skip < total) {
    const response = await client.getEntries({
      content_type: contentType,
      limit,
      skip,
      include: 2,
    });

    items.push(...response.items);

    total = response.total;
    skip += response.items.length;

    if (response.items.length === 0) break;
  }

  return items;
}

async function getSearchProducts() {
  const collections = await Promise.all(
    PRODUCT_TYPES.map(async (type) => {
      try {
        const entries = await fetchEntries(type.id);

        return entries.map((entry) => {
          const fields = entry.fields || {};

          return {
            id: entry.sys.id,
            title: fields.title || "",
            description: toText(fields.description),
            material: toText(fields.material),
            tags: toText(fields.tags),
            category: type.route,
            image: getImage(fields),
            price: fields.price ?? null,
            discountedPrice:
              fields.discountedPrice ?? null,
            href: `/${type.route}/${entry.sys.id}`,
          };
        });
      } catch (error) {
        console.error(
          `Error fetching ${type.id}:`,
          error.message
        );

        return [];
      }
    })
  );

  return collections.flat();
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  const query =
    typeof req.query.q === "string"
      ? req.query.q.trim().slice(0, 100)
      : "";

  if (query.length < 2) {
    return res.status(200).json({
      results: [],
    });
  }

  try {
    const products = await getSearchProducts();

    const fuse = new Fuse(products, {
      keys: [
        { name: "title", weight: 0.7 },
        { name: "category", weight: 0.12 },
        { name: "tags", weight: 0.1 },
        { name: "material", weight: 0.05 },
        { name: "description", weight: 0.03 },
      ],
      threshold: 0.4,
      ignoreLocation: true,
      minMatchCharLength: 2,
      includeScore: true,
    });

    const results = fuse
      .search(query, { limit: 8 })
      .map(({ item }) => item);

    return res.status(200).json({
      results,
    });
  } catch (error) {
    console.error("SEARCH ERROR:", error);

    return res.status(500).json({
      error: "Unable to search products",
    });
  }
}
