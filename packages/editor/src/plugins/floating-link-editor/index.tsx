"use client";

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
import { useCallback, useEffect, useRef, useState } from "react";
import type React from "react";
import { createPortal } from "react-dom";

import { cn } from "@andi/utils";
import { EditLinkView } from "./components/edit-view";
import { DisplayLinkView } from "./components/display-view";

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
  anchorElem = typeof document !== "undefined" ? document.body : undefined,
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

  const calculatePosition = useCallback(
    (rect: DOMRect) => {
      const popover = popoverRef.current;
      if (!popover || !anchorElem) return;

      const popoverRect = popover.getBoundingClientRect();
      const anchorRect = anchorElem.getBoundingClientRect();

      const MARGIN = 10;
      const GAP = 6;

      let top = rect.bottom - anchorRect.top + anchorElem.scrollTop + GAP;
      let left = rect.left - anchorRect.left + anchorElem.scrollLeft;

      if (left + popoverRect.width > anchorRect.width - MARGIN) {
        left = anchorRect.width - popoverRect.width - MARGIN;
      }
      if (left < MARGIN) left = MARGIN;

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

  if (!isLink || !anchorElem) return null;

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
        <EditLinkView
          editedLinkUrl={editedLinkUrl}
          setEditedLinkUrl={setEditedLinkUrl}
          handleLinkSubmission={handleLinkSubmission}
          setIsEditMode={setIsEditMode}
          inputRef={inputRef}
        />
      ) : (
        <DisplayLinkView
          linkUrl={linkUrl}
          displayUrl={displayUrl}
          sanitizeUrl={sanitizeUrl}
          setEditedLinkUrl={setEditedLinkUrl}
          setIsEditMode={setIsEditMode}
          removeLink={removeLink}
        />
      )}
    </div>,
    anchorElem,
  );
}
