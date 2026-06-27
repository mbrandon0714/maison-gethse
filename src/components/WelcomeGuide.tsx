"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KeyIcon } from "./KeyIcon";

const STEPS = [
  {
    title: "Welcome to Maison Gethse",
    body: "This is not a typical store. It's a narrative brand — each chapter tells a story, and each garment is an artifact of that story.",
    icon: "key",
  },
  {
    title: "How it works",
    body: "Scroll to explore the brand, read the chapters, and discover the meaning behind each drop. Or head straight to Shop if you already know what you want.",
    icon: "scroll",
  },
  {
    title: "The Garden & The Lens",
    body: "The Garden is a living archive of stories from people like you. The Lens is our visual memory — grounded, honest photography.",
    icon: "garden",
  },
];

export function WelcomeGuide() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem("mg-welcome-seen");
    if (!seen) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem("mg-welcome-seen", "1");
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else dismiss();
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            className="fixed inset-0 z-[800]"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
          />
          <motion.div
            className="fixed inset-0 z-[801] flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md relative text-center"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-soft)",
                borderRadius: 16,
                padding: "40px 32px 32px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
              }}
              initial={{ y: 30, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 30, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Skip button */}
              <button
                onClick={dismiss}
                className="absolute top-4 right-5"
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "var(--font-sans)", fontSize: 12, letterSpacing: "0.1em",
                  textTransform: "uppercase", color: "var(--text-body)", opacity: 0.4,
                }}
              >
                Skip
              </button>

              {/* Icon */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {STEPS[step].icon === "key" && (
                    <KeyIcon size={40} gold className="mx-auto mb-6" />
                  )}
                  {STEPS[step].icon === "scroll" && (
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.2" className="mx-auto mb-6">
                      <path d="M12 5v14M19 12l-7 7-7-7" />
                    </svg>
                  )}
                  {STEPS[step].icon === "garden" && (
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.2" className="mx-auto mb-6">
                      <path d="M12 22V8M12 8C12 8 7 3 3 8c4 0 9 0 9 0zM12 8C12 8 17 3 21 8c-4 0-9 0-9 0z" />
                      <path d="M7 22h10" />
                    </svg>
                  )}

                  {/* Title */}
                  <h3 style={{
                    fontFamily: "var(--font-serif)", fontSize: "1.4rem", fontWeight: 300,
                    color: "var(--text-head)", marginBottom: 12, lineHeight: 1.3,
                  }}>
                    {STEPS[step].title}
                  </h3>

                  {/* Body */}
                  <p style={{
                    fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 300,
                    lineHeight: 1.9, color: "var(--text-body)", maxWidth: 340, margin: "0 auto",
                  }}>
                    {STEPS[step].body}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-8 mb-6">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: i === step ? 20 : 6, height: 6, borderRadius: 3,
                      background: i === step ? "var(--gold)" : "var(--border-soft)",
                      transition: "all 0.3s",
                    }}
                  />
                ))}
              </div>

              {/* CTA */}
              <button
                onClick={next}
                style={{
                  width: "100%", padding: "16px 0",
                  fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500,
                  letterSpacing: "0.16em", textTransform: "uppercase",
                  color: "#fff", background: "var(--green)",
                  border: "none", borderRadius: 6, cursor: "pointer",
                  transition: "opacity 0.3s",
                }}
              >
                {step < STEPS.length - 1 ? "Next" : "Start Exploring"}
              </button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
