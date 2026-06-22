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

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  zip: string;
  notes: string;
}

type Step = "details" | "review" | "confirmed";

export function OrderOverlay({ artifact, isOpen, onClose }: OrderOverlayProps) {
  const [step, setStep] = useState<Step>("details");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    zip: "",
    notes: "",
  });

  const subtotal = artifact.price * quantity;
  const total = subtotal + SHIPPING_FEE;

  const handleClose = useCallback(() => {
    onClose();
    setTimeout(() => {
      setStep("details");
      setSelectedSize("");
      setQuantity(1);
      setForm({ firstName: "", lastName: "", email: "", phone: "", address: "", city: "", province: "", zip: "", notes: "" });
    }, 400);
  }, [onClose]);

  const canProceed =
    selectedSize &&
    form.firstName &&
    form.lastName &&
    form.email &&
    form.phone &&
    form.address &&
    form.city &&
    form.province;

  const handleSubmit = useCallback(() => {
    if (step === "details") {
      setStep("review");
    } else if (step === "review") {
      // TODO: PayMongo Checkout integration
      // 1. POST to /api/checkout with order details
      // 2. Receive PayMongo checkout URL
      // 3. Redirect to PayMongo hosted checkout
      // 4. On success webhook → save order to Supabase
      // For now, simulate confirmation
      setStep("confirmed");
    }
  }, [step]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[400]"
            style={{ background: "rgba(0,0,0,0.55)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed top-0 right-0 bottom-0 z-[401] w-full max-w-[580px] overflow-y-auto"
            style={{ background: "var(--bg-surface)", transition: "background 0.35s" }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="p-8 md:p-10 min-h-full flex flex-col">
              {/* Close */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-6 bg-transparent border-none cursor-pointer"
                style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 300, color: "var(--text-body)", lineHeight: 1 }}
              >
                ×
              </button>

              {step === "confirmed" ? (
                <ConfirmationView artifact={artifact} size={selectedSize} quantity={quantity} total={total} onClose={handleClose} />
              ) : (
                <>
                  {/* Product summary */}
                  <div className="flex gap-4 pb-6 mb-6" style={{ borderBottom: "1px solid var(--border-soft)" }}>
                    <div className="w-[100px] h-[130px] relative overflow-hidden flex-shrink-0" style={{ background: "var(--bg-mid)" }}>
                      <Image src={artifact.image} alt={artifact.name} fill className="object-cover" sizes="100px" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.3rem" }}>
                        {artifact.chapter}
                      </p>
                      <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", fontWeight: 400, color: "var(--text-head)", marginBottom: "0.2rem" }}>
                        {artifact.name}
                      </p>
                      <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", fontWeight: 300, color: "var(--text-head)" }}>
                        {artifact.priceDisplay}
                      </p>
                    </div>
                  </div>

                  {step === "details" ? (
                    <DetailsStep
                      artifact={artifact}
                      selectedSize={selectedSize}
                      setSelectedSize={setSelectedSize}
                      quantity={quantity}
                      setQuantity={setQuantity}
                      form={form}
                      setForm={setForm}
                    />
                  ) : (
                    <ReviewStep
                      artifact={artifact}
                      selectedSize={selectedSize}
                      quantity={quantity}
                      subtotal={subtotal}
                      total={total}
                      form={form}
                      onBack={() => setStep("details")}
                    />
                  )}

                  {/* Submit */}
                  <div className="mt-auto pt-6">
                    <button
                      onClick={handleSubmit}
                      disabled={step === "details" && !canProceed}
                      className="w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                      style={{
                        fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 400,
                        letterSpacing: "0.2em", textTransform: "uppercase",
                        color: "var(--white)", background: "var(--green)",
                        border: "none", padding: "18px 32px",
                        transition: "background 0.3s",
                      }}
                    >
                      {step === "details" ? "Review Order" : `Place Order — ₱${total.toLocaleString()}`}
                    </button>
                    {step === "review" && (
                      <p className="mt-3 text-center" style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 300, color: "var(--text-body)", opacity: 0.4 }}>
                        You will be redirected to our secure payment page
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3" style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-body)" }}>
      {children}
    </p>
  );
}

