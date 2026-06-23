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
  "Davao Oriental", "Eastern Samar", "Guimaras", "Ifugao", "Ilocos Norte",
  "Ilocos Sur", "Iloilo", "Isabela", "Kalinga", "La Union", "Laguna",
  "Lanao del Norte", "Lanao del Sur", "Leyte", "Marinduque", "Masbate",
  "Misamis Occidental", "Misamis Oriental", "Mountain Province", "Negros Occidental",
  "Negros Oriental", "Northern Samar", "Nueva Ecija", "Nueva Vizcaya",
  "Occidental Mindoro", "Oriental Mindoro", "Palawan", "Pampanga", "Pangasinan",
  "Quezon", "Quirino", "Rizal", "Romblon", "Samar", "Sarangani", "Siquijor",
  "Sorsogon", "South Cotabato", "Southern Leyte", "Sultan Kudarat", "Sulu",
  "Surigao del Norte", "Surigao del Sur", "Tarlac", "Tawi-Tawi", "Zambales",
  "Zamboanga del Norte", "Zamboanga del Sur", "Zamboanga Sibugay",
];

function FloatingInput({ label, value, onChange, type = "text", autoComplete }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; autoComplete?: string;
}) {
  return (
    <div style={{ position: "relative" }}>
      <input
        type={type}
        value={value}
        onChange={e => {
          if (type === "tel") {
            const nums = e.target.value.replace(/[^0-9+]/g, "");
            onChange(nums);
          } else {
            onChange(e.target.value);
          }
        }}
        autoComplete={autoComplete}
        placeholder=" "
        style={{
          width: "100%", padding: "22px 16px 10px", fontSize: 16, fontFamily: "var(--font-sans)",
          border: "1px solid #3a3a38", borderRadius: 6, background: "#2a2a28", color: "#e8e4de",
          outline: "none", transition: "border-color 0.3s",
        }}
        onFocus={e => e.target.style.borderColor = "#c8922a"}
        onBlur={e => e.target.style.borderColor = "#3a3a38"}
      />
      <label style={{
        position: "absolute", left: 16, transition: "all 0.2s",
        top: value ? 6 : 16, fontSize: value ? 10 : 16,
        letterSpacing: value ? "0.08em" : "0",
        textTransform: value ? "uppercase" : "none",
        color: value ? "#c8922a" : "#777", pointerEvents: "none",
        fontFamily: "var(--font-sans)", fontWeight: value ? 500 : 300,
      }}>
        {label}
      </label>
    </div>
  );
}

function FloatingSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div style={{ position: "relative" }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%", padding: "22px 16px 10px", fontSize: 16, fontFamily: "var(--font-sans)",
          border: "1px solid #3a3a38", borderRadius: 6, background: "#2a2a28", color: value ? "#e8e4de" : "#777",
          outline: "none", appearance: "none", transition: "border-color 0.3s",
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23777' stroke-width='1.5' fill='none'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center",
        }}
        onFocus={e => e.target.style.borderColor = "#c8922a"}
        onBlur={e => e.target.style.borderColor = "#3a3a38"}
      >
        <option value="" disabled> </option>
        {options.map(o => <option key={o} value={o} style={{ background: "#2a2a28", color: "#e8e4de" }}>{o}</option>)}
      </select>
      <label style={{
        position: "absolute", left: 16, transition: "all 0.2s",
        top: value ? 6 : 16, fontSize: value ? 10 : 16,
        letterSpacing: value ? "0.08em" : "0",
        textTransform: value ? "uppercase" : "none",
        color: value ? "#c8922a" : "#777", pointerEvents: "none",
        fontFamily: "var(--font-sans)", fontWeight: value ? 500 : 300,
      }}>
        {label}
      </label>
    </div>
  );
}

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
          name: mainItem.name, price: mainItem.price,
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
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: "#1a1d1a" }}>
        <KeyIcon size={40} className="mb-6 opacity-20" />
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", fontWeight: 300, fontStyle: "italic", color: "#e8e4de", marginBottom: 16 }}>Your cart is empty.</h1>
        <a href="/chapters/01" style={{ fontFamily: "var(--font-sans)", fontSize: 14, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c8922a", textDecoration: "none" }}>← Browse Chapter 01</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#1a1d1a", color: "#e8e4de" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid #2a2a28", padding: "18px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="/home" style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: "#e8e4de", textDecoration: "none" }}>Maison Gethse</a>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", color: "#666" }}>Secure Checkout</span>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }} className="grid gap-10 md:!grid-cols-[1fr_380px]">
        {/* Left — Form */}
        <div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", fontWeight: 300, color: "#e8e4de", marginBottom: 24 }}>
            Where should we send your <em style={{ fontStyle: "italic", color: "#c8922a" }}>chapter?</em>
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <FloatingInput label="First name" value={form.firstName} onChange={v => setField("firstName", v)} autoComplete="given-name" />
              <FloatingInput label="Last name" value={form.lastName} onChange={v => setField("lastName", v)} autoComplete="family-name" />
            </div>
            <FloatingInput label="Email address" value={form.email} onChange={v => setField("email", v)} type="email" autoComplete="email" />
            <FloatingInput label="Phone number" value={form.phone} onChange={v => setField("phone", v)} type="tel" autoComplete="tel" />

            <div style={{ height: 8 }} />

            <FloatingInput label="Street address" value={form.address} onChange={v => setField("address", v)} autoComplete="street-address" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <FloatingInput label="City / Municipality" value={form.city} onChange={v => setField("city", v)} autoComplete="address-level2" />
              <FloatingInput label="Postal code" value={form.zip} onChange={v => setField("zip", v)} autoComplete="postal-code" />
            </div>
            <FloatingSelect label="Province / Region" value={form.province} onChange={v => setField("province", v)} options={PROVINCES} />
          </div>

          {/* Shipping */}
          <div style={{ marginTop: 32, marginBottom: 32 }}>
            <h3 style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888", marginBottom: 12 }}>Shipping</h3>
            <div style={{ padding: "18px 20px", border: "2px solid #c8922a", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(200,146,42,0.05)" }}>
              <div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 500, color: "#e8e4de" }}>J&T Express — Nationwide</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#777", marginTop: 3 }}>3-5 business days</p>
              </div>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 600, color: "#e8e4de" }}>₱{SHIPPING_FEE}</p>
            </div>
          </div>

          {/* Payment */}
          <div style={{ padding: "20px", border: "1px solid #2a2a28", borderRadius: 8, marginBottom: 28, background: "rgba(255,255,255,0.02)" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, color: "#aaa", lineHeight: 1.8 }}>
              You will be securely redirected to complete payment.
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, color: "#e8e4de", marginTop: 10 }}>
              Accepted: GCash · Maya · Debit/Credit Card
            </p>
          </div>

          {/* Place order */}
          <button onClick={handleCheckout} disabled={!canSubmit || loading}
            style={{ width: "100%", padding: "20px 0", fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#fff", background: canSubmit && !loading ? "#303d30" : "#444", border: "none", borderRadius: 8, cursor: canSubmit && !loading ? "pointer" : "not-allowed", transition: "all 0.3s" }}>
            {loading ? "Redirecting to payment..." : `Pay ₱${total.toLocaleString()}`}
          </button>

          <p style={{ marginTop: 14, textAlign: "center", fontFamily: "var(--font-sans)", fontSize: 13, color: "#666" }}>
            🔒 Encrypted & secure
          </p>
        </div>

        {/* Right — Order summary */}
        <div style={{ background: "#222522", padding: 28, borderRadius: 12, border: "1px solid #2a2a28", alignSelf: "start", position: "sticky", top: 24 }}>
          <h3 style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888", marginBottom: 20 }}>Order Summary</h3>

          {items.map(item => (
            <div key={`${item.id}-${item.size}`} style={{ display: "flex", gap: 16, marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid #2a2a28" }}>
              <div style={{ width: 72, height: 90, position: "relative", overflow: "hidden", flexShrink: 0, borderRadius: 8, background: "#1a1d1a" }}>
                <Image src={item.image} alt={item.name} fill style={{ objectFit: "cover" }} sizes="72px" />
                <span style={{ position: "absolute", top: -2, right: -2, width: 22, height: 22, borderRadius: "50%", background: "#c8922a", color: "#1a1d1a", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{item.quantity}</span>
              </div>
              <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 500, color: "#e8e4de" }}>{item.name}</p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#777", marginTop: 3 }}>Size {item.size} · {item.color}</p>
                </div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 500, color: "#e8e4de" }}>₱{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            </div>
          ))}

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-sans)", fontSize: 15, color: "#888" }}>
              <span>Subtotal</span><span style={{ color: "#e8e4de" }}>₱{subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-sans)", fontSize: 15, color: "#888" }}>
              <span>Shipping</span><span style={{ color: "#e8e4de" }}>₱{SHIPPING_FEE}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 14, marginTop: 6, borderTop: "2px solid #333", fontFamily: "var(--font-serif)", fontSize: "1.4rem", fontWeight: 500, color: "#e8e4de" }}>
              <span>Total</span><span>₱{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
