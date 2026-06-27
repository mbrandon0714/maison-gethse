"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Animated word-by-word text ── */

function Word({ children, delay, gold }: { children: string; delay: number; gold?: boolean }) {
  return (
    <motion.span
      className="inline-block mx-[0.2em]"
      style={gold ? { color: "#c8922a" } : undefined}
      initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.span>
  );
}

function AnimatedLine({ text, startDelay, wordInterval = 0.12, style, goldWords = [] }: {
  text: string; startDelay: number; wordInterval?: number; style?: React.CSSProperties; goldWords?: number[];
}) {
  return (
    <div style={style}>
      {text.split(" ").map((word, i) => (
        <Word key={i} delay={startDelay + i * wordInterval} gold={goldWords.includes(i)}>{word}</Word>
      ))}
    </div>
  );
}

/* ── Particles that emanate from center ── */

function Particle({ delay, angle, distance, size }: {
  delay: number; angle: number; distance: number; size: number;
}) {
  const rad = (angle * Math.PI) / 180;
  const endX = Math.cos(rad) * distance;
  const endY = Math.sin(rad) * distance;

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size, height: size,
        left: "50%", top: "50%",
        marginLeft: -size / 2, marginTop: -size / 2,
        background: "#c8922a",
        boxShadow: `0 0 ${size * 3}px ${size}px rgba(200,146,42,0.3)`,
      }}
      initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
      animate={{
        opacity: [0, 0.8, 0.4, 0.6, 0.2],
        scale: [0, 1, 0.7, 1, 0.5],
        x: [0, endX * 0.3, endX * 0.6, endX],
        y: [0, endY * 0.3, endY * 0.6, endY],
      }}
      transition={{ delay, duration: 10, ease: "easeOut", repeat: Infinity, repeatType: "mirror" }}
    />
  );
}

/* ── Tour content — immersive full-screen panels ── */

const TOUR_STEPS = [
  {
    label: "The Brand",
    title: "Where pressure became purpose.",
    body: "Rooted in Gethsemane — a garden of transformation. This is the foundation of everything that follows.",
    bg: "radial-gradient(ellipse at 30% 60%, rgba(48,61,48,0.4) 0%, #050705 70%), #050705",
    accent: "var(--green)",
  },
  {
    label: "Chapters",
    title: "Each one honors a life.",
    body: "Every chapter represents a person. Every artifact carries the lessons they left behind. This is not a collection — it is a living archive.",
    bg: "radial-gradient(ellipse at 70% 40%, rgba(200,146,42,0.08) 0%, #050705 70%), #050705",
    accent: "var(--gold)",
  },
  {
    label: "Shop",
    title: "Carry a chapter with you.",
    body: "Each garment is an artifact — a record of a moment, a lesson, a person. You’re not buying a shirt. You’re carrying a story.",
    bg: "radial-gradient(ellipse at 50% 70%, rgba(48,61,48,0.3) 0%, #050705 70%), #050705",
    accent: "var(--green)",
  },
  {
    label: "The Garden",
    title: "An archive of becoming.",
    body: "A living collection of real stories, quiet lessons, and personal experiences from people navigating their own journeys.\n\nRead, reflect, and discover pieces of yourself in the chapters of others.",
    bg: "radial-gradient(ellipse at 40% 50%, rgba(200,146,42,0.06) 0%, #050705 60%), #050705",
    accent: "var(--gold)",
    hasFireflies: true,
  },
  {
    label: "The Lens",
    title: "An archive of perspective.",
    body: "A collection of visual stories from creators capturing the moments, people, and places that shape our journey.\n\nDocumented, not displayed.",
    bg: "radial-gradient(ellipse at 60% 40%, rgba(42,92,104,0.1) 0%, #050705 70%), #050705",
    accent: "var(--teal)",
    hasGrain: true,
  },
];

/* ── Main component ── */

