"use client";

import { useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

/* ──────────────────────────────────────────────────────────
   FEEDBACK WIDGET — a quiet floating button (bottom-left) that
   lets any visitor ask a question or report something amiss.
   Sends to /api/feedback → Supabase + an email to the Maison.
   ────────────────────────────────────────────────────────── */

type FeedbackType = "question" | "bug";

const EXCLUDED = ["/admin"];

export function FeedbackWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<FeedbackType>("question");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const excluded = EXCLUDED.some((p) => pathname?.startsWith(p));

  const submit = useCallback(async () => {
    if (state === "sending") return;
    if (message.trim().length < 3) {
      setState("error");
      setErrorMsg("Please add a little more detail.");
      return;
    }
    setState("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          email,
          message,
          page: typeof window !== "undefined" ? window.location.pathname : "",
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setState("error");
        setErrorMsg(json.error || "Something went wrong — try again?");
        return;
      }
      setState("done");
      setMessage("");
      setEmail("");
    } catch {
      setState("error");
      setErrorMsg("Something went wrong — try again?");
    }
  }, [type, email, message, state]);

  const close = useCallback(() => {
    setOpen(false);
    // reset the success state a moment after closing
    setTimeout(() => setState("idle"), 300);
  }, []);

  if (excluded) return null;

  return (
    <>
      {/* ── Floating button ── */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label="Questions or feedback"
        className="fixed bottom-6 left-6 z-[350] cursor-pointer flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        style={{
          width: 50,
          height: 50,
          borderRadius: "50%",
          background: "var(--bg-surface)",
          border: "1px solid var(--gold)",
          boxShadow: "0 6px 24px rgba(0,0,0,0.35), 0 0 0 4px rgba(200,146,42,0.05)",
        }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              style={{ color: "var(--gold)", fontSize: 22, lineHeight: 1, fontFamily: "var(--font-serif)" }}
            >
              ×
            </motion.span>
          ) : (
            <motion.svg
              key="icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--gold)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-[86px] left-6 z-[351]"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: "min(340px, calc(100vw - 48px))",
              background: "var(--bg-surface)",
              border: "1px solid var(--border-soft)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              padding: "26px 24px 24px",
            }}
          >
            {state === "done" ? (
              <div style={{ textAlign: "center", padding: "16px 0 8px" }}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 500, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 14 }}>
                  Received
                </p>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.35rem", fontWeight: 300, fontStyle: "italic", color: "var(--text-head)", lineHeight: 1.5, marginBottom: 12 }}>
                  Thank you for tending this space.
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 300, lineHeight: 1.8, color: "var(--text-body)" }}>
                  If you left your email, we&rsquo;ll write back.
                </p>
                <button
                  onClick={close}
                  className="cursor-pointer"
                  style={{ marginTop: 20, fontFamily: "var(--font-sans)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)", background: "none", border: "none" }}
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 500, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 8 }}>
                  Reach the Maison
                </p>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.35rem", fontWeight: 300, fontStyle: "italic", color: "var(--text-head)", lineHeight: 1.4, marginBottom: 18 }}>
                  A question, or something amiss?
                </h3>

                {/* Type toggle */}
                <div className="flex gap-2 mb-4">
                  {([
                    { value: "question" as const, label: "A question" },
                    { value: "bug" as const, label: "Something's off" },
                  ]).map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setType(opt.value)}
                      className="flex-1 cursor-pointer"
                      style={{
                        fontFamily: "var(--font-sans)", fontSize: 11.5, fontWeight: 400,
                        letterSpacing: "0.04em", padding: "10px 8px",
                        color: type === opt.value ? "var(--white)" : "var(--text-head)",
                        background: type === opt.value ? "var(--green)" : "var(--input-bg)",
                        border: "1px solid " + (type === opt.value ? "var(--green)" : "var(--border-soft)"),
                        transition: "all 0.2s",
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={type === "bug" ? "What isn't working? Where did you see it?" : "What's on your mind?"}
                  rows={4}
                  className="w-full mb-3"
                  style={{
                    fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 300,
                    color: "var(--text-head)", background: "var(--input-bg)",
                    border: "1px solid var(--input-bd)", padding: "12px 14px",
                    outline: "none", resize: "vertical", lineHeight: 1.7,
                  }}
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com — so we can reply"
                  className="w-full mb-4"
                  style={{
                    fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 300,
                    color: "var(--text-head)", background: "var(--input-bg)",
                    border: "1px solid var(--input-bd)", padding: "11px 14px", outline: "none",
                  }}
                />

                {state === "error" && (
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#c46a4a", margin: "0 0 12px" }}>{errorMsg}</p>
                )}

                <button
                  onClick={submit}
                  disabled={state === "sending"}
                  className="w-full cursor-pointer"
                  style={{
                    fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 500,
                    letterSpacing: "0.2em", textTransform: "uppercase",
                    color: "#0f130f", background: "var(--gold)",
                    border: "none", padding: "14px", opacity: state === "sending" ? 0.6 : 1,
                  }}
                >
                  {state === "sending" ? "Sending…" : "Send"}
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
