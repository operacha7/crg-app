const fetch = require("node-fetch");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { recipient, subject, htmlBody, cc } = JSON.parse(event.body);

    const payload = {
      from: "info@crghouston.org",
      to: recipient,
      subject,
      html: htmlBody,
      ...(cc && { cc }),
    };

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Resend error:", data);
      return {
        statusCode: res.status,
        body: JSON.stringify({ success: false, message: data.message || "Send failed" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, id: data.id }),
    };
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: error.message }),
    };
  }
};