function DetailsStep({
  artifact,
  selectedSize,
  setSelectedSize,
  quantity,
  setQuantity,
  form,
  setForm,
}: {
  artifact: Artifact;
  selectedSize: string;
  setSelectedSize: (s: string) => void;
  quantity: number;
  setQuantity: (n: number) => void;
  form: FormData;
  setForm: (f: FormData) => void;
}) {
  const updateField = (key: keyof FormData, value: string) => setForm({ ...form, [key]: value });

  return (
    <div className="flex flex-col gap-8">
      {/* Size */}
      <div>
        <SectionLabel>Size</SectionLabel>
        <div className="flex gap-2 flex-wrap">
          {artifact.sizes.map((s) => (
            <button
              key={s.label}
              disabled={!s.available}
              onClick={() => setSelectedSize(s.label)}
              className="px-5 py-3 cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed"
              style={{
                fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 400,
                letterSpacing: "0.08em", color: selectedSize === s.label ? "var(--white)" : "var(--text-head)",
                background: selectedSize === s.label ? "var(--green)" : "var(--input-bg)",
                border: selectedSize === s.label ? "1px solid var(--green)" : "1px solid var(--border-soft)",
                transition: "all 0.2s",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <SectionLabel>Quantity</SectionLabel>
        <div className="flex items-center gap-0">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 flex items-center justify-center cursor-pointer"
            style={{ background: "var(--input-bg)", border: "1px solid var(--border-soft)", fontFamily: "var(--font-sans)", fontSize: "18px", fontWeight: 300, color: "var(--text-head)" }}
          >
            −
          </button>
          <div
            className="w-12 h-10 flex items-center justify-center"
            style={{ borderTop: "1px solid var(--border-soft)", borderBottom: "1px solid var(--border-soft)", background: "var(--input-bg)", fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 400, color: "var(--text-head)" }}
          >
            {quantity}
          </div>
          <button
            onClick={() => setQuantity(Math.min(5, quantity + 1))}
            className="w-10 h-10 flex items-center justify-center cursor-pointer"
            style={{ background: "var(--input-bg)", border: "1px solid var(--border-soft)", fontFamily: "var(--font-sans)", fontSize: "18px", fontWeight: 300, color: "var(--text-head)" }}
          >
            +
          </button>
        </div>
      </div>

      {/* Shipping */}
      <div>
        <SectionLabel>Shipping</SectionLabel>
        <div
          className="flex justify-between items-center px-4 py-3"
          style={{ background: "var(--input-bg)", border: "1px solid var(--border-soft)" }}
        >
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 300, color: "var(--text-head)" }}>
            Flat Rate · Nationwide
          </span>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 400, color: "var(--text-head)" }}>
            ₱{SHIPPING_FEE}
          </span>
        </div>
        <p className="mt-2" style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 300, color: "var(--text-body)", opacity: 0.4 }}>
          Via J&T Express · 3-5 business days
        </p>
      </div>

      {/* Customer info */}
      <div>
        <SectionLabel>Your Details</SectionLabel>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Input label="First Name" value={form.firstName} onChange={(v) => updateField("firstName", v)} />
            <Input label="Last Name" value={form.lastName} onChange={(v) => updateField("lastName", v)} />
          </div>
          <Input label="Email" type="email" value={form.email} onChange={(v) => updateField("email", v)} />
          <Input label="Phone" type="tel" value={form.phone} onChange={(v) => updateField("phone", v)} />
          <Input label="Street Address" value={form.address} onChange={(v) => updateField("address", v)} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="City" value={form.city} onChange={(v) => updateField("city", v)} />
            <Input label="Province" value={form.province} onChange={(v) => updateField("province", v)} />
          </div>
          <Input label="ZIP Code" value={form.zip} onChange={(v) => updateField("zip", v)} />
          <div className="flex flex-col gap-1">
            <label style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-body)" }}>
              Notes (optional)
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              rows={2}
              style={{
                fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 300, color: "var(--text-head)",
                background: "var(--input-bg)", border: "1px solid var(--input-bd)", padding: "12px 14px",
                outline: "none", resize: "vertical", transition: "border-color 0.2s",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-body)" }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 300, color: "var(--text-head)",
          background: "var(--input-bg)", border: "1px solid var(--input-bd)", padding: "12px 14px",
          outline: "none", width: "100%", transition: "border-color 0.2s",
        }}
      />
    </div>
  );
}

