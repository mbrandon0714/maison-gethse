"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Artifact {
  name: string;
  price: number;
  priceDisplay: string;
  image: string;
  chapter: string;
  sizes: { label: string; available: boolean }[];
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
  "Antipolo": "Rizal", "Cainta": "Rizal", "Taytay": "Rizal", "Angono": "Rizal", "Binangonan": "Rizal",
  "San Mateo": "Rizal", "Rodriguez": "Rizal", "Tanay": "Rizal",
  "Bacoor": "Cavite", "Imus": "Cavite", "Dasmariñas": "Cavite", "General Trias": "Cavite",
  "Cavite City": "Cavite", "Rosario": "Cavite", "Silang": "Cavite", "Tagaytay": "Cavite",
  "San Pedro": "Laguna", "Biñan": "Laguna", "Santa Rosa": "Laguna", "Calamba": "Laguna",
  "Cabuyao": "Laguna", "Los Baños": "Laguna", "San Pablo": "Laguna",
  "Meycauayan": "Bulacan", "Marilao": "Bulacan", "San Jose del Monte": "Bulacan",
  "Malolos": "Bulacan", "Obando": "Bulacan", "Bocaue": "Bulacan", "Baliwag": "Bulacan",
  "San Fernando": "Pampanga", "Angeles City": "Pampanga", "Clark": "Pampanga",
  "Olongapo": "Zambales", "Subic": "Zambales",
  "Batangas City": "Batangas", "Lipa": "Batangas", "Tanauan": "Batangas",
  "Baguio": "Benguet", "La Trinidad": "Benguet",
  "Dagupan": "Pangasinan", "Urdaneta": "Pangasinan", "San Carlos": "Pangasinan",
  "Laoag": "Ilocos Norte", "Vigan": "Ilocos Sur", "San Fernando City": "La Union",
  "Tuguegarao": "Cagayan", "Santiago": "Isabela", "Cauayan": "Isabela",
  "Naga": "Camarines Sur", "Legazpi": "Albay", "Sorsogon City": "Sorsogon",
  "Iloilo City": "Iloilo", "Roxas City": "Capiz", "Kalibo": "Aklan",
  "Bacolod": "Negros Occidental", "Silay": "Negros Occidental", "Dumaguete": "Negros Oriental",
  "Cebu City": "Cebu", "Mandaue": "Cebu", "Lapu-Lapu": "Cebu", "Talisay": "Cebu",
  "Tacloban": "Leyte", "Ormoc": "Leyte",
  "Tagbilaran": "Bohol", "Panglao": "Bohol",
  "Davao City": "Davao del Sur", "Tagum": "Davao del Norte", "Digos": "Davao del Sur",
  "General Santos": "South Cotabato", "Koronadal": "South Cotabato",
  "Cagayan de Oro": "Misamis Oriental", "Iligan": "Lanao del Norte",
  "Butuan": "Agusan del Norte", "Surigao City": "Surigao del Norte",
  "Zamboanga City": "Zamboanga del Sur", "Dipolog": "Zamboanga del Norte",
  "Cotabato City": "Maguindanao del Norte", "Marawi": "Lanao del Sur",
  "Puerto Princesa": "Palawan", "Calapan": "Oriental Mindoro",
};

const CITIES = Object.keys(CITY_PROVINCE_MAP).sort();

const PRODUCT_IMAGES = [
  { src: "/images/ch01/Copy of IMG_0910.jpg", alt: "Back print — teddy bear in paper boat" },
  { src: "/images/ch01/Copy of IMG_0926.jpg", alt: "Front view — golden sunset" },
  { src: "/images/ch01/Copy of IMG_0933.jpg", alt: "Hanging on tree — golden hour" },
  { src: "/images/ch01/Copy of IMG_0963.jpg", alt: "Close-up — bear detail" },
  { src: "/images/ch01/Copy of IMG_0917.jpg", alt: "Maison Gethse stamp" },
];

