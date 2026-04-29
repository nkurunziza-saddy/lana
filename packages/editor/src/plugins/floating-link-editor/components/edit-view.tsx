"use client";

import React from "react";
import { Check, Link2, X } from "lucide-react";
import { Button, Input } from "@lana/ui";

interface EditLinkViewProps {
  editedLinkUrl: string;
  setEditedLinkUrl: (url: string) => void;
  handleLinkSubmission: (e: React.FormEvent) => void;
  setIsEditMode: (val: boolean) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export function EditLinkView({
  editedLinkUrl,
  setEditedLinkUrl,
  handleLinkSubmission,
  setIsEditMode,
  inputRef,
}: EditLinkViewProps) {
  return (
    <form onSubmit={handleLinkSubmission} className="flex items-center gap-2 p-2">
      <div className="flex flex-1 items-center gap-2 rounded-md border border-border/60 bg-muted/45 px-2.5 py-1.5 transition-colors focus-within:border-ring/50">
        <Link2 className="size-3.5 shrink-0 text-muted-foreground" />
        <Input
          ref={inputRef}
          className="h-auto border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          value={editedLinkUrl}
          onChange={(e) => setEditedLinkUrl(e.target.value)}
          placeholder="https://..."
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              setIsEditMode(false);
            }
          }}
        />
      </div>
      <Button
        size="icon"
        variant="ghost"
        className="size-8 shrink-0 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-600"
        type="submit"
        title="Save"
      >
        <Check className="size-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="size-8 shrink-0 text-muted-foreground hover:text-foreground"
        type="button"
        title="Cancel"
        onClick={() => setIsEditMode(false)}
      >
        <X className="size-4" />
      </Button>
    </form>
  );
}
