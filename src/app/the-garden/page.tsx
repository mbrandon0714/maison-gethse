"use client";

import { useRef, useState, useMemo, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { MuteToggle } from "@/components/MuteToggle";
import { KeyIcon } from "@/components/KeyIcon";

function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

const PROMPTS = [
  "What season are you currently walking through?",
  "What is something you learned that changed you?",
  "Who helped shape the person you are becoming?",
  "What would you tell your younger self?",
  "What are you carrying quietly?",
  "Ano ang dala-dala mo na hindi mo masabi?",
  "What lesson stayed with you the longest?",
  "What did you lose that taught you the most?",
];

const SAMPLE_SEEDS = [
  {
    id: 1,
    text: "I learned that silence is not emptiness — it is where I finally heard what mattered.",
    author: "Anonymous",
    prompt: "What is something you learned that changed you?",
    rotation: -2.1,
  },
  {
    id: 2,
    text: "My father never said he was proud. But he showed up every morning at 4 AM for 23 years. That was his language.",
    author: "M.",
    prompt: "Who helped shape the person you are becoming?",
    rotation: 1.4,
  },
  {
    id: 3,
    text: "I'm in the season of unlearning everything I thought I needed to be. It's quiet. It's uncomfortable. But it's honest.",
    author: "Anonymous",
    prompt: "What season are you currently walking through?",
    rotation: -0.8,
  },
  {
    id: 4,
    text: "You don't have to carry everything. Some of it was never yours to begin with.",
    author: "K.",
    prompt: "What would you tell your younger self?",
    rotation: 2.3,
  },
  {
    id: 5,
    text: "The version of me that kept going when nobody was watching — that's the one I'm most proud of.",
    author: "Anonymous",
    prompt: "What are you carrying quietly?",
    rotation: -1.6,
  },
  {
    id: 6,
    text: "Hindi ko alam kung saan ako patungo. Pero alam ko na ayaw ko nang bumalik sa dati.",
    author: "J.",
    prompt: "Ano ang dala-dala mo na hindi mo masabi?",
    rotation: 0.9,
  },
  {
    id: 7,
    text: "I lost someone who believed in me before I believed in myself. Now I carry that belief for both of us.",
    author: "Anonymous",
    prompt: "What did you lose that taught you the most?",
    rotation: -2.8,
  },
  {
    id: 8,
    text: "The hardest lesson: growth doesn't always feel like progress. Sometimes it feels like breaking.",
    author: "R.",
    prompt: "What lesson stayed with you the longest?",
    rotation: 1.1,
  },
];

export default function TheGardenPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [previewSeed, setPreviewSeed] = useState<typeof SAMPLE_SEEDS[0] | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [identityType, setIdentityType] = useState<"anonymous" | "penname" | "name">("anonymous");
  const [displayName, setDisplayName] = useState("");
  const [seedText, setSeedText] = useState("");

  const currentPrompt = useMemo(() => {
    return PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
  }, []);

  const handleSubmit = useCallback(() => {
    if (!seedText.trim()) return;
    // TODO: POST to Supabase with status: "pending"
    // { text: seedText, identity_type: identityType, display_name: displayName, prompt: currentPrompt }
    setSubmitted(true);
    setTimeout(() => {
      setFormOpen(false);
      setSubmitted(false);
      setSeedText("");
      setDisplayName("");
    }, 3500);
  }, [seedText, identityType, displayName, currentPrompt]);

  return (
    <>
      <Navigation />
      <MuteToggle />

      <main>
        {/* ═══ HERO ═══ */}
        <section
          className="min-h-[80vh] flex items-center justify-center relative"
          style={{ background: "var(--bg-deep)", paddingTop: "var(--nav-h)" }}
        >
          {/* Subtle particle field */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 3,
                  height: 3,
                  background: "rgba(200,146,42,0.25)",
                  left: `${10 + (i * 7.3) % 80}%`,
                  bottom: "-5%",
                }}
                animate={{
                  y: [0, -900],
                  x: [0, (i % 2 === 0 ? 30 : -20)],
                  opacity: [0, 0.6, 0.6, 0],
                }}
                transition={{
                  duration: 8 + (i % 4) * 2,
                  repeat: Infinity,
                  delay: i * 0.8,
                  ease: "linear",
                }}
              />
            ))}
          </div>

          <motion.div
            className="relative z-10 text-center max-w-2xl px-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="mb-6" style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 400, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--gold)", opacity: 0.7 }}>
              The Garden
            </p>

            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 300, color: "var(--beige-light)", lineHeight: 1.12, fontStyle: "italic" }}>
              What are you carrying?
            </h1>

            <div className="w-[1px] h-[40px] mx-auto my-8" style={{ background: "var(--beige)", opacity: 0.12 }} />

            <p style={{ fontFamily: "var(--font-sans)", fontSize: "16px", fontWeight: 300, lineHeight: 2.1, color: "var(--beige)", opacity: 0.5, letterSpacing: "0.02em", maxWidth: "520px", margin: "0 auto" }}>
              A living archive of stories from people walking through their own seasons. Not a comment section. A sanctuary — where seeds are planted, and proof grows that you are not alone.
            </p>

            <motion.button
              className="mt-10 cursor-pointer"
              onClick={() => setFormOpen(true)}
              style={{
                fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 400,
                letterSpacing: "0.22em", textTransform: "uppercase",
                color: "var(--green-deep)", background: "var(--beige-light)",
                border: "none", padding: "16px 32px",
                transition: "background 0.3s",
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Plant a Seed
            </motion.button>
          </motion.div>
        </section>

        {/* ═══ THE ARCHIVE ═══ */}
        <section className="py-24 px-6 md:px-12 relative" style={{ background: "#0f130f" }}>
          <div className="max-w-5xl mx-auto">
            <FadeIn>
              <p className="mb-8 text-center" style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", fontWeight: 300, fontStyle: "italic", color: "#f4f1ec", opacity: 0.4 }}>
                Seeds planted by those who walked before you.
              </p>
            </FadeIn>

            {/* Organic scattered layout */}
            <div className="flex flex-wrap justify-center gap-5 md:gap-6">
              {SAMPLE_SEEDS.map((seed, i) => (
                <FadeIn key={seed.id} delay={0.08 * i}>
                  <motion.div
                    className="max-w-[320px] p-6 relative cursor-pointer"
                    onClick={() => setPreviewSeed(seed)}
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(216,212,206,0.06)",
                      borderRadius: "20px",
                      transform: `rotate(${seed.rotation}deg)`,
                      marginTop: `${(i % 3) * 12}px`,
                    }}
                    whileHover={{
                      borderColor: "rgba(200,146,42,0.2)",
                      boxShadow: "0 6px 40px rgba(200,146,42,0.08)",
                      y: -4,
                      scale: 1.02,
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Prompt label */}
                    <p className="mb-3" style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold)", opacity: 0.4 }}>
                      {seed.prompt.length > 40 ? seed.prompt.slice(0, 40) + "..." : seed.prompt}
                    </p>

                    {/* Seed text */}
                    <p style={{ fontFamily: "var(--font-hand)", fontSize: "clamp(1.05rem, 1.6vw, 1.25rem)", fontWeight: 400, color: "var(--beige-light)", lineHeight: 1.7, opacity: 0.85 }}>
                      &ldquo;{seed.text}&rdquo;
                    </p>

                    {/* Author */}
                    <div className="mt-4 pt-3" style={{ borderTop: "1px solid rgba(216,212,206,0.05)" }}>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 400, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--beige)", opacity: 0.2 }}>
                        — {seed.author}
                      </p>
                    </div>
                  </motion.div>
                </FadeIn>
              ))}
            </div>

            {/* Plant a seed CTA */}
            <FadeIn delay={0.3}>
              <div className="mt-16 text-center">
                <button
                  onClick={() => setFormOpen(true)}
                  className="cursor-pointer"
                  style={{
                    fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 400,
                    letterSpacing: "0.2em", textTransform: "uppercase",
                    color: "var(--beige-light)", background: "var(--green)",
                    border: "none", padding: "16px 32px",
                    transition: "background 0.3s",
                  }}
                >
                  Plant Your Seed
                </button>
                <p className="mt-4" style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 300, color: "var(--text-body)", opacity: 0.3 }}>
                  Your story will be reviewed before it enters the archive.
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ═══ CLOSING ═══ */}
        <section className="py-20 px-6" style={{ background: "var(--bg-deep)" }}>
          <div className="max-w-xl mx-auto text-center">
            <FadeIn>
              <KeyIcon size={36} className="mx-auto mb-6 opacity-20" />
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.15rem", fontWeight: 300, fontStyle: "italic", color: "var(--beige-light)", lineHeight: 1.6, opacity: 0.5 }}>
                Every seed planted here is proof that someone else<br />
                has walked through a season like yours.
              </p>
              <div className="mt-8">
                <a
                  href="/home"
                  className="no-underline"
                  style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 400, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--beige)", opacity: 0.3, transition: "opacity 0.3s" }}
                >
                  ← Return to Maison Gethse
                </a>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>

      {/* ═══ SEED PREVIEW ═══ */}
      <AnimatePresence>
        {previewSeed && (
          <>
            <motion.div
              className="fixed inset-0 z-[400]"
              style={{ background: "rgba(0,0,0,0.8)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewSeed(null)}
            />
            <motion.div
              className="fixed inset-0 z-[401] flex items-center justify-center p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewSeed(null)}
            >
              <motion.div
                className="w-full max-w-md p-10 relative text-center"
                style={{ background: "#141a14", border: "1px solid rgba(216,212,206,0.1)", borderRadius: "24px" }}
                initial={{ y: 20, scale: 0.97 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 20, scale: 0.97 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setPreviewSeed(null)}
                  className="absolute top-4 right-5 bg-transparent border-none"
                  style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", fontWeight: 300, color: "var(--beige)", opacity: 0.4, lineHeight: 1 }}
                >
                  ×
                </button>

                <p className="mb-4" style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 400, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--gold)", opacity: 0.6 }}>
                  {previewSeed.prompt}
                </p>

                <p style={{ fontFamily: "var(--font-hand)", fontSize: "clamp(1.3rem, 3vw, 1.8rem)", fontWeight: 400, color: "#f4f1ec", lineHeight: 1.7, opacity: 0.9 }}>
                  &ldquo;{previewSeed.text}&rdquo;
                </p>

                <div className="w-[1px] h-[20px] mx-auto my-6" style={{ background: "var(--beige)", opacity: 0.1 }} />

                <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 400, letterSpacing: "0.16em", textTransform: "uppercase", color: "#d8d4ce", opacity: 0.3 }}>
                  — {previewSeed.author}
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══ SUBMISSION OVERLAY ═══ */}
      <AnimatePresence>
        {formOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[400]"
              style={{ background: "rgba(0,0,0,0.7)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !submitted && setFormOpen(false)}
            />

            <motion.div
              className="fixed inset-0 z-[401] flex items-center justify-center p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-full max-w-lg relative"
                style={{ background: "var(--bg-surface)", border: "1px solid var(--border-soft)" }}
                initial={{ y: 30, scale: 0.97 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 30, scale: 0.97 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                {submitted ? (
                  /* ── Planted confirmation ── */
                  <motion.div
                    className="p-10 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-4xl mb-4">🌱</p>
                    <h3 style={{ fontFamily: "var(--font-hand)", fontSize: "1.6rem", color: "var(--text-head)", lineHeight: 1.5 }}>
                      Your seed has been planted.
                    </h3>
                    <p className="mt-3" style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 300, color: "var(--text-body)", opacity: 0.5, letterSpacing: "0.04em" }}>
                      It will be reviewed and added to the archive.
                    </p>
                  </motion.div>
                ) : (
                  /* ── Submission form ── */
                  <div className="p-8 md:p-10">
                    {/* Close */}
                    <button
                      onClick={() => setFormOpen(false)}
                      className="absolute top-3 right-5 bg-transparent border-none cursor-pointer"
                      style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", fontWeight: 300, color: "var(--text-body)", lineHeight: 1 }}
                    >
                      ×
                    </button>

                    <p className="mb-2" style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 400, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold)", opacity: 0.7 }}>
                      Plant a Seed
                    </p>

                    {/* Prompt */}
                    <h3 className="mb-6" style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", fontWeight: 300, fontStyle: "italic", color: "var(--text-head)", lineHeight: 1.5 }}>
                      {currentPrompt}
                    </h3>

                    {/* Text area */}
                    <textarea
                      value={seedText}
                      onChange={(e) => setSeedText(e.target.value)}
                      placeholder="Write what you carry..."
                      rows={5}
                      className="w-full mb-6"
                      style={{
                        fontFamily: "var(--font-sans)", fontSize: "15px", fontWeight: 300,
                        color: "var(--text-head)", background: "var(--input-bg)",
                        border: "1px solid var(--input-bd)", padding: "16px",
                        outline: "none", resize: "vertical", lineHeight: 1.9,
                        letterSpacing: "0.02em", transition: "border-color 0.2s",
                      }}
                    />

                    {/* Identity choice */}
                    <p className="mb-3" style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 400, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-body)" }}>
                      How would you like to appear?
                    </p>

                    <div className="flex gap-2 mb-4">
                      {[
                        { value: "anonymous" as const, label: "Anonymous" },
                        { value: "penname" as const, label: "Pen Name" },
                        { value: "name" as const, label: "My Name" },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setIdentityType(opt.value)}
                          className="flex-1 py-3 cursor-pointer"
                          style={{
                            fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 400,
                            letterSpacing: "0.08em",
                            color: identityType === opt.value ? "var(--white)" : "var(--text-head)",
                            background: identityType === opt.value ? "var(--green)" : "var(--input-bg)",
                            border: identityType === opt.value ? "1px solid var(--green)" : "1px solid var(--border-soft)",
                            transition: "all 0.2s",
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>

                    {/* Name input (conditional) */}
                    <AnimatePresence>
                      {identityType !== "anonymous" && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden mb-4"
                        >
                          <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder={identityType === "penname" ? "Your pen name" : "Your name"}
                            className="w-full"
                            style={{
                              fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 300,
                              color: "var(--text-head)", background: "var(--input-bg)",
                              border: "1px solid var(--input-bd)", padding: "12px 14px",
                              outline: "none", transition: "border-color 0.2s",
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Submit */}
                    <button
                      onClick={handleSubmit}
                      disabled={!seedText.trim()}
                      className="w-full cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{
                        fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 400,
                        letterSpacing: "0.22em", textTransform: "uppercase",
                        color: "var(--green-deep)", background: "var(--beige-light)",
                        border: "none", padding: "16px",
                        transition: "background 0.3s",
                      }}
                    >
                      Plant Your Seed
                    </button>

                    <p className="mt-4 text-center" style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 300, color: "var(--text-body)", opacity: 0.3, lineHeight: 1.7 }}>
                      Your story will be reviewed before it enters the archive.<br />
                      This space is curated, not automated.
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
