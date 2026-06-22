"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import Image from "next/image";

interface Artifact {
  name: string;
  price: number;
  priceDisplay: string;
  image: string;
  chapter: string;
  sizes: { label: string; stock: number }[];
}

interface OrderOverlayProps {
  artifact: Artifact;
  isOpen: boolean;
  onClose: () => void;
}

const SHIPPING_FEE = 80;

const CITY_PROVINCE_MAP: Record<string, string> = {
  "Manila": "Metro Manila", "Quezon City": "Metro Manila", "Makati": "Metro Manila",
  "Taguig": "Metro Manila", "Pasig": "Metro Manila", "Mandaluyong": "Metro Manila",
  "Marikina": "Metro Manila", "Parañaque": "Metro Manila", "Las Piñas": "Metro Manila",
  "Muntinlupa": "Metro Manila", "Caloocan": "Metro Manila", "Malabon": "Metro Manila",
  "Navotas": "Metro Manila", "Valenzuela": "Metro Manila", "San Juan": "Metro Manila",
  "Pasay": "Metro Manila", "Pateros": "Metro Manila",
  "Antipolo": "Rizal", "Cainta": "Rizal", "Taytay": "Rizal", "Angono": "Rizal",
  "Bacoor": "Cavite", "Imus": "Cavite", "Dasmariñas": "Cavite", "General Trias": "Cavite",
  "Tagaytay": "Cavite", "San Pedro": "Laguna", "Biñan": "Laguna", "Santa Rosa": "Laguna",
  "Calamba": "Laguna", "Los Baños": "Laguna", "San Jose del Monte": "Bulacan",
  "Malolos": "Bulacan", "Meycauayan": "Bulacan", "Angeles City": "Pampanga",
  "San Fernando": "Pampanga", "Olongapo": "Zambales", "Batangas City": "Batangas",
  "Lipa": "Batangas", "Baguio": "Benguet", "Dagupan": "Pangasinan",
  "Laoag": "Ilocos Norte", "Vigan": "Ilocos Sur", "Tuguegarao": "Cagayan",
  "Naga": "Camarines Sur", "Legazpi": "Albay", "Iloilo City": "Iloilo",
  "Bacolod": "Negros Occidental", "Dumaguete": "Negros Oriental",
  "Cebu City": "Cebu", "Mandaue": "Cebu", "Lapu-Lapu": "Cebu",
  "Tacloban": "Leyte", "Tagbilaran": "Bohol", "Davao City": "Davao del Sur",
  "General Santos": "South Cotabato", "Cagayan de Oro": "Misamis Oriental",
  "Zamboanga City": "Zamboanga del Sur", "Butuan": "Agusan del Norte",
  "Puerto Princesa": "Palawan",
};
const CITIES = Object.keys(CITY_PROVINCE_MAP).sort();

const PRODUCT_IMAGES = [
  { src: "/images/ch01/Copy of IMG_0910.jpg", alt: "Back print" },
  { src: "/images/ch01/Copy of IMG_0926.jpg", alt: "Front view" },
  { src: "/images/ch01/Copy of IMG_0933.jpg", alt: "Golden hour" },
  { src: "/images/ch01/Copy of IMG_0963.jpg", alt: "Detail" },
  { src: "/images/ch01/Copy of IMG_0917.jpg", alt: "Stamp" },
];

const SIZE_CHART = [
  { size: "XS", chest: '34"', length: '26"', shoulder: '16"' },
  { size: "S", chest: '36"', length: '27"', shoulder: '17"' },
  { size: "M", chest: '38"', length: '28"', shoulder: '18"' },
  { size: "L", chest: '40"', length: '29"', shoulder: '19"' },
  { size: "XL", chest: '42"', length: '30"', shoulder: '20"' },
  { size: "2XL", chest: '44"', length: '31"', shoulder: '21"' },
];

