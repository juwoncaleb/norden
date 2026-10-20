// lib/contentful.js

// Keep your existing import and client setup at the top of this file:
//
// import { createClient } from "contentful";
// const client = createClient({
//   space: process.env.CONTENTFUL_SPACE_ID,
//   accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
// });

// Keep your existing product, blog, and other functions above this section.

// ==========================
// CAREERS
// ==========================

export async function getAllJobs() {
  try {
    const response = await client.getEntries({
      content_type: "vase", // Your Contentful API Identifier
      include: 10,
      limit: 1000,
      order: ["-sys.createdAt"],
    });

    return JSON.parse(JSON.stringify(response.items || []));
  } catch (error) {
    console.error("Error fetching careers:", error);
    return [];
  }
}

export async function getJobById(id) {
  try {
    const entry = await client.getEntry(id, {
      include: 10,
    });

    // Confirm this entry belongs to your existing Contentful model.
    if (entry.sys.contentType.sys.id !== "vase") {
      return null;
    }

    return JSON.parse(JSON.stringify(entry));
  } catch (error) {
    console.error(`Error fetching career ${id}:`, error);
    return null;
  }
}