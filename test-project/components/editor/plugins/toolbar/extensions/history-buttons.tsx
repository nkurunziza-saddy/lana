"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { REDO_COMMAND, UNDO_COMMAND } from "lexical";
import { Redo, Undo } from "lucide-react";
import { ToolbarButton } from "./toolbar-button";
import React from "react";
import { useToolbar } from "../context";

export const HistoryButtons = React.memo(function HistoryButtons() {
  const [editor] = useLexicalComposerContext();
  const { state } = useToolbar();

  return (
    <>
      <ToolbarButton
        disabled={!state.canUndo}
        icon={Undo}
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        title="Undo"
      />
      <ToolbarButton
        disabled={!state.canRedo}
        icon={Redo}
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        title="Redo"
      />
    </>
  );
});
