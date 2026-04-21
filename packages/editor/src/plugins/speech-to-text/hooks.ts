import { useState, useCallback, useRef, useSyncExternalStore } from "react";
import { setGlobalState, subscribe, getSnapshot } from "./state";
import { type LexicalEditor, CAN_UNDO_COMMAND, CAN_REDO_COMMAND } from "lexical";
import type {
  SpeechRecognition,
  SpeechRecognitionEvent,
  SpeechRecognitionErrorEvent,
} from "./types";

export function useSpeechToTextState() {
  return useSyncExternalStore(subscribe, getSnapshot);
}

export function useSpeechToText(editor: LexicalEditor) {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const isSupported =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || (window as any).webkitSpeechRecognition);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      setGlobalState(false, false);
    }
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) return;

    const SpeechRecognitionConstructor =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognitionConstructor() as SpeechRecognition;
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.addEventListener("start", () => {
      setIsListening(true);
      setGlobalState(true, false);
      setStatusMessage("Listening...");
    });

    recognition.addEventListener("error", (event: any) => {
      const errorEvent = event as SpeechRecognitionErrorEvent;
      console.error("Speech recognition error", errorEvent.error);
      setIsListening(false);
      setGlobalState(false, false);
      setStatusMessage(`Error: ${errorEvent.error}`);
    });

    recognition.addEventListener("end", () => {
      setIsListening(false);
      setGlobalState(false, false);
    });

    recognition.addEventListener("result", (event: any) => {
      const speechEvent = event as SpeechRecognitionEvent;
      let finalTranscript = "";
      let currentInterim = "";

      for (let i = speechEvent.resultIndex; i < speechEvent.results.length; ++i) {
        const result = speechEvent.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          currentInterim += result[0].transcript;
        }
      }

      setInterimText(currentInterim);

      if (finalTranscript) {
        const command = finalTranscript.trim().toLowerCase();
        if (command === "undo") {
          editor.dispatchCommand(CAN_UNDO_COMMAND, undefined as any);
        } else if (command === "redo") {
          editor.dispatchCommand(CAN_REDO_COMMAND, undefined as any);
        }
        // Further logic can be added here
      }
    });

    recognition.start();
  }, [editor, isSupported]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    isProcessing: false,
    isSupported,
    interimText,
    statusMessage,
    toggleListening,
  };
}
