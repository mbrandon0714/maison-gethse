"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useCart } from "@/components/CartProvider";
import { KeyIcon } from "@/components/KeyIcon";

const SHIPPING_FEE = 80;

const CITY_PROVINCE: Record<string, string> = {
  "Manila": "Metro Manila", "Quezon City": "Metro Manila", "Makati": "Metro Manila",
  "Taguig": "Metro Manila", "Pasig": "Metro Manila", "Mandaluyong": "Metro Manila",
  "Marikina": "Metro Manila", "Parañaque": "Metro Manila", "Las Piñas": "Metro Manila",
  "Muntinlupa": "Metro Manila", "Caloocan": "Metro Manila",
  "Antipolo": "Rizal", "Cainta": "Rizal", "Taytay": "Rizal",
  "Bacoor": "Cavite", "Imus": "Cavite", "Dasmariñas": "Cavite", "Tagaytay": "Cavite",
  "San Pedro": "Laguna", "Santa Rosa": "Laguna", "Calamba": "Laguna",
  "San Jose del Monte": "Bulacan", "Malolos": "Bulacan",
  "Angeles City": "Pampanga", "San Fernando": "Pampanga",
  "Batangas City": "Batangas", "Lipa": "Batangas",
  "Baguio": "Benguet", "Cebu City": "Cebu", "Davao City": "Davao del Sur",
  "Iloilo City": "Iloilo", "Bacolod": "Negros Occidental",
  "Cagayan de Oro": "Misamis Oriental", "Zamboanga City": "Zamboanga del Sur",
  "General Santos": "South Cotabato", "Butuan": "Agusan del Norte",
  "Puerto Princesa": "Palawan", "Tacloban": "Leyte",
};
const CITIES = Object.keys(CITY_PROVINCE).sort();

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [form, setForm] = useState({
    email: "", firstName: "", lastName: "", phone: "",
    address: "", city: "", province: "", zip: "",
  });

  const total = subtotal + SHIPPING_FEE;
  const canSubmit = form.email && form.firstName && form.lastName && form.phone && form.address && form.city && form.province && items.length > 0;

  const filteredCities = useMemo(() => {
    if (!citySearch) return CITIES.slice(0, 20);
    return CITIES.filter(c => c.toLowerCase().includes(citySearch.toLowerCase())).slice(0, 20);
  }, [citySearch]);

  const setField = (k: string, v: string) => {
    const f = { ...form, [k]: v };
    if (k === "city" && CITY_PROVINCE[v]) f.province = CITY_PROVINCE[v];
    setForm(f);
  };

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
      if (data.checkout_url) {
        clearCart();
        window.location.href = data.checkout_url;
      } else {
        alert(data.error || "Something went wrong.");
        setLoading(false);
      }
    } catch {
      alert("Connection error. Please try again.");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: "var(--bg-body)" }}>
        <KeyIcon size={40} className="mb-6 opacity-20" />
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", fontWeight: 300, fontStyle: "italic", color: "var(--text-head)", marginBottom: 12 }}>Your cart is empty.</h1>
        <a href="/chapters/01" style={{ fontFamily: "var(--font-sans)", fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold)", textDecoration: "none", marginTop: 16 }}>← Browse Chapter 01</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-body)" }}>
      {/* Header */}
      <div className="border-b border-[var(--border-soft)] px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a href="/home" className="no-underline" style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: 300, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-head)" }}>Maison Gethse</a>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-body)", opacity: 0.5 }}>Checkout</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 grid md:grid-cols-[1fr_380px] gap-12">
        {/* Left — Form */}
        <div>
          {/* Contact */}
          <h2 style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-head)", marginBottom: 16 }}>Contact</h2>
          <input type="email" value={form.email} onChange={e => setField("email", e.target.value)} placeholder="Email" className="checkout-input" style={{ marginBottom: 24 }} />

          {/* Delivery */}
          <h2 style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-head)", marginBottom: 16 }}>Delivery</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <input type="text" value={form.firstName} onChange={e => setField("firstName", e.target.value)} placeholder="First name" className="checkout-input" />
            <input type="text" value={form.lastName} onChange={e => setField("lastName", e.target.value)} placeholder="Last name" className="checkout-input" />
          </div>
          <input type="text" value={form.address} onChange={e => setField("address", e.target.value)} placeholder="Address" className="checkout-input" style={{ marginBottom: 12 }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <input type="text" value={form.zip} onChange={e => setField("zip", e.target.value)} placeholder="Postal code" className="checkout-input" />
            <div style={{ position: "relative" }}>
              <input type="text" value={cityOpen ? citySearch : form.city} placeholder="City"
                onFocus={() => { setCityOpen(true); setCitySearch(""); }}
                onBlur={() => setTimeout(() => setCityOpen(false), 200)}
                onChange={e => setCitySearch(e.target.value)}
                className="checkout-input" />
              {cityOpen && (
                <div className="checkout-dropdown" data-lenis-prevent>
                  {filteredCities.length === 0 ? <div style={{ padding: 12, fontSize: 13, color: "var(--text-body)", opacity: 0.5 }}>No results</div> :
                    filteredCities.map(c => (
                      <button key={c} onMouseDown={() => { setField("city", c); setCitySearch(""); setCityOpen(false); }} className="checkout-dropdown-item">
                        {c} <span style={{ marginLeft: 8, fontSize: 11, opacity: 0.4 }}>{CITY_PROVINCE[c]}</span>
                      </button>
                    ))
                  }
                </div>
              )}
            </div>
          </div>
          <input type="text" value={form.province} placeholder="Province" disabled className="checkout-input" style={{ marginBottom: 12, opacity: 0.5 }} />
          <input type="tel" value={form.phone} onChange={e => setField("phone", e.target.value)} placeholder="Phone (09XX XXX XXXX)" className="checkout-input" style={{ marginBottom: 24 }} />

          {/* Shipping method */}
          <h2 style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-head)", marginBottom: 12 }}>Shipping Method</h2>
          <div style={{ padding: 16, border: "1px solid var(--gold)", borderRadius: 4, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, background: "rgba(200,146,42,0.04)" }}>
            <div>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--text-head)" }}>J&T Express — Nationwide</p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--text-body)", opacity: 0.5, marginTop: 2 }}>3-5 business days</p>
            </div>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500, color: "var(--text-head)" }}>₱{SHIPPING_FEE}</p>
          </div>

          {/* Payment info */}
          <h2 style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-head)", marginBottom: 12 }}>Payment</h2>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--text-body)", opacity: 0.6, lineHeight: 1.7, marginBottom: 24 }}>
            You will be redirected to our secure payment page powered by PayMongo. We accept GCash, Maya, and debit/credit cards.
          </p>

          {/* Place order */}
          <button onClick={handleCheckout} disabled={!canSubmit || loading}
            style={{ width: "100%", padding: "18px 0", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff", background: "var(--green)", border: "none", cursor: (canSubmit && !loading) ? "pointer" : "not-allowed", opacity: (canSubmit && !loading) ? 1 : 0.4 }}>
            {loading ? "Redirecting to payment..." : "Place Order"}
          </button>
        </div>

        {/* Right — Order summary */}
        <div className="md:border-l md:border-[var(--border-soft)] md:pl-10">
          <h2 style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-head)", marginBottom: 20 }}>Order Summary</h2>

          {items.map(item => (
            <div key={`${item.id}-${item.size}`} className="flex gap-4 mb-5 pb-5 border-b border-[var(--border-soft)]">
              <div className="w-16 h-20 relative overflow-hidden flex-shrink-0 bg-[var(--bg-mid)]">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                <span style={{ position: "absolute", top: -4, right: -4, width: 20, height: 20, borderRadius: "50%", background: "var(--gold)", color: "#0f130f", fontSize: 10, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>{item.quantity}</span>
              </div>
              <div className="flex-1 flex justify-between items-center">
                <div>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 400, color: "var(--text-head)" }}>{item.name}</p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--text-body)", marginTop: 2 }}>Size {item.size}</p>
                </div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--text-head)" }}>₱{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            </div>
          ))}

          <div className="flex flex-col gap-2 pt-2">
            <div className="flex justify-between" style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--text-body)" }}>
              <span>Subtotal</span><span>₱{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between" style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--text-body)" }}>
              <span>Shipping</span><span>₱{SHIPPING_FEE}</span>
            </div>
            <div className="flex justify-between pt-3 mt-2 border-t border-[var(--border-soft)]" style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", fontWeight: 400, color: "var(--text-head)" }}>
              <span>Total</span><span>₱{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
