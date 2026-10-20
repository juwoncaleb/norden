// pages/api/refer.js
import nodemailer from "nodemailer";

const TO = "info@norden.org";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const email = String(req.body?.email || "").trim();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return res.status(400).json({ error: "Please enter a valid email." });
  }

  try {
    const port = Number(process.env.SMTP_PORT || 465);
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"Norden Club" <${process.env.SMTP_USER}>`,
      to: TO,
      replyTo: email,
      subject: "New Norden Club referral signup",
      text: `A new email was submitted on the Norden Club page:\n\n${email}\n`,
      html: `<p>A new email was submitted on the Norden Club page:</p><p><strong>${email.replace(/[<>&]/g, "")}</strong></p>`,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Referral email failed:", err);
    return res.status(500).json({ error: "Could not send. Please try again." });
  }
}