"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
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

type FilterTab = "all" | "chapter" | "field-notes";

const PHOTOGRAPHERS = [
  {
    slug: "mcrey",
    name: "McRey",
    bio: "Visual storyteller capturing the quiet moments between motion and stillness.",
    chapters: ["Chapter 01"],
  },
  {
    slug: "jerick",
    name: "Jerick",
    bio: "Documents the textures of everyday life — light, shadow, and the spaces in between.",
    chapters: ["Chapter 01"],
  },
];

const PHOTOS: {
  src: string;
  alt: string;
  photographer: string;
  chapter?: string;
  aspect: "portrait" | "landscape" | "square";
}[] = [
  { src: "/images/ch01/ch1_8216.jpg", alt: "A boy resting with a teddy bear under golden light", photographer: "McRey", chapter: "Chapter 01", aspect: "portrait" },
  { src: "/images/ch01/ch1_0655.jpg", alt: "A hand placing a paper boat into a puddle", photographer: "McRey", chapter: "Chapter 01", aspect: "landscape" },
  { src: "/images/ch01/ch1_running.jpg", alt: "Three boys running barefoot across a field", photographer: "Jerick", chapter: "Chapter 01", aspect: "landscape" },
  { src: "/images/ch01/ch1_0878.jpg", alt: "Three friends laughing under golden trees", photographer: "McRey", chapter: "Chapter 01", aspect: "landscape" },
  { src: "/images/ch01/ch1_0682.jpg", alt: "A paper boat floating alone in a sunlit puddle", photographer: "McRey", chapter: "Chapter 01", aspect: "square" },
  { src: "/images/ch01/ch1_5863.jpg", alt: "An overgrown playground seen through leaves", photographer: "Jerick", chapter: "Chapter 01", aspect: "landscape" },
  { src: "/images/ch01/ch1_0841.jpg", alt: "Bare feet resting on dry earth", photographer: "McRey", chapter: "Chapter 01", aspect: "landscape" },
  { src: "/images/ch01/ch1_0733.jpg", alt: "Kids perched high up in a tree", photographer: "Jerick", chapter: "Chapter 01", aspect: "portrait" },
  { src: "/images/ch01/ch1_5894.jpg", alt: "A child's bare feet splashing in a puddle", photographer: "McRey", chapter: "Chapter 01", aspect: "square" },
  { src: "/images/ch01/ch1_8194.jpg", alt: "A boy holding a teddy bear under golden trees", photographer: "McRey", chapter: "Chapter 01", aspect: "portrait" },
  { src: "/images/ch01/ch1_0742.jpg", alt: "Boys climbing a tree together", photographer: "Jerick", chapter: "Chapter 01", aspect: "portrait" },
  { src: "/images/ch01/ch1_talipapa.jpg", alt: "Two boys walking past a talipapa market", photographer: "Jerick", chapter: "Chapter 01", aspect: "landscape" },
  { src: "/images/ch01/ch1_5847.jpg", alt: "A child walking along a narrow Philippine street", photographer: "Jerick", chapter: "Chapter 01", aspect: "portrait" },
];

