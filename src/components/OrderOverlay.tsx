"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { useLenis } from "./LenisProvider";

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
  "Antipolo": "Rizal", "Cainta": "Rizal", "Taytay": "Rizal",
  "Bacoor": "Cavite", "Imus": "Cavite", "Dasmariñas": "Cavite", "Tagaytay": "Cavite",
  "San Pedro": "Laguna", "Santa Rosa": "Laguna", "Calamba": "Laguna", "Los Baños": "Laguna",
  "San Jose del Monte": "Bulacan", "Malolos": "Bulacan", "Meycauayan": "Bulacan",
  "Angeles City": "Pampanga", "San Fernando": "Pampanga",
  "Olongapo": "Zambales", "Batangas City": "Batangas", "Lipa": "Batangas",
  "Baguio": "Benguet", "Dagupan": "Pangasinan",
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
  const [chartOpen, setChartOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", address: "", city: "", province: "", zip: "" });
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  const stock = useMemo(() => artifact.sizes.find(s => s.label === size)?.stock ?? 0, [artifact.sizes, size]);
  const subtotal = artifact.price * qty;
  const total = subtotal + SHIPPING_FEE;
  const canSubmit = form.firstName && form.lastName && form.email && form.phone && form.address && form.city && form.province;

  const filteredCities = useMemo(() => {
    if (!citySearch) return CITIES.slice(0, 25);
    return CITIES.filter(c => c.toLowerCase().includes(citySearch.toLowerCase())).slice(0, 25);
  }, [citySearch]);

  const handleCheckout = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: artifact.name,
          price: artifact.price,
          quantity: qty,
          size,
          customer: form,
        }),
      });
      const data = await res.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        alert(data.error || "Something went wrong. Please try again.");
        setLoading(false);
      }
    } catch {
      alert("Connection error. Please try again.");
      setLoading(false);
    }
  }, [artifact, qty, size, form]);

  const reset = useCallback(() => {
    setStep("select"); setSize(""); setQty(1); setImg(0); setChartOpen(false); setLoading(false);
    setForm({ firstName: "", lastName: "", email: "", phone: "", address: "", city: "", province: "", zip: "" });
  }, []);

  const close = useCallback(() => { onClose(); setTimeout(reset, 300); }, [onClose, reset]);

  const setField = (k: keyof typeof form, v: string) => {
    const f = { ...form, [k]: v };
    if (k === "city" && CITY_PROVINCE_MAP[v]) f.province = CITY_PROVINCE_MAP[v];
    setForm(f);
  };

  // Stop Lenis + lock body when open
  useEffect(() => {
    if (isOpen) {
      lenis.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis.start();
      document.body.style.overflow = "";
    }
    return () => { lenis.start(); document.body.style.overflow = ""; };
  }, [isOpen, lenis]);

  // Scroll to top on step change
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [step]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={close} />

      {/* Modal */}
      <div
        ref={scrollRef}
        data-lenis-prevent
        className="relative z-10 w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-[var(--bg-surface)] shadow-2xl"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {/* Close */}
        <button type="button" onClick={close}
          className="sticky top-3 float-right mr-4 z-20 w-10 h-10 flex items-center justify-center border-none bg-[var(--bg-surface)]"
          style={{ borderRadius: "50%", fontFamily: "var(--font-serif)", fontSize: "1.8rem", fontWeight: 300, color: "var(--text-body)", lineHeight: 1 }}>
          ×
        </button>

        <div className="clear-both">
          {step === "done" ? renderDone(artifact, size, qty, total, close) :
           step === "select" ? renderSelect(artifact, size, setSize, qty, setQty, stock, img, setImg, chartOpen, setChartOpen, () => setStep("details")) :
           renderDetails(artifact, size, qty, subtotal, total, form, setField, !!canSubmit, loading, () => setStep("select"), handleCheckout, cityOpen, setCityOpen, citySearch, setCitySearch, filteredCities, (c: string) => { setField("city", c); setCitySearch(""); setCityOpen(false); })}
        </div>
      </div>
    </div>
  );
}

