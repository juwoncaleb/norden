import { createClient } from "contentful";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

// ==========================
// PRODUCTS
// ==========================

export async function getAllProducts() {
  const response = await client.getEntries({
    content_type: "product",
    include: 10,
  });

  return response.items || [];
}


// ==========================
// BLOGS
// ==========================

export async function getAllBlogs() {
  try {
    const response = await client.getEntries({
      content_type: "blog",
      include: 10,
      order: ["-sys.createdAt"],
    });

    return response.items || [];
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}


// Get one individual blog by Contentful entry ID
export async function getBlogById(id) {
  try {
    const entry = await client.getEntry(id, {
      include: 10,
    });

    return entry;
  } catch (error) {
    console.error(`Error fetching blog ${id}:`, error);
    return null;
  }
}


// ==========================
// DINING TABLES
// ==========================

export async function getDiningTables({ limit } = {}) {
  const pageSize = 100;
  let skip = 0;
  let total = Infinity;
  const items = [];

  while (skip < total && (!limit || items.length < limit)) {
    const res = await client.getEntries({
      content_type: "diningTable",
      limit: limit
        ? Math.min(limit - items.length, pageSize)
        : pageSize,
      skip,
      order: ["fields.title"],
      include: 10,
    });

    total = res.total;

    items.push(...res.items);

    skip += pageSize;
  }

  return JSON.parse(JSON.stringify(items));
}