export default function TheLensPage() {
  const [filter, setFilter] = useState<FilterTab>("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [subName, setSubName] = useState("");
  const [subPortfolio, setSubPortfolio] = useState("");
  const [subCaption, setSubCaption] = useState("");
  const [subState, setSubState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [subError, setSubError] = useState("");

  const handleSubmitWork = useCallback(async () => {
    if (subState === "sending") return;
    if (!subName.trim() || !subPortfolio.trim()) {
      setSubState("error");
      setSubError("Your name and a portfolio or Instagram link are required.");
      return;
    }
    setSubState("sending");
    try {
      const res = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: subName, portfolio: subPortfolio, caption: subCaption }),
      });
      if (res.ok) {
        setSubState("done");
        setSubName(""); setSubPortfolio(""); setSubCaption("");
      } else {
        const data = await res.json().catch(() => ({}));
        setSubState("error");
        setSubError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setSubState("error");
      setSubError("Connection error. Please try again.");
    }
  }, [subName, subPortfolio, subCaption, subState]);

  const filteredPhotos = PHOTOS.filter((p) => {
    if (filter === "chapter") return !!p.chapter;
    if (filter === "field-notes") return !p.chapter;
    return true;
  });

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  }, []);

  return (
    <>
      <Navigation />
      <MuteToggle />

      <main>
        {/* ═══ HERO ═══ */}
        <section className="min-h-[70vh] flex items-center justify-center relative" style={{ background: "var(--lens-bg)", paddingTop: "var(--nav-h)" }}>
          <motion.div
            className="relative z-10 text-center max-w-2xl px-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="mb-6" style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 400, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--gold)", opacity: 0.7 }}>
              The Lens
            </p>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 300, color: "var(--beige-light)", lineHeight: 1.12 }}>
              Documented, not <em style={{ fontStyle: "italic" }}>displayed.</em>
            </h1>
            <div className="w-[1px] h-[40px] mx-auto my-8" style={{ background: "var(--beige)", opacity: 0.12 }} />
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "16px", fontWeight: 300, lineHeight: 2.1, color: "var(--beige)", opacity: 0.5, letterSpacing: "0.02em", maxWidth: "500px", margin: "0 auto" }}>
              A visual archive of chapters and the stories between them. Photography as memory — grounded, intentional, honest.
            </p>
          </motion.div>
        </section>

        {/* ═══ FEATURED VISUAL AUTHORS ═══ */}
        <section className="py-20 px-6 md:px-12" style={{ background: "var(--lens-bg)", borderTop: "1px solid rgba(216,212,206,0.05)" }}>
          <div className="max-w-5xl mx-auto">
            <FadeIn>
              <p className="mb-8" style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 400, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--gold)", opacity: 0.5 }}>
                Featured Visual Authors
              </p>
            </FadeIn>

            <div className="grid md:grid-cols-2 gap-6">
              {PHOTOGRAPHERS.map((p, i) => (
                <FadeIn key={p.slug} delay={0.1 * i}>
                  <div
                    className="p-6 flex flex-col gap-3"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(216,212,206,0.06)", transition: "border-color 0.3s" }}
                  >
                    <div className="flex items-baseline justify-between">
                      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", fontWeight: 400, color: "var(--beige-light)" }}>
                        {p.name}
                      </h3>
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 400, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--beige)", opacity: 0.25 }}>
                        Visual Author
                      </span>
                    </div>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 300, lineHeight: 1.8, color: "var(--beige)", opacity: 0.5 }}>
                      {p.bio}
                    </p>
                    <div className="flex gap-2 mt-1">
                      {p.chapters.map((ch) => (
                        <span
                          key={ch}
                          style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold)", opacity: 0.5, padding: "3px 8px", border: "1px solid rgba(200,146,42,0.15)" }}
                        >
                          {ch}
                        </span>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ GALLERY ═══ */}
        <section className="py-20 px-6 md:px-12 relative" style={{ background: "var(--lens-bg)" }}>
          {/* Film grain */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          }} />

          <div className="max-w-5xl mx-auto relative z-10">
            {/* Filter tabs */}
            <FadeIn>
              <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
                <div className="flex gap-1">
                  {[
                    { key: "all" as const, label: "All" },
                    { key: "chapter" as const, label: "Chapter Archives" },
                    { key: "field-notes" as const, label: "Field Notes" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setFilter(tab.key)}
                      className="cursor-pointer px-4 py-2"
                      style={{
                        fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 400,
                        letterSpacing: "0.16em", textTransform: "uppercase",
                        color: filter === tab.key ? "var(--beige-light)" : "rgba(216,212,206,0.3)",
                        background: filter === tab.key ? "rgba(255,255,255,0.06)" : "transparent",
                        border: "1px solid " + (filter === tab.key ? "rgba(216,212,206,0.1)" : "transparent"),
                        transition: "all 0.3s",
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setSubmitOpen(true)}
                  className="cursor-pointer"
                  style={{
                    fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 500,
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "var(--beige-light)", background: "var(--green)",
                    border: "2px solid var(--green)", padding: "14px 28px",
                    transition: "all 0.3s", borderRadius: 4,
                  }}
                  onMouseOver={e => { e.currentTarget.style.background = "var(--gold)"; e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "#0f130f"; }}
                  onMouseOut={e => { e.currentTarget.style.background = "var(--green)"; e.currentTarget.style.borderColor = "var(--green)"; e.currentTarget.style.color = "var(--beige-light)"; }}
                >
                  Submit Your Work →
                </button>
              </div>
            </FadeIn>

            {/* Masonry gallery */}
            <div className="columns-2 md:columns-3 gap-[4px]">
              {filteredPhotos.map((photo, i) => (
                <FadeIn key={i} delay={0.04 * Math.min(i, 6)}>
                  <div
                    className="break-inside-avoid mb-[4px] overflow-hidden cursor-pointer relative group"
                    onClick={() => openLightbox(i)}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      width={600}
                      height={photo.aspect === "portrait" ? 900 : photo.aspect === "square" ? 600 : 400}
                      className="w-full block transition-all duration-1000 group-hover:scale-[1.03]"
                      style={{
                        
                        transition: "filter 0.5s, transform 1s",
                      }}
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />

                    {/* Hover overlay with museum credit */}
                    <div className="absolute inset-0 flex items-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="w-full p-3" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)" }}>
                        <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>
                          {photo.photographer}{photo.chapter ? ` · ${photo.chapter}` : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>

            {filteredPhotos.length === 0 && (
              <div className="py-20 text-center">
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", fontWeight: 300, fontStyle: "italic", color: "var(--beige-light)", opacity: 0.3 }}>
                  No field notes yet. This space awaits.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ═══ CLOSING ═══ */}
        <section className="py-20 px-6" style={{ background: "var(--lens-closing)" }}>
          <div className="max-w-xl mx-auto text-center">
            <FadeIn>
              <KeyIcon size={36} className="mx-auto mb-6 opacity-20" />
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.15rem", fontWeight: 300, fontStyle: "italic", color: "var(--beige-light)", lineHeight: 1.6, opacity: 0.5 }}>
                Photography is not a content section.<br />
                It is a growing visual memory system.
              </p>
              <div className="mt-8">
                <Link href="/home" className="no-underline" style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 400, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--beige)", opacity: 0.3 }}>
                  ← Return to Maison Gethse
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>

      {/* ═══ LIGHTBOX ═══ */}
      <AnimatePresence>
        {lightboxOpen && filteredPhotos[lightboxIndex] && (
          <motion.div
            className="fixed inset-0 z-[500] flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.96)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-8 bg-transparent border-none cursor-pointer z-10"
              style={{ fontFamily: "var(--font-serif)", fontSize: "2.2rem", fontWeight: 300, color: "rgba(255,255,255,0.5)", lineHeight: 1 }}
            >
              ×
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={lightboxIndex}
                className="relative max-w-[90vw] max-h-[85vh]"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={filteredPhotos[lightboxIndex].src}
                  alt={filteredPhotos[lightboxIndex].alt}
                  width={1200}
                  height={1500}
                  className="object-contain max-h-[85vh] w-auto"
                  style={{}}
                  sizes="90vw"
                />
              </motion.div>
            </AnimatePresence>

            {/* Museum credit */}
            <div className="absolute bottom-8 left-8" onClick={(e) => e.stopPropagation()}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
                {filteredPhotos[lightboxIndex].photographer}
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 300, letterSpacing: "0.1em", color: "rgba(255,255,255,0.2)", marginTop: "2px" }}>
                {filteredPhotos[lightboxIndex].chapter || "Field Notes"} · {filteredPhotos[lightboxIndex].alt}
              </p>
            </div>

            {/* Counter */}
            <p className="absolute bottom-8 right-8" style={{ fontFamily: "var(--font-sans)", fontSize: "12px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)" }}>
              {lightboxIndex + 1} / {filteredPhotos.length}
            </p>

            {/* Nav */}
            {filteredPhotos.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length); }}
                  className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-4"
                  style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 300, color: "rgba(255,255,255,0.3)" }}
                >
                  ‹
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex((prev) => (prev + 1) % filteredPhotos.length); }}
                  className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-4"
                  style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 300, color: "rgba(255,255,255,0.3)" }}
                >
                  ›
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ SUBMISSION OVERLAY ═══ */}
      <AnimatePresence>
        {submitOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[400]"
              style={{ background: "rgba(0,0,0,0.7)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSubmitOpen(false)}
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
                <div className="p-8 md:p-10">
                  <button
                    onClick={() => setSubmitOpen(false)}
                    className="absolute top-3 right-5 bg-transparent border-none cursor-pointer"
                    style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", fontWeight: 300, color: "var(--text-body)", lineHeight: 1 }}
                  >
                    ×
                  </button>

                  <p className="mb-2" style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 400, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold)", opacity: 0.7 }}>
                    Submit Your Work
                  </p>
                  <h3 className="mb-2" style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", fontWeight: 300, color: "var(--text-head)", lineHeight: 1.4 }}>
                    Share your <em style={{ fontStyle: "italic" }}>lens.</em>
                  </h3>
                  <p className="mb-6" style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 300, lineHeight: 1.8, color: "var(--text-body)", opacity: 0.5 }}>
                    We accept photography that aligns with the Maison Gethse atmosphere — grounded, intentional, quiet, honest. Submissions are reviewed for narrative resonance, not popularity.
                  </p>

                  {subState === "done" ? (
                    <div className="text-center py-10">
                      <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", fontStyle: "italic", color: "var(--text-head)", marginBottom: 10 }}>
                        Your lens has been received.
                      </p>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 300, color: "var(--text-body)", opacity: 0.6, lineHeight: 1.8 }}>
                        We review every submission for narrative resonance.<br />If your work aligns, we&rsquo;ll reach out through your portfolio or Instagram.
                      </p>
                      <button
                        onClick={() => { setSubmitOpen(false); setSubState("idle"); }}
                        className="mt-6 cursor-pointer"
                        style={{ fontFamily: "var(--font-sans)", fontSize: "12px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)", background: "none", border: "none" }}
                      >
                        Close
                      </button>
                    </div>
                  ) : (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <label style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-body)" }}>
                        Your Name
                      </label>
                      <input
                        type="text"
                        placeholder="Photographer name"
                        value={subName}
                        onChange={(e) => setSubName(e.target.value)}
                        style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 300, color: "var(--text-head)", background: "var(--input-bg)", border: "1px solid var(--input-bd)", padding: "12px 14px", outline: "none" }}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-body)" }}>
                        Instagram / Portfolio / Drive Link
                      </label>
                      <input
                        type="text"
                        placeholder="@handle, URL, or shared album link"
                        value={subPortfolio}
                        onChange={(e) => setSubPortfolio(e.target.value)}
                        style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 300, color: "var(--text-head)", background: "var(--input-bg)", border: "1px solid var(--input-bd)", padding: "12px 14px", outline: "none" }}
                      />
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 300, color: "var(--text-body)", opacity: 0.4, marginTop: 4 }}>
                        Link us to the work you&rsquo;d like considered — a shared album, grid, or portfolio.
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-body)" }}>
                        Caption / Story Behind the Shot
                      </label>
                      <textarea
                        placeholder="What does this image carry?"
                        rows={3}
                        value={subCaption}
                        onChange={(e) => setSubCaption(e.target.value)}
                        style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 300, color: "var(--text-head)", background: "var(--input-bg)", border: "1px solid var(--input-bd)", padding: "12px 14px", outline: "none", resize: "vertical" }}
                      />
                    </div>

                    {subState === "error" && (
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "#e57373", margin: 0 }}>{subError}</p>
                    )}

                    <button
                      onClick={handleSubmitWork}
                      disabled={subState === "sending"}
                      className="w-full cursor-pointer mt-2"
                      style={{
                        fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 400,
                        letterSpacing: "0.22em", textTransform: "uppercase",
                        color: "var(--white)", background: "var(--green)",
                        border: "none", padding: "16px",
                        transition: "background 0.3s",
                        opacity: subState === "sending" ? 0.6 : 1,
                      }}
                    >
                      {subState === "sending" ? "Sending…" : "Submit for Review ✦"}
                    </button>
                    <p className="text-center" style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 300, color: "var(--text-body)", opacity: 0.3, lineHeight: 1.7 }}>
                      Submissions are reviewed for aesthetic and narrative alignment.<br />
                      Access is open. Placement is earned through resonance.
                    </p>
                  </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
