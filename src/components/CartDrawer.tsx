"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartProvider";

const SHIPPING_FEE = 80;

const OTHER_DROPS = [
  { name: "Lesson II — Coming Soon", desc: "The second artifact of Chapter 01", status: "upcoming" },
  { name: "Lesson III — Coming Soon", desc: "The third artifact of Chapter 01", status: "upcoming" },
];

export function CartDrawer() {
  const { items, removeItem, updateQuantity, isOpen, setIsOpen, justAdded, totalItems, subtotal } = useCart();
  const total = subtotal + (items.length > 0 ? SHIPPING_FEE : 0);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[500] bg-black/60" onClick={() => setIsOpen(false)} />
      <div className="fixed inset-0 md:inset-auto md:top-0 md:right-0 md:bottom-0 md:w-full md:max-w-xl z-[501] bg-[var(--bg-surface)] shadow-2xl flex flex-col" data-lenis-prevent>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border-soft)] flex-shrink-0">
          <div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", fontWeight: 400, color: "var(--text-head)" }}>Your Cart</h2>
            {justAdded && <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--gold)", marginTop: 4, fontWeight: 500 }}>✓ Added to cart</p>}
          </div>
          <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", fontFamily: "var(--font-serif)", fontSize: "1.8rem", fontWeight: 300, color: "var(--text-body)", cursor: "pointer" }}>×</button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling: "touch" }}>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6 py-20">
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", fontStyle: "italic", color: "var(--text-head)", opacity: 0.4 }}>Your cart is empty.</p>
              <button onClick={() => setIsOpen(false)} className="mt-4" style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--text-body)", opacity: 0.5, background: "none", border: "none", cursor: "pointer" }}>Continue Exploring →</button>
            </div>
          ) : (
            <div className="px-6 py-5">
              {/* Cart items */}
              {items.map(item => (
                <div key={`${item.id}-${item.size}`} className="flex gap-5 pb-6 mb-6 border-b border-[var(--border-soft)]">
                  <div className="w-24 h-30 relative overflow-hidden flex-shrink-0 bg-[var(--bg-mid)]" style={{ borderRadius: 6 }}>
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 3 }}>{item.chapter}</p>
                        <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", fontWeight: 400, color: "var(--text-head)" }}>{item.name}</p>
                        <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--text-body)", marginTop: 3 }}>Size {item.size} · {item.color}</p>
                      </div>
                      <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", color: "var(--text-head)" }}>₱{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center">
                        <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--input-bg)", border: "1px solid var(--border-soft)", fontSize: 16, color: "var(--text-head)", cursor: "pointer", borderRadius: 4 }}>−</button>
                        <div style={{ width: 40, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderTop: "1px solid var(--border-soft)", borderBottom: "1px solid var(--border-soft)", background: "var(--input-bg)", fontSize: 14, fontWeight: 500, color: "var(--text-head)" }}>{item.quantity}</div>
                        <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)} disabled={item.quantity >= item.maxStock} style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--input-bg)", border: "1px solid var(--border-soft)", fontSize: 16, color: "var(--text-head)", cursor: item.quantity >= item.maxStock ? "not-allowed" : "pointer", opacity: item.quantity >= item.maxStock ? 0.3 : 1, borderRadius: 4 }}>+</button>
                      </div>
                      <button onClick={() => removeItem(item.id, item.size)} style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--text-body)", opacity: 0.5, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 }}>Remove</button>
                    </div>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: item.maxStock <= 3 ? "var(--gold)" : "var(--text-body)", marginTop: 8 }}>
                      {item.maxStock} in stock · Limited archive
                    </p>
                  </div>
                </div>
              ))}

              {/* Other drops / Quick adds */}
              <div className="mt-4 mb-6">
                <h3 style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-body)", marginBottom: 14 }}>Other Artifacts</h3>
                {OTHER_DROPS.map((drop, i) => (
                  <div key={i} style={{ padding: "14px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-soft)", borderRadius: 6, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ fontFamily: "var(--font-serif)", fontSize: 15, color: "var(--text-head)" }}>{drop.name}</p>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--text-body)", opacity: 0.5, marginTop: 2 }}>{drop.desc}</p>
                    </div>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold)", opacity: 0.6, whiteSpace: "nowrap" }}>Coming Soon</span>
                  </div>
                ))}
              </div>

              {/* FAQs */}
              <div className="mt-2 mb-4">
                <h3 style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-body)", marginBottom: 14 }}>Quick Help</h3>
                {[
                  { q: "How long does shipping take?", a: "3-5 business days via J&T Express nationwide." },
                  { q: "Can I exchange my order?", a: "Yes, exchanges accepted within 7 days for unworn items with tags." },
                  { q: "Do you accept returns?", a: "Exchanges only — no refunds. We want you to love what you carry." },
                  { q: "How do I track my order?", a: "You'll receive a tracking number via email once your order ships." },
                ].map((faq, i) => (
                  <details key={i} style={{ marginBottom: 6, border: "1px solid var(--border-soft)", borderRadius: 6, overflow: "hidden" }}>
                    <summary style={{ padding: "12px 16px", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 400, color: "var(--text-head)", cursor: "pointer", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      {faq.q}
                    </summary>
                    <div style={{ padding: "0 16px 14px", fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--text-body)", opacity: 0.7, lineHeight: 1.7 }}>
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer — checkout */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-[var(--border-soft)] flex-shrink-0">
            <div className="flex justify-between mb-2" style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--text-body)" }}>
              <span>Subtotal ({totalItems} item{totalItems > 1 ? "s" : ""})</span>
              <span style={{ color: "var(--text-head)" }}>₱{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-3" style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--text-body)" }}>
              <span>Shipping</span>
              <span style={{ color: "var(--text-head)" }}>₱{SHIPPING_FEE}</span>
            </div>
            <div className="flex justify-between mb-5 pt-3 border-t border-[var(--border-soft)]" style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", fontWeight: 500, color: "var(--text-head)" }}>
              <span>Total</span>
              <span>₱{total.toLocaleString()}</span>
            </div>
            <Link href="/checkout" onClick={() => setIsOpen(false)} style={{ display: "block", width: "100%", padding: "18px 0", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: "#fff", background: "var(--green)", border: "none", textAlign: "center", textDecoration: "none", borderRadius: 4 }}>
              Check Out — ₱{total.toLocaleString()}
            </Link>
            <p style={{ marginTop: 12, textAlign: "center", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500, color: "var(--text-body)", opacity: 0.6 }}>
              Secure payment via GCash · Maya · Card
            </p>
          </div>
        )}
      </div>

      {/* Fly animation */}
      <FlyAnimation />
    </>
  );
}