function AutoSlideGallery({ img, setImg }: { img: number; setImg: (n: number) => void }) {
  useEffect(() => {
    const timer = setInterval(() => {
      setImg((img + 1) % PRODUCT_IMAGES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [img, setImg]);

  return (
    <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", background: "var(--bg-mid)" }}>
      {PRODUCT_IMAGES.map((p, i) => (
        <div key={i} style={{ position: "absolute", inset: 0, opacity: img === i ? 1 : 0, transition: "opacity 0.8s ease", transform: img === i ? "scale(1)" : "scale(1.05)", transitionProperty: "opacity, transform" }}>
          <Image src={p.src} alt={p.alt} fill style={{ objectFit: "cover" }} sizes="700px" />
        </div>
      ))}
      <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 2 }}>
        {PRODUCT_IMAGES.map((_, i) => (
          <button key={i} onClick={() => setImg(i)} style={{ width: img === i ? 28 : 8, height: 8, borderRadius: 4, background: img === i ? "var(--gold)" : "rgba(255,255,255,0.35)", border: "none", cursor: "pointer", transition: "all 0.4s", padding: 0 }} />
        ))}
      </div>
      <button style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "33%", background: "transparent", border: "none" }} onClick={() => setImg((img - 1 + PRODUCT_IMAGES.length) % PRODUCT_IMAGES.length)} />
      <button style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "33%", background: "transparent", border: "none" }} onClick={() => setImg((img + 1) % PRODUCT_IMAGES.length)} />
      {/* Image counter */}
      <div style={{ position: "absolute", top: 16, left: 20, fontFamily: "var(--font-sans)", fontSize: 11, letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)", zIndex: 2 }}>
        {img + 1} / {PRODUCT_IMAGES.length}
      </div>
    </div>
  );
}

