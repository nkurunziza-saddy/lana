/* oxlint-disable */
// @ts-nocheck
/** Punctuation voice commands — the transcript is replaced by the value. */
export const PUNCTUATION_COMMANDS: Record<string, string> = {
  period: ".",
  "full stop": ".",
  comma: ",",
  "question mark": "?",
  "exclamation mark": "!",
  "exclamation point": "!",
  colon: ":",
  semicolon: ";",
  "open quote": "\u201C",
  "close quote": "\u201D",
  "open parenthesis": "(",
  "close parenthesis": ")",
  dash: "\u2014",
  hyphen: "-",
  ellipsis: "\u2026",
  "forward slash": "/",
  ampersand: "&",
  "at sign": "@",
  hashtag: "#",
};

/** Action voice commands — handled specially in the hook. */
const ACTION_COMMANDS = new Set([
  "undo",
  "redo",
  "stop",
  "stop listening",
  "stop dictation",
  "new line",
  "newline",
  "new paragraph",
]);

/**
 * Returns `true` if the (lower-cased) transcript is a recognised
 * voice command that should NOT be inserted as-is.
 */
export function isVoiceCommand(cmd: string): boolean {
  return ACTION_COMMANDS.has(cmd);
}

export function capitalizeFirstLetter(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Format a transcript before insertion.
 *
 * 1. If the whole transcript matches a punctuation command, return
 *    the punctuation character.
 * 2. Otherwise capitalise the first letter when at the start of a
 *    sentence.
 */
export function formatTranscript(transcript: string, isStartOfSentence: boolean): string {
  let result = transcript.trim();

  // Check punctuation commands (exact match only)
  const lower = result.toLowerCase();
  const punctuation = PUNCTUATION_COMMANDS[lower];
  if (punctuation !== undefined) return punctuation;

  // Auto-capitalise at sentence boundaries
  if (isStartOfSentence && result.length > 0) {
    result = capitalizeFirstLetter(result);
  }

  return result;
}

/**
 * Heuristic: is the cursor currently at the start of a new sentence?
 * Looks at the text *before* the cursor position.
 */
export function isAtSentenceStart(text: string): boolean {
  if (!text || text.length === 0) return true;
  const trimmed = text.trimEnd();
  if (trimmed.length === 0) return true;
  const lastChar = trimmed[trimmed.length - 1];
  return [".", "!", "?", "\n"].includes(lastChar);
}