export function OrderOverlay({ artifact, isOpen, onClose }: OrderOverlayProps) {
  const [step, setStep] = useState<"select" | "details" | "done">("select");
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(0);
  const [chart, setChart] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", address: "", city: "", province: "", zip: "" });
  const scrollRef = useRef<HTMLDivElement>(null);

  const stock = useMemo(() => artifact.sizes.find(s => s.label === size)?.stock ?? 0, [artifact.sizes, size]);
  const subtotal = artifact.price * qty;
  const total = subtotal + SHIPPING_FEE;
  const canSubmit = form.firstName && form.lastName && form.email && form.phone && form.address && form.city && form.province;

  const filteredCities = useMemo(() => {
    if (!citySearch) return CITIES.slice(0, 25);
    return CITIES.filter(c => c.toLowerCase().includes(citySearch.toLowerCase())).slice(0, 25);
  }, [citySearch]);

  const reset = useCallback(() => {
    setStep("select"); setSize(""); setQty(1); setImg(0); setChart(false);
    setForm({ firstName: "", lastName: "", email: "", phone: "", address: "", city: "", province: "", zip: "" });
  }, []);

  const close = useCallback(() => { onClose(); setTimeout(reset, 400); }, [onClose, reset]);

  const setField = (k: keyof typeof form, v: string) => {
    const f = { ...form, [k]: v };
    if (k === "city" && CITY_PROVINCE_MAP[v]) f.province = CITY_PROVINCE_MAP[v];
    setForm(f);
  };

  const selectCity = (c: string) => {
    setField("city", c);
    setCitySearch("");
    setCityOpen(false);
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [step]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="checkout-backdrop" onClick={close} />

      {/* Panel */}
      <div className="checkout-panel" ref={scrollRef}>
        {/* Close */}
        <button type="button" onClick={close} className="checkout-close">×</button>

        {step === "done" ? (
          <div className="checkout-content" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "70vh", textAlign: "center" }}>
            <div style={{ width: 48, height: 80, position: "relative", marginBottom: 24 }}>
              <Image src="/images/mg-key-transparent.png" alt="Key" fill style={{ objectFit: "contain", opacity: 0.3 }} />
            </div>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", fontWeight: 300, fontStyle: "italic", color: "var(--text-head)", lineHeight: 1.4, marginBottom: 8 }}>You now carry a chapter.</h3>
            <div style={{ width: 1, height: 24, background: "var(--text-body)", opacity: 0.12, margin: "16px auto" }} />
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 300, lineHeight: 1.9, color: "var(--text-body)", maxWidth: 320, marginBottom: 24 }}>
              <strong style={{ fontWeight: 500, color: "var(--text-head)" }}>{artifact.name}</strong> · Size {size} × {qty}<br/>A confirmation will be sent to your email.
            </p>
            <div style={{ width: "100%", maxWidth: 280, padding: 20, background: "var(--bg-mid)", border: "1px solid var(--border-soft)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--text-body)" }}>
                <span style={{ opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.12em" }}>Total</span>
                <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", color: "var(--text-head)" }}>₱{total.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--text-body)" }}>
                <span style={{ opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.12em" }}>Status</span>
                <span style={{ color: "var(--gold)", fontWeight: 500 }}>Processing</span>
              </div>
            </div>
            <a href="/home" style={{ marginTop: 32, fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 400, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-body)", opacity: 0.5, textDecoration: "none" }}>Continue Exploring →</a>
          </div>
        ) : step === "select" ? (
          <div>
            {/* Gallery */}
            <div style={{ position: "relative", aspectRatio: "4/5", overflow: "hidden", background: "var(--bg-mid)" }}>
              {PRODUCT_IMAGES.map((p, i) => (
                <div key={i} style={{ position: "absolute", inset: 0, opacity: img === i ? 1 : 0, transition: "opacity 0.5s" }}>
                  <Image src={p.src} alt={p.alt} fill style={{ objectFit: "cover" }} sizes="520px" />
                </div>
              ))}
              <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 2 }}>
                {PRODUCT_IMAGES.map((_, i) => (
                  <button key={i} onClick={() => setImg(i)} style={{ width: img === i ? 24 : 6, height: 6, borderRadius: 3, background: img === i ? "var(--gold)" : "rgba(255,255,255,0.4)", border: "none", cursor: "pointer", transition: "all 0.3s", padding: 0 }} />
                ))}
              </div>
              <button style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "33%", background: "transparent", border: "none" }} onClick={() => setImg(p => (p - 1 + PRODUCT_IMAGES.length) % PRODUCT_IMAGES.length)} />
              <button style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "33%", background: "transparent", border: "none" }} onClick={() => setImg(p => (p + 1) % PRODUCT_IMAGES.length)} />
            </div>

            <div className="checkout-content">
              {/* Info */}
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 400, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 4 }}>{artifact.chapter}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", fontWeight: 400, color: "var(--text-head)" }}>{artifact.name}</h3>
                <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", fontWeight: 300, color: "var(--text-head)" }}>{artifact.priceDisplay}</span>
              </div>

              {/* Sizes */}
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 400, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-body)", marginBottom: 12 }}>Select your size</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
                {artifact.sizes.map(s => (
                  <button key={s.label} disabled={s.stock === 0} onClick={() => { setSize(s.label); setQty(1); }}
                    style={{ padding: "14px 0", textAlign: "center", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: size === s.label ? 500 : 300, color: size === s.label ? "#fff" : "var(--text-head)", background: size === s.label ? "var(--green)" : "transparent", border: size === s.label ? "1px solid var(--green)" : "1px solid var(--border-soft)", opacity: s.stock === 0 ? 0.2 : 1, cursor: s.stock === 0 ? "not-allowed" : "pointer", transition: "all 0.2s" }}>
                    {s.label}
                    <span style={{ display: "block", marginTop: 4, fontSize: 10, opacity: 0.5 }}>{s.stock === 0 ? "Sold out" : `${s.stock} left`}</span>
                  </button>
                ))}
              </div>

              {/* Size chart */}
              <button type="button" onClick={() => setChart(!chart)} style={{ background: "none", border: "none", fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 400, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold)", textDecoration: "underline", textUnderlineOffset: 3, cursor: "pointer", marginBottom: 16, padding: 0 }}>
                {chart ? "Hide" : "View"} Size Chart
              </button>
              {chart && (
                <div style={{ border: "1px solid var(--border-soft)", marginBottom: 16, overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-sans)" }}>
                    <thead>
                      <tr>{["Size", "Chest", "Length", "Shoulder"].map(h => <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-body)", borderBottom: "1px solid var(--border-soft)" }}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {SIZE_CHART.map(r => <tr key={r.size}><td style={{ padding: "10px 14px", fontSize: 14, fontWeight: 500, color: "var(--text-head)", borderBottom: "1px solid var(--border-soft)" }}>{r.size}</td><td style={{ padding: "10px 14px", fontSize: 14, fontWeight: 300, color: "var(--text-body)", borderBottom: "1px solid var(--border-soft)" }}>{r.chest}</td><td style={{ padding: "10px 14px", fontSize: 14, fontWeight: 300, color: "var(--text-body)", borderBottom: "1px solid var(--border-soft)" }}>{r.length}</td><td style={{ padding: "10px 14px", fontSize: 14, fontWeight: 300, color: "var(--text-body)", borderBottom: "1px solid var(--border-soft)" }}>{r.shoulder}</td></tr>)}
                    </tbody>
                  </table>
                  <p style={{ padding: "8px 14px", fontSize: 11, color: "var(--text-body)", opacity: 0.4 }}>Measurements in inches. Oversized fit — size down for regular.</p>
                </div>
              )}

              {/* Quantity */}
              {size && (
                <div style={{ marginBottom: 24 }}>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 400, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-body)", marginBottom: 10 }}>Quantity</p>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--input-bg)", border: "1px solid var(--border-soft)", fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 300, color: "var(--text-head)", cursor: "pointer" }}>−</button>
                    <div style={{ width: 52, height: 44, display: "flex", alignItems: "center", justifyContent: "center", borderTop: "1px solid var(--border-soft)", borderBottom: "1px solid var(--border-soft)", background: "var(--input-bg)", fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 400, color: "var(--text-head)" }}>{qty}</div>
                    <button onClick={() => { if (qty < stock) setQty(qty + 1); }} disabled={qty >= stock} style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--input-bg)", border: "1px solid var(--border-soft)", fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 300, color: "var(--text-head)", cursor: qty >= stock ? "not-allowed" : "pointer", opacity: qty >= stock ? 0.3 : 1 }}>+</button>
                    {qty >= stock && <span style={{ marginLeft: 12, fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--gold)" }}>Max stock</span>}
                  </div>
                </div>
              )}

              {/* Continue */}
              <button onClick={() => { if (size) { setStep("details"); } }} disabled={!size}
                style={{ width: "100%", padding: "18px 0", fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 400, letterSpacing: "0.2em", textTransform: "uppercase", color: "#fff", background: "var(--green)", border: "none", cursor: size ? "pointer" : "not-allowed", opacity: size ? 1 : 0.3, transition: "opacity 0.3s" }}>
                Continue — {artifact.priceDisplay}
              </button>
              <p style={{ marginTop: 14, textAlign: "center", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500, color: "var(--gold)" }}>
                Free shipping on orders over ₱1,000
              </p>
            </div>
          </div>
        ) : (
          <div className="checkout-content">
            {/* Back */}
            <button type="button" onClick={() => setStep("select")} style={{ background: "none", border: "none", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 400, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-body)", cursor: "pointer", padding: "4px 0", marginBottom: 20 }}>← Back</button>

            {/* Summary */}
            <div style={{ display: "flex", gap: 16, paddingBottom: 20, marginBottom: 20, borderBottom: "1px solid var(--border-soft)" }}>
              <div style={{ width: 60, height: 75, position: "relative", overflow: "hidden", flexShrink: 0, background: "var(--bg-mid)" }}>
                <Image src={artifact.image} alt={artifact.name} fill style={{ objectFit: "cover" }} sizes="60px" />
              </div>
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: 400, color: "var(--text-head)" }}>{artifact.name}</p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 300, color: "var(--text-body)", marginTop: 2 }}>Size {size} · Qty {qty}</p>
                </div>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", fontWeight: 300, color: "var(--text-head)" }}>{artifact.priceDisplay}</p>
              </div>
            </div>

            {/* Form */}
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 400, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-body)", marginBottom: 20 }}>Where should we send it?</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <UnderlineInput label="First name" value={form.firstName} onChange={v => setField("firstName", v)} />
              <UnderlineInput label="Last name" value={form.lastName} onChange={v => setField("lastName", v)} />
            </div>
            <UnderlineInput label="Email" value={form.email} onChange={v => setField("email", v)} type="email" />
            <UnderlineInput label="Phone" value={form.phone} onChange={v => setField("phone", v)} type="tel" placeholder="09XX XXX XXXX" />
            <div style={{ height: 8 }} />
            <UnderlineInput label="Street address" value={form.address} onChange={v => setField("address", v)} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12, position: "relative" }}>
              <div>
                <input
                  type="text"
                  value={cityOpen ? citySearch : form.city}
                  placeholder="City / Municipality"
                  onFocus={() => { setCityOpen(true); setCitySearch(""); }}
                  onBlur={() => setTimeout(() => setCityOpen(false), 200)}
                  onChange={e => setCitySearch(e.target.value)}
                  className="checkout-input"
                />
                {form.city && !cityOpen && <span className="checkout-label">City</span>}
                {cityOpen && (
                  <div className="checkout-dropdown">
                    {filteredCities.length === 0 ? <div style={{ padding: "12px 14px", fontSize: 13, color: "var(--text-body)", opacity: 0.5 }}>No results</div> :
                      filteredCities.map(c => (
                        <button key={c} onMouseDown={() => selectCity(c)} className="checkout-dropdown-item">
                          {c} <span style={{ marginLeft: 8, fontSize: 11, opacity: 0.4 }}>{CITY_PROVINCE_MAP[c]}</span>
                        </button>
                      ))
                    }
                  </div>
                )}
              </div>
              <div>
                <input type="text" value={form.province} placeholder="Province" disabled className="checkout-input" style={{ opacity: 0.5 }} />
                {form.province && <span className="checkout-label">Province</span>}
              </div>
            </div>
            <UnderlineInput label="ZIP code" value={form.zip} onChange={v => setField("zip", v)} />

            {/* Totals */}
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--border-soft)", display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 300, color: "var(--text-body)" }}>
                <span>Subtotal ({qty}×)</span><span>₱{subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 300, color: "var(--text-body)" }}>
                <span>Shipping</span><span>₱{SHIPPING_FEE}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid var(--border-soft)", fontFamily: "var(--font-serif)", fontSize: "1.2rem", fontWeight: 400, color: "var(--text-head)" }}>
                <span>Total</span><span>₱{total.toLocaleString()}</span>
              </div>
            </div>

            <button onClick={() => { if (canSubmit) setStep("done"); }} disabled={!canSubmit}
              style={{ width: "100%", padding: "18px 0", marginTop: 24, fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 400, letterSpacing: "0.2em", textTransform: "uppercase", color: "#fff", background: "var(--green)", border: "none", cursor: canSubmit ? "pointer" : "not-allowed", opacity: canSubmit ? 1 : 0.3, transition: "opacity 0.3s" }}>
              Place Order
            </button>
            <p style={{ marginTop: 14, textAlign: "center", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 400, color: "var(--text-body)", opacity: 0.6 }}>
              Secure payment via PayMongo · GCash · Maya · Card
            </p>
          </div>
        )}
      </div>
    </>
  );
}

function UnderlineInput({ label, value, onChange, type = "text", placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div style={{ position: "relative", marginBottom: 12 }}>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || label} className="checkout-input" />
      {value && <span className="checkout-label">{label}</span>}
    </div>
  );
}
