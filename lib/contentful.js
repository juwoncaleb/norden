// ==========================
// CAREERS
// ==========================

export async function getAllJobs() {
  try {
    const response = await client.getEntries({
      content_type: "job",
      include: 10,
      limit: 1000,
      order: ["-sys.createdAt"],
    });

    return JSON.parse(JSON.stringify(response.items || []));
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
}

export async function getJobById(id) {
  try {
    const entry = await client.getEntry(id, {
      include: 10,
    });

    // Make sure this entry is actually a job.
    if (entry.sys.contentType.sys.id !== "job") {
      return null;
    }

    return JSON.parse(JSON.stringify(entry));
  } catch (error) {
    console.error(`Error fetching job ${id}:`, error);
    return null;
  }
}