import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { REDO_COMMAND, UNDO_COMMAND } from "lexical";
import { Redo, Undo } from "lucide-react";
import { ToolbarButton } from "./toolbar-button";
import React from "react";

export const HistoryButtons = React.memo(function HistoryButtons({
  canUndo,
  canRedo,
}: {
  canUndo: boolean;
  canRedo: boolean;
}) {
  const [editor] = useLexicalComposerContext();

  return (
    <>
      <ToolbarButton
        disabled={!canUndo}
        icon={Undo}
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        title="Undo"
      />
      <ToolbarButton
        disabled={!canRedo}
        icon={Redo}
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        title="Redo"
      />
    </>
  );
});