function SizeChartPopup({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70" />
      <div data-lenis-prevent className="relative z-10 w-full max-w-md bg-[var(--bg-surface)] p-6 overflow-y-auto max-h-[80vh]" onClick={e => e.stopPropagation()}>
        <button type="button" onClick={onClose} className="absolute top-3 right-4 bg-transparent border-none" style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", fontWeight: 300, color: "var(--text-body)", lineHeight: 1 }}>×</button>
        <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", fontWeight: 300, color: "var(--text-head)", marginBottom: 4 }}>Size Chart</h4>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--text-body)", opacity: 0.5, marginBottom: 16 }}>Measurements in inches · Oversized fit — size down for regular</p>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-sans)" }}>
          <thead><tr>{["Size","Chest","Length","Shoulder"].map(h=><th key={h} style={{ textAlign:"left", padding:"12px 16px", fontSize:12, fontWeight:500, color:"var(--text-body)", borderBottom:"2px solid var(--border-soft)", textTransform:"uppercase", letterSpacing:"0.1em" }}>{h}</th>)}</tr></thead>
          <tbody>{SIZE_CHART.map(r=><tr key={r.size}><td style={{padding:"14px 16px",fontSize:15,fontWeight:500,color:"var(--text-head)",borderBottom:"1px solid var(--border-soft)"}}>{r.size}</td><td style={{padding:"14px 16px",fontSize:15,fontWeight:300,color:"var(--text-body)",borderBottom:"1px solid var(--border-soft)"}}>{r.chest}</td><td style={{padding:"14px 16px",fontSize:15,fontWeight:300,color:"var(--text-body)",borderBottom:"1px solid var(--border-soft)"}}>{r.length}</td><td style={{padding:"14px 16px",fontSize:15,fontWeight:300,color:"var(--text-body)",borderBottom:"1px solid var(--border-soft)"}}>{r.shoulder}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

function renderSelect(
  artifact: { name: string; priceDisplay: string; chapter: string; sizes: { label: string; stock: number }[] },
  size: string, setSize: (s: string) => void,
  qty: number, setQty: (n: number) => void, stock: number,
  img: number, setImg: (n: number) => void,
  chartOpen: boolean, setChartOpen: (b: boolean) => void,
  onContinue: () => void,
) {
  return (
    <>
      <AutoSlideGallery img={img} setImg={setImg} />

      <div style={{ padding: "24px 32px 40px" }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 4 }}>{artifact.chapter}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", fontWeight: 400, color: "var(--text-head)" }}>{artifact.name}</h3>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", fontWeight: 300, color: "var(--text-head)" }}>{artifact.priceDisplay}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-body)" }}>Select size</p>
          <button type="button" onClick={() => setChartOpen(true)} style={{ background: "none", border: "none", fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--gold)", textDecoration: "underline", textUnderlineOffset: 3, cursor: "pointer", padding: 0 }}>
            Size Chart
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 20 }}>
          {artifact.sizes.map(s => (
            <button key={s.label} disabled={s.stock === 0} onClick={() => { setSize(s.label); setQty(1); }}
              style={{ padding: "14px 0", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: size === s.label ? 500 : 300, color: size === s.label ? "#fff" : "var(--text-head)", background: size === s.label ? "var(--green)" : "transparent", border: size === s.label ? "1px solid var(--green)" : "1px solid var(--border-soft)", opacity: s.stock === 0 ? 0.2 : 1, cursor: s.stock === 0 ? "not-allowed" : "pointer", transition: "all 0.2s" }}>
              {s.label}<span style={{ display: "block", fontSize: 10, opacity: 0.5, marginTop: 3 }}>{s.stock === 0 ? "Sold out" : `${s.stock} left`}</span>
            </button>
          ))}
        </div>

        {size && (
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-body)", marginBottom: 10 }}>Quantity</p>
            <div style={{ display: "flex", alignItems: "center" }}>
              <button onClick={() => setQty(Math.max(1, qty-1))} style={{ width:48,height:48,display:"flex",alignItems:"center",justifyContent:"center",background:"var(--input-bg)",border:"1px solid var(--border-soft)",fontSize:18,fontWeight:300,color:"var(--text-head)",cursor:"pointer",fontFamily:"var(--font-sans)" }}>−</button>
              <div style={{ width:56,height:48,display:"flex",alignItems:"center",justifyContent:"center",borderTop:"1px solid var(--border-soft)",borderBottom:"1px solid var(--border-soft)",background:"var(--input-bg)",fontSize:16,fontWeight:400,color:"var(--text-head)",fontFamily:"var(--font-sans)" }}>{qty}</div>
              <button onClick={() => { if(qty<stock) setQty(qty+1); }} disabled={qty>=stock} style={{ width:48,height:48,display:"flex",alignItems:"center",justifyContent:"center",background:"var(--input-bg)",border:"1px solid var(--border-soft)",fontSize:18,fontWeight:300,color:"var(--text-head)",cursor:qty>=stock?"not-allowed":"pointer",opacity:qty>=stock?0.3:1,fontFamily:"var(--font-sans)" }}>+</button>
              {qty>=stock && <span style={{marginLeft:12,fontSize:12,color:"var(--gold)",fontFamily:"var(--font-sans)"}}>Max stock</span>}
            </div>
          </div>
        )}

        <button onClick={onContinue} disabled={!size} style={{ width:"100%",padding:"18px 0",fontFamily:"var(--font-sans)",fontSize:12,fontWeight:400,letterSpacing:"0.2em",textTransform:"uppercase",color:"#fff",background:"var(--green)",border:"none",cursor:size?"pointer":"not-allowed",opacity:size?1:0.3,transition:"opacity 0.3s" }}>
          Continue — {artifact.priceDisplay}
        </button>
        <p style={{ marginTop:14,textAlign:"center",fontFamily:"var(--font-sans)",fontSize:14,fontWeight:500,color:"var(--gold)" }}>Free shipping on orders over ₱1,000</p>
      </div>

      <SizeChartPopup open={chartOpen} onClose={() => setChartOpen(false)} />
    </>
  );
}

