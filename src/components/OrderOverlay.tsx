"use client";

import { useState, useCallback } from "react";
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

const PROVINCES = [
  "Metro Manila", "Abra", "Agusan del Norte", "Agusan del Sur", "Aklan", "Albay",
  "Antique", "Apayao", "Aurora", "Bataan", "Batanes", "Batangas", "Benguet",
  "Biliran", "Bohol", "Bukidnon", "Bulacan", "Cagayan", "Camarines Norte",
  "Camarines Sur", "Camiguin", "Capiz", "Catanduanes", "Cavite", "Cebu",
  "Davao de Oro", "Davao del Norte", "Davao del Sur", "Davao Occidental",
  "Davao Oriental", "Dinagat Islands", "Eastern Samar", "Guimaras", "Ifugao",
  "Ilocos Norte", "Ilocos Sur", "Iloilo", "Isabela", "Kalinga", "La Union",
  "Laguna", "Lanao del Norte", "Lanao del Sur", "Leyte", "Maguindanao del Norte",
  "Maguindanao del Sur", "Marinduque", "Masbate", "Misamis Occidental",
  "Misamis Oriental", "Mountain Province", "Negros Occidental", "Negros Oriental",
  "Northern Samar", "Nueva Ecija", "Nueva Vizcaya", "Occidental Mindoro",
  "Oriental Mindoro", "Palawan", "Pampanga", "Pangasinan", "Quezon", "Quirino",
  "Rizal", "Romblon", "Samar", "Sarangani", "Siquijor", "Sorsogon",
  "South Cotabato", "Southern Leyte", "Sultan Kudarat", "Sulu", "Surigao del Norte",
  "Surigao del Sur", "Tarlac", "Tawi-Tawi", "Zambales", "Zamboanga del Norte",
  "Zamboanga del Sur", "Zamboanga Sibugay",
];

type Step = "select" | "details" | "confirmed";

