"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KeyIcon } from "./KeyIcon";

/* ── Animated word-by-word text ── */

function Word({ children, delay }: { children: string; delay: number }) {
  return (
    <motion.span
      className="inline-block mx-[0.2em]"
      initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.span>
  );
}

function AnimatedLine({ text, startDelay, wordInterval = 0.12, style }: {
  text: string; startDelay: number; wordInterval?: number; style?: React.CSSProperties;
}) {
  return (
    <div style={style}>
      {text.split(" ").map((word, i) => (
        <Word key={i} delay={startDelay + i * wordInterval}>{word}</Word>
      ))}
    </div>
  );
}

/* ── Floating particles ── */

function Particle({ delay, x, y, size, drift }: {
  delay: number; x: number; y: number; size: number; drift: { x: number; y: number };
}) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size, height: size, left: `${x}%`, top: `${y}%`,
        background: "#c8922a",
        boxShadow: `0 0 ${size * 3}px ${size}px rgba(200,146,42,0.3)`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.7, 0.3, 0.6, 0.3],
        scale: [0, 1, 0.8, 1.1, 0.9],
        x: [0, drift.x * 0.5, drift.x],
        y: [0, drift.y * 0.3, drift.y],
      }}
      transition={{ delay, duration: 8, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
    />
  );
}

/* ── Tour content ── */

const TOUR_STEPS = [
  {
    label: "The Brand",
    text: "Where it all started — and why pressure became the foundation.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.2">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    label: "Chapters",
    text: "Each one honors a person. Each garment carries what they left behind.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.2">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 014 17V5a2.5 2.5 0 012.5-2.5H20v17H6.5z" />
      </svg>
    ),
  },
  {
    label: "Shop",
    text: "You're not buying a shirt. You're carrying a chapter.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.2">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
      </svg>
    ),
  },
  {
    label: "The Garden",
    text: "A living archive. Plant what you carry — anonymously or by name.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.2">
        <path d="M12 22V8M12 8C12 8 7 3 3 8c4 0 9 0 9 0zM12 8C12 8 17 3 21 8c-4 0-9 0-9 0z" />
        <path d="M7 22h10" />
      </svg>
    ),
  },
  {
    label: "The Lens",
    text: "Photography as memory — documented, not displayed.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.2">
        <circle cx="12" cy="13" r="3" />
        <path d="M5 7h2l2-3h6l2 3h2a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z" />
      </svg>
    ),
  },
];

/* ── Main component ── */

