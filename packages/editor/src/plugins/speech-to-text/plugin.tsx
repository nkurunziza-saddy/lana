import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@lana/ui";
import { useSpeechToText, useSpeechToTextState } from "./hooks";

export default function SpeechToTextPlugin({
  anchorElem = document.body,
}: {
  anchorElem?: HTMLElement;
}): React.ReactPortal | null {
  const [editor] = useLexicalComposerContext();
  const { isListening, isProcessing } = useSpeechToTextState();
  const { isSupported, interimText, statusMessage, toggleListening } = useSpeechToText(editor);

  useEffect(() => {
    const handleToggle = () => {
      toggleListening();
    };

    window.addEventListener("toggle-speech-to-text", handleToggle);
    return () => {
      window.removeEventListener("toggle-speech-to-text", handleToggle);
    };
  }, [toggleListening]);

  if (!isSupported) {
    return null;
  }

  return createPortal(
    <div className="absolute bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {(statusMessage || interimText) && (
        <div className="bg-background/95 backdrop-blur-sm border rounded-lg px-3 py-2 shadow-lg max-w-xs">
          {statusMessage && <div className="text-sm text-muted-foreground">{statusMessage}</div>}
          {interimText && (
            <div className="text-sm text-muted-foreground/70 italic">{interimText}...</div>
          )}
        </div>
      )}

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              onClick={toggleListening}
              size="icon"
              variant={isListening ? "default" : "outline"}
              className={`rounded-full shadow-lg transition-all duration-300 ${
                isListening
                  ? "bg-destructive hover:bg-destructive/90 scale-110"
                  : "bg-background hover:bg-accent"
              } ${isProcessing ? "ring-2 ring-primary ring-offset-2" : ""}`}
              aria-label={isListening ? "Stop recording" : "Start recording"}
            >
              {isProcessing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : isListening ? (
                <MicOff className="size-4" />
              ) : (
                <Mic className="size-4" />
              )}
            </Button>
          }
        />
        <TooltipContent side="left">
          <p>
            {isListening ? "Stop speech-to-text" : "Start speech-to-text"}
            {isListening && (
              <span className="block text-xs text-muted-foreground mt-1">
                Say &quot;undo&quot; or &quot;redo&quot; for commands
              </span>
            )}
          </p>
        </TooltipContent>
      </Tooltip>
    </div>,
    anchorElem,
  );
}
