"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

/* ──────────────────────────────────────────────────────────
   LETTERS FROM THE MAISON — email capture invitation.
   Appears once, softly, after the visitor has settled in:
   never during the welcome sequence, never on checkout/admin,
   and never again for 14 days once dismissed (forever once
   subscribed).
   ────────────────────────────────────────────────────────── */

const STORAGE_KEY = "mg-letters";
const DISMISS_COOLDOWN_DAYS = 14;
const IDLE_DELAY_MS = 18000; // show after 18s on page…
const SCROLL_TRIGGER = 0.4; // …or after 40% scroll, whichever first

const EXCLUDED_PATHS = ["/checkout", "/admin", "/order"];

function getStored(): { state: string; at?: number } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function LettersInvite() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const armed = useRef(false);

  const excluded = EXCLUDED_PATHS.some((p) => pathname?.startsWith(p));

  useEffect(() => {
    if (excluded || armed.current) return;

    const stored = getStored();
    if (stored?.state === "subscribed") return;
    if (
      stored?.state === "dismissed" &&
      stored.at &&
      Date.now() - stored.at < DISMISS_COOLDOWN_DAYS * 24 * 60 * 60 * 1000
    )
      return;

    armed.current = true;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let waiter: ReturnType<typeof setInterval> | null = null;
    let shown = false;

    const show = () => {
      if (shown) return;
      shown = true;
      cleanup();
      setVisible(true);
    };

    const onScroll = () => {
      const doc = document.documentElement;
      const progress = window.scrollY / Math.max(1, doc.scrollHeight - window.innerHeight);
      if (progress > SCROLL_TRIGGER) show();
    };

    const arm = () => {
      timer = setTimeout(show, IDLE_DELAY_MS);
      window.addEventListener("scroll", onScroll, { passive: true });
    };

    const cleanup = () => {
      if (timer) clearTimeout(timer);
      if (waiter) clearInterval(waiter);
      window.removeEventListener("scroll", onScroll);
    };

    // Wait for the welcome sequence to finish before counting down.
    if (sessionStorage.getItem("mg-welcome-seen")) {
      arm();
    } else {
      waiter = setInterval(() => {
        if (sessionStorage.getItem("mg-welcome-seen")) {
          if (waiter) clearInterval(waiter);
          arm();
        }
      }, 1000);
    }

    return cleanup;
  }, [excluded]);

  const dismiss = useCallback(() => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ state: "dismissed", at: Date.now() }));
  }, []);

  const submit = useCallback(async () => {
    if (status === "sending") return;
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "popup" }),
      });
      const json = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(json.error || "Something went wrong — try again?");
        return;
      }
      setStatus("done");
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ state: "subscribed" }));
      setTimeout(() => setVisible(false), 4000);
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong — try again?");
    }
  }, [email, status]);

  if (excluded) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[800] flex items-center justify-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Soft overlay */}
          <div
            className="absolute inset-0"
            style={{ background: "rgba(5,7,5,0.55)", backdropFilter: "blur(3px)" }}
            onClick={status === "done" ? undefined : dismiss}
          />

          {/* Card */}
          <motion.div
            className="relative w-full"
            style={{
              maxWidth: 460,
              background: "var(--bg-surface)",
              border: "1px solid var(--border-soft)",
              boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
              padding: "44px 40px 40px",
            }}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Close */}
            <button
              onClick={dismiss}
              aria-label="Close"
              className="absolute top-4 right-4 cursor-pointer"
              style={{
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                fontSize: 18,
                lineHeight: 1,
                padding: 6,
              }}
            >
              ×
            </button>

            {status !== "done" ? (
              <>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: "0.26em",
                    textTransform: "uppercase",
                    color: "var(--gold)",
                    marginBottom: 18,
                  }}
                >
                  Letters from the Maison
                </p>

                <h2
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(1.4rem, 3vw, 1.7rem)",
                    fontWeight: 300,
                    fontStyle: "italic",
                    color: "var(--text-head)",
                    lineHeight: 1.45,
                    marginBottom: 14,
                  }}
                >
                  When the next chapter opens, we&apos;ll write to you first.
                </h2>

                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 14,
                    fontWeight: 300,
                    lineHeight: 1.9,
                    color: "var(--text-body)",
                    marginBottom: 26,
                  }}
                >
                  Leave your address — new chapters, new artifacts, and the
                  stories behind them. Nothing more.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submit();
                  }}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 14,
                      padding: "13px 16px",
                      background: "var(--input-bg)",
                      border: "1px solid var(--input-bd)",
                      color: "var(--text-head)",
                      outline: "none",
                      borderRadius: 4,
                      minWidth: 0,
                    }}
                  />
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="cursor-pointer"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 11,
                      fontWeight: 500,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "#0f130f",
                      background: "var(--gold)",
                      border: "none",
                      padding: "13px 22px",
                      borderRadius: 4,
                      opacity: status === "sending" ? 0.6 : 1,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {status === "sending" ? "Sending…" : "Leave My Address"}
                  </button>
                </form>

                {status === "error" && (
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 12,
                      color: "#c46a4a",
                      marginTop: 12,
                    }}
                  >
                    {errorMsg}
                  </p>
                )}

                <button
                  onClick={dismiss}
                  className="cursor-pointer"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 11,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    background: "none",
                    border: "none",
                    marginTop: 20,
                    padding: 0,
                  }}
                >
                  Not now
                </button>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ textAlign: "center", padding: "12px 0" }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: "0.26em",
                    textTransform: "uppercase",
                    color: "var(--gold)",
                    marginBottom: 16,
                  }}
                >
                  Letters from the Maison
                </p>
                <h2
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.5rem",
                    fontWeight: 300,
                    fontStyle: "italic",
                    color: "var(--text-head)",
                    lineHeight: 1.5,
                    marginBottom: 10,
                  }}
                >
                  The first letter is on its way.
                </h2>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 13,
                    fontWeight: 300,
                    lineHeight: 1.8,
                    color: "var(--text-body)",
                  }}
                >
                  You&apos;ll hear from us when something is worth saying.
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
