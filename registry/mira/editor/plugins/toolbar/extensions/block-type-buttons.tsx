/* oxlint-disable */
// @ts-nocheck
import React from "react";
import { $createCodeNode } from "@lexical/code";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createQuoteNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $createParagraphNode, $getSelection, $isRangeSelection } from "lexical";
import { BLOCK_FORMAT_ITEMS } from "../toolbar-items";
import { ToolbarToggleButton } from "./toolbar-button";
import { useToolbar } from "../context";

const BLOCK_TYPE_ITEMS = BLOCK_FORMAT_ITEMS.filter((item) => item.format);

export const BlockTypeButtons = React.memo(function BlockTypeButtons() {
  const [editor] = useLexicalComposerContext();
  const { state: toolbarState } = useToolbar();

  const onClickHandler = (format: string) => {
    editor.update(() => {
      const selection = $getSelection();

      if (toolbarState.blockType === format) {
        $setBlocksType(selection, () => $createParagraphNode());
      } else {
        if (format === "quote") {
          $setBlocksType(selection, () => $createQuoteNode());
        } else if (format === "code") {
          if (!selection) return;
          if (!$isRangeSelection(selection) || selection.isCollapsed()) {
            $setBlocksType(selection, () => $createCodeNode());
          } else {
            const textContent = selection.getTextContent();
            const codeNode = $createCodeNode();
            selection.insertNodes([codeNode]);
            const updatedSelection = $getSelection();
            if ($isRangeSelection(updatedSelection)) {
              updatedSelection.insertRawText(textContent);
            }
          }
        }
      }
    });
  };

  return (
    <>
      {BLOCK_TYPE_ITEMS.map((item) => {
        return (
          <ToolbarToggleButton
            icon={item.icon}
            isActive={toolbarState.blockType === item.name}
            key={item.name}
            onClick={() => onClickHandler(item.format!)}
            title={item.name}
          />
        );
      })}
    </>
  );
});
