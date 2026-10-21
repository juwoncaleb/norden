import nodemailer from "nodemailer";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: Number(process.env.SMTP_PORT || 465) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req) {
  try {
    const { email, company } = await req.json();

    if (company) return Response.json({ ok: true }); // honeypot

    if (!email || !EMAIL_RE.test(email)) {
      return Response.json({ error: "Invalid email" }, { status: 400 });
    }

    await transporter.sendMail({
      from: `"Norden Website" <${process.env.SMTP_USER}>`,
      to: "info@norden.org",
      replyTo: email,
      subject: "New newsletter signup",
      text: `New subscriber from the website footer: ${email}`,
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Send failed" }, { status: 500 });
  }
}