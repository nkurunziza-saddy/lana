/* oxlint-disable */
// @ts-nocheck
export const VOICE_COMMANDS: Record<string, string> = {
  "new line": "\n",
  newline: "\n",
  "new paragraph": "\n\n",
  period: ".",
  "full stop": ".",
  comma: ",",
  "question mark": "?",
  "exclamation mark": "!",
  "exclamation point": "!",
  colon: ":",
  semicolon: ";",
  "open quote": '"',
  "close quote": '"',
  "open parenthesis": "(",
  "close parenthesis": ")",
  dash: "-",
  hyphen: "-",
};

export function capitalizeFirstLetter(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatTranscript(transcript: string, isStartOfSentence: boolean): string {
  let result = transcript.trim();

  const lowerResult = result.toLowerCase();
  for (const [command, replacement] of Object.entries(VOICE_COMMANDS)) {
    if (lowerResult === command) {
      return replacement;
    }
  }

  if (isStartOfSentence && result.length > 0) {
    result = capitalizeFirstLetter(result);
  }

  return result;
}

export function isAtSentenceStart(text: string): boolean {
  if (!text || text.length === 0) return true;
  const trimmed = text.trimEnd();
  if (trimmed.length === 0) return true;
  const lastChar = trimmed[trimmed.length - 1];
  return [".", "!", "?", "\n"].includes(lastChar);
}
