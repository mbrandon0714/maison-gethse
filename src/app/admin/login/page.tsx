"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        window.location.href = "/admin";
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Wrong password");
        setLoading(false);
      }
    } catch {
      setError("Connection error");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f130f", color: "#d8d4ce", fontFamily: "system-ui, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <form onSubmit={submit} style={{ maxWidth: 360, width: "100%", textAlign: "center" }}>
        <h1 style={{ fontSize: 24, fontWeight: 300, color: "#f4f1ec", marginBottom: 4 }}>Maison Gethse</h1>
        <p style={{ fontSize: 13, opacity: 0.4, marginBottom: 32 }}>Admin Access</p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 6, color: "#f4f1ec", fontSize: 15, outline: "none", marginBottom: 12 }}
        />

        {error && <p style={{ fontSize: 13, color: "#f87171", marginBottom: 12 }}>{error}</p>}

        <button
          type="submit"
          disabled={!password || loading}
          style={{ width: "100%", padding: "14px 0", background: "#c8922a", color: "#0f130f", border: "none", borderRadius: 6, fontSize: 14, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", cursor: password && !loading ? "pointer" : "not-allowed", opacity: password && !loading ? 1 : 0.5 }}
        >
          {loading ? "Checking…" : "Enter"}
        </button>
      </form>
    </div>
  );
}
