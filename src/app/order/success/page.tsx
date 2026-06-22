"use client";

import Image from "next/image";
import { KeyIcon } from "@/components/KeyIcon";

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--bg-body)" }}>
      <div className="text-center max-w-md">
        <KeyIcon size={48} className="mx-auto mb-8 opacity-30" />

        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.8rem, 4vw, 2.4rem)", fontWeight: 300, fontStyle: "italic", color: "var(--text-head)", lineHeight: 1.4, marginBottom: 12 }}>
          You now carry a chapter.
        </h1>

        <div style={{ width: 1, height: 30, background: "var(--text-body)", opacity: 0.12, margin: "20px auto" }} />

        <p style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 300, lineHeight: 1.9, color: "var(--text-body)", marginBottom: 32 }}>
          Your payment has been confirmed. A receipt has been sent to your email. We&rsquo;ll prepare your artifact and notify you when it ships.
        </p>

        <div style={{ padding: 24, background: "var(--bg-mid)", border: "1px solid var(--border-soft)", marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontFamily: "var(--font-sans)", fontSize: 13 }}>
            <span style={{ color: "var(--text-body)", opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.12em" }}>Payment</span>
            <span style={{ color: "var(--gold)", fontWeight: 500 }}>Confirmed</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-sans)", fontSize: 13 }}>
            <span style={{ color: "var(--text-body)", opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.12em" }}>Status</span>
            <span style={{ color: "var(--text-head)" }}>Processing</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
          <a href="/home" style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--white)", background: "var(--green)", padding: "16px 32px", textDecoration: "none" }}>
            Return to Maison Gethse
          </a>
          <a href="/chapters/01" style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 400, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-body)", opacity: 0.4, textDecoration: "none" }}>
            Back to Chapter 01
          </a>
        </div>
      </div>
    </div>
  );
}