function renderDetails(
  artifact: { name: string; image: string; priceDisplay: string },
  size: string, qty: number, subtotal: number, total: number,
  form: Record<string, string>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setField: (k: any, v: string) => void,
  canSubmit: boolean, loading: boolean, onBack: () => void, onSubmit: () => void,
  cityOpen: boolean, setCityOpen: (b: boolean) => void,
  citySearch: string, setCitySearch: (s: string) => void,
  filteredCities: string[], selectCity: (c: string) => void,
) {
  return (
    <div style={{ padding: "16px 28px 40px" }}>
      <button type="button" onClick={onBack} style={{ background:"none",border:"none",fontFamily:"var(--font-sans)",fontSize:13,color:"var(--text-body)",cursor:"pointer",padding:"4px 0",marginBottom:20 }}>← Back</button>

      <div style={{ display:"flex",gap:16,paddingBottom:20,marginBottom:20,borderBottom:"1px solid var(--border-soft)" }}>
        <div style={{ width:60,height:75,position:"relative",overflow:"hidden",flexShrink:0,background:"var(--bg-mid)" }}>
          <Image src={artifact.image} alt={artifact.name} fill style={{ objectFit:"cover" }} sizes="60px" />
        </div>
        <div style={{ flex:1,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <div>
            <p style={{ fontFamily:"var(--font-serif)",fontSize:"1rem",fontWeight:400,color:"var(--text-head)" }}>{artifact.name}</p>
            <p style={{ fontFamily:"var(--font-sans)",fontSize:12,fontWeight:300,color:"var(--text-body)",marginTop:2 }}>Size {size} · Qty {qty}</p>
          </div>
          <p style={{ fontFamily:"var(--font-serif)",fontSize:"1.1rem",fontWeight:300,color:"var(--text-head)" }}>{artifact.priceDisplay}</p>
        </div>
      </div>

      <p style={{ fontFamily:"var(--font-sans)",fontSize:12,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--text-body)",marginBottom:20 }}>Where should we send it?</p>

      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12 }}>
        <Input label="First name" value={form.firstName} onChange={v=>setField("firstName",v)} />
        <Input label="Last name" value={form.lastName} onChange={v=>setField("lastName",v)} />
      </div>
      <Input label="Email" value={form.email} onChange={v=>setField("email",v)} type="email" />
      <Input label="Phone" value={form.phone} onChange={v=>setField("phone",v)} type="tel" placeholder="09XX XXX XXXX" />
      <div style={{height:8}} />
      <Input label="Street address" value={form.address} onChange={v=>setField("address",v)} />

      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12,position:"relative" }}>
        <div style={{position:"relative"}}>
          <input type="text" value={cityOpen?citySearch:form.city} placeholder="City / Municipality"
            onFocus={()=>{setCityOpen(true);setCitySearch("");}}
            onBlur={()=>setTimeout(()=>setCityOpen(false),200)}
            onChange={e=>setCitySearch(e.target.value)}
            className="checkout-input" />
          {form.city&&!cityOpen&&<span className="checkout-label">City</span>}
          {cityOpen&&(
            <div className="checkout-dropdown" data-lenis-prevent>
              {filteredCities.length===0?<div style={{padding:"12px 14px",fontSize:13,color:"var(--text-body)",opacity:0.5}}>No results</div>:
                filteredCities.map(c=>(
                  <button key={c} onMouseDown={()=>selectCity(c)} className="checkout-dropdown-item">
                    {c}<span style={{marginLeft:8,fontSize:11,opacity:0.4}}>{CITY_PROVINCE_MAP[c]}</span>
                  </button>
                ))
              }
            </div>
          )}
        </div>
        <div style={{position:"relative"}}>
          <input type="text" value={form.province} placeholder="Province" disabled className="checkout-input" style={{opacity:0.5}} />
          {form.province&&<span className="checkout-label">Province</span>}
        </div>
      </div>
      <Input label="ZIP code" value={form.zip} onChange={v=>setField("zip",v)} />

      <div style={{ marginTop:24,paddingTop:16,borderTop:"1px solid var(--border-soft)",display:"flex",flexDirection:"column",gap:8 }}>
        <div style={{ display:"flex",justifyContent:"space-between",fontFamily:"var(--font-sans)",fontSize:13,fontWeight:300,color:"var(--text-body)" }}><span>Subtotal ({qty}×)</span><span>₱{subtotal.toLocaleString()}</span></div>
        <div style={{ display:"flex",justifyContent:"space-between",fontFamily:"var(--font-sans)",fontSize:13,fontWeight:300,color:"var(--text-body)" }}><span>Shipping</span><span>₱{SHIPPING_FEE}</span></div>
        <div style={{ display:"flex",justifyContent:"space-between",paddingTop:8,borderTop:"1px solid var(--border-soft)",fontFamily:"var(--font-serif)",fontSize:"1.2rem",fontWeight:400,color:"var(--text-head)" }}><span>Total</span><span>₱{total.toLocaleString()}</span></div>
      </div>

      <button onClick={()=>{if(canSubmit&&!loading)onSubmit();}} disabled={!canSubmit||loading} style={{ width:"100%",padding:"18px 0",marginTop:24,fontFamily:"var(--font-sans)",fontSize:12,fontWeight:400,letterSpacing:"0.2em",textTransform:"uppercase",color:"#fff",background:"var(--green)",border:"none",cursor:(canSubmit&&!loading)?"pointer":"not-allowed",opacity:(canSubmit&&!loading)?1:0.5 }}>
        {loading ? "Redirecting to payment..." : "Place Order"}
      </button>
      <p style={{ marginTop:14,textAlign:"center",fontFamily:"var(--font-sans)",fontSize:13,fontWeight:400,color:"var(--text-body)",opacity:0.6 }}>Secure payment via PayMongo · GCash · Maya · Card</p>
    </div>
  );
}

