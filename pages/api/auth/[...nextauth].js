

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "contentful-management";
import { createHash } from "crypto";

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const ENVIRONMENT_ID = process.env.CONTENTFUL_ENVIRONMENT || "master";
const LOCALE = process.env.CONTENTFUL_LOCALE || "en-US";
const CUSTOMER_TYPE = "project";

const FIELDS = {
  fullName: "fullName",
  googleId: "googleId",
  email: "email",
  profilePicture: "profilePicture",
  emailVerified: "emailVerified",
  lastLogin: "lastLogin",
  likedProducts: "likedProducts",
};

function field(value) {
  return { [LOCALE]: value };
}

function getClient() {
  if (!SPACE_ID || !process.env.CONTENTFUL_MANAGEMENT_TOKEN) {
    throw new Error("Missing Contentful configuration.");
  }
  return createClient(
    { accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN },
    { type: "plain" }
  );
}


function customerId(email) {
  return (
    "customer-" +
    createHash("sha256")
      .update(email.trim().toLowerCase())
      .digest("hex")
      .slice(0, 40)
  );
}

function reportError(stage, error) {
  const raw = String(error?.message || "");
  let parsed = null;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = null;
  }
  const safeDetails = parsed
    ? {
        status: parsed.status,
        statusText: parsed.statusText,
        message: parsed.message,
        validationDetails: parsed.details?.errors?.map((item) => ({
          name: item.name,
          path: item.path,
          message: item.message,
        })),
      }
    : {
        name: error?.name,
        message: "Request failed; inspect field IDs.",
      };
  console.error("CUSTOMER SYNC ERROR:", { stage, ...safeDetails });
}

async function findCustomer(client, email) {
  const normalized = email.trim().toLowerCase();
  let skip = 0;
  while (true) {
    const result = await client.entry.getMany({
      spaceId: SPACE_ID,
      environmentId: ENVIRONMENT_ID,
      query: { content_type: CUSTOMER_TYPE, limit: 100, skip },
    });
    const customer = result.items.find(
      (entry) =>
        String(entry.fields?.[FIELDS.email]?.[LOCALE] || "")
          .trim()
          .toLowerCase() === normalized
    );
    if (customer) return customer;
    skip += result.items.length;
    if (!result.items.length || skip >= result.total) return null;
  }
}

async function syncCustomer(user, account, profile) {
  const client = getClient();
  const email = user.email?.trim().toLowerCase();
  if (!email) throw new Error("Google email missing.");

  const name = user.name || email;
  const googleId = account?.providerAccountId || profile?.sub || "";
  const now = new Date().toISOString();

  let customer = await findCustomer(client, email);

  if (!customer) {
    try {
      await client.entry.createWithId({
        spaceId: SPACE_ID,
        environmentId: ENVIRONMENT_ID,
        contentTypeId: CUSTOMER_TYPE,
        entryId: customerId(email),
        entry: {
          fields: {
            [FIELDS.fullName]: field(name),
            [FIELDS.googleId]: field(googleId),
            [FIELDS.email]: field(email),
            [FIELDS.emailVerified]: field(true),
            [FIELDS.lastLogin]: field(now),
          },
        },
      });
    } catch (error) {
      reportError("createCustomer", error);
    }
  } else {
    try {
      await client.entry.update({
        spaceId: SPACE_ID,
        environmentId: ENVIRONMENT_ID,
        entryId: customer.sys.id,
        entry: {
          ...customer,
          fields: {
            ...customer.fields,
            [FIELDS.lastLogin]: field(now),
          },
        },
      });
    } catch (error) {
      reportError("updateCustomer", error);
    }
  }
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (
        account?.provider !== "google" ||
        !user?.email ||
        profile?.email_verified !== true
      ) {
        return false;
      }
      try {
        await syncCustomer(user, account, profile);
      } catch (error) {
        console.error(
          "Customer sync unsuccessful:",
          error?.name || "Unknown error"
        );
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);