type Step = "select" | "details" | "confirmed";

export function OrderOverlay({ artifact, isOpen, onClose }: OrderOverlayProps) {
  const [step, setStep] = useState<Step>("select");
  const [selectedSize, setSelectedSize] = useState("");
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", province: "", zip: "",
  });

  const total = artifact.price + SHIPPING_FEE;

  const handleClose = useCallback(() => {
    onClose();
    setTimeout(() => {
      setStep("select");
      setSelectedSize("");
      setForm({ firstName: "", lastName: "", email: "", phone: "", address: "", city: "", province: "", zip: "" });
    }, 400);
  }, [onClose]);

  const updateField = (key: keyof typeof form, value: string) => {
    const updates = { ...form, [key]: value };
    if (key === "city" && CITY_PROVINCE_MAP[value]) {
      updates.province = CITY_PROVINCE_MAP[value];
    }
    setForm(updates);
  };

  const canSubmit = form.firstName && form.lastName && form.email && form.phone && form.address && form.city && form.province;

  const handlePlaceOrder = useCallback(() => {
    setStep("confirmed");
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[400]"
            style={{ background: "rgba(0,0,0,0.6)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          <motion.div
            className="fixed top-0 right-0 bottom-0 z-[401] w-full max-w-[520px]"
            style={{
              background: "var(--bg-surface)",
              overflowY: "scroll",
              WebkitOverflowScrolling: "touch",
            }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="fixed z-20 w-10 h-10 flex items-center justify-center bg-transparent border-none"
              style={{
                top: "16px",
                right: "20px",
                fontFamily: "var(--font-serif)",
                fontSize: "1.8rem",
                fontWeight: 300,
                color: "var(--text-body)",
                lineHeight: 1,
                background: "var(--bg-surface)",
                borderRadius: "50%",
              }}
            >
              ×
            </button>

            <AnimatePresence mode="wait">
              {step === "confirmed" ? (
                <ConfirmationView key="confirmed" artifact={artifact} size={selectedSize} total={total} onClose={handleClose} />
              ) : step === "select" ? (
                <SelectStep key="select" artifact={artifact} selectedSize={selectedSize} setSelectedSize={setSelectedSize} total={total} onContinue={() => setStep("details")} />
              ) : (
                <DetailsStep key="details" artifact={artifact} selectedSize={selectedSize} total={total} form={form} updateField={updateField} canSubmit={!!canSubmit} onBack={() => setStep("select")} onSubmit={handlePlaceOrder} />
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ════════════════════════════════════════════
   STEP 1 — Select Size + Image Gallery
   ════════════════════════════════════════════ */
function SelectStep({
  artifact, selectedSize, setSelectedSize, total, onContinue,
}: {
  artifact: Artifact; selectedSize: string; setSelectedSize: (s: string) => void; total: number; onContinue: () => void;
}) {
  const [activeImg, setActiveImg] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image gallery */}
      <div className="relative aspect-[4/5] overflow-hidden" style={{ background: "var(--bg-mid)" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImg}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Image
              src={PRODUCT_IMAGES[activeImg].src}
              alt={PRODUCT_IMAGES[activeImg].alt}
              fill
              className="object-cover"
              sizes="520px"
            />
          </motion.div>
        </AnimatePresence>

        {/* Thumbnail dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {PRODUCT_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              className="border-none p-0 transition-all duration-300"
              style={{
                width: activeImg === i ? "24px" : "6px",
                height: "6px",
                borderRadius: "3px",
                background: activeImg === i ? "var(--gold)" : "rgba(255,255,255,0.4)",
                cursor: "pointer",
              }}
            />
          ))}
        </div>

        {/* Left/right tap zones */}
        <button
          className="absolute left-0 top-0 bottom-0 w-1/3 bg-transparent border-none"
          onClick={() => setActiveImg((p) => (p - 1 + PRODUCT_IMAGES.length) % PRODUCT_IMAGES.length)}
        />
        <button
          className="absolute right-0 top-0 bottom-0 w-1/3 bg-transparent border-none"
          onClick={() => setActiveImg((p) => (p + 1) % PRODUCT_IMAGES.length)}
        />
      </div>

      <div className="px-8 md:px-10 pt-6 pb-10">
        {/* Product info */}
        <p className="mb-1" style={{ fontFamily: "var(--font-sans)", fontSize: "9px", fontWeight: 400, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)" }}>
          {artifact.chapter}
        </p>
        <div className="flex items-baseline justify-between mb-8">
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", fontWeight: 400, color: "var(--text-head)" }}>
            {artifact.name}
          </h3>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", fontWeight: 300, color: "var(--text-head)" }}>
            {artifact.priceDisplay}
          </span>
        </div>

        {/* Size grid */}
        <p className="mb-3" style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-body)" }}>
          Select your size
        </p>
        <div className="grid grid-cols-3 gap-2 mb-10">
          {artifact.sizes.map((s) => (
            <button
              key={s.label}
              disabled={!s.available}
              onClick={() => setSelectedSize(s.label)}
              className="py-4 text-center disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200"
              style={{
                fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: selectedSize === s.label ? 500 : 300,
                letterSpacing: "0.06em",
                color: selectedSize === s.label ? "var(--white)" : "var(--text-head)",
                background: selectedSize === s.label ? "var(--green)" : "transparent",
                border: selectedSize === s.label ? "1px solid var(--green)" : "1px solid var(--border-soft)",
              }}
            >
              {s.label}
              {!s.available && (
                <span className="block mt-1" style={{ fontSize: "8px", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.5 }}>
                  Sold out
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Continue — shows just the product price */}
        <button
          onClick={onContinue}
          disabled={!selectedSize}
          className="w-full py-5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
          style={{
            fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 400,
            letterSpacing: "0.22em", textTransform: "uppercase",
            color: "var(--white)", background: "var(--green)", border: "none",
          }}
        >
          Continue — {artifact.priceDisplay}
        </button>
        <p className="mt-3 text-center" style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 300, color: "var(--text-body)", opacity: 0.3 }}>
          Free shipping on orders over ₱1,000
        </p>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════
   STEP 2 — Shipping Details
   ════════════════════════════════════════════ */
function DetailsStep({
  artifact, selectedSize, total, form, updateField, canSubmit, onBack, onSubmit,
}: {
  artifact: Artifact; selectedSize: string; total: number;
  form: { firstName: string; lastName: string; email: string; phone: string; address: string; city: string; province: string; zip: string };
  updateField: (key: keyof typeof form, value: string) => void;
  canSubmit: boolean; onBack: () => void; onSubmit: () => void;
}) {
  return (
    <motion.div
      className="px-8 md:px-10 pt-6 pb-10"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <button onClick={onBack} className="mb-6 bg-transparent border-none" style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-body)", opacity: 0.5 }}>
        ← Back
      </button>

      {/* Compact summary */}
      <div className="flex gap-4 pb-6 mb-6" style={{ borderBottom: "1px solid var(--border-soft)" }}>
        <div className="w-16 h-20 relative overflow-hidden flex-shrink-0" style={{ background: "var(--bg-mid)" }}>
          <Image src={artifact.image} alt={artifact.name} fill className="object-cover" sizes="64px" />
        </div>
        <div className="flex-1 flex items-center justify-between">
          <div>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: 400, color: "var(--text-head)" }}>{artifact.name}</p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 300, color: "var(--text-body)", marginTop: "2px" }}>Size {selectedSize}</p>
          </div>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", fontWeight: 300, color: "var(--text-head)" }}>{artifact.priceDisplay}</p>
        </div>
      </div>

      {/* Form */}
      <p className="mb-5" style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-body)" }}>
        Where should we send it?
      </p>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name" value={form.firstName} onChange={(v) => updateField("firstName", v)} autoFocus />
          <Field label="Last name" value={form.lastName} onChange={(v) => updateField("lastName", v)} />
        </div>
        <Field label="Email" value={form.email} onChange={(v) => updateField("email", v)} type="email" />
        <Field label="Phone number" value={form.phone} onChange={(v) => updateField("phone", v)} type="tel" placeholder="09XX XXX XXXX" />
        <div className="mt-1" />
        <Field label="Street address" value={form.address} onChange={(v) => updateField("address", v)} />
        <div className="grid grid-cols-2 gap-3">
          <SearchSelect label="City / Municipality" value={form.city} onChange={(v) => updateField("city", v)} options={CITIES} />
          <Field label="Province" value={form.province} onChange={(v) => updateField("province", v)} disabled />
        </div>
        <Field label="ZIP code" value={form.zip} onChange={(v) => updateField("zip", v)} />
      </div>

      {/* Order total — only revealed here at checkout */}
      <div className="mt-8 mb-4 flex flex-col gap-2 py-4" style={{ borderTop: "1px solid var(--border-soft)" }}>
        <div className="flex justify-between" style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 300, color: "var(--text-body)" }}>
          <span>Subtotal</span>
          <span>{artifact.priceDisplay}</span>
        </div>
        <div className="flex justify-between" style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 300, color: "var(--text-body)" }}>
          <span>Shipping</span>
          <span>₱{SHIPPING_FEE}</span>
        </div>
        <div className="flex justify-between pt-2" style={{ borderTop: "1px solid var(--border-soft)", fontFamily: "var(--font-serif)", fontSize: "1.2rem", fontWeight: 400, color: "var(--text-head)" }}>
          <span>Total</span>
          <span>₱{total.toLocaleString()}</span>
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={!canSubmit}
        className="w-full py-5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
        style={{
          fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 400,
          letterSpacing: "0.22em", textTransform: "uppercase",
          color: "var(--white)", background: "var(--green)", border: "none",
        }}
      >
        Place Order
      </button>
      <p className="mt-3 text-center" style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 300, color: "var(--text-body)", opacity: 0.35, lineHeight: 1.7 }}>
        Secure payment via PayMongo · GCash · Maya · Card
      </p>
    </motion.div>
  );
}

