import React, { useState } from "react";

function EmailDialog({ onClose, selectedData, userDetails }) {
  const [recipient, setRecipient] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSend = async () => {
    setSending(true);
    try {
      const grouped = {};
      selectedData.forEach((item) => {
        const type = item["Assistance Type"];
        if (!grouped[type]) grouped[type] = [];
        grouped[type].push(item);
      });

      const emailHtml = Object.entries(grouped)
        .map(([type, entries]) => {
          const section = entries
            .map(
              (e) => `
              <div style="margin-bottom: 20px;">
                <strong>${e.Organization}</strong> &nbsp; ${e.Telephone}<br/>
                ${e.Address}<br/>
                ${e.Hours}<br/>
                <ul>
                  ${e.Requirements.split("\n")
                    .slice(0, 3)
                    .map((r) => `<li>${r}</li>`)
                    .join("\n")}
                </ul>
              </div>
            `
            )
            .join("\n");

          return `<h3>${type}</h3>${section}`;
        })
        .join("\n");

      const payload = {
        recipient,
        subject: "Community Resources You Requested",
        htmlBody: emailHtml,
        cc: userDetails["Copy to User"] ? userDetails["Org Email"] : null,
      };

      const emailServiceUrl = "/.netlify/functions/sendEmail";

      const res = await fetch(emailServiceUrl, {
        method: "POST",
        mode: "cors", // 🔥 This is essential to pass the preflight check
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        setStatus("✅ Email sent successfully.");
      } else {
        setStatus("❌ Email failed to send.");
      }
    } catch (err) {
      setStatus("🚨 Error sending email: " + err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "20%",
        left: "35%",
        width: "30%",
        padding: "20px",
        backgroundColor: "white",
        border: "1px solid #ccc",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.26)",
        zIndex: 1000,
      }}
    >
      <h3>Send Selected Resources</h3>
      <input
        type="text"
        placeholder="Recipient Email"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={onClose}>Cancel</button>
        <button onClick={handleSend} disabled={sending}>
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
      {status && <p style={{ marginTop: "10px" }}>{status}</p>}
    </div>
  );
}

export default EmailDialog;
