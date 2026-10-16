// Verifies a Paystack payment on the server and checks the amount
// against your real Contentful prices.

async function getServerTotal(cart) {
  const ids = cart.map((c) => c.id).join(",");
  const url =
    `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}` +
    `/environments/master/entries?sys.id[in]=${ids}` +
    `&access_token=${process.env.CONTENTFUL_ACCESS_TOKEN}`;

  const r = await fetch(url);
  if (!r.ok) throw new Error("Contentful fetch failed");
  const data = await r.json();

  const priceById = {};
  data.items.forEach((entry) => {
    // ASSUMPTION: your price field is called "price". Change if different.
    priceById[entry.sys.id] = Number(entry.fields.price);
  });

  return cart.reduce((sum, c) => {
    const price = priceById[c.id];
    if (!price) throw new Error("Unknown product: " + c.id);
    return sum + price * Number(c.quantity);
  }, 0);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { reference } = req.body || {};
  if (!reference) return res.status(400).json({ error: "Missing reference" });

  try {
    const r = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
    );
    const data = await r.json();

    if (!data.status || data.data.status !== "success") {
      return res.status(400).json({ verified: false });
    }

    const cart = data.data.metadata?.cart || [];
    const expected = await getServerTotal(cart);

    // Paystack amount is in kobo
    if (data.data.amount !== Math.round(expected * 100)) {
      console.error("Amount mismatch", data.data.amount, expected * 100);
      return res.status(400).json({ verified: false });
    }

    // TODO: save the order here (database / email / Contentful)

    return res.status(200).json({ verified: true, reference });
  } catch (e) {
    console.error("Verify error:", e);
    return res.status(500).json({ error: "Verification failed" });
  }
}