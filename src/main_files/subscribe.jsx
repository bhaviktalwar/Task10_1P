import React, { useState } from "react";

function Subscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // null | "sending" | "success" | "error"
  const [errorMsg, setErrorMsg] = useState("");

  const subscribeUrl = process.env.REACT_APP_SUBSCRIBE_URL || "http://localhost:5000/subscribe";

  async function handleSubscribe(e) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch(subscribeUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed: ${res.status}`);
      }

      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Unknown error");
    }
  }

  return (
    <div
      style={{
        backgroundColor: "#f2f2f2",
        padding: "16px",
        width: "100%",
        textAlign: "center",
        margin: "10px 0",
        borderRadius: 6,
      }}
    >
      <form onSubmit={handleSubscribe} style={{ display: "inline-flex", alignItems: "center" }}>
        <strong style={{ marginRight: 12 }}>SIGN UP FOR OUR DAILY INSIDER</strong>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: "8px",
            marginRight: "8px",
            width: "260px",
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
          aria-label="Email address"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          style={{
            padding: "8px 16px",
            cursor: status === "sending" ? "not-allowed" : "pointer",
            backgroundColor: status === "sending" ? "#ddd" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: 4,
          }}
        >
          {status === "sending" ? "Sending..." : "Subscribe"}
        </button>
      </form>

      {status === "success" && (
        <div style={{ marginTop: 10, color: "green" }}>Thanks — check your inbox for a welcome email.</div>
      )}

      {status === "error" && (
        <div style={{ marginTop: 10, color: "#b00020" }}>Error: {errorMsg}</div>
      )}
    </div>
  );
}

export default Subscribe;
