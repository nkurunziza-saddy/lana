/* oxlint-disable */
"use client";

import { useState, useCallback, useRef, useSyncExternalStore, useEffect } from "react";
import { setGlobalState, subscribe, getSnapshot } from "./state";
import {
  type LexicalEditor,
  UNDO_COMMAND,
  REDO_COMMAND,
  $getSelection,
  $isRangeSelection,
  $getRoot,
  $createParagraphNode,
} from "lexical";
import type {
  SpeechRecognition,
  SpeechRecognitionEvent,
  SpeechRecognitionErrorEvent,
} from "./types";
import { formatTranscript, isAtSentenceStart, isVoiceCommand } from "./utils";

const MIN_CONFIDENCE = 0.4;
const RESTART_DELAY_MS = 250;

export function useSpeechToTextState() {
  return useSyncExternalStore(subscribe, getSnapshot, () => ({
    isListening: false,
    isProcessing: false,
  }));
}

export function useSpeechToText(editor: LexicalEditor) {
  const { isListening } = useSpeechToTextState();
  const [interimText, setInterimText] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isStartOfSentenceRef = useRef(true);
  const shouldRestartRef = useRef(false);
  const pendingInterimRef = useRef("");
  const spawnRef = useRef<() => void>(() => {});

  const isSupported =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || (window as any).webkitSpeechRecognition);

  const commitText = useCallback(
    (raw: string) => {
      editor.focus(() => {
        editor.update(
          () => {
            let selection = $getSelection();

            if (!$isRangeSelection(selection)) {
              const root = $getRoot();
              let lastBlock = root.getLastChild();
              if (!lastBlock) {
                lastBlock = $createParagraphNode();
                root.append(lastBlock);
              }
              lastBlock.selectEnd();
              selection = $getSelection();
              if (!$isRangeSelection(selection)) return;
            }

            const anchorNode = selection.anchor.getNode();
            const fullText = anchorNode.getTextContent?.() ?? "";
            const before = fullText.slice(0, selection.anchor.offset);

            const atSentenceStart = isStartOfSentenceRef.current || isAtSentenceStart(before);
            const formatted = formatTranscript(raw, atSentenceStart);

            const needsSpace =
              before.length > 0 && !/[\s\n]$/.test(before) && !/^[\n.,!?;:)\]"']/.test(formatted);

            const text = needsSpace ? ` ${formatted}` : formatted;
            selection.insertText(text);

            const t = text.trimEnd();
            isStartOfSentenceRef.current =
              t.length > 0 && [".", "!", "?", "\n"].includes(t[t.length - 1]);
          },
          { discrete: true, tag: "speech-to-text" },
        );
      });
    },
    [editor],
  );

  const clearTimers = useCallback(() => {
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
  }, []);

  const stopListening = useCallback(() => {
    shouldRestartRef.current = false;
    clearTimers();

    const r = recognitionRef.current;
    recognitionRef.current = null;
    if (r) {
      try {
        r.stop();
      } catch {
        /* already stopped */
      }
    }

    setGlobalState({ isListening: false, isProcessing: false });
    setInterimText("");
    pendingInterimRef.current = "";
    setStatusMessage("");
  }, [clearTimers]);

  const spawnRecognition = useCallback(() => {
    if (!isSupported) return;

    const Ctor = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new Ctor() as SpeechRecognition;
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    recognition.addEventListener("start", () => {
      setGlobalState({ isListening: true, isProcessing: false });
      setStatusMessage("Listening...");
    });

    recognition.addEventListener("error", (event: any) => {
      if (recognitionRef.current !== recognition) return;
      const err = (event as SpeechRecognitionErrorEvent).error;

      if (err === "no-speech" || err === "aborted") return;
      if (err === "network") return;

      console.error("Speech recognition error:", err);
      shouldRestartRef.current = false;
      setGlobalState({ isListening: false, isProcessing: false });
      setStatusMessage(`Error: ${err}`);
    });

    recognition.addEventListener("end", () => {
      if (recognitionRef.current !== recognition) return;
      recognitionRef.current = null;

      const pending = pendingInterimRef.current.trim();
      if (pending) {
        commitText(pending);
        pendingInterimRef.current = "";
        setInterimText("");
      }

      if (!shouldRestartRef.current) return;

      restartTimerRef.current = setTimeout(() => {
        if (shouldRestartRef.current) {
          spawnRef.current();
        }
      }, RESTART_DELAY_MS);
    });

    recognition.addEventListener("result", (event: any) => {
      const speechEvent = event as SpeechRecognitionEvent;
      let finalTranscript = "";
      let currentInterim = "";

      for (let i = speechEvent.resultIndex; i < speechEvent.results.length; ++i) {
        const result = speechEvent.results[i];
        if (result.isFinal) {
          if (result[0].confidence >= MIN_CONFIDENCE) {
            finalTranscript += result[0].transcript;
          }
        } else {
          currentInterim += result[0].transcript;
        }
      }

      pendingInterimRef.current = currentInterim;
      setInterimText(currentInterim);

      if (!finalTranscript) return;
      const trimmed = finalTranscript.trim();
      if (!trimmed) return;

      const cmd = trimmed.toLowerCase();

      if (isVoiceCommand(cmd)) {
        if (cmd === "undo") {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
          setStatusMessage("Undo");
        } else if (cmd === "redo") {
          editor.dispatchCommand(REDO_COMMAND, undefined);
          setStatusMessage("Redo");
        } else if (cmd === "stop" || cmd === "stop listening" || cmd === "stop dictation") {
          stopListening();
          return;
        } else if (cmd === "new line" || cmd === "newline") {
          commitText("\n");
        } else if (cmd === "new paragraph") {
          commitText("\n\n");
        }
        pendingInterimRef.current = "";
        setInterimText("");
        return;
      }

      commitText(trimmed);
      pendingInterimRef.current = "";
      setInterimText("");
      setStatusMessage("Listening...");
    });

    try {
      recognition.start();
    } catch (e) {
      console.error("Recognition start failed:", e);
      recognitionRef.current = null;
    }
  }, [isSupported, commitText, stopListening, editor]);

  useEffect(() => {
    spawnRef.current = spawnRecognition;
  }, [spawnRecognition]);

  const startListening = useCallback(() => {
    if (!isSupported) return;
    shouldRestartRef.current = true;
    isStartOfSentenceRef.current = true;
    spawnRecognition();
  }, [isSupported, spawnRecognition]);

  useEffect(() => {
    return () => {
      shouldRestartRef.current = false;
      clearTimers();
      const r = recognitionRef.current;
      if (r) {
        recognitionRef.current = null;
        try {
          r.stop();
        } catch {
          /* ignore */
        }
      }
    };
  }, [clearTimers]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    isSupported,
    interimText,
    statusMessage,
    toggleListening,
  };
}