function FlyAnimation() {
  const { flyFrom } = useCart();
  if (!flyFrom) return null;

  return (
    <>
      {/* Thumbnail that flies to cart */}
      <div
        className="fixed z-[600] pointer-events-none"
        style={{
          left: flyFrom.x - 28,
          top: flyFrom.y - 28,
          width: 56,
          height: 56,
          borderRadius: 8,
          overflow: "hidden",
          border: "2px solid var(--gold)",
          boxShadow: "0 0 30px rgba(200,146,42,0.5), 0 4px 20px rgba(0,0,0,0.3)",
          animation: "flyThumbToCart 1s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        {flyFrom.image && (
          <img src={flyFrom.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
        {!flyFrom.image && (
          <div style={{ width: "100%", height: "100%", background: "var(--gold)" }} />
        )}
      </div>
      {/* Gold burst at origin */}
      <div
        className="fixed z-[599] pointer-events-none"
        style={{
          left: flyFrom.x - 20,
          top: flyFrom.y - 20,
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,146,42,0.4) 0%, transparent 70%)",
          animation: "burstFade 0.6s ease-out forwards",
        }}
      />
      <style>{`
        @keyframes flyThumbToCart {
          0% { transform: scale(1) translate(0, 0); opacity: 1; }
          40% { transform: scale(0.7) translate(10px, -60px); opacity: 0.9; }
          100% { transform: scale(0.2) translate(calc(100vw - ${flyFrom.x}px - 60px), calc(-${flyFrom.y}px + 36px)); opacity: 0; }
        }
        @keyframes burstFade {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(3); opacity: 0; }
        }
      `}</style>
    </>
  );
}

export function CartButton() {
  const { totalItems, setIsOpen, justAdded } = useCart();

  return (
    <button onClick={() => setIsOpen(true)} className="relative" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-head)" }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
      </svg>
      {totalItems > 0 && (
        <span style={{
          position: "absolute", top: -8, right: -8, width: 20, height: 20, borderRadius: "50%",
          background: "var(--gold)", color: "#0f130f", fontSize: 11, fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-sans)",
          animation: justAdded ? "cartPop 0.4s ease" : "none",
        }}>
          {totalItems}
        </span>
      )}
      <style>{`
        @keyframes cartPop {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(200,146,42,0.6); }
          30% { transform: scale(1.8); box-shadow: 0 0 12px 4px rgba(200,146,42,0.4); }
          60% { transform: scale(0.9); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(200,146,42,0); }
        }
      `}</style>
    </button>
  );
}
