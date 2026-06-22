"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
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
  const inView = useInView(ref, { once: true, margin: "-80px" });

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

function SectionDivider() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      className="w-[1px] mx-auto"
      style={{ background: "var(--text-body)", opacity: 0.15 }}
      initial={{ height: 0 }}
      animate={inView ? { height: 80 } : {}}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}

export default function HomePage() {
  return (
    <>
      <Navigation />
      <MuteToggle />

      <main>
        {/* ═══ HERO ═══ */}
        <section className="min-h-screen flex items-center justify-center relative" style={{ paddingTop: "var(--nav-h)" }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 60%, var(--bg-body) 100%)" }} />
          <motion.div
            className="relative z-10 text-center max-w-2xl px-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="mb-6" style={{ fontFamily: "var(--font-sans)", fontSize: "9px", fontWeight: 400, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--text-body)", opacity: 0.5 }}>
              A Narrative Brand
            </p>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)", fontWeight: 300, color: "var(--text-head)", lineHeight: 1.15, letterSpacing: "0.01em" }}>
              Work unlocks what we <em style={{ fontStyle: "italic" }}>carry.</em><br />
              Culture opens what we <em style={{ fontStyle: "italic" }}>become.</em>
            </h1>
            <div className="w-[40px] h-[1px] mx-auto my-8" style={{ background: "var(--text-body)", opacity: 0.3 }} />
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "16px", fontWeight: 300, lineHeight: 2, color: "var(--text-body)", letterSpacing: "0.03em", maxWidth: "480px", margin: "0 auto" }}>
              Maison Gethse is not a clothing brand. It is a sanctuary of stories, seasons, and the quiet process of becoming — with garments as artifacts of each chapter lived.
            </p>
          </motion.div>
        </section>

        {/* section break */}

        {/* ═══ THE BRAND ═══ */}
        <section id="brand" className="py-32 px-6 md:px-12" style={{ background: "var(--bg-surface)", transition: "background 0.5s" }}>
          <div className="max-w-5xl mx-auto">
            <FadeIn>
              <p className="mb-4" style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 400, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold)" }}>
                The Brand
              </p>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 300, color: "var(--text-head)", lineHeight: 1.1 }}>
                Born from <em style={{ fontStyle: "italic" }}>Gethsemane</em>
              </h2>
            </FadeIn>

            <div className="grid md:grid-cols-2 gap-16 mt-12">
              <FadeIn delay={0.1}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "17px", fontWeight: 300, lineHeight: 2, color: "var(--text-body)", letterSpacing: "0.02em" }}>
                  The name is rooted in <strong style={{ fontWeight: 500, color: "var(--text-head)" }}>Gethsemane</strong> — the biblical garden defined by pressure, isolation, and radical transformation before a major calling. Abbreviated to <strong style={{ fontWeight: 500, color: "var(--text-head)" }}>Gethse</strong> for universal accessibility across cultures and beliefs.
                </p>
                <p className="mt-6" style={{ fontFamily: "var(--font-sans)", fontSize: "17px", fontWeight: 300, lineHeight: 2, color: "var(--text-body)", letterSpacing: "0.02em" }}>
                  Rather than treating pressure as destructive, Maison Gethse frames it as an unavoidable forge. Gethse represents the moment an individual accepts heavy reality, discards comfortable stagnation, and enters their personal forge of becoming.
                </p>
                <blockquote className="mt-8 pl-5" style={{ borderLeft: "2px solid var(--text-head)", fontFamily: "var(--font-serif)", fontSize: "1.25rem", fontWeight: 400, fontStyle: "italic", color: "var(--text-head)", lineHeight: 1.6 }}>
                  &ldquo;Discomfort is the true metric of growth.&rdquo;
                </blockquote>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div className="flex flex-col gap-6">
                  {[
                    { num: "01", title: "The Forge of Pressure", desc: "Responsibility, adulthood, and the shift to becoming a provider inject friction. We honor the long, isolated nights." },
                    { num: "02", title: "The Architecture of Chapters", desc: "Lives are non-linear. Every drop is a chapter — a specific, lived psychological season." },
                    { num: "03", title: "The Symbol of Access", desc: "The Key represents authority, lessons extracted from grief, and the hidden keys left behind by those who guided us." },
                    { num: "04", title: "The Value of Tuition", desc: "Failure is expensive tuition paid to the school of execution. We document both the outcome and the process." },
                  ].map((pillar) => (
                    <div key={pillar.num} className="flex gap-4 pb-6" style={{ borderBottom: "1px solid var(--border-soft)" }}>
                      <span style={{ fontFamily: "var(--font-serif)", fontSize: "0.85rem", fontWeight: 300, color: "var(--gold)", letterSpacing: "0.1em", minWidth: "28px", paddingTop: "2px" }}>
                        {pillar.num}
                      </span>
                      <div>
                        <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "1.05rem", fontWeight: 400, color: "var(--text-head)", marginBottom: "0.3rem" }}>
                          {pillar.title}
                        </h4>
                        <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", fontWeight: 300, lineHeight: 1.9, color: "var(--text-body)", opacity: 0.75 }}>
                          {pillar.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* section break */}

        {/* ═══ CHAPTERS ═══ */}
        <section id="chapters" className="py-32 px-6 md:px-12" style={{ background: "var(--bg-body)", transition: "background 0.5s" }}>
          <div className="max-w-5xl mx-auto">
            <FadeIn>
              <p className="mb-4" style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 400, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold)" }}>
                The Chapters
              </p>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 300, color: "var(--text-head)", lineHeight: 1.1 }}>
                Each chapter honors <em style={{ fontStyle: "italic" }}>a life.</em>
              </h2>
              <p className="mt-4 max-w-xl" style={{ fontFamily: "var(--font-sans)", fontSize: "17px", fontWeight: 300, lineHeight: 2, color: "var(--text-body)", letterSpacing: "0.02em" }}>
                Every chapter represents a person. Every artifact carries the lessons they left behind. This is not a collection — it is a living archive of the people who shaped us.
              </p>
            </FadeIn>

            {/* Chapter 01 Card */}
            <FadeIn delay={0.2}>
              <a
                href="/chapters/01"
                className="block mt-16 group relative overflow-hidden no-underline"
                style={{ background: "var(--bg-surface)", transition: "background 0.5s" }}
              >
                <div className="grid md:grid-cols-2">
                  <div className="aspect-[4/5] md:aspect-auto relative overflow-hidden" style={{ background: "var(--bg-mid)" }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p style={{ fontFamily: "var(--font-serif)", fontSize: "6rem", fontWeight: 300, color: "var(--text-head)", opacity: 0.04 }}>01</p>
                    </div>
                    <div className="absolute top-6 left-6">
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: "8px", fontWeight: 400, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--beige-light)", background: "var(--green)", padding: "5px 12px" }}>
                        Current Chapter
                      </span>
                    </div>
                  </div>
                  <div className="p-10 md:p-14 flex flex-col justify-center">
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 400, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.5rem" }}>
                      Chapter 01
                    </p>
                    <h3 style={{ fontFamily: "var(--font-hand)", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 400, color: "var(--text-head)", lineHeight: 1.2, marginBottom: "1rem" }}>
                      Before We Knew
                    </h3>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "16px", fontWeight: 300, lineHeight: 2, color: "var(--text-body)", letterSpacing: "0.02em" }}>
                      We once dreamed without limits. Before life opened our eyes to the weight of reality, there was innocence — a childlike trust in what could be. This chapter honors the space between who we were and who we are becoming.
                    </p>
                    <div className="mt-8 flex items-center gap-3">
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: "9px", fontWeight: 400, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-head)", opacity: 0.5 }}>
                        Enter Chapter →
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            </FadeIn>
          </div>
        </section>

        {/* section break */}

        {/* ═══ THE GARDEN ═══ */}
        <section id="garden" className="py-32 px-6 md:px-12 relative" style={{ background: "var(--bg-deep)", transition: "background 0.5s" }}>
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn>
              <p className="mb-4" style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 400, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold)" }}>
                The Garden
              </p>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 300, color: "var(--beige-light)", lineHeight: 1.1 }}>
                What are you <em style={{ fontStyle: "italic" }}>carrying?</em>
              </h2>
              <p className="mt-6 max-w-lg mx-auto" style={{ fontFamily: "var(--font-sans)", fontSize: "17px", fontWeight: 300, lineHeight: 2, color: "var(--beige)", opacity: 0.6, letterSpacing: "0.02em" }}>
                A living archive of stories from people walking through their own seasons. Not a comment section. A sanctuary — where seeds are planted, and proof grows that you are not alone.
              </p>
            </FadeIn>

            {/* Preview seed cards */}
            <FadeIn delay={0.2}>
              <div className="mt-16 flex flex-col md:flex-row gap-4 justify-center items-center">
                {[
                  { text: "I learned that silence is not emptiness — it is where I finally heard what mattered.", author: "Anonymous" },
                  { text: "My father never said he was proud. But he showed up every morning at 4 AM for 23 years. That was his language.", author: "M." },
                ].map((seed, i) => (
                  <div
                    key={i}
                    className="max-w-[300px] p-6 text-left"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(216,212,206,0.08)",
                      borderRadius: "20px",
                      transform: `rotate(${i === 0 ? -1.5 : 1.5}deg)`,
                    }}
                  >
                    <p style={{ fontFamily: "var(--font-hand)", fontSize: "1.15rem", fontWeight: 400, color: "var(--beige-light)", lineHeight: 1.65, opacity: 0.85 }}>
                      &ldquo;{seed.text}&rdquo;
                    </p>
                    <p className="mt-3" style={{ fontFamily: "var(--font-sans)", fontSize: "9px", fontWeight: 400, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--beige)", opacity: 0.25 }}>
                      — {seed.author}
                    </p>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <a
                href="/the-garden"
                className="inline-block mt-12 no-underline"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "9px",
                  fontWeight: 400,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--beige-light)",
                  background: "var(--green)",
                  padding: "14px 28px",
                  transition: "background 0.3s",
                }}
              >
                Plant a Seed
              </a>
            </FadeIn>
          </div>
        </section>

        {/* section break */}

        {/* ═══ THE LENS ═══ */}
        <section id="lens" className="py-32 px-6 md:px-12" style={{ background: "var(--bg-body)", transition: "background 0.5s" }}>
          <div className="max-w-5xl mx-auto">
            <FadeIn>
              <p className="mb-4" style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 400, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold)" }}>
                The Lens
              </p>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 300, color: "var(--text-head)", lineHeight: 1.1 }}>
                Documented, not <em style={{ fontStyle: "italic" }}>displayed.</em>
              </h2>
              <p className="mt-4 max-w-lg" style={{ fontFamily: "var(--font-sans)", fontSize: "17px", fontWeight: 300, lineHeight: 2, color: "var(--text-body)", letterSpacing: "0.02em" }}>
                A visual archive of chapters and the stories between them. Photography as memory — grounded, intentional, honest.
              </p>
            </FadeIn>

            {/* Photo grid placeholder */}
            <FadeIn delay={0.2}>
              <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-[3px]">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="relative overflow-hidden group"
                    style={{
                      background: "rgba(48,61,48,0.08)",
                      aspectRatio: i === 0 ? "3/4" : i % 2 === 0 ? "4/5" : "1/1",
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <KeyIcon size={20} className="opacity-[0.06]" />
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="mt-8 text-center">
                <a
                  href="/the-lens"
                  className="inline-block no-underline"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "9px",
                    fontWeight: 400,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--text-head)",
                    opacity: 0.5,
                    transition: "opacity 0.3s",
                  }}
                >
                  View Full Archive →
                </a>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* section break */}

        {/* ═══ COMMUNITY ═══ */}
        <section className="py-24 px-6 md:px-12" style={{ background: "var(--bg-mid)", transition: "background 0.5s" }}>
          <div className="max-w-2xl mx-auto text-center">
            <FadeIn>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 300, color: "var(--text-head)", lineHeight: 1.15, marginBottom: "0.6rem" }}>
                Walk <em style={{ fontStyle: "italic" }}>with us.</em>
              </h2>
              <p className="max-w-md mx-auto" style={{ fontFamily: "var(--font-sans)", fontSize: "16px", fontWeight: 300, lineHeight: 2, color: "var(--text-body)", letterSpacing: "0.02em", marginBottom: "2rem" }}>
                Maison Gethse is not built to convince. It exists as a place people can return to — where stories are carried, not sold.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <a
                  href="https://instagram.com/maisongethse"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 no-underline"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "10px",
                    fontWeight: 400,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--white)",
                    background: "var(--green)",
                    padding: "14px 28px",
                    transition: "background 0.3s",
                  }}
                >
                  Instagram
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 no-underline"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "10px",
                    fontWeight: 400,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--text-head)",
                    background: "transparent",
                    padding: "14px 28px",
                    border: "1px solid var(--text-head)",
                    transition: "background 0.3s, color 0.3s",
                  }}
                >
                  Facebook
                </a>
                <a
                  href="https://tiktok.com/@maisongethse"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 no-underline"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "10px",
                    fontWeight: 400,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--text-head)",
                    background: "transparent",
                    padding: "14px 28px",
                    border: "1px solid var(--text-head)",
                    transition: "background 0.3s, color 0.3s",
                  }}
                >
                  TikTok
                </a>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="py-16 px-6 md:px-12" style={{ background: "var(--bg-deep)" }}>
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-4 gap-12 pb-12" style={{ borderBottom: "1px solid rgba(216,212,206,0.08)" }}>
              <div>
                <span className="block mb-4" style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", fontWeight: 300, letterSpacing: "0.14em", color: "var(--beige-light)" }}>
                  Maison Gethse
                </span>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 300, lineHeight: 1.9, color: "var(--beige)", opacity: 0.4, maxWidth: "200px" }}>
                  A sanctuary of stories, seasons, and the quiet process of becoming.
                </p>
              </div>
              {[
                { title: "Navigate", links: [{ label: "The Brand", href: "#brand" }, { label: "Chapters", href: "#chapters" }, { label: "The Garden", href: "/the-garden" }, { label: "The Lens", href: "/the-lens" }] },
                { title: "Chapters", links: [{ label: "01 — Before We Knew", href: "/chapters/01" }] },
                { title: "Connect", links: [{ label: "Instagram", href: "https://instagram.com/maisongethse" }, { label: "Facebook", href: "#" }, { label: "TikTok", href: "https://tiktok.com/@maisongethse" }, { label: "maisongethse@gmail.com", href: "mailto:maisongethse@gmail.com" }] },
              ].map((col) => (
                <div key={col.title}>
                  <h5 className="mb-4" style={{ fontFamily: "var(--font-sans)", fontSize: "9px", fontWeight: 400, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--beige)", opacity: 0.35 }}>
                    {col.title}
                  </h5>
                  <ul className="flex flex-col gap-3" style={{ listStyle: "none" }}>
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="no-underline transition-opacity duration-300 hover:opacity-100"
                          style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 300, letterSpacing: "0.04em", color: "var(--beige)", opacity: 0.55 }}
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center flex-wrap gap-4 mt-8">
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 300, letterSpacing: "0.1em", color: "var(--beige)", opacity: 0.2 }}>
                © 2026 Maison Gethse. All rights reserved.
              </p>
              <KeyIcon size={18} className="opacity-[0.15]" />
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
