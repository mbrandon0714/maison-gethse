"use client";

import Image from "next/image";
import { useCart } from "./CartProvider";

const SHIPPING_FEE = 80;

export function CartDrawer() {
  const { items, removeItem, updateQuantity, isOpen, setIsOpen, justAdded, totalItems, subtotal } = useCart();
  const total = subtotal + (items.length > 0 ? SHIPPING_FEE : 0);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[500] bg-black/50" onClick={() => setIsOpen(false)} />
      <div className="fixed top-0 right-0 bottom-0 z-[501] w-full max-w-md bg-[var(--bg-surface)] shadow-2xl flex flex-col" data-lenis-prevent>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border-soft)]">
          <div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", fontWeight: 400, color: "var(--text-head)" }}>
              Your Cart
            </h2>
            {justAdded && (
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--gold)", marginTop: 2 }}>
                ✓ Item added
              </p>
            )}
          </div>
          <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", fontFamily: "var(--font-serif)", fontSize: "1.6rem", fontWeight: 300, color: "var(--text-body)", cursor: "pointer" }}>×</button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4" style={{ WebkitOverflowScrolling: "touch" }}>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", fontStyle: "italic", color: "var(--text-head)", opacity: 0.4 }}>Your cart is empty.</p>
              <button onClick={() => setIsOpen(false)} className="mt-4" style={{ fontFamily: "var(--font-sans)", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-body)", opacity: 0.5, background: "none", border: "none", cursor: "pointer" }}>Continue Exploring →</button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map(item => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4 pb-4 border-b border-[var(--border-soft)]">
                  <div className="w-20 h-24 relative overflow-hidden flex-shrink-0 bg-[var(--bg-mid)]">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 2 }}>{item.chapter}</p>
                        <p style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: 400, color: "var(--text-head)" }}>{item.name}</p>
                        <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--text-body)", marginTop: 2 }}>
                          Size {item.size} · {item.color}
                        </p>
                      </div>
                      <p style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", color: "var(--text-head)" }}>₱{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-0">
                        <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--input-bg)", border: "1px solid var(--border-soft)", fontSize: 16, color: "var(--text-head)", cursor: "pointer", fontFamily: "var(--font-sans)" }}>−</button>
                        <div style={{ width: 36, height: 32, display: "flex", alignItems: "center", justifyContent: "center", borderTop: "1px solid var(--border-soft)", borderBottom: "1px solid var(--border-soft)", background: "var(--input-bg)", fontSize: 13, color: "var(--text-head)", fontFamily: "var(--font-sans)" }}>{item.quantity}</div>
                        <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)} disabled={item.quantity >= item.maxStock} style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--input-bg)", border: "1px solid var(--border-soft)", fontSize: 16, color: "var(--text-head)", cursor: item.quantity >= item.maxStock ? "not-allowed" : "pointer", opacity: item.quantity >= item.maxStock ? 0.3 : 1, fontFamily: "var(--font-sans)" }}>+</button>
                      </div>
                      <button onClick={() => removeItem(item.id, item.size)} style={{ fontFamily: "var(--font-sans)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-body)", opacity: 0.5, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 }}>Remove</button>
                    </div>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: item.maxStock <= 3 ? "var(--gold)" : "var(--text-body)", marginTop: 6, opacity: 0.8 }}>
                      {item.maxStock} in stock · Limited archive
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-[var(--border-soft)]">
            <div className="flex justify-between mb-2" style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--text-body)" }}>
              <span>Subtotal ({totalItems} item{totalItems > 1 ? "s" : ""})</span>
              <span>₱{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-3" style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--text-body)" }}>
              <span>Shipping</span>
              <span>₱{SHIPPING_FEE}</span>
            </div>
            <div className="flex justify-between mb-5 pt-3 border-t border-[var(--border-soft)]" style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", fontWeight: 400, color: "var(--text-head)" }}>
              <span>Total</span>
              <span>₱{total.toLocaleString()}</span>
            </div>
            <a href="/checkout" style={{ display: "block", width: "100%", padding: "16px 0", fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 400, letterSpacing: "0.2em", textTransform: "uppercase", color: "#fff", background: "var(--green)", border: "none", textAlign: "center", textDecoration: "none" }}>
              Check Out
            </a>
            <p style={{ marginTop: 10, textAlign: "center", fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--text-body)", opacity: 0.4 }}>
              Secure payment via GCash · Maya · Card
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export function CartButton() {
  const { totalItems, setIsOpen } = useCart();

  return (
    <button onClick={() => setIsOpen(true)} className="relative" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-head)" }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
      </svg>
      {totalItems > 0 && (
        <span style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%", background: "var(--gold)", color: "#0f130f", fontSize: 10, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-sans)" }}>
          {totalItems}
        </span>
      )}
    </button>
  );
}
