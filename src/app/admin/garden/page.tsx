"use client";

import { useState, useEffect, useCallback } from "react";

interface Seed {
  id: string;
  text: string;
  prompt: string;
  identity_type: string;
  display_name: string | null;
  status: string;
  created_at: string;
}

export default function AdminGardenPage() {
  const [seeds, setSeeds] = useState<Seed[]>([]);
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");

  const fetchSeeds = useCallback(() => {
    fetch("/api/admin/garden")
      .then(res => res.json())
      .then(data => { if (data.seeds) setSeeds(data.seeds); })
      .catch(() => {});
  }, []);

  useEffect(() => { fetchSeeds(); }, [fetchSeeds]);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/garden", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchSeeds();
  };

  const deleteSeed = async (id: string) => {
    if (!confirm("Delete this seed permanently?")) return;
    await fetch("/api/admin/garden", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchSeeds();
  };

  const filtered = filter === "all" ? seeds : seeds.filter(s => s.status === filter);
  const counts = {
    pending: seeds.filter(s => s.status === "pending").length,
    approved: seeds.filter(s => s.status === "approved").length,
    rejected: seeds.filter(s => s.status === "rejected").length,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f130f", color: "#d8d4ce", fontFamily: "system-ui, sans-serif", padding: "24px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontSize: 24, fontWeight: 300, marginBottom: 8, color: "#f4f1ec" }}>Garden — Seed Moderation</h1>
        <p style={{ fontSize: 14, opacity: 0.5, marginBottom: 24 }}>Approve or reject community submissions.</p>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {(["pending", "approved", "rejected", "all"] as const).map(tab => (
            <button key={tab} onClick={() => setFilter(tab)}
              style={{
                padding: "8px 16px", border: "none", borderRadius: 4, cursor: "pointer",
                fontSize: 13, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em",
                background: filter === tab ? "#c8922a" : "rgba(255,255,255,0.06)",
                color: filter === tab ? "#0f130f" : "#d8d4ce",
              }}>
              {tab} {tab !== "all" && `(${counts[tab]})`}
            </button>
          ))}
        </div>

        {/* Seeds list */}
        {filtered.length === 0 ? (
          <p style={{ opacity: 0.3, fontSize: 14, paddingTop: 40, textAlign: "center" }}>No {filter} seeds.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map(seed => (
              <div key={seed.id} style={{ padding: 20, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8 }}>
                {/* Prompt */}
                <p style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c8922a", opacity: 0.6, marginBottom: 8 }}>
                  {seed.prompt}
                </p>

                {/* Text */}
                <p style={{ fontSize: 16, lineHeight: 1.7, color: "#f4f1ec", marginBottom: 12 }}>
                  &ldquo;{seed.text}&rdquo;
                </p>

                {/* Meta */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 12, opacity: 0.4 }}>
                    — {seed.identity_type === "anonymous" ? "Anonymous" : seed.display_name || "Anonymous"} · {new Date(seed.created_at).toLocaleDateString()}
                  </span>
                  <span style={{
                    fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em",
                    color: seed.status === "approved" ? "#4ade80" : seed.status === "rejected" ? "#f87171" : "#c8922a",
                  }}>
                    {seed.status}
                  </span>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8 }}>
                  {seed.status !== "approved" && (
                    <button onClick={() => updateStatus(seed.id, "approved")}
                      style={{ padding: "8px 20px", background: "#303d30", color: "#f4f1ec", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 500 }}>
                      ✓ Approve
                    </button>
                  )}
                  {seed.status !== "rejected" && (
                    <button onClick={() => updateStatus(seed.id, "rejected")}
                      style={{ padding: "8px 20px", background: "rgba(255,255,255,0.06)", color: "#d8d4ce", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>
                      ✗ Reject
                    </button>
                  )}
                  {seed.status !== "pending" && (
                    <button onClick={() => updateStatus(seed.id, "pending")}
                      style={{ padding: "8px 20px", background: "rgba(255,255,255,0.06)", color: "#d8d4ce", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>
                      ↩ Back to Pending
                    </button>
                  )}
                  <button onClick={() => deleteSeed(seed.id)}
                    style={{ padding: "8px 20px", background: "rgba(248,113,113,0.1)", color: "#f87171", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, marginLeft: "auto" }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
