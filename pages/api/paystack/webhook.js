import crypto from "crypto";

// Needed so we can read the raw body for signature checking
export const config = { api: { bodyParser: false } };

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const raw = await getRawBody(req);

  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(raw)
    .digest("hex");

  if (hash !== req.headers["x-paystack-signature"]) {
    return res.status(401).end();
  }

  const event = JSON.parse(raw.toString());

  if (event.event === "charge.success") {
    const reference = event.data.reference;
    // TODO: mark order as paid using `reference` (skip if already saved)
    console.log("Paid:", reference);
  }

  return res.status(200).end();
}