export function WelcomeGuide() {
  const [mode, setMode] = useState<"hidden" | "cinematic" | "tour" | "done">("hidden");
  const [phase, setPhase] = useState(0);
  const [tourStep, setTourStep] = useState(0);
  const [showSkip, setShowSkip] = useState(false);

  const particles = useMemo(() =>
    Array.from({ length: 24 }).map((_, i) => ({
      angle: (i / 24) * 360 + Math.random() * 15,
      distance: 150 + Math.random() * 250,
      size: 2 + Math.random() * 3,
      delay: 2 + Math.random() * 5,
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

  /* ══════════════════════════════════════════
     CINEMATIC SEQUENCE
     ══════════════════════════════════════════ */
  if (mode === "cinematic") {
    return (
      <motion.div
        className="fixed inset-0 z-[900] flex items-center justify-center overflow-hidden"
        style={{ background: "#050705" }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.7) 100%)" }} />

        {/* Ambient radial glow */}
        {phase >= 1 && (
          <motion.div
            className="absolute pointer-events-none"
            style={{
              width: 500, height: 500,
              left: "50%", top: "50%",
              marginLeft: -250, marginTop: -250,
              background: "radial-gradient(circle, rgba(200,146,42,0.05) 0%, transparent 60%)",
            }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        {/* Particles emanating from center */}
        {phase >= 2 && particles.map((p, i) => <Particle key={i} {...p} />)}

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-8" style={{ maxWidth: 520 }}>

          <AnimatePresence mode="wait">
            {/* ── PHASE 1 ── */}
            {phase === 1 && (
              <motion.div key="p1" exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
                <AnimatedLine
                  text="Every story begins with a key."
                  startDelay={0.6}
                  wordInterval={0.15}
                  goldWords={[5]}
                  style={{
                    fontFamily: "var(--font-serif)", fontSize: "clamp(1.4rem, 3.5vw, 2rem)",
                    fontWeight: 300, fontStyle: "italic", color: "#f4f1ec", lineHeight: 1.6,
                  }}
                />
              </motion.div>
            )}

            {/* ── PHASE 2 ── */}
            {phase === 2 && (
              <motion.div key="p2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
                <AnimatedLine text="A reminder that growth," startDelay={0.2} wordInterval={0.13} goldWords={[3]}
                  style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.2rem, 3vw, 1.7rem)", fontWeight: 300, color: "#f4f1ec", lineHeight: 1.8 }} />
                <AnimatedLine text="purpose, and belonging" startDelay={0.9} wordInterval={0.13} goldWords={[0, 2]}
                  style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.2rem, 3vw, 1.7rem)", fontWeight: 300, color: "#f4f1ec", lineHeight: 1.8 }} />
                <AnimatedLine text="are carried within us." startDelay={1.5} wordInterval={0.14}
                  style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.2rem, 3vw, 1.7rem)", fontWeight: 300, fontStyle: "italic", color: "#c8922a", lineHeight: 1.8 }} />
              </motion.div>
            )}

            {/* ── PHASE 3 ── */}
            {phase === 3 && (
              <motion.div key="p3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
                <AnimatedLine text="Maison Gethse documents these chapters —" startDelay={0.2} wordInterval={0.09} goldWords={[0, 1, 4]}
                  style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(0.95rem, 2.2vw, 1.1rem)", fontWeight: 300, color: "#d8d4ce", lineHeight: 2.2, letterSpacing: "0.02em" }} />
                <AnimatedLine text="through the moments we capture," startDelay={1} wordInterval={0.09} goldWords={[2]}
                  style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(0.95rem, 2.2vw, 1.1rem)", fontWeight: 300, color: "#d8d4ce", lineHeight: 2.2, letterSpacing: "0.02em", opacity: 0.8 }} />
                <AnimatedLine text="the stories we preserve," startDelay={1.7} wordInterval={0.09} goldWords={[1]}
                  style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(0.95rem, 2.2vw, 1.1rem)", fontWeight: 300, color: "#d8d4ce", lineHeight: 2.2, letterSpacing: "0.02em", opacity: 0.8 }} />
                <AnimatedLine text="and the pieces we carry." startDelay={2.3} wordInterval={0.11} goldWords={[2]}
                  style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(0.95rem, 2.2vw, 1.1rem)", fontWeight: 300, fontStyle: "italic", color: "#f4f1ec", lineHeight: 2.2, letterSpacing: "0.02em" }} />
              </motion.div>
            )}

            {/* ── PHASE 4: Unlock ── */}
            {phase === 4 && (
              <motion.div key="p4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="flex flex-col items-center">
                <AnimatedLine text="Unlock the story." startDelay={0.3} wordInterval={0.2}
                  style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.5rem, 4vw, 2.2rem)", fontWeight: 300, fontStyle: "italic", color: "#c8922a", lineHeight: 1.5, marginBottom: 28 }} />

                <motion.div
                  className="flex flex-col sm:flex-row gap-3 mt-4"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4, duration: 0.6 }}
                >
                  <motion.button onClick={startTour} className="cursor-pointer"
                    style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "#0f130f", background: "var(--gold)", border: "none", padding: "15px 32px", borderRadius: 4 }}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    Show Me Around
                  </motion.button>
                  <motion.button onClick={dismiss} className="cursor-pointer"
                    style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(244,241,236,0.5)", background: "transparent", border: "1px solid rgba(244,241,236,0.12)", padding: "15px 32px", borderRadius: 4 }}
                    whileHover={{ borderColor: "rgba(244,241,236,0.3)" }}>
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
            onClick={dismiss} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(244,241,236,0.2)", background: "none", border: "none" }}
            whileHover={{ color: "rgba(244,241,236,0.5)" }}>
            Skip
          </motion.button>
        )}
      </motion.div>
    );
  }

  /* ══════════════════════════════════════════
     IMMERSIVE TOUR — full-screen panels
     ══════════════════════════════════════════ */
  if (mode === "tour") {
    const step = TOUR_STEPS[tourStep];
    const bodyLines = step.body.split("\n\n");

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={tourStep}
          className="fixed inset-0 z-[850] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: step.bg }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Vignette */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)" }} />

          {/* Film grain for Lens */}
          {step.hasGrain && (
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }} />
          )}

          {/* Fireflies for Garden */}
          {step.hasFireflies && Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 2 + (i % 3), height: 2 + (i % 3),
                background: "#c8922a",
                boxShadow: `0 0 ${6 + i * 2}px ${2 + i}px rgba(200,146,42,0.2)`,
                left: `${10 + (i * 7) % 80}%`,
                top: `${15 + (i * 11) % 70}%`,
              }}
              animate={{
                y: [0, -15, 5, 0],
                x: [0, (i % 2 === 0 ? 10 : -10), 0],
                opacity: [0.2, 0.7, 0.3],
              }}
              transition={{ duration: 4 + (i % 3) * 2, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
            />
          ))}

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center px-8 max-w-lg">

            {/* Step counter */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 400,
                letterSpacing: "0.3em", textTransform: "uppercase",
                color: "rgba(244,241,236,0.2)", marginBottom: 32,
              }}
            >
              {String(tourStep + 1).padStart(2, "0")} / {String(TOUR_STEPS.length).padStart(2, "0")}
            </motion.p>

            {/* Label */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              style={{
                fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600,
                letterSpacing: "0.28em", textTransform: "uppercase",
                color: "#f4f1ec",
                textShadow: "0 0 20px rgba(200,146,42,0.4)",
                marginBottom: 16,
              }}
            >
              {step.label}
            </motion.p>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
                fontWeight: 300, fontStyle: "italic",
                color: "#f4f1ec", lineHeight: 1.3,
                marginBottom: 20,
              }}
            >
              {step.title}
            </motion.h2>

            {/* Divider */}
            <motion.div
              style={{ width: 30, height: 1, background: step.accent, opacity: 0.3 }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mb-6"
            />

            {/* Body paragraphs */}
            {bodyLines.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.3, duration: 0.6 }}
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "clamp(0.9rem, 2vw, 1rem)",
                  fontWeight: 300, lineHeight: 2,
                  color: i === 0 ? "rgba(216,212,206,0.7)" : "rgba(216,212,206,0.5)",
                  letterSpacing: "0.02em",
                  maxWidth: 400, marginBottom: i < bodyLines.length - 1 ? 12 : 0,
                  fontStyle: i === bodyLines.length - 1 && bodyLines.length > 1 ? "italic" : "normal",
                }}
              >
                {line}
              </motion.p>
            ))}

            {/* Actions */}
            <motion.div
              className="flex gap-3 mt-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <motion.button onClick={dismiss} className="cursor-pointer"
                style={{
                  fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 400,
                  letterSpacing: "0.16em", textTransform: "uppercase",
                  color: "rgba(244,241,236,0.3)", background: "transparent",
                  border: "1px solid rgba(244,241,236,0.08)", padding: "13px 24px", borderRadius: 4,
                }}
                whileHover={{ borderColor: "rgba(244,241,236,0.2)", color: "rgba(244,241,236,0.5)" }}>
                Skip
              </motion.button>
              <motion.button onClick={nextTourStep} className="cursor-pointer"
                style={{
                  fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 500,
                  letterSpacing: "0.16em", textTransform: "uppercase",
                  color: "#0f130f", background: "var(--gold)",
                  border: "none", padding: "13px 28px", borderRadius: 4,
                }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                {tourStep < TOUR_STEPS.length - 1 ? "Continue" : "Enter Maison Gethse"}
              </motion.button>
            </motion.div>

            {/* Dots */}
            <div className="flex gap-2 mt-8">
              {TOUR_STEPS.map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    width: i === tourStep ? 20 : 6,
                    background: i === tourStep ? "var(--gold)" : "rgba(244,241,236,0.1)",
                  }}
                  style={{ height: 4, borderRadius: 2 }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return null;
}
