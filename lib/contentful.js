import { createClient } from "contentful";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

export async function getAllProducts() {
  const response = await client.getEntries({ content_type: "product" });
  return response.items || [];
}

export async function getAllBlogs() {
  const response = await client.getEntries({ content_type: "blog" });
  return response.items || [];
}

export async function getDiningTables({ limit } = {}) {
  const pageSize = 100;
  let skip = 0;
  let total = Infinity;
  const items = [];

  while (skip < total && (!limit || items.length < limit)) {
    const res = await client.getEntries({
      content_type: "diningTable",
      limit: limit ? Math.min(limit - items.length, pageSize) : pageSize,
      skip,
      order: ["fields.title"],
    });
    total = res.total;
    items.push(...res.items);
    skip += pageSize;
  }

  return JSON.parse(JSON.stringify(items));
}