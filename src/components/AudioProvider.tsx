"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";
import { Howl } from "howler";

const AudioContext = createContext<{
  isPlaying: boolean;
  isUnlocked: boolean;
  unlock: () => void;
  toggle: () => void;
}>({
  isPlaying: false,
  isUnlocked: false,
  unlock: () => {},
  toggle: () => {},
});

export function useAudio() {
  return useContext(AudioContext);
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const howlRef = useRef<Howl | null>(null);

  const getHowl = useCallback(() => {
    if (!howlRef.current) {
      howlRef.current = new Howl({
        src: ["/audio/ambient.mp3"],
        loop: true,
        volume: 0.15,
        html5: true,
      });
    }
    return howlRef.current;
  }, []);

  const unlock = useCallback(() => {
    if (isUnlocked) return;
    const howl = getHowl();
    howl.play();
    howl.fade(0, 0.15, 2000);
    setIsPlaying(true);
    setIsUnlocked(true);
  }, [isUnlocked, getHowl]);

  const toggle = useCallback(() => {
    const howl = getHowl();
    if (isPlaying) {
      howl.fade(howl.volume(), 0, 500);
      setTimeout(() => howl.pause(), 500);
      setIsPlaying(false);
    } else {
      howl.play();
      howl.fade(0, 0.15, 500);
      setIsPlaying(true);
    }
  }, [isPlaying, getHowl]);

  return (
    <AudioContext.Provider value={{ isPlaying, isUnlocked, unlock, toggle }}>
      {children}
    </AudioContext.Provider>
  );
}