function renderDone(artifact: { name: string }, size: string, qty: number, total: number, close: () => void) {
  return (
    <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"60vh",textAlign:"center",padding:"40px 28px" }}>
      <div style={{ width:48,height:80,position:"relative",marginBottom:24 }}>
        <Image src="/images/mg-key-transparent.png" alt="Key" fill style={{ objectFit:"contain",opacity:0.3 }} />
      </div>
      <h3 style={{ fontFamily:"var(--font-serif)",fontSize:"1.6rem",fontWeight:300,fontStyle:"italic",color:"var(--text-head)",lineHeight:1.4,marginBottom:8 }}>You now carry a chapter.</h3>
      <div style={{ width:1,height:24,background:"var(--text-body)",opacity:0.12,margin:"16px auto" }} />
      <p style={{ fontFamily:"var(--font-sans)",fontSize:14,fontWeight:300,lineHeight:1.9,color:"var(--text-body)",maxWidth:320,marginBottom:24 }}>
        <strong style={{ fontWeight:500,color:"var(--text-head)" }}>{artifact.name}</strong> · Size {size} × {qty}<br/>Confirmation sent to your email.
      </p>
      <div style={{ width:"100%",maxWidth:280,padding:20,background:"var(--bg-mid)",border:"1px solid var(--border-soft)" }}>
        <div style={{ display:"flex",justifyContent:"space-between",marginBottom:12,fontFamily:"var(--font-sans)",fontSize:12 }}><span style={{opacity:0.5,textTransform:"uppercase",letterSpacing:"0.12em",color:"var(--text-body)"}}>Total</span><span style={{fontFamily:"var(--font-serif)",fontSize:"1.1rem",color:"var(--text-head)"}}>₱{total.toLocaleString()}</span></div>
        <div style={{ display:"flex",justifyContent:"space-between",fontFamily:"var(--font-sans)",fontSize:12 }}><span style={{opacity:0.5,textTransform:"uppercase",letterSpacing:"0.12em",color:"var(--text-body)"}}>Status</span><span style={{color:"var(--gold)",fontWeight:500}}>Processing</span></div>
      </div>
      <a href="/home" style={{ marginTop:32,fontFamily:"var(--font-sans)",fontSize:12,letterSpacing:"0.16em",textTransform:"uppercase",color:"var(--text-body)",opacity:0.5,textDecoration:"none" }}>Continue Exploring →</a>
    </div>
  );
}

function Input({ label, value, onChange, type="text", placeholder }: { label:string; value:string; onChange:(v:string)=>void; type?:string; placeholder?:string }) {
  return (
    <div style={{ position:"relative",marginBottom:12 }}>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder||label} className="checkout-input" />
      {value&&<span className="checkout-label">{label}</span>}
    </div>
  );
}
