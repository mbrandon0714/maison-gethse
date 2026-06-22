"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAudio } from "@/components/AudioProvider";
import { KeyIcon } from "@/components/KeyIcon";

export default function CoverPage() {
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const { unlock } = useAudio();
  const router = useRouter();

  const handleEnter = useCallback(() => {
    if (isUnlocking) return;
    setIsUnlocking(true);
    unlock();

    setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        router.push("/home");
      }, 1000);
    }, 1200);
  }, [isUnlocking, unlock, router]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center cursor-pointer select-none"
          style={{ background: "var(--void)" }}
          onClick={handleEnter}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)",
            }}
          />

          <motion.div
            className="relative z-10 flex flex-col items-center gap-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Brand name */}
            <h1
              className="text-center"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.8rem, 4.5vw, 3rem)",
                fontWeight: 300,
                color: "var(--beige-light)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              Maison Gethse
            </h1>

            {/* Divider */}
            <motion.div
              className="w-[1px]"
              style={{ background: "var(--beige)", opacity: 0.15 }}
              initial={{ height: 0 }}
              animate={{ height: 60 }}
              transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Tagline */}
            <motion.p
              className="text-center max-w-[440px] px-6"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
                fontWeight: 300,
                fontStyle: "italic",
                color: "var(--beige)",
                lineHeight: 1.7,
                letterSpacing: "0.03em",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              transition={{ duration: 1.5, delay: 1.2 }}
            >
              Work unlocks what we carry.<br />
              Culture opens what we become.
            </motion.p>

            {/* The Key */}
            <motion.div
              className="mt-6 flex flex-col items-center gap-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 1.8 }}
            >
              <motion.div
                animate={
                  isUnlocking
                    ? { scale: 1.15, opacity: 0.3 }
                    : { scale: [1, 1.04, 1] }
                }
                transition={
                  isUnlocking
                    ? { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                    : {
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }
                }
              >
                <KeyIcon size={64} gold />
              </motion.div>

              <motion.span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "12px",
                  fontWeight: 400,
                  color: "var(--beige)",
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                }}
                animate={{ opacity: [0.25, 0.5, 0.25] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                Enter
              </motion.span>
            </motion.div>
          </motion.div>

          {/* Bottom */}
          <motion.p
            className="absolute bottom-8 text-center"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
              fontWeight: 300,
              letterSpacing: "0.2em",
              color: "var(--beige)",
              textTransform: "uppercase",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 1, delay: 2.5 }}
          >
            Stories · Chapters · Becoming
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
