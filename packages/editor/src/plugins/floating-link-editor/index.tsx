import { $isAutoLinkNode, $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isElementNode,
  $isNodeSelection,
  $isRangeSelection,
  type BaseSelection,
  COMMAND_PRIORITY_CRITICAL,
  getDOMSelection,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { Check, Edit2, ExternalLink, Link2, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type React from "react";
import { createPortal } from "react-dom";

import { Button, Input } from "@lana/ui";
import { cn } from "@lana/utils";

function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "javascript:") return "about:blank";
    return url;
  } catch {
    if (!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("mailto:")) {
      return `https://${url}`;
    }
    return url;
  }
}

function getSelectedNode(selection: BaseSelection) {
  const nodes = selection.getNodes();
  const anchorNode = nodes[0];
  if (!anchorNode) return null;
  return $isElementNode(anchorNode) ? anchorNode : anchorNode.getParentOrThrow();
}

interface Position {
  top: number;
  left: number;
  opacity: number;
}

export function FloatingLinkEditorPlugin({
  anchorElem = document.body,
}: {
  anchorElem?: HTMLElement;
}) {
  const [editor] = useLexicalComposerContext();
  const popoverRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isLink, setIsLink] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [editedLinkUrl, setEditedLinkUrl] = useState("");
  const [position, setPosition] = useState<Position>({ top: -1000, left: -1000, opacity: 0 });

  // Calculates position relative to the anchor element (editor container)
  const calculatePosition = useCallback(
    (rect: DOMRect) => {
      const popover = popoverRef.current;
      if (!popover) return;

      const popoverRect = popover.getBoundingClientRect();
      const anchorRect = anchorElem.getBoundingClientRect();

      const MARGIN = 10;
      const GAP = 6;

      // Local coordinates within the anchor element
      let top = rect.bottom - anchorRect.top + anchorElem.scrollTop + GAP;
      let left = rect.left - anchorRect.left + anchorElem.scrollLeft;

      // Clamp horizontally
      if (left + popoverRect.width > anchorRect.width - MARGIN) {
        left = anchorRect.width - popoverRect.width - MARGIN;
      }
      if (left < MARGIN) left = MARGIN;

      // Flip above if it would overflow the bottom of the anchor element
      const wouldOverflowBottom = top + popoverRect.height > anchorElem.scrollHeight - MARGIN;
      if (wouldOverflowBottom) {
        top = rect.top - anchorRect.top + anchorElem.scrollTop - popoverRect.height - GAP;
      }

      setPosition({ top, left, opacity: 1 });
    },
    [anchorElem],
  );

  const updateLinkEditor = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      let currentLinkNode = null;

      if ($isRangeSelection(selection)) {
        const node = getSelectedNode(selection);
        if (node) {
          const linkParent = $findMatchingParent(node, $isLinkNode);
          const autoLinkParent = $findMatchingParent(node, $isAutoLinkNode);
          if (linkParent) currentLinkNode = linkParent;
          else if (autoLinkParent) currentLinkNode = autoLinkParent;
          else if ($isLinkNode(node) || $isAutoLinkNode(node)) currentLinkNode = node;
        }
      } else if ($isNodeSelection(selection)) {
        const nodes = selection.getNodes();
        if (nodes.length > 0) {
          const node = nodes[0];
          const parent = node.getParent();
          if ($isLinkNode(parent) || $isAutoLinkNode(parent)) currentLinkNode = parent;
          else if ($isLinkNode(node) || $isAutoLinkNode(node)) currentLinkNode = node;
        }
      }

      if (currentLinkNode) {
        setIsLink(true);
        setLinkUrl(currentLinkNode.getURL());

        const rootElement = editor.getRootElement();
        const nativeSelection = getDOMSelection(editor._window);
        if (rootElement && nativeSelection) {
          const element = editor.getElementByKey(currentLinkNode.getKey());
          if (element) {
            calculatePosition(element.getBoundingClientRect());
          }
        }
      } else {
        setIsLink(false);
        setIsEditMode(false);
        setPosition((prev) => ({ ...prev, opacity: 0 }));
      }
    });
  }, [editor, calculatePosition]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(updateLinkEditor);
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor();
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    );
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    if (isEditMode && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditMode]);

  const handleLinkSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = editedLinkUrl.trim();
    if (trimmed) {
      const sanitized = sanitizeUrl(trimmed);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitized);
      setLinkUrl(sanitized);
    }
    setIsEditMode(false);
  };

  const removeLink = () => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    setIsLink(false);
    setIsEditMode(false);
  };

  const displayUrl = (() => {
    try {
      const parsed = new URL(linkUrl);
      const host = parsed.hostname.replace(/^www\./, "");
      const path = parsed.pathname === "/" ? "" : parsed.pathname;
      const full = `${host}${path}`;
      return full.length > 40 ? `${full.slice(0, 40)}…` : full;
    } catch {
      return linkUrl.length > 40 ? `${linkUrl.slice(0, 40)}…` : linkUrl;
    }
  })();

  if (!isLink) return null;

  return createPortal(
    <div
      ref={popoverRef}
      className={cn(
        "absolute z-50 overflow-hidden rounded-lg border border-border/70 bg-popover  transition-opacity duration-100 ease-out",
      )}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        opacity: position.opacity,
        pointerEvents: position.opacity > 0 ? "auto" : "none",
        minWidth: "260px",
        maxWidth: "380px",
      }}
    >
      {isEditMode ? (
        // ── Edit mode ────────────────────────────────
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
      ) : (
        // ── View mode ────────────────────────────────
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
      )}
    </div>,
    anchorElem,
  );
}
