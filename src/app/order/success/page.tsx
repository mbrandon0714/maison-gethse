"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { KeyIcon } from "@/components/KeyIcon";
import { useCart } from "@/components/CartProvider";

interface OrderStatus {
  status: string;
  product_name: string;
  size: string;
  quantity: number;
  total: number;
  tracking_number: string | null;
}

function SuccessContent() {
  const { clearCart } = useCart();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const id = sessionStorage.getItem("mg-checkout-session");
    setSessionId(id);
    if (!id) setChecking(false);
  }, []);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  useEffect(() => {
    if (!sessionId) return;
    let attempts = 0;
    let cancelled = false;

    const check = async () => {
      try {
        const res = await fetch(`/api/orders/status?session_id=${encodeURIComponent(sessionId)}`);
        if (res.ok) {
          const data = await res.json();
          if (cancelled) return;
          setOrder(data.order);
          // Webhook may lag a few seconds behind redirect — keep polling until paid
          if (data.order.status === "pending" && attempts < 10) {
            attempts++;
            setTimeout(check, 2000);
            return;
          }
        }
      } catch {
        // network hiccup — fall through to generic confirmation
      }
      if (!cancelled) setChecking(false);
    };
    check();
    return () => { cancelled = true; };
  }, [sessionId]);

  const confirmed = order && order.status !== "pending";
  const stillPending = order?.status === "pending" && !checking;

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--bg-body)" }}>
      <div className="text-center max-w-md">
        <KeyIcon size={48} className="mx-auto mb-8 opacity-30" />

        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.8rem, 4vw, 2.4rem)", fontWeight: 300, fontStyle: "italic", color: "var(--text-head)", lineHeight: 1.4, marginBottom: 12 }}>
          You now carry a chapter.
        </h1>

        <div style={{ width: 1, height: 30, background: "var(--text-body)", opacity: 0.12, margin: "20px auto" }} />

        <p style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 300, lineHeight: 1.9, color: "var(--text-body)", marginBottom: 32 }}>
          {stillPending
            ? "We're confirming your payment — this can take a moment. Your confirmation email will arrive as soon as it clears."
            : "Your payment has been confirmed. A receipt has been sent to your email. We’ll prepare your artifact and notify you when it ships."}
        </p>

        <div style={{ padding: 24, background: "var(--bg-mid)", border: "1px solid var(--border-soft)", marginBottom: 32 }}>
          {order && (
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontFamily: "var(--font-sans)", fontSize: 13 }}>
              <span style={{ color: "var(--text-body)", opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.12em" }}>Order</span>
              <span style={{ color: "var(--text-head)" }}>{order.product_name} · Size {order.size} × {order.quantity}</span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontFamily: "var(--font-sans)", fontSize: 13 }}>
            <span style={{ color: "var(--text-body)", opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.12em" }}>Payment</span>
            <span style={{ color: "var(--gold)", fontWeight: 500 }}>
              {checking ? "Confirming…" : confirmed ? "Confirmed" : stillPending ? "Processing" : "Confirmed"}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-sans)", fontSize: 13 }}>
            <span style={{ color: "var(--text-body)", opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.12em" }}>Status</span>
            <span style={{ color: "var(--text-head)", textTransform: "capitalize" }}>{confirmed ? order.status === "paid" ? "Processing" : order.status : "Processing"}</span>
          </div>
          {order?.tracking_number && (
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontFamily: "var(--font-sans)", fontSize: 13 }}>
              <span style={{ color: "var(--text-body)", opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.12em" }}>Tracking</span>
              <span style={{ color: "var(--text-head)", fontFamily: "monospace" }}>{order.tracking_number}</span>
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
          <Link href="/home" style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--white)", background: "var(--green)", padding: "16px 32px", textDecoration: "none" }}>
            Return to Maison Gethse
          </Link>
          <Link href="/chapters/01" style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 400, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-body)", opacity: 0.4, textDecoration: "none" }}>
            Back to Chapter 01
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: "var(--bg-body)" }} />}>
      <SuccessContent />
    </Suspense>
  );
}
