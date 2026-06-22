"use client";

import { useAudio } from "./AudioProvider";

export function MuteToggle() {
  const { isPlaying, isUnlocked, toggle } = useAudio();

  if (!isUnlocked) return null;

  return (
    <button
      onClick={toggle}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 opacity-40 hover:opacity-80 transition-opacity duration-300"
      aria-label={isPlaying ? "Mute ambient sound" : "Unmute ambient sound"}
    >
      <div className="flex items-center gap-[3px]">
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className="block w-[2px] bg-[var(--text-body)] rounded-full transition-all duration-300"
            style={{
              height: isPlaying ? `${8 + i * 4}px` : "4px",
              animationName: isPlaying ? "soundWave" : "none",
              animationDuration: `${0.4 + i * 0.15}s`,
              animationIterationCount: "infinite",
              animationDirection: "alternate",
              animationTimingFunction: "ease-in-out",
            }}
          />
        ))}
      </div>
      <span
        className="text-[9px] font-[var(--font-sans)] tracking-[0.18em] uppercase"
        style={{ color: "var(--text-body)" }}
      >
        {isPlaying ? "Sound" : "Muted"}
      </span>

      <style jsx>{`
        @keyframes soundWave {
          0% { transform: scaleY(0.5); }
          100% { transform: scaleY(1.3); }
        }
      `}</style>
    </button>
  );
}