/* ════════════════════════════════════════════
   CONFIRMATION
   ════════════════════════════════════════════ */
function ConfirmationView({
  artifact, size, total, onClose,
}: {
  artifact: Artifact; size: string; total: number; onClose: () => void;
}) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[80vh] text-center px-8"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mb-6 relative" style={{ width: "48px", height: "80px" }}>
        <Image src="/images/mg-key-transparent.png" alt="Maison Gethse Key" fill style={{ objectFit: "contain", opacity: 0.3 }} />
      </div>

      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", fontWeight: 300, fontStyle: "italic", color: "var(--text-head)", lineHeight: 1.4, marginBottom: "0.6rem" }}>
        You now carry a chapter.
      </h3>

      <div className="w-[1px] h-[24px] mx-auto my-4" style={{ background: "var(--text-body)", opacity: 0.12 }} />

      <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 300, lineHeight: 1.9, color: "var(--text-body)", maxWidth: "320px", marginBottom: "2rem" }}>
        <strong style={{ fontWeight: 500, color: "var(--text-head)" }}>{artifact.name}</strong> · Size {size}<br />
        A confirmation will be sent to your email.
      </p>

      <div className="w-full max-w-xs p-5" style={{ background: "var(--bg-mid)", border: "1px solid var(--border-soft)" }}>
        <div className="flex justify-between mb-3">
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-body)", opacity: 0.5 }}>Total</span>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", fontWeight: 300, color: "var(--text-head)" }}>₱{total.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-body)", opacity: 0.5 }}>Status</span>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 400, letterSpacing: "0.08em", color: "var(--gold)" }}>Processing</span>
        </div>
      </div>

      <a
        href="/home"
        className="mt-8 no-underline"
        style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-body)", opacity: 0.4 }}
      >
        Continue Exploring →
      </a>
    </motion.div>
  );
}

