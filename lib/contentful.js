
import { createClient } from "contentful";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

// ==========================
// PRODUCTS
// ==========================

export async function getAllProducts() {
  try {
    const response = await client.getEntries({
      content_type: "product",
      include: 10,
    });

    return JSON.parse(JSON.stringify(response.items || []));
  } catch (error) {
    console.error("ERROR FETCHING PRODUCTS:", error);
    return [];
  }
}

// ==========================
// BLOGS
// ==========================

export async function getAllBlogs() {
  try {
    const response = await client.getEntries({
      content_type: "blog",
      include: 10,
    });

    return JSON.parse(JSON.stringify(response.items || []));
  } catch (error) {
    console.error("ERROR FETCHING BLOGS:", error);
    return [];
  }
}

// ==========================
// DINING TABLES
// ==========================

export async function getDiningTables({ limit = 12 } = {}) {
  try {
    const response = await client.getEntries({
      content_type: "diningTable",
      limit,
      include: 10,
    });

    return JSON.parse(JSON.stringify(response.items || []));
  } catch (error) {
    console.error("ERROR FETCHING DINING TABLES:", error);
    return [];
  }
}

// ==========================
// CAREERS / JOBS
// Your Job content type API Identifier is "vases"
// ==========================

export async function getAllJobs() {
  try {
    const response = await client.getEntries({
      content_type: "vases",
      include: 10,
      order: "-sys.createdAt",
    });

    return JSON.parse(JSON.stringify(response.items || []));
  } catch (error) {
    console.error("ERROR FETCHING JOBS:", error);
    return [];
  }
}

// ==========================
// GET ONE JOB BY ENTRY ID
// ==========================

export async function getJobById(id) {
  try {
    if (!id) {
      return null;
    }

    const entry = await client.getEntry(id, {
      include: 10,
    });

    return JSON.parse(JSON.stringify(entry));
  } catch (error) {
    console.error("ERROR FETCHING JOB:", error);
    return null;
  }
}
