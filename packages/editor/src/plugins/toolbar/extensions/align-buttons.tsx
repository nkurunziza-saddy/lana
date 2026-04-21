import React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { FORMAT_ELEMENT_COMMAND } from "lexical";
import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from "lucide-react";
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from "@lana/ui";
import { ToolbarButton } from "./toolbar-button";

export const AlignButtons = React.memo(function AlignButtons() {
  const [editor] = useLexicalComposerContext();

  const formatElement = (format: "left" | "center" | "right" | "justify") => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, format);
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger render={<ToolbarButton icon={AlignLeft} title="Text Alignment" />} />

      <DropdownMenuContent
        align="start"
        side="top"
        sideOffset={10}
        className="animate-in slide-in-from-top-2 duration-200"
      >
        <DropdownMenuItem
          className="hover:bg-accent/80 transition-colors"
          onClick={() => formatElement("left")}
        >
          <AlignLeft data-icon="inline-start" />
          Left
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:bg-accent/80 transition-colors"
          onClick={() => formatElement("center")}
        >
          <AlignCenter data-icon="inline-start" />
          Center
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:bg-accent/80 transition-colors"
          onClick={() => formatElement("right")}
        >
          <AlignRight data-icon="inline-start" />
          Right
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:bg-accent/80 transition-colors"
          onClick={() => formatElement("justify")}
        >
          <AlignJustify data-icon="inline-start" />
          Justify
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