export function OrderOverlay({ artifact, isOpen, onClose }: OrderOverlayProps) {
  const [step, setStep] = useState<Step>("select");
  const [selectedSize, setSelectedSize] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    zip: "",
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

  const updateField = (key: keyof typeof form, value: string) => setForm({ ...form, [key]: value });

  const canSubmitDetails =
    form.firstName && form.lastName && form.email && form.phone &&
    form.address && form.city && form.province;

  const handlePlaceOrder = useCallback(() => {
    // TODO: POST to /api/checkout → PayMongo Checkout URL → redirect
    setStep("confirmed");
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[400]"
            style={{ background: "rgba(0,0,0,0.6)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed top-0 right-0 bottom-0 z-[401] w-full max-w-[520px] overflow-y-auto overscroll-contain"
            style={{ background: "var(--bg-surface)" }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="sticky top-0 right-0 z-10 float-right mt-4 mr-5 w-10 h-10 flex items-center justify-center bg-transparent border-none"
              style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", fontWeight: 300, color: "var(--text-body)", lineHeight: 1 }}
            >
              ×
            </button>

            <div className="px-8 md:px-10 pb-12 pt-4 clear-both">
              <AnimatePresence mode="wait">
                {step === "confirmed" ? (
                  <ConfirmationView
                    key="confirmed"
                    artifact={artifact}
                    size={selectedSize}
                    total={total}
                    onClose={handleClose}
                  />
                ) : step === "select" ? (
                  <SelectStep
                    key="select"
                    artifact={artifact}
                    selectedSize={selectedSize}
                    setSelectedSize={setSelectedSize}
                    onContinue={() => setStep("details")}
                  />
                ) : (
                  <DetailsStep
                    key="details"
                    artifact={artifact}
                    selectedSize={selectedSize}
                    total={total}
                    form={form}
                    updateField={updateField}
                    canSubmit={!!canSubmitDetails}
                    onBack={() => setStep("select")}
                    onSubmit={handlePlaceOrder}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ════════════════════════════════════════════
   STEP 1 — Select Size
   ════════════════════════════════════════════ */
function SelectStep({
  artifact,
  selectedSize,
  setSelectedSize,
  onContinue,
}: {
  artifact: Artifact;
  selectedSize: string;
  setSelectedSize: (s: string) => void;
  onContinue: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Product hero */}
      <div className="relative aspect-[4/5] overflow-hidden mb-6 -mx-8 md:-mx-10 -mt-4" style={{ background: "var(--bg-mid)" }}>
        <Image
          src={artifact.image}
          alt={artifact.name}
          fill
          className="object-cover"
          sizes="520px"
        />
      </div>

      {/* Product info */}
      <div className="flex items-baseline justify-between mb-1">
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "9px", fontWeight: 400, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)" }}>
          {artifact.chapter}
        </p>
      </div>
      <div className="flex items-baseline justify-between mb-6">
        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", fontWeight: 400, color: "var(--text-head)" }}>
          {artifact.name}
        </h3>
        <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", fontWeight: 300, color: "var(--text-head)" }}>
          {artifact.priceDisplay}
        </span>
      </div>

      {/* Size selection */}
      <p className="mb-3" style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-body)" }}>
        Select your size
      </p>
      <div className="grid grid-cols-3 gap-2 mb-6">
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

      {/* Shipping note */}
      <div className="flex justify-between items-center py-3 mb-6" style={{ borderTop: "1px solid var(--border-soft)", borderBottom: "1px solid var(--border-soft)" }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 300, color: "var(--text-body)" }}>
          Shipping · Nationwide
        </span>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 400, color: "var(--text-head)" }}>
          ₱{SHIPPING_FEE}
        </span>
      </div>

      {/* Continue */}
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
        Continue — ₱{(artifact.price + SHIPPING_FEE).toLocaleString()}
      </button>
    </motion.div>
  );
}

/* ════════════════════════════════════════════
   STEP 2 — Shipping Details
   ════════════════════════════════════════════ */
function DetailsStep({
  artifact,
  selectedSize,
  total,
  form,
  updateField,
  canSubmit,
  onBack,
  onSubmit,
}: {
  artifact: Artifact;
  selectedSize: string;
  total: number;
  form: { firstName: string; lastName: string; email: string; phone: string; address: string; city: string; province: string; zip: string };
  updateField: (key: keyof typeof form, value: string) => void;
  canSubmit: boolean;
  onBack: () => void;
  onSubmit: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Back + order summary (compact) */}
      <button
        onClick={onBack}
        className="mb-6 bg-transparent border-none"
        style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-body)", opacity: 0.5 }}
      >
        ← Back
      </button>

      <div className="flex gap-4 pb-6 mb-6" style={{ borderBottom: "1px solid var(--border-soft)" }}>
        <div className="w-16 h-20 relative overflow-hidden flex-shrink-0" style={{ background: "var(--bg-mid)" }}>
          <Image src={artifact.image} alt={artifact.name} fill className="object-cover" sizes="64px" />
        </div>
        <div className="flex-1 flex items-center justify-between">
          <div>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: 400, color: "var(--text-head)" }}>
              {artifact.name}
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 300, color: "var(--text-body)", marginTop: "2px" }}>
              Size {selectedSize}
            </p>
          </div>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", fontWeight: 300, color: "var(--text-head)" }}>
            ₱{total.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Shipping details */}
      <p className="mb-4" style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-body)" }}>
        Where should we send it?
      </p>

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name" value={form.firstName} onChange={(v) => updateField("firstName", v)} autoFocus />
          <Field label="Last name" value={form.lastName} onChange={(v) => updateField("lastName", v)} />
        </div>
        <Field label="Email" value={form.email} onChange={(v) => updateField("email", v)} type="email" />
        <Field label="Phone number" value={form.phone} onChange={(v) => updateField("phone", v)} type="tel" placeholder="09XX XXX XXXX" />

        <div className="mt-2" />

        <Field label="Street address" value={form.address} onChange={(v) => updateField("address", v)} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="City / Municipality" value={form.city} onChange={(v) => updateField("city", v)} />
          <SelectField label="Province" value={form.province} onChange={(v) => updateField("province", v)} options={PROVINCES} />
        </div>
        <Field label="ZIP code" value={form.zip} onChange={(v) => updateField("zip", v)} />
      </div>

      {/* Place order */}
      <button
        onClick={onSubmit}
        disabled={!canSubmit}
        className="w-full py-5 mt-8 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
        style={{
          fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 400,
          letterSpacing: "0.22em", textTransform: "uppercase",
          color: "var(--white)", background: "var(--green)", border: "none",
        }}
      >
        Place Order — ₱{total.toLocaleString()}
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
  artifact,
  size,
  total,
  onClose,
}: {
  artifact: Artifact;
  size: string;
  total: number;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[60vh] text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mb-6" style={{ width: "48px", height: "48px", position: "relative" }}>
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
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-body)", opacity: 0.5 }}>
            Total
          </span>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", fontWeight: 300, color: "var(--text-head)" }}>
            ₱{total.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-body)", opacity: 0.5 }}>
            Status
          </span>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 400, letterSpacing: "0.08em", color: "var(--gold)" }}>
            Processing
          </span>
        </div>
      </div>

      <button
        onClick={onClose}
        className="mt-8 bg-transparent border-none"
        style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-body)", opacity: 0.4 }}
      >
        Continue Exploring →
      </button>
    </motion.div>
  );
}

