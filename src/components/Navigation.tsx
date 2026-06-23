"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { KeyIcon } from "./KeyIcon";
import { CartButton } from "./CartDrawer";

const NAV_ITEMS = [
  { id: "brand", label: "The Brand", href: "/home#brand" },
  { id: "chapters", label: "Chapters", href: "/home#chapters" },
  { id: "garden", label: "The Garden", href: "/the-garden" },
  { id: "lens", label: "The Lens", href: "/the-lens" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const navigateTo = useCallback((item: typeof NAV_ITEMS[0]) => {
    setMobileOpen(false);
    if (item.href.startsWith("/the-")) {
      router.push(item.href);
      return;
    }
    if (pathname === "/home") {
      const el = document.getElementById(item.id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push(item.href);
    }
  }, [pathname, router]);

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-8 md:px-12"
        style={{
          height: "var(--nav-h)",
          background: scrolled ? "var(--nav-bg)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid var(--nav-bd)" : "1px solid transparent",
          transition: "background 0.4s, border-bottom 0.4s, backdrop-filter 0.4s",
        }}
        initial={{ y: -72 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo / Key */}
        <a
          href="/home"
          className="flex items-center gap-3 no-underline"
          style={{ color: "var(--text-head)" }}
        >
          <KeyIcon size={36} />
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "0.85rem",
              fontWeight: 300,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Maison Gethse
          </span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-10 list-none">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => navigateTo(item)}
                className="relative bg-transparent border-none cursor-pointer py-2 px-3 -mx-3"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "10px",
                  fontWeight: activeSection === item.id ? 500 : 400,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: activeSection === item.id ? "var(--gold)" : "var(--text-head)",
                  background: activeSection === item.id ? "rgba(200,146,42,0.08)" : "transparent",
                  borderRadius: "4px",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  if (activeSection !== item.id) {
                    e.currentTarget.style.color = "var(--gold)";
                    e.currentTarget.style.background = "rgba(200,146,42,0.05)";
                  }
                }}
                onMouseOut={(e) => {
                  if (activeSection !== item.id) {
                    e.currentTarget.style.color = "var(--text-head)";
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-3 right-3 h-[1.5px]"
                    style={{ background: "var(--gold)" }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* Right controls */}
        <div className="flex items-center gap-4">
          {/* Cart */}
          <CartButton />
          {/* Theme toggle */}
          <button
            onClick={(e) => toggleTheme(e)}
            className="w-9 h-9 flex items-center justify-center bg-transparent border-none cursor-pointer"
            style={{ color: "var(--text-head)", transition: "opacity 0.3s" }}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px] bg-transparent border-none cursor-pointer"
            aria-label="Menu"
          >
            <span
              className="block w-5 h-[1px] transition-transform duration-300"
              style={{
                background: "var(--text-head)",
                transform: mobileOpen ? "rotate(45deg) translate(2px, 3px)" : "none",
              }}
            />
            <span
              className="block w-5 h-[1px] transition-opacity duration-300"
              style={{
                background: "var(--text-head)",
                opacity: mobileOpen ? 0 : 1,
              }}
            />
            <span
              className="block w-5 h-[1px] transition-transform duration-300"
              style={{
                background: "var(--text-head)",
                transform: mobileOpen ? "rotate(-45deg) translate(2px, -3px)" : "none",
              }}
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile overlay */}
      <motion.div
        className="fixed inset-0 z-[99] flex flex-col items-center justify-center md:hidden"
        style={{ background: "var(--bg-deep)" }}
        initial={false}
        animate={{
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? "auto" : "none",
        }}
        transition={{ duration: 0.4 }}
      >
        <ul className="flex flex-col items-center gap-8 list-none">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => navigateTo(item)}
                className="bg-transparent border-none cursor-pointer"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.4rem",
                  fontWeight: 300,
                  letterSpacing: "0.1em",
                  color: activeSection === item.id ? "var(--gold)" : "var(--text-head)",
                  transition: "color 0.3s",
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </motion.div>
    </>
  );
}