function ReviewStep({
  artifact,
  selectedSize,
  quantity,
  subtotal,
  total,
  form,
  onBack,
}: {
  artifact: Artifact;
  selectedSize: string;
  quantity: number;
  subtotal: number;
  total: number;
  form: FormData;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={onBack}
        className="self-start bg-transparent border-none cursor-pointer"
        style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 400, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-body)", opacity: 0.5 }}
      >
        ← Edit Details
      </button>

      <SectionLabel>Order Summary</SectionLabel>

      <div className="flex flex-col gap-3">
        {[
          { label: "Artifact", value: artifact.name },
          { label: "Size", value: selectedSize },
          { label: "Quantity", value: String(quantity) },
        ].map((row) => (
          <div key={row.label} className="flex justify-between" style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 300, color: "var(--text-body)" }}>
            <span>{row.label}</span>
            <span style={{ color: "var(--text-head)" }}>{row.value}</span>
          </div>
        ))}

        <div className="my-2" style={{ borderTop: "1px solid var(--border-soft)" }} />

        <div className="flex justify-between" style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 300, color: "var(--text-body)" }}>
          <span>Subtotal</span>
          <span style={{ color: "var(--text-head)" }}>₱{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between" style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 300, color: "var(--text-body)" }}>
          <span>Shipping (Nationwide)</span>
          <span style={{ color: "var(--text-head)" }}>₱{SHIPPING_FEE}</span>
        </div>

        <div className="my-2" style={{ borderTop: "1px solid var(--border-soft)" }} />

        <div className="flex justify-between" style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", fontWeight: 400, color: "var(--text-head)" }}>
          <span>Total</span>
          <span>₱{total.toLocaleString()}</span>
        </div>
      </div>

      <div className="mt-4">
        <SectionLabel>Ship To</SectionLabel>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 300, lineHeight: 1.8, color: "var(--text-body)" }}>
          {form.firstName} {form.lastName}<br />
          {form.address}<br />
          {form.city}, {form.province} {form.zip}<br />
          {form.phone}<br />
          {form.email}
        </p>
      </div>
    </div>
  );
}

function ConfirmationView({
  artifact,
  size,
  quantity,
  total,
  onClose,
}: {
  artifact: Artifact;
  size: string;
  quantity: number;
  total: number;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center flex-1 text-center px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mb-6" style={{ width: "48px", height: "48px", position: "relative" }}>
        <Image src="/images/mg-key-transparent.png" alt="Maison Gethse Key" fill style={{ objectFit: "contain", opacity: 0.3 }} />
      </div>

      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", fontWeight: 300, fontStyle: "italic", color: "var(--text-head)", lineHeight: 1.4, marginBottom: "0.8rem" }}>
        You now carry<br />a chapter.
      </h3>

      <div className="w-[1px] h-[30px] mx-auto my-4" style={{ background: "var(--text-body)", opacity: 0.15 }} />

      <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", fontWeight: 300, lineHeight: 1.9, color: "var(--text-body)", maxWidth: "360px", marginBottom: "2rem" }}>
        Your order for <strong style={{ fontWeight: 500, color: "var(--text-head)" }}>{artifact.name}</strong> ({size} × {quantity}) has been received. A confirmation email will be sent to you shortly.
      </p>

      <div className="p-5 w-full max-w-sm" style={{ background: "var(--bg-mid)", border: "1px solid var(--border-soft)" }}>
        <div className="flex justify-between mb-2">
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-body)", opacity: 0.5 }}>
            Order Total
          </span>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", fontWeight: 300, color: "var(--text-head)" }}>
            ₱{total.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-body)", opacity: 0.5 }}>
            Status
          </span>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 400, letterSpacing: "0.1em", color: "var(--gold)" }}>
            Processing
          </span>
        </div>
      </div>

      <button
        onClick={onClose}
        className="mt-8 bg-transparent border-none cursor-pointer"
        style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-body)", opacity: 0.4, transition: "opacity 0.3s" }}
      >
        Continue Exploring →
      </button>
    </motion.div>
  );
}
