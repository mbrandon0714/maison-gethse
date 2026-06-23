"use client";

export default function AdminPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0f130f", color: "#d8d4ce", fontFamily: "system-ui, sans-serif", padding: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: 500, width: "100%", textAlign: "center" }}>
        <h1 style={{ fontSize: 28, fontWeight: 300, color: "#f4f1ec", marginBottom: 8 }}>Maison Gethse</h1>
        <p style={{ fontSize: 14, opacity: 0.4, marginBottom: 40 }}>Admin Dashboard</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { label: "Garden Seeds", desc: "Approve or reject community stories", href: "/admin/garden" },
            { label: "Orders", desc: "Track and manage customer orders", href: "/admin/orders" },
            { label: "Photo Submissions", desc: "Review photographer submissions", href: "/admin/photos" },
          ].map(item => (
            <a key={item.href} href={item.href} style={{ display: "block", padding: 24, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, textDecoration: "none", textAlign: "left", transition: "border-color 0.3s" }}
              onMouseOver={e => (e.currentTarget.style.borderColor = "rgba(200,146,42,0.3)")}
              onMouseOut={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}>
              <p style={{ fontSize: 18, fontWeight: 400, color: "#f4f1ec", marginBottom: 4 }}>{item.label}</p>
              <p style={{ fontSize: 13, color: "#d8d4ce", opacity: 0.5 }}>{item.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