/* ════════════════════════════════════════════
   FORM COMPONENTS
   ════════════════════════════════════════════ */
function Field({
  label, value, onChange, type = "text", placeholder, autoFocus, disabled,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; autoFocus?: boolean; disabled?: boolean;
}) {
  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || label}
        autoFocus={autoFocus}
        disabled={disabled}
        className="w-full peer"
        style={{
          fontFamily: "var(--font-sans)", fontSize: "15px", fontWeight: 300,
          color: "var(--text-head)", background: "transparent",
          border: "none", borderBottom: "1px solid var(--border-soft)",
          padding: "14px 0 10px", outline: "none",
          transition: "border-color 0.3s",
          opacity: disabled ? 0.5 : 1,
        }}
        onFocus={(e) => { if (!disabled) e.target.style.borderBottomColor = "var(--gold)"; }}
        onBlur={(e) => { e.target.style.borderBottomColor = "var(--border-soft)"; }}
      />
      {value && (
        <label className="absolute left-0 top-[-2px] pointer-events-none" style={{ fontFamily: "var(--font-sans)", fontSize: "9px", fontWeight: 400, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold)", opacity: 0.6 }}>
          {label}
        </label>
      )}
    </div>
  );
}

function SearchSelect({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return options.slice(0, 20);
    return options.filter((o) => o.toLowerCase().includes(search.toLowerCase())).slice(0, 20);
  }, [search, options]);

  const handleSelect = (v: string) => {
    onChange(v);
    setSearch("");
    setOpen(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={open ? search : value}
        placeholder={label}
        onFocus={() => { setOpen(true); setSearch(""); }}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full"
        style={{
          fontFamily: "var(--font-sans)", fontSize: "15px", fontWeight: 300,
          color: "var(--text-head)", background: "transparent",
          border: "none", borderBottom: "1px solid var(--border-soft)",
          padding: "14px 0 10px", outline: "none",
          transition: "border-color 0.3s",
        }}
        onFocusCapture={(e) => { e.target.style.borderBottomColor = "var(--gold)"; }}
        onBlurCapture={(e) => { e.target.style.borderBottomColor = "var(--border-soft)"; }}
      />
      {value && !open && (
        <label className="absolute left-0 top-[-2px] pointer-events-none" style={{ fontFamily: "var(--font-sans)", fontSize: "9px", fontWeight: 400, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold)", opacity: 0.6 }}>
          {label}
        </label>
      )}
      <svg className="absolute right-0 top-4 pointer-events-none" width="10" height="6" viewBox="0 0 10 6" fill="none">
        <path d="M1 1l4 4 4-4" stroke="var(--text-body)" strokeWidth="1" opacity="0.4" />
      </svg>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute left-0 right-0 top-full z-30 max-h-[200px] overflow-y-auto"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border-soft)", boxShadow: "0 8px 30px rgba(0,0,0,0.3)" }}
        >
          {filtered.length === 0 ? (
            <div className="px-4 py-3" style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--text-body)", opacity: 0.5 }}>
              No results
            </div>
          ) : (
            filtered.map((opt) => (
              <button
                key={opt}
                onMouseDown={() => handleSelect(opt)}
                className="w-full text-left px-4 py-3 border-none transition-colors duration-150"
                style={{
                  fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 300,
                  color: "var(--text-head)", background: "transparent",
                  borderBottom: "1px solid var(--border-soft)",
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = "rgba(200,146,42,0.08)"; }}
                onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                {opt}
                <span className="ml-2" style={{ fontSize: "11px", color: "var(--text-body)", opacity: 0.4 }}>
                  {CITY_PROVINCE_MAP[opt]}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
