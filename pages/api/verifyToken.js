// pages/api/verifyToken.js
import { getDecodedOAuthJwtGoogle } from "../../utils/tokedDecoder";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  const { token } = req.body;

  try {
    console.log("Received token:", token);
    const decodedToken = await getDecodedOAuthJwtGoogle(token);
    console.log("Decoded token:", decodedToken);
    return res.status(200).json(decodedToken);
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(500).json({ error: "Token verification failed" });
  }
}