/* ════════════════════════════════════════════
   FORM COMPONENTS
   ════════════════════════════════════════════ */
function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoFocus,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || label}
        autoFocus={autoFocus}
        className="w-full peer"
        style={{
          fontFamily: "var(--font-sans)", fontSize: "15px", fontWeight: 300,
          color: "var(--text-head)", background: "transparent",
          border: "none", borderBottom: "1px solid var(--border-soft)",
          padding: "14px 0 10px", outline: "none",
          transition: "border-color 0.3s",
        }}
        onFocus={(e) => (e.target.style.borderBottomColor = "var(--gold)")}
        onBlur={(e) => (e.target.style.borderBottomColor = "var(--border-soft)")}
      />
      <label
        className="absolute left-0 pointer-events-none transition-all duration-200"
        style={{
          fontFamily: "var(--font-sans)", fontSize: value ? "9px" : "13px", fontWeight: 400,
          letterSpacing: value ? "0.12em" : "0.04em",
          textTransform: value ? "uppercase" : "none",
          color: "var(--text-body)", opacity: value ? 0.5 : 0.3,
          top: value ? "-2px" : "14px",
        }}
      >
        {label}
      </label>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none"
        style={{
          fontFamily: "var(--font-sans)", fontSize: "15px", fontWeight: 300,
          color: value ? "var(--text-head)" : "rgba(160,152,144,0.3)",
          background: "transparent",
          border: "none", borderBottom: "1px solid var(--border-soft)",
          padding: "14px 20px 10px 0", outline: "none",
          transition: "border-color 0.3s",
        }}
        onFocus={(e) => (e.target.style.borderBottomColor = "var(--gold)")}
        onBlur={(e) => (e.target.style.borderBottomColor = "var(--border-soft)")}
      >
        <option value="" disabled>{label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {value && (
        <label
          className="absolute left-0 top-[-2px] pointer-events-none"
          style={{ fontFamily: "var(--font-sans)", fontSize: "9px", fontWeight: 400, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-body)", opacity: 0.5 }}
        >
          {label}
        </label>
      )}
      {/* Dropdown arrow */}
      <svg className="absolute right-0 top-4 pointer-events-none" width="10" height="6" viewBox="0 0 10 6" fill="none">
        <path d="M1 1l4 4 4-4" stroke="var(--text-body)" strokeWidth="1" opacity="0.4" />
      </svg>
    </div>
  );
}
