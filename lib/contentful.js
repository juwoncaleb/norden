
import { createClient } from "contentful";

const space = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

const client =
  space && accessToken
    ? createClient({
        space,
        accessToken,
      })
    : null;

function serializeEntries(items) {
  return JSON.parse(JSON.stringify(items || []));
}

// ==========================
// PRODUCTS
// ==========================

export async function getAllProducts() {
  try {
    if (!client) {
      throw new Error("Missing Contentful environment variables.");
    }

    const response = await client.getEntries({
      content_type: "product",
      include: 10,
    });

    return serializeEntries(response.items);
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
    if (!client) {
      throw new Error("Missing Contentful environment variables.");
    }

    const response = await client.getEntries({
      content_type: "blog",
      include: 10,
    });

    return serializeEntries(response.items);
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
    if (!client) {
      throw new Error("Missing Contentful environment variables.");
    }

    const response = await client.getEntries({
      content_type: "diningTable",
      limit,
      include: 10,
    });

    return serializeEntries(response.items);
  } catch (error) {
    console.error("ERROR FETCHING DINING TABLES:", error);
    return [];
  }
}

// ==========================
// CAREERS / JOBS
// ==========================

export async function getAllJobs() {
  try {
    if (!client) {
      throw new Error("Missing Contentful environment variables.");
    }

    const response = await client.getEntries({
      content_type: "vases",
      include: 10,
      order: "-sys.createdAt",
    });

    return serializeEntries(response.items);
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
    if (!client || !id) {
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

// ==========================
// GET ONE BLOG BY ENTRY ID
// ==========================

export async function getBlogById(id) {
  try {
    if (!client || !id) return null;

    const entry = await client.getEntry(id, { include: 10 });

    return JSON.parse(JSON.stringify(entry));
  } catch (error) {
    console.error("ERROR FETCHING BLOG:", error);
    return null;
  }
}