export function WelcomeGuide() {
  const [mode, setMode] = useState<"hidden" | "cinematic" | "tour" | "done">("hidden");
  const [phase, setPhase] = useState(0);
  const [tourStep, setTourStep] = useState(0);
  const [showSkip, setShowSkip] = useState(false);

  const particles = useMemo(() =>
    Array.from({ length: 30 }).map(() => ({
      x: 25 + Math.random() * 50,
      y: 25 + Math.random() * 50,
      size: 2 + Math.random() * 4,
      delay: 3 + Math.random() * 6,
      drift: { x: (Math.random() - 0.5) * 120, y: (Math.random() - 0.5) * 80 },
    })),
  []);

  useEffect(() => {
    const seen = localStorage.getItem("mg-welcome-seen");
    if (!seen) {
      const timer = setTimeout(() => setMode("cinematic"), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (mode !== "cinematic") return;

    setTimeout(() => setShowSkip(true), 2000);

    const timers = [
      setTimeout(() => setPhase(1), 0),
      setTimeout(() => setPhase(2), 5000),
      setTimeout(() => setPhase(3), 9500),
      setTimeout(() => setPhase(4), 16000),
    ];

    return () => timers.forEach(clearTimeout);
  }, [mode]);

  const dismiss = useCallback(() => {
    setMode("done");
    localStorage.setItem("mg-welcome-seen", "1");
  }, []);

  const startTour = useCallback(() => {
    setMode("tour");
    setTourStep(0);
  }, []);

  const nextTourStep = useCallback(() => {
    if (tourStep < TOUR_STEPS.length - 1) {
      setTourStep(tourStep + 1);
    } else {
      dismiss();
    }
  }, [tourStep, dismiss]);

  if (mode === "hidden" || mode === "done") return null;

  /* ── CINEMATIC SEQUENCE ── */
  if (mode === "cinematic") {
    return (
      <motion.div
        className="fixed inset-0 z-[900] flex items-center justify-center overflow-hidden"
        style={{ background: "#050705" }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)" }} />

        {/* Golden particles */}
        {phase >= 2 && particles.map((p, i) => <Particle key={i} {...p} />)}

        {/* Content — absolutely centered */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-8" style={{ maxWidth: 520 }}>

          {/* ── THE KEY (phases 1-3) ── */}
          <AnimatePresence>
            {phase >= 1 && phase <= 3 && (
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                  opacity: 1,
                  scale: phase >= 3 ? 1.1 : 1,
                  rotate: phase >= 3 ? 90 : 0,
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  scale: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
                  rotate: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
                  opacity: { duration: 0.8 },
                }}
              >
                <motion.div
                  animate={{
                    filter: [
                      "drop-shadow(0 0 8px rgba(200,146,42,0.3))",
                      "drop-shadow(0 0 24px rgba(200,146,42,0.6))",
                      "drop-shadow(0 0 8px rgba(200,146,42,0.3))",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <KeyIcon size={64} gold />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── PHASE 1: "Every story begins with a key." ── */}
          <AnimatePresence mode="wait">
            {phase === 1 && (
              <motion.div key="p1" exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
                <AnimatedLine
                  text="Every story begins with a key."
                  startDelay={0.6}
                  wordInterval={0.15}
                  style={{
                    fontFamily: "var(--font-serif)", fontSize: "clamp(1.4rem, 3.5vw, 2rem)",
                    fontWeight: 300, fontStyle: "italic", color: "#f4f1ec", lineHeight: 1.6,
                  }}
                />
              </motion.div>
            )}

            {/* ── PHASE 2: "A reminder that growth..." ── */}
            {phase === 2 && (
              <motion.div key="p2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
                <AnimatedLine text="A reminder that growth," startDelay={0.2} wordInterval={0.13}
                  style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.2rem, 3vw, 1.7rem)", fontWeight: 300, color: "#f4f1ec", lineHeight: 1.8 }} />
                <AnimatedLine text="purpose, and belonging" startDelay={0.9} wordInterval={0.13}
                  style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.2rem, 3vw, 1.7rem)", fontWeight: 300, color: "#f4f1ec", lineHeight: 1.8 }} />
                <AnimatedLine text="are carried within us." startDelay={1.5} wordInterval={0.14}
                  style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.2rem, 3vw, 1.7rem)", fontWeight: 300, fontStyle: "italic", color: "#c8922a", lineHeight: 1.8 }} />
              </motion.div>
            )}

            {/* ── PHASE 3: "Maison Gethse documents..." ── */}
            {phase === 3 && (
              <motion.div key="p3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
                <AnimatedLine text="Maison Gethse documents these chapters —" startDelay={0.2} wordInterval={0.09}
                  style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(0.95rem, 2.2vw, 1.1rem)", fontWeight: 300, color: "#d8d4ce", lineHeight: 2.1, letterSpacing: "0.02em" }} />
                <AnimatedLine text="through the moments we capture," startDelay={1} wordInterval={0.09}
                  style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(0.95rem, 2.2vw, 1.1rem)", fontWeight: 300, color: "#d8d4ce", lineHeight: 2.1, letterSpacing: "0.02em", opacity: 0.8 }} />
                <AnimatedLine text="the stories we preserve," startDelay={1.7} wordInterval={0.09}
                  style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(0.95rem, 2.2vw, 1.1rem)", fontWeight: 300, color: "#d8d4ce", lineHeight: 2.1, letterSpacing: "0.02em", opacity: 0.8 }} />
                <AnimatedLine text="and the pieces we carry." startDelay={2.3} wordInterval={0.11}
                  style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(0.95rem, 2.2vw, 1.1rem)", fontWeight: 300, fontStyle: "italic", color: "#f4f1ec", lineHeight: 2.1, letterSpacing: "0.02em" }} />
              </motion.div>
            )}

            {/* ── PHASE 4: "Unlock the story." ── */}
            {phase === 4 && (
              <motion.div key="p4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="flex flex-col items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-6"
                >
                  <KeyIcon size={52} gold />
                </motion.div>

                <AnimatedLine text="Unlock the story." startDelay={0.4} wordInterval={0.2}
                  style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.5rem, 4vw, 2.2rem)", fontWeight: 300, fontStyle: "italic", color: "#c8922a", lineHeight: 1.5, marginBottom: 28 }} />

                <motion.div
                  className="flex flex-col sm:flex-row gap-3 mt-4"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4, duration: 0.6 }}
                >
                  <motion.button
                    onClick={startTour}
                    className="cursor-pointer"
                    style={{
                      fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 500,
                      letterSpacing: "0.18em", textTransform: "uppercase",
                      color: "#0f130f", background: "var(--gold)",
                      border: "none", padding: "15px 32px", borderRadius: 4,
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Show Me Around
                  </motion.button>
                  <motion.button
                    onClick={dismiss}
                    className="cursor-pointer"
                    style={{
                      fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 400,
                      letterSpacing: "0.18em", textTransform: "uppercase",
                      color: "rgba(244,241,236,0.5)", background: "transparent",
                      border: "1px solid rgba(244,241,236,0.12)", padding: "15px 32px", borderRadius: 4,
                    }}
                    whileHover={{ borderColor: "rgba(244,241,236,0.3)" }}
                  >
                    I&apos;ll Explore Myself
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Skip */}
        {showSkip && phase < 4 && (
          <motion.button
            className="absolute top-6 right-6 md:top-8 md:right-8 z-20 cursor-pointer"
            onClick={dismiss}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 400,
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: "rgba(244,241,236,0.2)", background: "none", border: "none",
            }}
            whileHover={{ color: "rgba(244,241,236,0.5)" }}
          >
            Skip
          </motion.button>
        )}
      </motion.div>
    );
  }

  /* ── TOUR MODE ── */
  if (mode === "tour") {
    const step = TOUR_STEPS[tourStep];

    return (
      <>
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 z-[850]"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(3px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={dismiss}
        />

        {/* Tour card */}
        <motion.div
          className="fixed inset-0 z-[851] flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={tourStep}
              className="w-full max-w-sm relative"
              style={{
                background: "var(--bg-surface)", border: "1px solid rgba(200,146,42,0.15)",
                borderRadius: 16, padding: "36px 28px 28px", textAlign: "center",
                boxShadow: "0 0 40px rgba(200,146,42,0.06), 0 20px 60px rgba(0,0,0,0.4)",
              }}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Icon */}
              <div className="mb-5 flex justify-center">{step.icon}</div>

              {/* Label */}
              <p style={{
                fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 500,
                letterSpacing: "0.22em", textTransform: "uppercase",
                color: "var(--gold)", marginBottom: 8,
              }}>
                {step.label}
              </p>

              {/* Description */}
              <p style={{
                fontFamily: "var(--font-serif)", fontSize: "1.15rem", fontWeight: 300,
                fontStyle: "italic", color: "var(--text-head)", lineHeight: 1.65,
                maxWidth: 280, margin: "0 auto",
              }}>
                {step.text}
              </p>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-7 mb-5">
                {TOUR_STEPS.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: i === tourStep ? 18 : 6, height: 6, borderRadius: 3,
                      background: i === tourStep ? "var(--gold)" : "var(--border-soft)",
                      transition: "all 0.3s",
                    }}
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={dismiss}
                  className="flex-1 cursor-pointer"
                  style={{
                    fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 400,
                    letterSpacing: "0.1em", textTransform: "uppercase",
                    color: "var(--text-body)", background: "transparent",
                    border: "1px solid var(--border-soft)", padding: "13px 0", borderRadius: 6,
                  }}
                >
                  Skip Tour
                </button>
                <button
                  onClick={nextTourStep}
                  className="flex-1 cursor-pointer"
                  style={{
                    fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 500,
                    letterSpacing: "0.1em", textTransform: "uppercase",
                    color: "#fff", background: "var(--green)",
                    border: "none", padding: "13px 0", borderRadius: 6,
                  }}
                >
                  {tourStep < TOUR_STEPS.length - 1 ? "Next" : "Start Exploring"}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </>
    );
  }

  return null;
}
