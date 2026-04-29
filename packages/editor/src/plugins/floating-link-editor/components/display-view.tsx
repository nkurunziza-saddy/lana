"use client";

import { Edit2, ExternalLink, Link2, Trash2 } from "lucide-react";
import { Button } from "@lana/ui";

interface DisplayLinkViewProps {
  linkUrl: string;
  displayUrl: string;
  sanitizeUrl: (url: string) => string;
  setEditedLinkUrl: (url: string) => void;
  setIsEditMode: (val: boolean) => void;
  removeLink: () => void;
}

export function DisplayLinkView({
  linkUrl,
  displayUrl,
  sanitizeUrl,
  setEditedLinkUrl,
  setIsEditMode,
  removeLink,
}: DisplayLinkViewProps) {
  return (
    <div className="flex items-stretch">
      <a
        href={sanitizeUrl(linkUrl)}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex min-w-0 flex-1 items-center gap-2.5 px-3 py-2.5 transition-colors hover:bg-muted/35"
        title={linkUrl}
      >
        <Link2 className="size-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
        <span className="truncate text-sm font-medium text-foreground">{displayUrl}</span>
        <ExternalLink className="ml-auto size-3 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-primary/60" />
      </a>

      <div className="my-1.5 w-px shrink-0 bg-border/60" />

      <div className="flex shrink-0 items-center gap-0.5 px-1.5 py-1">
        <Button
          size="icon"
          variant="ghost"
          className="size-7 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          onClick={() => {
            setEditedLinkUrl(linkUrl);
            setIsEditMode(true);
          }}
          title="Edit link"
        >
          <Edit2 className="size-3.5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="size-7 text-muted-foreground/60 hover:bg-destructive/10 hover:text-destructive"
          onClick={removeLink}
          title="Remove link"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
