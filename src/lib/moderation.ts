/* ═══════════════════════════════════════════════════════════
   MAISON GETHSE — Garden moderation
   Automated gatekeeper so seeds publish instantly, while
   harsh/offensive language is quietly turned away.

   The Garden is bilingual (English + Filipino/Taglish), so the
   lists below cover both. Mark can freely add or remove words —
   the matching logic doesn't need to change.
   ═══════════════════════════════════════════════════════════ */

// Whole-word profanity (matched as complete tokens, so innocent
// words that merely *contain* these — "class", "assist", "grass" —
// are never flagged).
const BANNED_WORDS: string[] = [
  // ── English ──
  "fuck", "fucker", "fucking", "fuckin", "motherfucker", "mf", "stfu", "wtf",
  "shit", "shite", "bullshit", "bitch", "bitches", "asshole", "asshat",
  "bastard", "cunt", "dick", "dickhead", "prick", "cock", "pussy",
  "slut", "whore", "hoe", "douche", "douchebag", "twat", "wanker", "jerkoff",
  "jackass", "dumbass", "dipshit", "shithead", "piss",
  // ── Slurs (always unacceptable) ──
  "nigger", "nigga", "faggot", "fag", "retard", "retarded", "chink", "spic", "kike", "tranny",
  // ── Filipino / Tagalog ──
  "putangina", "puta", "puta", "pota", "potangina", "tangina", "tang", "tanga",
  "gago", "gaga", "gagi", "bobo", "boba", "ulol", "ulul", "tarantado",
  "pakyu", "kingina", "kingnina", "kupal", "hayop", "hindot", "hindutan",
  "iyot", "kantot", "jakol", "burat", "titi", "tite", "puke", "puki", "pekpek",
  "betlog", "bayag", "punyeta", "puneta", "hinayupak", "putragis", "putangnamo",
  "gunggong", "ungas", "engot", "siraulo", "peste", "leche", "letse",
  "tarantada", "walanghiya", "yawa", "buang", "bilat", "lintik", "pisti",
];

// Distinctive multi-word or spacing-evasion phrases. These are
// matched against the text stripped of ALL non-letters, so
// "p u t a n g i n a", "tang.ina", "tang_ina" are all caught.
// Kept deliberately distinctive to avoid false positives.
const BANNED_COLLAPSED: string[] = [
  "putangina", "putanginamo", "tangina", "tanginamo", "putanginamo",
  "gagoka", "gagokaba", "bobomo", "ulolka", "kingina", "pakyu", "fuckyou",
  "motherfucker", "nigger", "faggot",
];

// Leetspeak / symbol substitutions normalized before matching.
const LEET: Record<string, string> = {
  "@": "a", "4": "a", "8": "b", "(": "c", "3": "e", "6": "g",
  "1": "i", "!": "i", "0": "o", "$": "s", "5": "s", "7": "t", "+": "t", "9": "g",
};

function normalize(input: string): string {
  let s = input.toLowerCase();
  // strip accents (é → e, ñ → n)
  s = s.normalize("NFD").replace(/[̀-ͯ]/g, "");
  // leetspeak → letters
  s = s.replace(/[@48(36 1!0$57+9]/g, (c) => LEET[c] ?? c);
  // collapse 3+ repeated letters: "fuuuuck" → "fuuck" → treat as "fuck"
  s = s.replace(/(.)\1{2,}/g, "$1$1");
  return s;
}

const BANNED_SET = new Set(BANNED_WORDS.map((w) => w.replace(/(.)\1{2,}/g, "$1$1")));

export interface ModerationResult {
  clean: boolean;
  reason?: string;
}

/**
 * Screens a Garden seed. Returns { clean: true } when the text may be
 * published immediately, or { clean: false, reason } when it should be
 * turned away with a gentle message.
 */
export function moderateSeed(text: string): ModerationResult {
  const normalized = normalize(text);

  // 1) Whole-token match (also catches "shiiit" via repeat-collapse).
  const tokens = normalized.split(/[^a-z]+/).filter(Boolean);
  for (const token of tokens) {
    const collapsed = token.replace(/(.)\1{2,}/g, "$1$1");
    if (BANNED_SET.has(token) || BANNED_SET.has(collapsed)) {
      return { clean: false, reason: "language" };
    }
  }

  // 2) Spacing / punctuation-evasion match against letters-only string.
  const lettersOnly = normalized.replace(/[^a-z]/g, "");
  for (const phrase of BANNED_COLLAPSED) {
    if (lettersOnly.includes(phrase)) {
      return { clean: false, reason: "language" };
    }
  }

  return { clean: true };
}

// A gentle, on-brand message shown when a seed is turned away.
export const MODERATION_MESSAGE =
  "The Garden holds stories with care. This one carries language we can't plant here — please rephrase it gently, and try again.";
