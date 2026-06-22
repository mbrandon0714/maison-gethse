"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { MuteToggle } from "@/components/MuteToggle";
import { KeyIcon } from "@/components/KeyIcon";
import { OrderOverlay } from "@/components/OrderOverlay";

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

function ParallaxImage({
  src,
  alt,
  className = "",
  objectPosition = "center",
}: {
  src: string;
  alt: string;
  className?: string;
  objectPosition?: string;
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <div ref={ref} className={`overflow-hidden relative ${className}`}>
      <motion.div style={{ y }} className="w-full h-full">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          style={{ filter: "saturate(0.9) brightness(0.95)", objectPosition }}
          sizes="100vw"
        />
      </motion.div>
    </div>
  );
}

function Lightbox({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
  onGoTo,
}: {
  images: { src: string; alt: string }[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onGoTo: (i: number) => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[500] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.94)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-6 right-8 bg-transparent border-none cursor-pointer z-10"
        style={{ fontFamily: "var(--font-serif)", fontSize: "2.2rem", fontWeight: 300, color: "rgba(255,255,255,0.6)", lineHeight: 1 }}
      >
        ×
      </button>

      {/* Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="relative max-w-[90vw] max-h-[85vh]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            width={1200}
            height={1500}
            className="object-contain max-h-[85vh] w-auto"
            sizes="90vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-4"
            style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 300, color: "rgba(255,255,255,0.4)" }}
          >
            ‹
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-4"
            style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 300, color: "rgba(255,255,255,0.4)" }}
          >
            ›
          </button>
        </>
      )}

      {/* Counter */}
      <p
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        style={{ fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}
      >
        {currentIndex + 1} / {images.length}
      </p>

      {/* Thumbnail strip */}
      <div
        className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => onGoTo(i)}
            className="w-10 h-10 overflow-hidden border-none cursor-pointer p-0"
            style={{
              opacity: i === currentIndex ? 1 : 0.35,
              border: i === currentIndex ? "1px solid rgba(255,255,255,0.5)" : "1px solid transparent",
              transition: "opacity 0.3s",
            }}
          >
            <Image src={img.src} alt="" width={40} height={40} className="object-cover w-full h-full" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}

const ARTIFACTS = [
  {
    id: "perspective-change",
    lesson: "Lesson I",
    name: "Perspective Change",
    price: 600,
    priceDisplay: "₱600",
    description:
      "Chapter 01 explores the juxtaposition of a pure, childlike perspective before life becomes heavy — against the sobering weight of sudden personal maturity. The graphic on this tee is not decoration. It is a record of where you were when things shifted.",
    image: "/images/ch01/Copy of IMG_0910.jpg",
    elements: [
      {
        name: "The Sun",
        meaning:
          "Hope doesn't always arrive loudly. Sometimes it simply rises again.",
      },
      {
        name: "The Paper Boat",
        meaning:
          "A symbol of what carries you. The thing you trust when the waters become uncertain. A purpose, a belief, a calling — whatever it may be.",
      },
      {
        name: "The Teddy Bear",
        meaning:
          "There's a version of you that still trusts. The version that rests without having all the answers. That's the part of you we hope you never lose.",
      },
      {
        name: "The Waves",
        meaning:
          "Life doesn't always move as we planned. There are things we didn't see coming — things that shake our peace. And still, we learn to keep going.",
      },
    ],
    sizes: [
      { label: "XS", stock: 5 },
      { label: "S", stock: 6 },
      { label: "M", stock: 6 },
      { label: "L", stock: 6 },
      { label: "XL", stock: 5 },
      { label: "2XL", stock: 0 },
    ],
    status: "available" as const,
  },
];

const CHAPTER_PHOTOS: { src: string; alt: string; wide?: boolean }[] = [
  { src: "/images/ch01/ch1_0655.jpg", alt: "A hand placing a paper boat into a puddle" },
  { src: "/images/ch01/ch1_8216.jpg", alt: "A boy resting with a teddy bear under golden light" },
  { src: "/images/ch01/ch1_running.jpg", alt: "Three boys running barefoot across a field", wide: true },
  { src: "/images/ch01/ch1_0682.jpg", alt: "A paper boat floating alone in a sunlit puddle" },
  { src: "/images/ch01/ch1_0878.jpg", alt: "Three friends laughing under golden trees" },
  { src: "/images/ch01/ch1_5863.jpg", alt: "An overgrown playground seen through leaves" },
  { src: "/images/ch01/ch1_0841.jpg", alt: "Bare feet resting on dry earth and fallen leaves" },
  { src: "/images/ch01/ch1_0733.jpg", alt: "Kids perched high up in a tree" },
  { src: "/images/ch01/ch1_5894.jpg", alt: "A child's bare feet splashing in a muddy puddle" },
  { src: "/images/ch01/ch1_8194.jpg", alt: "A boy holding a teddy bear under golden trees" },
  { src: "/images/ch01/ch1_0742.jpg", alt: "Boys climbing a tree together" },
  { src: "/images/ch01/ch1_talipapa.jpg", alt: "Two boys walking past a talipapa market" },
  { src: "/images/ch01/ch1_5847.jpg", alt: "A child walking along a narrow Philippine street" },
];

const LOOKBOOK = [
  { src: "/images/ch01/Copy of IMG_0910.jpg", alt: "Chapter 01 graphic tee back print" },
  { src: "/images/ch01/Copy of IMG_0933.jpg", alt: "Chapter 01 tee hanging on tree at golden hour" },
  { src: "/images/ch01/Copy of IMG_0926.jpg", alt: "Chapter 01 tee front face, golden sunset" },
  { src: "/images/ch01/Copy of IMG_0963.jpg", alt: "Chapter 01 close-up, bear in paper boat" },
  { src: "/images/ch01/Copy of IMG_0917.jpg", alt: "Maison Gethse logo stamp on tee" },
  { src: "/images/ch01/Copy of IMG_0918.jpg", alt: "Chapter 01 close crop, golden light" },
  { src: "/images/ch01/Copy of IMG_0920.jpg", alt: "Maison Gethse stamp detail" },
  { src: "/images/ch01/Copy of IMG_0888.jpg", alt: "Maison Gethse neck label detail" },
];

export default function Chapter01Page() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [orderOpen, setOrderOpen] = useState(false);
  const [orderArtifact, setOrderArtifact] = useState(ARTIFACTS[0]);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  }, []);

  const nextImage = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % LOOKBOOK.length);
  }, []);

  const prevImage = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + LOOKBOOK.length) % LOOKBOOK.length);
  }, []);

  return (
    <>
      <Navigation />
      <MuteToggle />

      <main>
        {/* ═══ CHAPTER HERO ═══ */}
        <section className="relative min-h-screen flex items-end" style={{ background: "var(--void)" }}>
          <ParallaxImage
            src="/images/ch01/ch1_8216.jpg"
            alt="Before We Knew — a boy resting with innocence"
            className="absolute inset-0"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(10,13,10,0.3) 0%, rgba(10,13,10,0.85) 100%)" }} />

          <motion.div
            className="relative z-10 w-full px-6 md:px-12 pb-16 md:pb-24 max-w-4xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <p
              className="mb-3"
              style={{
                fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 400,
                letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--gold)",
              }}
            >
              Chapter 01 · First Drop
            </p>
            <h1
              style={{
                fontFamily: "var(--font-hand)", fontSize: "clamp(2.8rem, 6vw, 5rem)",
                fontWeight: 400, color: "var(--beige-light)", lineHeight: 1.15,
              }}
            >
              Before We Knew
            </h1>
            <p
              className="mt-4 max-w-lg"
              style={{
                fontFamily: "var(--font-sans)", fontSize: "15px", fontWeight: 300,
                lineHeight: 2, color: "var(--beige)", opacity: 0.6, letterSpacing: "0.02em",
              }}
            >
              There was a version of us that didn&rsquo;t yet know what was coming.
            </p>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--beige)" strokeWidth="1.5" opacity="0.3">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </motion.div>
        </section>

        {/* ═══ THE STORY ═══ */}
        <section className="py-32 px-6 md:px-12" style={{ background: "var(--bg-body)" }}>
          <div className="max-w-3xl mx-auto">
            <FadeIn>
              <p
                className="mb-8"
                style={{
                  fontFamily: "var(--font-sans)", fontSize: "9px", fontWeight: 400,
                  letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--gold)", opacity: 0.7,
                }}
              >
                The Story
              </p>
            </FadeIn>

            <FadeIn delay={0.1}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "18px", fontWeight: 300, lineHeight: 2.1, color: "var(--text-body)", letterSpacing: "0.02em" }}>
                We once dreamed without limits. Before life opened our eyes to the weight of reality, there was innocence — a childlike trust in what could be. We climbed trees without thinking about what comes next. Played barefoot in puddles and didn&rsquo;t know the weight of what was coming.
              </p>
            </FadeIn>

            <FadeIn delay={0.15}>
              <p className="mt-8" style={{ fontFamily: "var(--font-sans)", fontSize: "18px", fontWeight: 300, lineHeight: 2.1, color: "var(--text-body)", letterSpacing: "0.02em" }}>
                Then, as we experienced life, it opened our eyes to the struggles — to the point that we tend to limit ourselves, especially our dreams, because we try to fit in to the reality life has given us. We tend to only be congruent to what opportunities we&rsquo;ve been given.
              </p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <blockquote
                className="mt-12 mb-12 pl-6"
                style={{
                  borderLeft: "2px solid var(--gold)",
                  fontFamily: "var(--font-serif)", fontSize: "1.4rem", fontWeight: 400,
                  fontStyle: "italic", color: "var(--text-head)", lineHeight: 1.6,
                }}
              >
                &ldquo;There was a version of us that didn&rsquo;t yet know what was coming.&rdquo;
              </blockquote>
            </FadeIn>

            <FadeIn delay={0.25}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "18px", fontWeight: 300, lineHeight: 2.1, color: "var(--text-body)", letterSpacing: "0.02em" }}>
                This chapter honors that space — the space between who we were and who we are becoming. It is the first page of the archive. The foundation of everything that follows.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* ═══ SECTION BREAK — Full-bleed image ═══ */}
        <ParallaxImage
          src="/images/ch01/ch1_0878.jpg"
          alt="Three friends laughing under golden trees"
          className="h-[50vh] md:h-[70vh]"
          objectPosition="center 55%"
        />

        {/* ═══ THE PERSON ═══ */}
        <section className="py-32 px-6 md:px-12" style={{ background: "var(--bg-deep)" }}>
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn>
              <p
                className="mb-6"
                style={{
                  fontFamily: "var(--font-sans)", fontSize: "9px", fontWeight: 400,
                  letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--gold)", opacity: 0.7,
                }}
              >
                The Person Behind This Chapter
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-serif)", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                  fontWeight: 300, color: "var(--beige-light)", lineHeight: 1.15, fontStyle: "italic",
                }}
              >
                For my father.
              </h2>
              <div className="w-[1px] h-[40px] mx-auto my-8" style={{ background: "var(--beige)", opacity: 0.15 }} />
            </FadeIn>

            <FadeIn delay={0.15}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "17px", fontWeight: 300, lineHeight: 2.1, color: "var(--beige)", opacity: 0.6, letterSpacing: "0.02em", maxWidth: "600px", margin: "0 auto" }}>
                Every chapter represents a person. Every chapter carries lessons that someone left behind. Chapter 01 belongs to my father — the one who showed me what it means to keep going, even when the world doesn&rsquo;t explain itself.
              </p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="mt-8" style={{ fontFamily: "var(--font-sans)", fontSize: "17px", fontWeight: 300, lineHeight: 2.1, color: "var(--beige)", opacity: 0.6, letterSpacing: "0.02em", maxWidth: "600px", margin: "0 auto" }}>
                He never said he was proud. But he showed up every morning. That was his language. These three lessons are what he left me — and through Maison Gethse, they live on.
              </p>
            </FadeIn>

            <FadeIn delay={0.25}>
              <div className="mt-12 flex flex-col gap-6 max-w-md mx-auto text-left">
                {["Perspective Change", "Lesson II", "Lesson III"].map((lesson, i) => (
                  <div
                    key={i}
                    className="flex gap-4 pb-6"
                    style={{ borderBottom: "1px solid rgba(216,212,206,0.08)" }}
                  >
                    <span style={{ fontFamily: "var(--font-serif)", fontSize: "0.8rem", fontWeight: 300, color: "var(--gold)", letterSpacing: "0.1em", minWidth: "24px", paddingTop: "3px" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p style={{ fontFamily: "var(--font-hand)", fontSize: "1.2rem", color: "var(--beige-light)", opacity: i === 0 ? 1 : 0.3 }}>
                        {lesson}
                      </p>
                      <p className="mt-1" style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 300, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--beige)", opacity: i === 0 ? 0.4 : 0.15 }}>
                        {i === 0 ? "Current Artifact" : "Coming Soon"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ═══ THE ARTIFACT ═══ */}
        {ARTIFACTS.map((artifact) => (
          <section
            key={artifact.id}
            className="py-32 px-6 md:px-12"
            style={{ background: "var(--bg-surface)" }}
          >
            <div className="max-w-5xl mx-auto">
              <FadeIn>
                <p className="mb-3" style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 400, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold)" }}>
                  {artifact.lesson} · The Artifact
                </p>
                <h2 style={{ fontFamily: "var(--font-hand)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 400, color: "var(--text-head)", lineHeight: 1.15 }}>
                  {artifact.name}
                </h2>
              </FadeIn>

              <div className="grid md:grid-cols-2 gap-12 md:gap-16 mt-12">
                {/* Image */}
                <FadeIn delay={0.1}>
                  <div className="relative aspect-[4/5] overflow-hidden" style={{ background: "var(--bg-mid)" }}>
                    <Image
                      src={artifact.image}
                      alt={`${artifact.name} — Chapter 01 artifact`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute top-4 right-4">
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: "8px", fontWeight: 400, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--beige-light)", background: "var(--green)", padding: "5px 12px" }}>
                        Limited Archive
                      </span>
                    </div>
                  </div>
                </FadeIn>

                {/* Details */}
                <FadeIn delay={0.2}>
                  <div className="flex flex-col justify-center">
                    <div className="flex items-baseline justify-between mb-6">
                      <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", fontWeight: 300, color: "var(--text-head)" }}>
                        {artifact.name}
                      </span>
                      <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", fontWeight: 300, color: "var(--text-body)" }}>
                        {artifact.priceDisplay}
                      </span>
                    </div>

                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "16px", fontWeight: 300, lineHeight: 2, color: "var(--text-body)", letterSpacing: "0.02em", marginBottom: "2rem" }}>
                      {artifact.description}
                    </p>

                    {/* Elements / Symbols */}
                    <div className="flex flex-col gap-0 mb-8">
                      {artifact.elements.map((el, i) => (
                        <div
                          key={i}
                          className="py-4"
                          style={{ borderTop: "1px solid var(--border-soft)" }}
                        >
                          <p style={{ fontFamily: "var(--font-hand)", fontSize: "1.25rem", fontWeight: 600, color: "var(--text-head)", marginBottom: "0.3rem" }}>
                            {el.name}
                          </p>
                          <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", fontWeight: 300, lineHeight: 1.9, color: "var(--text-body)", opacity: 0.75 }}>
                            {el.meaning}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <button
                      className="w-full cursor-pointer"
                      onClick={() => { setOrderArtifact(artifact); setOrderOpen(true); }}
                      style={{
                        fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 400,
                        letterSpacing: "0.2em", textTransform: "uppercase",
                        color: "var(--white)", background: "var(--green)",
                        border: "none", padding: "18px 32px",
                        transition: "background 0.3s",
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.background = "var(--green-deep)")}
                      onMouseOut={(e) => (e.currentTarget.style.background = "var(--green)")}
                    >
                      Carry This Chapter — {artifact.priceDisplay}
                    </button>
                    <p className="mt-3 text-center" style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 300, color: "var(--text-body)", opacity: 0.4, letterSpacing: "0.06em" }}>
                      Limited Archive · Ships within 3-5 business days
                    </p>
                  </div>
                </FadeIn>
              </div>
            </div>
          </section>
        ))}

        {/* ═══ THE DROP ═══ */}
        <section className="py-24 px-6 md:px-12" style={{ background: "var(--bg-deep)" }}>
          <div className="max-w-4xl mx-auto">
            <FadeIn>
              <div className="flex justify-between items-end mb-8">
                <div>
                  <p className="mb-2" style={{ fontFamily: "var(--font-sans)", fontSize: "9px", fontWeight: 400, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--gold)", opacity: 0.7 }}>
                    The Drop
                  </p>
                  <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 300, color: "var(--beige-light)", lineHeight: 1.1 }}>
                    In the <em style={{ fontStyle: "italic" }}>field.</em>
                  </h2>
                </div>
                <button
                  onClick={() => openLightbox(0)}
                  className="bg-transparent border-none cursor-pointer"
                  style={{ fontFamily: "var(--font-sans)", fontSize: "9px", fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--beige)", opacity: 0.4, transition: "opacity 0.3s" }}
                  onMouseOver={(e) => (e.currentTarget.style.opacity = "0.8")}
                  onMouseOut={(e) => (e.currentTarget.style.opacity = "0.4")}
                >
                  View All {LOOKBOOK.length} Photos →
                </button>
              </div>
            </FadeIn>

            {/* Single hero image — click to open gallery overlay */}
            <FadeIn delay={0.1}>
              <div
                className="relative overflow-hidden cursor-pointer group"
                onClick={() => openLightbox(0)}
              >
                <div className="relative aspect-[4/5] md:aspect-[3/4]">
                  <Image
                    src={LOOKBOOK[0].src}
                    alt={LOOKBOOK[0].alt}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                    style={{ filter: "saturate(0.9)" }}
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "rgba(10,13,10,0.4)" }}>
                    <div className="text-center">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--beige-light)" strokeWidth="1" className="mx-auto mb-3" opacity="0.8">
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                      </svg>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "9px", fontWeight: 400, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--beige-light)", opacity: 0.8 }}>
                        View Gallery · {LOOKBOOK.length} Photos
                      </p>
                    </div>
                  </div>
                </div>

                {/* Thumbnail preview strip below */}
                <div className="flex gap-[2px] mt-[2px]">
                  {LOOKBOOK.slice(1, 5).map((img, i) => (
                    <div
                      key={i}
                      className="relative flex-1 aspect-square overflow-hidden"
                      onClick={(e) => { e.stopPropagation(); openLightbox(i + 1); }}
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-[1.05]"
                        style={{ filter: "saturate(0.85)" }}
                        sizes="20vw"
                      />
                    </div>
                  ))}
                  {/* "More" indicator on last thumbnail */}
                  {LOOKBOOK.length > 5 && (
                    <div
                      className="relative flex-1 aspect-square overflow-hidden cursor-pointer"
                      onClick={(e) => { e.stopPropagation(); openLightbox(5); }}
                    >
                      <Image
                        src={LOOKBOOK[5].src}
                        alt={LOOKBOOK[5].alt}
                        fill
                        className="object-cover"
                        style={{ filter: "saturate(0.7) brightness(0.5)" }}
                        sizes="20vw"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 400, color: "var(--beige-light)", letterSpacing: "0.06em" }}>
                          +{LOOKBOOK.length - 5}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Lightbox overlay */}
        <AnimatePresence>
          {lightboxOpen && (
            <Lightbox
              images={LOOKBOOK}
              currentIndex={lightboxIndex}
              onClose={closeLightbox}
              onNext={nextImage}
              onPrev={prevImage}
              onGoTo={setLightboxIndex}
            />
          )}
        </AnimatePresence>

        {/* ═══ CHAPTER PHOTOGRAPHY ═══ */}
        <section className="py-32 px-6 md:px-12" style={{ background: "var(--bg-body)" }}>
          <div className="max-w-5xl mx-auto">
            <FadeIn>
              <p className="mb-3" style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 400, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold)" }}>
                Chapter 01 · Before We Knew
              </p>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 300, color: "var(--text-head)", lineHeight: 1.1 }}>
                When the world was still <em style={{ fontStyle: "italic" }}>ours.</em>
              </h2>
              <p className="mt-4 max-w-lg" style={{ fontFamily: "var(--font-sans)", fontSize: "16px", fontWeight: 300, lineHeight: 2, color: "var(--text-body)", letterSpacing: "0.02em" }}>
                There was a version of us that climbed trees without thinking about what comes next. This chapter lives there — in that space, before the shift.
              </p>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="mt-12 flex flex-col gap-[4px]">
                {/* Wide/featured photos get full width */}
                {CHAPTER_PHOTOS.filter((p) => p.wide).map((photo, i) => (
                  <div
                    key={`wide-${i}`}
                    className="relative overflow-hidden cursor-pointer group w-full"
                    style={{ aspectRatio: "16/9" }}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-[1.02]"
                      style={{ filter: "saturate(0.9) brightness(0.97)" }}
                      sizes="100vw"
                    />
                    <div className="absolute inset-0 transition-all duration-500 group-hover:bg-[rgba(25,33,20,0.06)]" />
                  </div>
                ))}

                {/* Masonry grid for the rest */}
                <div className="columns-2 md:columns-3 gap-[4px]">
                  {CHAPTER_PHOTOS.filter((p) => !p.wide).map((photo, i) => (
                    <div
                      key={i}
                      className="break-inside-avoid mb-[4px] overflow-hidden cursor-pointer relative group"
                    >
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        width={600}
                        height={800}
                        className="w-full block transition-all duration-700 group-hover:scale-[1.03]"
                        style={{ filter: "saturate(0.9) brightness(0.97)" }}
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 transition-all duration-500 group-hover:bg-[rgba(25,33,20,0.06)]" />
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Photographer credit */}
            <FadeIn delay={0.2}>
              <div className="mt-8 text-center">
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 400, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-body)", opacity: 0.3 }}>
                  Visual Archive · McRey &amp; Jerick
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ═══ CHAPTER FOOTER ═══ */}
        <section className="py-24 px-6 md:px-12" style={{ background: "var(--bg-deep)" }}>
          <div className="max-w-2xl mx-auto text-center">
            <FadeIn>
              <KeyIcon size={40} className="mx-auto mb-6 opacity-25" />
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", fontWeight: 300, fontStyle: "italic", color: "var(--beige-light)", lineHeight: 1.6, opacity: 0.7 }}>
                &ldquo;You are not buying a shirt.<br />You are carrying a chapter.&rdquo;
              </p>
              <div className="w-[1px] h-[40px] mx-auto my-8" style={{ background: "var(--beige)", opacity: 0.1 }} />
              <a
                href="/home"
                className="inline-block no-underline"
                style={{
                  fontFamily: "var(--font-sans)", fontSize: "9px", fontWeight: 400,
                  letterSpacing: "0.2em", textTransform: "uppercase",
                  color: "var(--beige)", opacity: 0.4,
                  transition: "opacity 0.3s",
                }}
              >
                ← Return to Maison Gethse
              </a>
            </FadeIn>
          </div>
        </section>
      </main>

      {/* Floating shop button */}
      <motion.button
        className="fixed bottom-6 left-6 z-50 flex items-center gap-3 no-underline"
        style={{
          fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 400,
          letterSpacing: "0.18em", textTransform: "uppercase",
          color: "var(--white)", background: "var(--green)",
          padding: "14px 24px", border: "none",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
        onClick={() => { setOrderArtifact(ARTIFACTS[0]); setOrderOpen(true); }}
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.03 }}
      >
        Carry This Chapter — {ARTIFACTS[0].priceDisplay}
      </motion.button>

      {/* Order Overlay */}
      <OrderOverlay
        artifact={{
          name: orderArtifact.name,
          price: orderArtifact.price,
          priceDisplay: orderArtifact.priceDisplay,
          image: orderArtifact.image,
          chapter: "Chapter 01 · Before We Knew",
          sizes: orderArtifact.sizes,
        }}
        isOpen={orderOpen}
        onClose={() => setOrderOpen(false)}
      />
    </>
  );
}
