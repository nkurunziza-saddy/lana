import React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $createParagraphNode, $getSelection } from "lexical";
import { Check, Heading, Heading1, Heading2, Heading3, Heading4 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToolbarButton } from "./toolbar-button";
import { useToolbar } from "../context";

export const BlockFormatDropDown = React.memo(function BlockFormatDropDown() {
  const [editor] = useLexicalComposerContext();
  const { state: toolbarState } = useToolbar();
  const { blockType } = toolbarState;

  const formatHeading = (headingSize: "h1" | "h2" | "h3" | "h4") => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      });
    }
  };

  const formatParagraph = () => {
    if (blockType !== "paragraph") {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createParagraphNode());
      });
    }
  };

  const Icon =
    blockType === "h1"
      ? Heading1
      : blockType === "h2"
        ? Heading2
        : blockType === "h3"
          ? Heading3
          : blockType === "h4"
            ? Heading4
            : Heading;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        render={
          <ToolbarButton
            disablePressAnimation
            icon={Icon}
            variant={["h1", "h2", "h3", "h4"].includes(blockType) ? "secondary" : "ghost"}
          />
        }
      />
      <DropdownMenuContent align="start" side="bottom" sideOffset={8} className="w-40">
        {[
          {
            key: "heading 1",
            icon: Heading1,
            format: "h1",
            state: blockType === "h1",
            onClick: () => formatHeading("h1"),
          },
          {
            key: "heading 2",
            icon: Heading2,
            format: "h2",
            state: blockType === "h2",
            onClick: () => formatHeading("h2"),
          },
          {
            key: "heading 3",
            icon: Heading3,
            format: "h3",
            state: blockType === "h3",
            onClick: () => formatHeading("h3"),
          },
          {
            key: "heading 4",
            icon: Heading4,
            format: "h4",
            state: blockType === "h4",
            onClick: () => formatHeading("h4"),
          },
          {
            key: "paragraph",
            icon: Heading,
            format: "p",
            state: blockType === "paragraph",
            onClick: formatParagraph,
          },
        ].map(({ key, icon: ItemIcon, state, onClick }) => (
          <DropdownMenuItem className="gap-2.5" closeOnClick key={key} onClick={onClick}>
            <ItemIcon className="size-4" />
            <span className="flex-1 capitalize text-sm text-muted-foreground">{key}</span>
            {state ? <Check className="ms-auto size-4" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
