"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/components/CartProvider";
import { KeyIcon } from "@/components/KeyIcon";

const SHIPPING_FEE = 80;

const PROVINCES = [
  "Metro Manila", "Abra", "Agusan del Norte", "Agusan del Sur", "Aklan", "Albay",
  "Antique", "Apayao", "Aurora", "Bataan", "Batanes", "Batangas", "Benguet",
  "Biliran", "Bohol", "Bukidnon", "Bulacan", "Cagayan", "Camarines Norte",
  "Camarines Sur", "Camiguin", "Capiz", "Catanduanes", "Cavite", "Cebu",
  "Davao de Oro", "Davao del Norte", "Davao del Sur", "Davao Occidental",
  "Davao Oriental", "Dinagat Islands", "Eastern Samar", "Guimaras", "Ifugao",
  "Ilocos Norte", "Ilocos Sur", "Iloilo", "Isabela", "Kalinga", "La Union",
  "Laguna", "Lanao del Norte", "Lanao del Sur", "Leyte", "Marinduque", "Masbate",
  "Misamis Occidental", "Misamis Oriental", "Mountain Province", "Negros Occidental",
  "Negros Oriental", "Northern Samar", "Nueva Ecija", "Nueva Vizcaya",
  "Occidental Mindoro", "Oriental Mindoro", "Palawan", "Pampanga", "Pangasinan",
  "Quezon", "Quirino", "Rizal", "Romblon", "Samar", "Sarangani", "Siquijor",
  "Sorsogon", "South Cotabato", "Southern Leyte", "Sultan Kudarat", "Sulu",
  "Surigao del Norte", "Surigao del Sur", "Tarlac", "Tawi-Tawi", "Zambales",
  "Zamboanga del Norte", "Zamboanga del Sur", "Zamboanga Sibugay",
];

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "", firstName: "", lastName: "", phone: "",
    address: "", city: "", province: "", zip: "",
  });

  const total = subtotal + SHIPPING_FEE;
  const canSubmit = form.email && form.firstName && form.lastName && form.phone && form.address && form.city && form.province && items.length > 0;

  const setField = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const handleCheckout = async () => {
    if (!canSubmit || loading) return;
    setLoading(true);
    const mainItem = items[0];
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: mainItem.name,
          price: mainItem.price,
          quantity: items.reduce((s, i) => s + i.quantity, 0),
          size: items.map(i => `${i.size}×${i.quantity}`).join(", "),
          customer: form,
        }),
      });
      const data = await res.json();
      if (data.checkout_url) { clearCart(); window.location.href = data.checkout_url; }
      else { alert(data.error || "Something went wrong."); setLoading(false); }
    } catch { alert("Connection error."); setLoading(false); }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: "var(--bg-body)" }}>
        <KeyIcon size={40} className="mb-6 opacity-20" />
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", fontWeight: 300, fontStyle: "italic", color: "var(--text-head)", marginBottom: 16 }}>Your cart is empty.</h1>
        <a href="/chapters/01" style={{ fontFamily: "var(--font-sans)", fontSize: 14, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold)", textDecoration: "none" }}>← Browse Chapter 01</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#f8f6f2", color: "#2a2a28" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid #e5e1db", padding: "18px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="/home" style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: "#2a2a28", textDecoration: "none" }}>Maison Gethse</a>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999" }}>Secure Checkout</span>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px", display: "grid", gridTemplateColumns: "1fr", gap: 40 }} className="md:!grid-cols-[1fr_400px]">
        {/* Left — Form */}
        <div>
          {/* Contact */}
          <h2 style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 600, letterSpacing: "0.06em", color: "#2a2a28", marginBottom: 16 }}>Contact Information</h2>
          <input type="email" value={form.email} onChange={e => setField("email", e.target.value)} placeholder="Email address" autoComplete="email"
            style={{ width: "100%", padding: "16px 18px", fontSize: 16, fontFamily: "var(--font-sans)", border: "1px solid #d4d0ca", borderRadius: 6, background: "#fff", color: "#2a2a28", outline: "none", marginBottom: 32 }} />

          {/* Delivery */}
          <h2 style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 600, letterSpacing: "0.06em", color: "#2a2a28", marginBottom: 16 }}>Delivery</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <input type="text" value={form.firstName} onChange={e => setField("firstName", e.target.value)} placeholder="First name" autoComplete="given-name"
              style={{ padding: "16px 18px", fontSize: 16, fontFamily: "var(--font-sans)", border: "1px solid #d4d0ca", borderRadius: 6, background: "#fff", color: "#2a2a28", outline: "none" }} />
            <input type="text" value={form.lastName} onChange={e => setField("lastName", e.target.value)} placeholder="Last name" autoComplete="family-name"
              style={{ padding: "16px 18px", fontSize: 16, fontFamily: "var(--font-sans)", border: "1px solid #d4d0ca", borderRadius: 6, background: "#fff", color: "#2a2a28", outline: "none" }} />
          </div>

          <input type="text" value={form.address} onChange={e => setField("address", e.target.value)} placeholder="Street address" autoComplete="street-address"
            style={{ width: "100%", padding: "16px 18px", fontSize: 16, fontFamily: "var(--font-sans)", border: "1px solid #d4d0ca", borderRadius: 6, background: "#fff", color: "#2a2a28", outline: "none", marginBottom: 12 }} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <input type="text" value={form.zip} onChange={e => setField("zip", e.target.value)} placeholder="Postal code" autoComplete="postal-code"
              style={{ padding: "16px 18px", fontSize: 16, fontFamily: "var(--font-sans)", border: "1px solid #d4d0ca", borderRadius: 6, background: "#fff", color: "#2a2a28", outline: "none" }} />
            <input type="text" value={form.city} onChange={e => setField("city", e.target.value)} placeholder="City / Municipality" autoComplete="address-level2"
              style={{ padding: "16px 18px", fontSize: 16, fontFamily: "var(--font-sans)", border: "1px solid #d4d0ca", borderRadius: 6, background: "#fff", color: "#2a2a28", outline: "none" }} />
          </div>

          {/* Province dropdown */}
          <select value={form.province} onChange={e => setField("province", e.target.value)}
            style={{ width: "100%", padding: "16px 18px", fontSize: 16, fontFamily: "var(--font-sans)", border: "1px solid #d4d0ca", borderRadius: 6, background: "#fff", color: form.province ? "#2a2a28" : "#999", outline: "none", appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23999' stroke-width='1.5' fill='none'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 18px center", marginBottom: 12 }}>
            <option value="" disabled>Province / Region</option>
            {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>

          <input type="tel" value={form.phone} onChange={e => setField("phone", e.target.value)} placeholder="Phone (09XX XXX XXXX)" autoComplete="tel"
            style={{ width: "100%", padding: "16px 18px", fontSize: 16, fontFamily: "var(--font-sans)", border: "1px solid #d4d0ca", borderRadius: 6, background: "#fff", color: "#2a2a28", outline: "none", marginBottom: 32 }} />

          {/* Shipping */}
          <h2 style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 600, letterSpacing: "0.06em", color: "#2a2a28", marginBottom: 12 }}>Shipping Method</h2>
          <div style={{ padding: "18px 20px", border: "2px solid #c8922a", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, background: "rgba(200,146,42,0.04)" }}>
            <div>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 500, color: "#2a2a28" }}>J&T Express — Nationwide</p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#888", marginTop: 3 }}>3-5 business days</p>
            </div>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 600, color: "#2a2a28" }}>₱{SHIPPING_FEE}</p>
          </div>

          {/* Payment */}
          <h2 style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 600, letterSpacing: "0.06em", color: "#2a2a28", marginBottom: 12 }}>Payment</h2>
          <div style={{ padding: "20px", border: "1px solid #d4d0ca", borderRadius: 8, marginBottom: 32, background: "#fff" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, color: "#555", lineHeight: 1.8 }}>
              You will be securely redirected to PayMongo to complete your payment.
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, color: "#2a2a28", marginTop: 12 }}>
              Accepted: GCash · Maya · Debit/Credit Card
            </p>
          </div>

          {/* Place order */}
          <button onClick={handleCheckout} disabled={!canSubmit || loading}
            style={{ width: "100%", padding: "20px 0", fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#fff", background: canSubmit && !loading ? "#303d30" : "#aaa", border: "none", borderRadius: 8, cursor: canSubmit && !loading ? "pointer" : "not-allowed", transition: "background 0.3s" }}>
            {loading ? "Redirecting to payment..." : `Pay ₱${total.toLocaleString()}`}
          </button>

          <p style={{ marginTop: 16, textAlign: "center", fontFamily: "var(--font-sans)", fontSize: 13, color: "#999" }}>
            🔒 Your information is encrypted and secure.
          </p>
        </div>

        {/* Right — Order summary */}
        <div style={{ background: "#fff", padding: 28, borderRadius: 12, border: "1px solid #e5e1db", alignSelf: "start", position: "sticky", top: 24 }}>
          <h2 style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 600, letterSpacing: "0.06em", color: "#2a2a28", marginBottom: 20 }}>Order Summary</h2>

          {items.map(item => (
            <div key={`${item.id}-${item.size}`} style={{ display: "flex", gap: 16, marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid #eee" }}>
              <div style={{ width: 72, height: 90, position: "relative", overflow: "hidden", flexShrink: 0, borderRadius: 6, background: "#f0ede8" }}>
                <Image src={item.image} alt={item.name} fill style={{ objectFit: "cover" }} sizes="72px" />
                <span style={{ position: "absolute", top: -2, right: -2, width: 22, height: 22, borderRadius: "50%", background: "#c8922a", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{item.quantity}</span>
              </div>
              <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 500, color: "#2a2a28" }}>{item.name}</p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#888", marginTop: 3 }}>Size {item.size} · {item.color}</p>
                </div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 500, color: "#2a2a28" }}>₱{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            </div>
          ))}

          <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-sans)", fontSize: 15, color: "#666" }}>
              <span>Subtotal</span><span style={{ color: "#2a2a28" }}>₱{subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-sans)", fontSize: 15, color: "#666" }}>
              <span>Shipping</span><span style={{ color: "#2a2a28" }}>₱{SHIPPING_FEE}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 14, marginTop: 6, borderTop: "2px solid #eee", fontFamily: "var(--font-serif)", fontSize: "1.4rem", fontWeight: 500, color: "#2a2a28" }}>
              <span>Total</span><span>₱{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
