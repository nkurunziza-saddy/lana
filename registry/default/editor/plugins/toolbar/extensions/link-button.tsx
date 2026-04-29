/* oxlint-disable */
// @ts-nocheck
"use client";

import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Link } from "lucide-react";
import React, { useCallback } from "react";
import { useToolbar } from "../context";
import { ToolbarButton } from "./toolbar-button";

export const LinkButton = React.memo(function LinkButton() {
  const [editor] = useLexicalComposerContext();
  const { state } = useToolbar();

  const insertLink = useCallback(() => {
    if (!state.isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, state.isLink]);

  return (
    <ToolbarButton
      icon={Link}
      isActive={state.isLink}
      onClick={insertLink}
      title={state.isLink ? "Remove Link" : "Insert Link"}
    />
  );
});
