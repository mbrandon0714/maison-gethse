"use client";

import { useState, useEffect, useCallback } from "react";

interface Submission {
  id: string;
  photographer_name: string;
  portfolio_link: string | null;
  caption: string | null;
  status: string;
  created_at: string;
}

export default function AdminPhotosPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filter, setFilter] = useState<string>("pending");

  const fetch_ = useCallback(() => {
    fetch("/api/admin/photos")
      .then(res => res.json())
      .then(data => { if (data.submissions) setSubmissions(data.submissions); })
      .catch(() => {});
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  const updateStatus = (id: string, status: string) => {
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    fetch("/api/admin/photos", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
  };

  const deleteSubmission = (id: string) => {
    setSubmissions(prev => prev.filter(s => s.id !== id));
    fetch("/api/admin/photos", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
  };

  const filtered = filter === "all" ? submissions : submissions.filter(s => s.status === filter);
  const counts = { pending: submissions.filter(s => s.status === "pending").length, approved: submissions.filter(s => s.status === "approved").length, rejected: submissions.filter(s => s.status === "rejected").length };

  return (
    <div style={{ minHeight: "100vh", background: "#0f130f", color: "#d8d4ce", fontFamily: "system-ui, sans-serif", padding: 24 }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontSize: 24, fontWeight: 300, marginBottom: 8, color: "#f4f1ec" }}>Photo Submissions</h1>
        <p style={{ fontSize: 14, opacity: 0.5, marginBottom: 24 }}>Review photographer submissions for The Lens.</p>

        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {(["pending", "approved", "rejected", "all"] as const).map(tab => (
            <button key={tab} onClick={() => setFilter(tab)}
              style={{ padding: "8px 16px", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", background: filter === tab ? "#c8922a" : "rgba(255,255,255,0.06)", color: filter === tab ? "#0f130f" : "#d8d4ce" }}>
              {tab} {tab !== "all" && `(${counts[tab as keyof typeof counts]})`}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p style={{ opacity: 0.3, fontSize: 14, paddingTop: 40, textAlign: "center" }}>No {filter} submissions.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map(sub => (
              <div key={sub.id} style={{ padding: 20, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
                  <div>
                    <p style={{ fontSize: 16, fontWeight: 500, color: "#f4f1ec" }}>{sub.photographer_name}</p>
                    {sub.portfolio_link && <a href={sub.portfolio_link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "#c8922a", textDecoration: "underline" }}>{sub.portfolio_link}</a>}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em", color: sub.status === "approved" ? "#4ade80" : sub.status === "rejected" ? "#f87171" : "#c8922a" }}>
                    {sub.status}
                  </span>
                </div>
                {sub.caption && <p style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.7, marginBottom: 12 }}>&ldquo;{sub.caption}&rdquo;</p>}
                <p style={{ fontSize: 12, opacity: 0.4, marginBottom: 12 }}>{new Date(sub.created_at).toLocaleDateString()}</p>

                <div style={{ display: "flex", gap: 8 }}>
                  {sub.status !== "approved" && <button onClick={() => updateStatus(sub.id, "approved")} style={{ padding: "8px 20px", background: "#303d30", color: "#f4f1ec", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 500 }}>✓ Approve</button>}
                  {sub.status !== "rejected" && <button onClick={() => updateStatus(sub.id, "rejected")} style={{ padding: "8px 20px", background: "rgba(255,255,255,0.06)", color: "#d8d4ce", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>✗ Reject</button>}
                  <button onClick={() => deleteSubmission(sub.id)} style={{ padding: "8px 20px", background: "rgba(248,113,113,0.1)", color: "#f87171", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, marginLeft: "auto" }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
