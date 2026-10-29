
import nodemailer from "nodemailer";

const RECIPIENT_EMAIL = "info@thenorden.org";

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function clean(value, maxLength = 500) {
  return typeof value === "string"
    ? value.trim().slice(0, maxLength)
    : "";
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");

    return res.status(405).json({
      success: false,
      message: "Method not allowed.",
    });
  }

  try {
    const body = req.body || {};

    // Basic spam honeypot
    if (body.websiteCheck) {
      return res.status(200).json({
        success: true,
        message: "Application received.",
      });
    }

    const application = {
      firstName: clean(body.firstName),
      lastName: clean(body.lastName),
      phone: clean(body.phone),
      email: clean(body.email),
      tradingName: clean(body.tradingName),
      businessNumber: clean(body.businessNumber),
      address: clean(body.address),
      industry: clean(body.industry),
      website: clean(body.website),
      social: clean(body.social),
      businessDetails: clean(body.businessDetails, 5000),
    };

    const {
      firstName,
      lastName,
      phone,
      email,
      tradingName,
      businessNumber,
      address,
      industry,
      website,
      social,
      businessDetails,
    } = application;

    // Validate required fields
    if (
      !firstName ||
      !phone ||
      !email ||
      !tradingName ||
      !address ||
      !industry ||
      !website ||
      body.consent !== true
    ) {
      return res.status(400).json({
        success: false,
        message: "Please complete all required fields.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // SMTP configuration
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 465);
    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASS;

    if (
      !smtpHost ||
      !smtpUser ||
      !smtpPassword
    ) {
      console.error(
        "Norden Trade: Missing SMTP configuration."
      );

      return res.status(500).json({
        success: false,
        message:
          "Email service is not configured. Please contact Norden support.",
      });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,

      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },

      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
    });

    const fields = [
      ["First Name", firstName],
      ["Last Name", lastName],
      ["Contact Number", phone],
      ["Email Address", email],
      ["Trading Name", tradingName],
      ["Business Number", businessNumber],
      ["Registered Address", address],
      ["Industry", industry],
      ["Business Website", website],
      ["Facebook / Instagram", social],
      ["About the Business", businessDetails],
    ];

    const rows = fields
      .map(
        ([label, value]) => `
          <tr>
            <td style="
              padding:14px;
              border-bottom:1px solid #e5ded5;
              font-weight:600;
              color:#803d24;
              vertical-align:top;
              width:180px;
            ">
              ${escapeHTML(label)}
            </td>

            <td style="
              padding:14px;
              border-bottom:1px solid #e5ded5;
              color:#333;
              vertical-align:top;
              white-space:pre-wrap;
            ">
              ${escapeHTML(value || "Not provided")}
            </td>
          </tr>
        `
      )
      .join("");

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
        </head>

        <body style="
          margin:0;
          padding:40px 15px;
          background:#f6f3e7;
          font-family:Arial,sans-serif;
        ">
          <div style="
            max-width:750px;
            margin:auto;
            background:#fff;
            padding:35px;
          ">
            <h1 style="
              margin:0 0 10px;
              font-size:32px;
              color:#803d24;
              letter-spacing:3px;
            ">
              NORDEN
            </h1>

            <p style="
              color:#888;
              font-size:12px;
              letter-spacing:2px;
              text-transform:uppercase;
            ">
              TRADE PROGRAM
            </p>

            <h2 style="
              margin-top:30px;
              font-size:25px;
              color:#302821;
            ">
              New Trade Application
            </h2>

            <p style="
              color:#666;
              line-height:1.8;
            ">
              A new application has been submitted
              through the Norden Trade page.
            </p>

            <table style="
              width:100%;
              border-collapse:collapse;
              margin-top:25px;
              font-size:14px;
            ">
              ${rows}
            </table>

            <div style="
              margin-top:35px;
              padding:20px;
              background:#f6f3e7;
              color:#55483e;
              font-size:14px;
              line-height:1.8;
            ">
              Reply to this email to contact the
              applicant directly.
            </div>

            <p style="
              margin-top:30px;
              color:#999;
              font-size:12px;
            ">
              Norden Trade Application System
            </p>
          </div>
        </body>
      </html>
    `;

    const text = [
      "NEW NORDEN TRADE APPLICATION",
      "",
      ...fields.map(
        ([label, value]) =>
          `${label}: ${value || "Not provided"}`
      ),
    ].join("\n");

    // Send application to Norden
    const info = await transporter.sendMail({
      from: {
        name: "Norden Trade",
        address: smtpUser,
      },

      to: RECIPIENT_EMAIL,

      replyTo: {
        name: `${firstName} ${lastName}`.trim(),
        address: email,
      },

      subject: `New Trade Application - ${tradingName.replace(
        /[\r\n]/g,
        " "
      )}`,

      html,
      text,
    });

    console.log(
      "Norden Trade application accepted by SMTP:",
      info.messageId
    );

    return res.status(200).json({
      success: true,
      message:
        "Your trade application has been submitted successfully.",
    });
  } catch (error) {
    console.error("Norden Trade Email Error:", {
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
      message: error.message,
    });

    if (
      error.code === "EAUTH" ||
      error.responseCode === 535
    ) {
      return res.status(500).json({
        success: false,
        message:
          "Our email service is temporarily unavailable. Please try again later.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "We couldn't submit your application. Please try again.",
    });
  }
}
