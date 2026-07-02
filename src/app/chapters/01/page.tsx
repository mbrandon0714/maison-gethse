"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { MuteToggle } from "@/components/MuteToggle";
import { KeyIcon } from "@/components/KeyIcon";
import { useCart } from "@/components/CartProvider";

function ReviewStars({ productId }: { productId: string }) {
  const [data, setData] = useState<{ average: number; count: number }>({ average: 0, count: 0 });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", rating: 5, text: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/reviews?product=${productId}`)
      .then(r => r.json())
      .then(d => { if (d.count !== undefined) setData(d); })
      .catch(() => {});
  }, [productId, submitting]);

  const submit = async () => {
    if (!form.name || !form.text || submitting) return;
    setSubmitting(true);
    await fetch("/api/reviews", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, ...form }),
    });
    setShowForm(false);
    setForm({ name: "", rating: 5, text: "" });
    setSubmitting(false);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex gap-1">
          {[1,2,3,4,5].map(s => (
            <svg key={s} width="18" height="18" viewBox="0 0 24 24" fill={s <= Math.round(data.average) ? "var(--gold)" : "none"} stroke="var(--gold)" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          ))}
        </div>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--text-body)" }}>
          {data.count > 0 ? `${data.average} (${data.count} review${data.count > 1 ? "s" : ""})` : "No reviews yet"}
        </span>
        <button onClick={() => setShowForm(!showForm)} style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--gold)", background: "none", border: "none", textDecoration: "underline", textUnderlineOffset: 3, cursor: "pointer", marginLeft: "auto" }}>
          Write a review
        </button>
      </div>

      {showForm && (
        <div style={{ padding: 20, border: "1px solid var(--border-soft)", borderRadius: 8, marginTop: 12, background: "rgba(255,255,255,0.02)" }}>
          <div className="flex gap-2 mb-4">
            {[1,2,3,4,5].map(s => (
              <button key={s} onClick={() => setForm({ ...form, rating: s })} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill={s <= form.rating ? "var(--gold)" : "none"} stroke="var(--gold)" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              </button>
            ))}
          </div>
          <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name"
            style={{ width: "100%", padding: "12px 14px", fontSize: 15, fontFamily: "var(--font-sans)", background: "var(--input-bg)", border: "1px solid var(--border-soft)", color: "var(--text-head)", borderRadius: 4, outline: "none", marginBottom: 10 }} />
          <textarea value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} placeholder="Share your experience..."
            rows={3} style={{ width: "100%", padding: "12px 14px", fontSize: 15, fontFamily: "var(--font-sans)", background: "var(--input-bg)", border: "1px solid var(--border-soft)", color: "var(--text-head)", borderRadius: 4, outline: "none", resize: "vertical", marginBottom: 12 }} />
          <button onClick={submit} disabled={!form.name || !form.text || submitting}
            style={{ padding: "12px 24px", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff", background: "var(--green)", border: "none", borderRadius: 4, cursor: form.name && form.text ? "pointer" : "not-allowed", opacity: form.name && form.text ? 1 : 0.4 }}>
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      )}
    </div>
  );
}

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
          style={{ objectPosition }}
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
        style={{ fontFamily: "var(--font-sans)", fontSize: "12px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}
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
    chapter: "Chapter 01 · Before We Knew",
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
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [productImg, setProductImg] = useState(0);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [shopInView, setShopInView] = useState(false);

  useEffect(() => {
    const el = document.getElementById("shop");
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setShopInView(entry.isIntersecting),
      { rootMargin: "0px 0px -20% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

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
          {/* Video background */}
          <div className="absolute inset-0 overflow-hidden">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              style={{}}
            >
              <source src="/video/intro-film.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(10,13,10,0.35) 0%, rgba(10,13,10,0.88) 100%)" }} />

          <motion.div
            className="relative z-10 w-full px-6 md:px-12 pb-16 md:pb-24 max-w-4xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <p
              className="mb-3"
              style={{
                fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 400,
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
                  fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 400,
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
                  fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 400,
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

        {/* ═══ THE ARTIFACT — Product Page ═══ */}
        {ARTIFACTS.map((artifact) => {
          const currentStock = artifact.sizes.find(s => s.label === selectedSize)?.stock ?? 0;
          const PRODUCT_IMGS = [
            { src: artifact.image, alt: "Back print" },
            { src: "/images/ch01/Copy of IMG_0926.jpg", alt: "Front view" },
            { src: "/images/ch01/Copy of IMG_0933.jpg", alt: "On tree" },
            { src: "/images/ch01/Copy of IMG_0963.jpg", alt: "Detail" },
            { src: "/images/ch01/Copy of IMG_0888.jpg", alt: "Label" },
          ];

          const expandables = [
            { key: "desc", label: "Description", content: artifact.description + "\n\nEach element on this tee carries meaning: The Sun (hope), The Paper Boat (purpose), The Teddy Bear (trust), The Waves (perseverance)." },
            { key: "model", label: "Model Size", content: "Model photos coming soon. This is an oversized fit — we recommend sizing down for a regular fit." },
            { key: "shipping", label: "Shipping & Returns", content: "Ships within 3-5 business days via J&T Express nationwide. ₱80 flat rate shipping.\n\nExchanges accepted within 7 days of delivery for unworn items with tags attached. No refunds — exchanges only." },
            { key: "care", label: "Fabric & Care", content: "100% Cotton\nScreen-printed graphic\n\nMachine wash cold, inside out. Do not bleach. Tumble dry low. Do not iron on print." },
          ];

          return (
            <section key={artifact.id} id="shop" className="py-20 px-6 md:px-12" style={{ background: "var(--bg-surface)" }}>
              <div className="max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8 md:gap-14">
                  {/* LEFT — Images */}
                  <FadeIn>
                    <div className="flex flex-col gap-2">
                      {/* Main image */}
                      <div className="relative aspect-[4/5] overflow-hidden" style={{ background: "var(--bg-mid)" }}>
                        {PRODUCT_IMGS.map((img, i) => (
                          <div key={i} style={{ position: "absolute", inset: 0, opacity: productImg === i ? 1 : 0, transition: "opacity 0.5s" }}>
                            <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                          </div>
                        ))}
                      </div>
                      {/* Thumbnails */}
                      <div className="grid grid-cols-5 gap-2">
                        {PRODUCT_IMGS.map((img, i) => (
                          <button key={i} onClick={() => setProductImg(i)} className="relative aspect-square overflow-hidden border-none p-0" style={{ border: productImg === i ? "2px solid var(--gold)" : "2px solid transparent", cursor: "pointer" }}>
                            <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="80px" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </FadeIn>

                  {/* RIGHT — Product details */}
                  <FadeIn delay={0.15}>
                    <div>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 10 }}>{artifact.chapter}</p>
                      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 400, color: "var(--text-head)", marginBottom: 6 }}>{artifact.name}</h2>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: 16, color: "var(--text-body)", opacity: 0.7, marginBottom: 12 }}>100% Cotton · Screen-printed · Oversized Fit</p>

                      {/* Reviews */}
                      <ReviewStars productId={artifact.id} />

                      {/* Price */}
                      <p style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 400, color: "var(--text-head)", marginBottom: 24 }}>{artifact.priceDisplay}</p>

                      {/* Color */}
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-body)", marginBottom: 10 }}>Color · <span style={{ color: "var(--text-head)", fontWeight: 500 }}>White</span></p>
                      <div className="mb-8">
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#f5f5f0", border: "2px solid var(--gold)", cursor: "pointer" }} />
                      </div>

                      {/* Size */}
                      <div className="flex justify-between items-center mb-4">
                        <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-body)" }}>Size</p>
                        <button type="button" onClick={() => setSizeChartOpen(true)} style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--gold)", background: "none", border: "none", textDecoration: "underline", textUnderlineOffset: 4, cursor: "pointer" }}>Size Chart</button>
                      </div>

                      {/* Size chart popup */}
                      {sizeChartOpen && (
                        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4" onClick={() => setSizeChartOpen(false)}>
                          <div className="absolute inset-0 bg-black/70" />
                          <div className="relative z-10 w-full max-w-md p-8" data-lenis-prevent style={{ background: "var(--bg-surface)", border: "1px solid var(--border-soft)", borderRadius: 12 }} onClick={e => e.stopPropagation()}>
                            <button onClick={() => setSizeChartOpen(false)} className="absolute top-4 right-5" style={{ background: "none", border: "none", fontFamily: "var(--font-serif)", fontSize: "1.6rem", fontWeight: 300, color: "var(--text-body)", cursor: "pointer" }}>×</button>
                            <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", fontWeight: 300, color: "var(--text-head)", marginBottom: 6 }}>Size Chart</h4>
                            <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--text-body)", opacity: 0.5, marginBottom: 20 }}>Measurements in inches · Oversized fit — size down for regular</p>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                              <thead><tr>{["Size","Chest","Length","Shoulder"].map(h=><th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "var(--text-body)", borderBottom: "2px solid var(--border-soft)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "var(--font-sans)" }}>{h}</th>)}</tr></thead>
                              <tbody>
                                {[{s:"XS",c:'34"',l:'26"',sh:'16"'},{s:"S",c:'36"',l:'27"',sh:'17"'},{s:"M",c:'38"',l:'28"',sh:'18"'},{s:"L",c:'40"',l:'29"',sh:'19"'},{s:"XL",c:'42"',l:'30"',sh:'20"'}].map(r=>
                                  <tr key={r.s}><td style={{padding:"14px 16px",fontSize:16,fontWeight:500,color:"var(--text-head)",borderBottom:"1px solid var(--border-soft)",fontFamily:"var(--font-sans)"}}>{r.s}</td><td style={{padding:"14px 16px",fontSize:16,fontWeight:300,color:"var(--text-body)",borderBottom:"1px solid var(--border-soft)",fontFamily:"var(--font-sans)"}}>{r.c}</td><td style={{padding:"14px 16px",fontSize:16,fontWeight:300,color:"var(--text-body)",borderBottom:"1px solid var(--border-soft)",fontFamily:"var(--font-sans)"}}>{r.l}</td><td style={{padding:"14px 16px",fontSize:16,fontWeight:300,color:"var(--text-body)",borderBottom:"1px solid var(--border-soft)",fontFamily:"var(--font-sans)"}}>{r.sh}</td></tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-5 gap-2 mb-5">
                        {artifact.sizes.filter(s => s.label !== "2XL").map(s => (
                          <button key={s.label} disabled={s.stock === 0} onClick={() => setSelectedSize(s.label)}
                            style={{ padding: "14px 0", fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: selectedSize === s.label ? 600 : 300, color: selectedSize === s.label ? "#fff" : "var(--text-head)", background: selectedSize === s.label ? "var(--green)" : "transparent", border: selectedSize === s.label ? "2px solid var(--green)" : "1px solid var(--border-soft)", opacity: s.stock === 0 ? 0.2 : 1, cursor: s.stock === 0 ? "not-allowed" : "pointer", transition: "all 0.2s", borderRadius: 4 }}>
                            {s.label}
                          </button>
                        ))}
                      </div>

                      {/* Stock */}
                      {selectedSize && (
                        <p style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 600, color: currentStock <= 3 ? "var(--gold)" : "var(--text-head)", marginBottom: 20 }}>
                          {currentStock} in stock · Limited archive
                        </p>
                      )}

                      {/* Add to Cart */}
                      <button
                        disabled={!selectedSize || currentStock === 0}
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          addItem({ id: artifact.id, name: artifact.name, price: artifact.price, priceDisplay: artifact.priceDisplay, size: selectedSize, color: "White", image: artifact.image, chapter: "Chapter 01", maxStock: currentStock }, rect);
                        }}
                        style={{ width: "100%", padding: "20px 0", fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: "#fff", background: "var(--green)", border: "none", cursor: selectedSize ? "pointer" : "not-allowed", opacity: selectedSize ? 1 : 0.35, transition: "all 0.3s", borderRadius: 4, marginBottom: 24 }}>
                        {selectedSize ? `Add to Cart — ${artifact.priceDisplay}` : "Select a Size"}
                      </button>

                      {/* Expandable sections */}
                      {expandables.map(sec => (
                        <div key={sec.key} style={{ borderTop: "1px solid var(--border-soft)" }}>
                          <button onClick={() => setExpandedSection(expandedSection === sec.key ? null : sec.key)}
                            className="w-full flex justify-between items-center py-5" style={{ background: "none", border: "none", cursor: "pointer" }}>
                            <span style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-head)" }}>{sec.label}</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-head)" strokeWidth="2" style={{ transform: expandedSection === sec.key ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s" }}><path d="M6 9l6 6 6-6"/></svg>
                          </button>
                          {expandedSection === sec.key && (
                            <div style={{ paddingBottom: 24 }}>
                              <p style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 400, lineHeight: 2, color: "var(--text-head)", opacity: 0.8, whiteSpace: "pre-line" }}>{sec.content}</p>
                            </div>
                          )}
                        </div>
                      ))}
                      <div style={{ borderTop: "1px solid var(--border-soft)" }} />
                    </div>
                  </FadeIn>
                </div>
              </div>
            </section>
          );
        })}

        {/* ═══ THE DROP ═══ */}
        <section className="py-24 px-6 md:px-12" style={{ background: "var(--bg-deep)" }}>
          <div className="max-w-4xl mx-auto">
            <FadeIn>
              <div className="flex justify-between items-end mb-8">
                <div>
                  <p className="mb-2" style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 400, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--gold)", opacity: 0.7 }}>
                    The Drop
                  </p>
                  <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 300, color: "var(--beige-light)", lineHeight: 1.1 }}>
                    In the <em style={{ fontStyle: "italic" }}>field.</em>
                  </h2>
                </div>
                <button
                  onClick={() => openLightbox(0)}
                  className="bg-transparent border-none cursor-pointer"
                  style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--beige)", opacity: 0.4, transition: "opacity 0.3s" }}
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
                    style={{}}
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
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 400, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--beige-light)", opacity: 0.8 }}>
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
                        style={{}}
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
                        sizes="20vw"
                      />
                      <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.55)" }}>
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
              <p className="mb-3" style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 400, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold)" }}>
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
                      style={{}}
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
                        style={{}}
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
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 400, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-body)", opacity: 0.3 }}>
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
              <Link
                href="/home"
                className="inline-block no-underline"
                style={{
                  fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 400,
                  letterSpacing: "0.18em", textTransform: "uppercase",
                  color: "var(--beige)", opacity: 0.6,
                  transition: "opacity 0.3s",
                  padding: "8px 16px",
                  border: "1px solid rgba(216,212,206,0.15)",
                }}
              >
                ← Return to Maison Gethse
              </Link>
            </FadeIn>
          </div>
        </section>
      </main>

      {/* Floating shop button */}
      <motion.button
        className="fixed bottom-6 left-16 right-4 md:left-24 md:right-auto z-50"
        style={{
          fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 500,
          letterSpacing: "0.14em", textTransform: "uppercase",
          color: "var(--white)", background: "var(--green)",
          padding: "16px 24px", border: "none", borderRadius: 6,
          boxShadow: "0 6px 30px rgba(0,0,0,0.4)", cursor: "pointer",
          textAlign: "center",
          pointerEvents: shopInView ? "none" : "auto",
          visibility: shopInView ? "hidden" : "visible",
          transition: "visibility 0s 0.6s",
        }}
        onClick={() => { const el = document.getElementById("shop"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}
        initial={{ y: 80, opacity: 0 }}
        animate={shopInView ? { y: 80, opacity: 0 } : { y: 0, opacity: 1 }}
        transition={{ delay: shopInView ? 0 : 2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        Carry This Chapter — Shop
      </motion.button>
    </>
  );
}
