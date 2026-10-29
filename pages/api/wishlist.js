
import { getServerSession } from "next-auth/next";
import { createClient } from "contentful-management";
import { createHash } from "crypto";
import { authOptions } from "./auth/[...nextauth]";

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const ENVIRONMENT_ID =
  process.env.CONTENTFUL_ENVIRONMENT || "master";
const LOCALE = process.env.CONTENTFUL_LOCALE || "en-US";

// Your existing customer content type ID
const CUSTOMER_TYPE = "project";

let managementClient;

function getClient() {
  if (!SPACE_ID || !process.env.CONTENTFUL_MANAGEMENT_TOKEN) {
    throw new Error("Missing Contentful configuration.");
  }

  if (!managementClient) {
    managementClient = createClient(
      {
        accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
      },
      {
        type: "plain",
      }
    );
  }

  return managementClient;
}

function getEnvironment() {
  const client = getClient();

  const base = {
    spaceId: SPACE_ID,
    environmentId: ENVIRONMENT_ID,
  };

  return {
    getEntries(query) {
      return client.entry.getMany({
        ...base,
        query,
      });
    },

    getEntry(entryId) {
      return client.entry.get({
        ...base,
        entryId,
      });
    },

    createEntryWithId(contentTypeId, entryId, entry) {
      return client.entry.createWithId(
        {
          ...base,
          contentTypeId,
          entryId,
        },
        entry
      );
    },

    updateEntry(entryId, version, entry) {
      return client.entry.update(
        {
          ...base,
          entryId,
        },
        {
          ...entry,
          sys: {
            type: "Entry",
            id: entryId,
            version,
          },
        }
      );
    },
  };
}

function field(value) {
  return { [LOCALE]: value };
}

function getField(entry, name) {
  return entry?.fields?.[name]?.[LOCALE];
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function customerId(email) {
  return (
    "customer-" +
    createHash("sha256")
      .update(normalizeEmail(email))
      .digest("hex")
      .slice(0, 40)
  );
}

function normalizeLikes(value) {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (item) =>
      item &&
      typeof item.productId === "string" &&
      typeof item.productType === "string"
  );
}

function errorStatus(error) {
  if (error?.status) return error.status;
  if (error?.response?.status) return error.response.status;

  try {
    return JSON.parse(error.message).status || null;
  } catch {
    return null;
  }
}

// Find existing customer
async function findCustomer(environment, email) {
  const normalized = normalizeEmail(email);
  let skip = 0;

  while (true) {
    const response = await environment.getEntries({
      content_type: CUSTOMER_TYPE,
      limit: 100,
      skip,
    });

    const customer = response.items.find(
      (entry) =>
        normalizeEmail(getField(entry, "email")) === normalized
    );

    if (customer) return customer;

    skip += response.items.length;

    if (!response.items.length || skip >= response.total) {
      return null;
    }
  }
}

// Create customer if necessary
async function getCustomer(environment, user, create = false) {
  const existing = await findCustomer(
    environment,
    user.email
  );

  if (existing || !create) return existing;

  const email = normalizeEmail(user.email);
  const id = customerId(email);

  try {
    return await environment.createEntryWithId(
      CUSTOMER_TYPE,
      id,
      {
        fields: {
          fullName: field(user.name || email),
          email: field(email),
          likedProducts: field([]),
        },
      }
    );
  } catch (error) {
    if (errorStatus(error) === 409) {
      return environment.getEntry(id);
    }

    throw error;
  }
}

// Confirm product exists and matches its content type
async function verifyProduct(environment, productId, productType) {
  try {
    const entry = await environment.getEntry(productId);

    return entry.sys.contentType?.sys?.id === productType;
  } catch (error) {
    if (errorStatus(error) === 404) return false;
    throw error;
  }
}

// Save likes to the customer's JSON field
async function updateLikes(
  environment,
  customer,
  product,
  method
) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const entry = await environment.getEntry(customer.sys.id);

    const current = normalizeLikes(
      getField(entry, "likedProducts")
    );

    const matches = (item) =>
      item.productId === product.productId &&
      item.productType === product.productType;

    const alreadyLiked = current.some(matches);

    const updated =
      method === "POST"
        ? alreadyLiked
          ? current
          : [...current, product]
        : current.filter((item) => !matches(item));

    if (
      (method === "POST" && alreadyLiked) ||
      (method === "DELETE" && !alreadyLiked)
    ) {
      return updated;
    }

    try {
      await environment.updateEntry(
        entry.sys.id,
        entry.sys.version,
        {
          fields: {
            ...entry.fields,
            likedProducts: field(updated),
          },
        }
      );

      return updated;
    } catch (error) {
      if (errorStatus(error) === 409 && attempt < 2) {
        continue;
      }

      throw error;
    }
  }

  throw new Error("Could not update wishlist.");
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "private, no-store");

  if (!["GET", "POST", "DELETE"].includes(req.method)) {
    return res.status(405).json({
      error: "Method not allowed.",
    });
  }

  try {
    const session = await getServerSession(
      req,
      res,
      authOptions
    );

    if (!session?.user?.email) {
      return res.status(401).json({
        error: "Please sign in to use your wishlist.",
        requiresLogin: true,
      });
    }

    const environment = getEnvironment();

    // GET WISHLIST
    if (req.method === "GET") {
      const customer = await getCustomer(
        environment,
        session.user,
        false
      );

      const likes = customer
        ? normalizeLikes(
            getField(customer, "likedProducts")
          )
        : [];

      return res.status(200).json({
        success: true,
        likes,
      });
    }

    const { productId, productType } = req.body || {};

    if (
      typeof productId !== "string" ||
      typeof productType !== "string" ||
      !/^[a-zA-Z0-9_-]{1,100}$/.test(productId) ||
      !/^[a-zA-Z][a-zA-Z0-9_-]{0,99}$/.test(productType)
    ) {
      return res.status(400).json({
        error: "Invalid product information.",
      });
    }

    const product = { productId, productType };

    // ADD LIKE
    if (req.method === "POST") {
      const exists = await verifyProduct(
        environment,
        productId,
        productType
      );

      if (!exists) {
        return res.status(404).json({
          error: "Product not found in Contentful.",
        });
      }

      const customer = await getCustomer(
        environment,
        session.user,
        true
      );

      const likes = await updateLikes(
        environment,
        customer,
        product,
        "POST"
      );

      return res.status(200).json({
        success: true,
        liked: true,
        likes,
      });
    }

    // REMOVE LIKE
    if (req.method === "DELETE") {
      const customer = await getCustomer(
        environment,
        session.user,
        false
      );

      if (!customer) {
        return res.status(200).json({
          success: true,
          liked: false,
          likes: [],
        });
      }

      const likes = await updateLikes(
        environment,
        customer,
        product,
        "DELETE"
      );

      return res.status(200).json({
        success: true,
        liked: false,
        likes,
      });
    }
  } catch (error) {
    console.error("WISHLIST ERROR:", {
      name: error.name,
      message: error.message,
      status: errorStatus(error),
    });

    return res.status(500).json({
      success: false,
      error:
        "Unable to update wishlist. Check your server terminal.",
    });
  }
}
