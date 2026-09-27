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