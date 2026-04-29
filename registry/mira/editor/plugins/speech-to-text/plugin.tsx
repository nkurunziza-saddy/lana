/* oxlint-disable */
// @ts-nocheck
"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { MicOff } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSpeechToText, useSpeechToTextState } from "./hooks";

export default function SpeechToTextPlugin({
  anchorElem = typeof document !== "undefined" ? document.body : undefined,
}: {
  anchorElem?: HTMLElement;
}): React.ReactPortal | null {
  const [editor] = useLexicalComposerContext();
  const { isListening } = useSpeechToTextState();
  const { isSupported, interimText, statusMessage, toggleListening } = useSpeechToText(editor);

  useEffect(() => {
    const handle = () => toggleListening();
    window.addEventListener("toggle-speech-to-text", handle);
    return () => window.removeEventListener("toggle-speech-to-text", handle);
  }, [toggleListening]);

  if (!isSupported || !isListening || !anchorElem) return null;

  return createPortal(
    <div className="absolute bottom-4 end-4 z-50 flex flex-col items-end gap-2 select-none">
      {(statusMessage || interimText) && (
        <div className="bg-background/95 backdrop-blur-sm border rounded-lg px-3 py-2 shadow-lg max-w-sm animate-in fade-in slide-in-from-bottom-2 duration-200">
          {statusMessage && (
            <div className="text-xs font-medium text-muted-foreground">{statusMessage}</div>
          )}
          {interimText && (
            <div className="text-sm text-foreground/60 italic leading-relaxed mt-0.5">
              {interimText}
              <span className="inline-block w-[3px] h-3.5 bg-primary/60 ms-0.5 align-text-bottom animate-pulse" />
            </div>
          )}
        </div>
      )}

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              onClick={toggleListening}
              size="icon"
              variant="default"
              className="relative rounded-full shadow-lg bg-destructive hover:bg-destructive/90 scale-110 transition-all duration-300"
              aria-label="Stop recording"
            >
              <MicOff className="relative size-4" />
            </Button>
          }
        />
        <TooltipContent side="left">
          <p>
            Stop speech-to-text
            <span className="block text-xs text-muted-foreground mt-1">
              Say &quot;stop&quot;, &quot;undo&quot;, or &quot;redo&quot;
            </span>
          </p>
        </TooltipContent>
      </Tooltip>
    </div>,
    anchorElem,
  );
}
