"use client";

import { useState, useEffect, useCallback } from "react";

interface Order {
  id: string;
  product_name: string;
  size: string;
  quantity: number;
  total: number;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_province: string;
  shipping_zip: string;
  status: string;
  tracking_number: string | null;
  created_at: string;
}

const STATUSES = ["paid", "processing", "packed", "shipped", "delivered"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>("all");

  const fetchOrders = useCallback(() => {
    fetch("/api/admin/orders")
      .then(res => res.json())
      .then(data => { if (data.orders) setOrders(data.orders); })
      .catch(() => {});
  }, []);

  useEffect(() => { fetchOrders(); const i = setInterval(fetchOrders, 30000); return () => clearInterval(i); }, [fetchOrders]);

  const updateStatus = (id: string, status: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    fetch("/api/admin/orders", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
  };

  const updateTracking = (id: string, tracking_number: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, tracking_number } : o));
    fetch("/api/admin/orders", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, tracking_number }) });
  };

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  return (
    <div style={{ minHeight: "100vh", background: "#0f130f", color: "#d8d4ce", fontFamily: "system-ui, sans-serif", padding: 24 }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ fontSize: 24, fontWeight: 300, marginBottom: 8, color: "#f4f1ec" }}>Orders</h1>
        <p style={{ fontSize: 14, opacity: 0.5, marginBottom: 24 }}>{orders.length} total orders</p>

        {/* Filter */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {["all", ...STATUSES].map(tab => (
            <button key={tab} onClick={() => setFilter(tab)}
              style={{ padding: "8px 16px", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", background: filter === tab ? "#c8922a" : "rgba(255,255,255,0.06)", color: filter === tab ? "#0f130f" : "#d8d4ce" }}>
              {tab} ({tab === "all" ? orders.length : orders.filter(o => o.status === tab).length})
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p style={{ opacity: 0.3, fontSize: 14, paddingTop: 40, textAlign: "center" }}>No {filter} orders.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map(order => (
              <div key={order.id} style={{ padding: 20, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
                  <div>
                    <p style={{ fontSize: 16, fontWeight: 500, color: "#f4f1ec", marginBottom: 4 }}>
                      {order.product_name} — Size {order.size} × {order.quantity}
                    </p>
                    <p style={{ fontSize: 13, opacity: 0.5 }}>
                      {new Date(order.created_at).toLocaleDateString()} · {new Date(order.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <p style={{ fontSize: 18, fontWeight: 400, color: "#f4f1ec" }}>₱{order.total.toLocaleString()}</p>
                </div>

                {/* Customer */}
                <div style={{ padding: 12, background: "rgba(255,255,255,0.02)", borderRadius: 4, marginBottom: 12, fontSize: 13, lineHeight: 1.8 }}>
                  <strong style={{ color: "#f4f1ec" }}>{order.customer_first_name} {order.customer_last_name}</strong><br />
                  {order.customer_email} · {order.customer_phone}<br />
                  {order.shipping_address}, {order.shipping_city}, {order.shipping_province} {order.shipping_zip}
                </div>

                {/* Status + actions */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em", marginRight: 8, color: order.status === "delivered" ? "#4ade80" : order.status === "shipped" ? "#60a5fa" : "#c8922a" }}>
                    {order.status}
                  </span>

                  {STATUSES.filter(s => s !== order.status).map(s => (
                    <button key={s} onClick={() => updateStatus(order.id, s)}
                      style={{ padding: "6px 14px", background: "rgba(255,255,255,0.06)", color: "#d8d4ce", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      → {s}
                    </button>
                  ))}
                </div>

                {/* Tracking */}
                {(order.status === "shipped" || order.status === "delivered") && (
                  <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      type="text"
                      placeholder="Tracking number"
                      defaultValue={order.tracking_number || ""}
                      onBlur={(e) => { if (e.target.value !== (order.tracking_number || "")) updateTracking(order.id, e.target.value); }}
                      style={{ flex: 1, padding: "8px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, color: "#f4f1ec", fontSize: 13, fontFamily: "monospace", outline: "none" }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
