"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { MuteToggle } from "@/components/MuteToggle";
import { KeyIcon } from "@/components/KeyIcon";
import { WelcomeGuide } from "@/components/WelcomeGuide";

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


export default function HomePage() {
  return (
    <>
      <Navigation />
      <MuteToggle />
      <WelcomeGuide />

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
            <p className="mb-6" style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 400, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--text-body)", opacity: 0.5 }}>
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
              <p className="mb-4" style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 400, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold)" }}>
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
                        <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", fontWeight: 300, lineHeight: 1.9, color: "var(--text-body)", opacity: 0.85 }}>
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
              <p className="mb-4" style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 400, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold)" }}>
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
              <Link
                href="/chapters/01"
                className="block mt-16 group relative overflow-hidden no-underline"
                style={{ background: "var(--bg-surface)", transition: "all 0.5s", border: "1px solid transparent" }}
                onMouseOver={e => { e.currentTarget.style.borderColor = "rgba(200,146,42,0.2)"; e.currentTarget.style.boxShadow = "0 8px 40px rgba(200,146,42,0.08)"; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div className="grid md:grid-cols-2">
                  <div className="aspect-[16/10] md:aspect-auto relative overflow-hidden" style={{ background: "var(--bg-mid)", minHeight: "320px" }}>
                    <Image
                      src="/images/ch01/ch1_running.jpg"
                      alt="Chapter 01 — three boys running barefoot"
                      fill
                      className="object-cover"
                      style={{ objectPosition: "center 40%" }}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute top-6 left-6">
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: "8px", fontWeight: 400, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--beige-light)", background: "var(--green)", padding: "5px 12px" }}>
                        Current Chapter
                      </span>
                    </div>
                  </div>
                  <div className="p-10 md:p-14 flex flex-col justify-center">
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 400, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.5rem" }}>
                      Chapter 01
                    </p>
                    <h3 style={{ fontFamily: "var(--font-hand)", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 400, color: "var(--text-head)", lineHeight: 1.2, marginBottom: "1rem" }}>
                      Before We Knew
                    </h3>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "16px", fontWeight: 300, lineHeight: 2, color: "var(--text-body)", letterSpacing: "0.02em" }}>
                      We once dreamed without limits. Before life opened our eyes to the weight of reality, there was innocence — a childlike trust in what could be. This chapter honors the space between who we were and who we are becoming.
                    </p>
                    <div className="mt-8">
                      <span
                        className="inline-block animate-pulse"
                        style={{
                          fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 500,
                          letterSpacing: "0.2em", textTransform: "uppercase",
                          color: "var(--gold)",
                          padding: "12px 24px",
                          border: "1px solid var(--gold)",
                          borderRadius: 4,
                          transition: "all 0.3s",
                          animationDuration: "3s",
                        }}
                      >
                        Enter Chapter →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </FadeIn>
          </div>
        </section>

        {/* section break */}

        {/* ═══ THE GARDEN ═══ */}
        <section id="garden" className="py-32 px-6 md:px-12 relative" style={{ background: "var(--bg-deep)", transition: "background 0.5s" }}>
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn>
              <p className="mb-4" style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 400, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold)" }}>
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
                    <p className="mt-3" style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 400, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--beige)", opacity: 0.35 }}>
                      — {seed.author}
                    </p>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <Link
                href="/the-garden"
                className="inline-block mt-12 no-underline"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "11px",
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
              </Link>
            </FadeIn>
          </div>
        </section>

        {/* section break */}

        {/* ═══ THE LENS ═══ */}
        <section id="lens" className="py-32 px-6 md:px-12" style={{ background: "var(--bg-body)", transition: "background 0.5s" }}>
          <div className="max-w-5xl mx-auto">
            <FadeIn>
              <div className="flex justify-between items-end flex-wrap gap-4">
                <div>
                  <p className="mb-4" style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 400, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold)" }}>
                    The Lens
                  </p>
                  <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 300, color: "var(--text-head)", lineHeight: 1.1 }}>
                    Documented, not <em style={{ fontStyle: "italic" }}>displayed.</em>
                  </h2>
                  <p className="mt-4 max-w-lg" style={{ fontFamily: "var(--font-sans)", fontSize: "17px", fontWeight: 300, lineHeight: 2, color: "var(--text-body)", letterSpacing: "0.02em" }}>
                    A visual archive of chapters and the stories between them.
                  </p>
                </div>
                <Link href="/the-lens" className="no-underline" style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold)", transition: "opacity 0.3s", whiteSpace: "nowrap" }}>
                  View Full Archive →
                </Link>
              </div>
            </FadeIn>

            {/* Photo grid */}
            <FadeIn delay={0.2}>
              <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-[3px]">
                {[
                  "/images/ch01/ch1_8216.jpg",
                  "/images/ch01/ch1_0655.jpg",
                  "/images/ch01/ch1_0878.jpg",
                  "/images/ch01/ch1_0733.jpg",
                  "/images/ch01/ch1_5863.jpg",
                  "/images/ch01/ch1_talipapa.jpg",
                ].map((src, i) => (
                  <div key={i} className="overflow-hidden cursor-pointer group relative aspect-[4/5]">
                    <Image
                      src={src}
                      alt="Chapter 01 photography"
                      fill
                      loading="eager"
                      className="object-cover transition-all duration-700 group-hover:scale-[1.04]"
                      style={{ filter: "saturate(0.85) contrast(1.05) brightness(0.95)" }}
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  </div>
                ))}
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
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
                {[
                  { label: "Instagram", href: "https://www.instagram.com/maison.gethse/", icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
                  { label: "Facebook", href: "https://www.facebook.com/maison.gethse/", icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                  { label: "TikTok", href: "https://www.tiktok.com/@maison.gethse", icon: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 no-underline flex-1 justify-center group"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "12px",
                      fontWeight: 400,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "var(--text-head)",
                      background: "rgba(255,255,255,0.03)",
                      padding: "18px 24px",
                      border: "1px solid var(--border-soft)",
                      transition: "all 0.4s ease",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = "var(--gold)";
                      e.currentTarget.style.background = "rgba(200,146,42,0.06)";
                      e.currentTarget.style.color = "var(--gold)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = "var(--border-soft)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                      e.currentTarget.style.color = "var(--text-head)";
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d={social.icon} />
                    </svg>
                    {social.label}
                  </a>
                ))}
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
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 300, lineHeight: 1.9, color: "var(--beige)", opacity: 0.5, maxWidth: "200px" }}>
                  A sanctuary of stories, seasons, and the quiet process of becoming.
                </p>
              </div>
              {[
                { title: "Navigate", links: [{ label: "The Brand", href: "#brand" }, { label: "Chapters", href: "#chapters" }, { label: "The Garden", href: "/the-garden" }, { label: "The Lens", href: "/the-lens" }] },
                { title: "Chapters", links: [{ label: "01 — Before We Knew", href: "/chapters/01" }] },
                { title: "Connect", links: [{ label: "Instagram", href: "https://www.instagram.com/maison.gethse/" }, { label: "Facebook", href: "#" }, { label: "TikTok", href: "https://www.tiktok.com/@maison.gethse" }, { label: "maisongethse@gmail.com", href: "mailto:maisongethse@gmail.com" }] },
              ].map((col) => (
                <div key={col.title}>
                  <h5 className="mb-4" style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 400, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--beige)", opacity: 0.45 }}>
                    {col.title}
                  </h5>
                  <ul className="flex flex-col gap-3" style={{ listStyle: "none" }}>
                    {col.links.map((link) => {
                      const isInternal = link.href.startsWith("/");
                      const Tag = isInternal ? Link : "a";
                      const extra = isInternal ? {} : { target: "_blank", rel: "noopener noreferrer" };
                      return (
                        <li key={link.label}>
                          <Tag
                            href={link.href}
                            className="no-underline transition-opacity duration-300 hover:opacity-100"
                            style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 300, letterSpacing: "0.04em", color: "var(--beige)", opacity: 0.55 }}
                            {...extra}
                          >
                            {link.label}
                          </Tag>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center flex-wrap gap-4 mt-8">
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 300, letterSpacing: "0.1em", color: "var(--beige)", opacity: 0.2 }}>
                © 2026 Maison Gethse. All rights reserved.
              </p>
              <KeyIcon size={32} className="opacity-[0.2]" />
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
