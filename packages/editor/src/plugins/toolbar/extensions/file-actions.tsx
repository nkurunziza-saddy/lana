import React, { useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FileDown, FileUp } from "lucide-react";
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from "@lana/ui";
import {
  copyAsPlainText,
  exportAsHTML,
  exportAsMarkdown,
  importMarkdown,
} from "../../../lib/utils";
import { ToolbarButton } from "./toolbar-button";

export const FileActions = React.memo(function FileActions() {
  const [editor] = useLexicalComposerContext();
  const importInputRef = useRef<HTMLInputElement>(null);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importMarkdown(editor, file);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <ToolbarButton disablePressAnimation icon={FileDown} title="Export" variant="ghost" />
          }
        />
        <DropdownMenuContent align="start" side="bottom" sideOffset={8}>
          <DropdownMenuItem
            className="hover:bg-accent/80 transition-colors"
            closeOnClick
            onClick={() => exportAsHTML(editor)}
          >
            Save as HTML
          </DropdownMenuItem>
          <DropdownMenuItem
            className="hover:bg-accent/80 transition-colors"
            closeOnClick
            onClick={() => exportAsMarkdown(editor)}
          >
            Save as Markdown
          </DropdownMenuItem>
          <DropdownMenuItem
            className="hover:bg-accent/80 transition-colors"
            closeOnClick
            onClick={() => copyAsPlainText(editor)}
          >
            Copy as Plain Text
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <input
        accept=".md,.markdown"
        className="hidden"
        onChange={handleImport}
        ref={importInputRef}
        type="file"
      />
      <ToolbarButton icon={FileUp} onClick={() => importInputRef.current?.click()} title="Import" />
    </>
  );
});
