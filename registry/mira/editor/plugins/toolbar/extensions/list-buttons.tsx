/* oxlint-disable */
// @ts-nocheck
import React from "react";
import { REMOVE_LIST_COMMAND } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { BLOCK_FORMAT_ITEMS } from "../toolbar-items";
import { ToolbarToggleButton } from "./toolbar-button";
import { useToolbar } from "../context";

const LIST_ITEMS = BLOCK_FORMAT_ITEMS.filter(
  (item) => item.command && ["bullet", "number", "check"].includes(item.name),
);

export const ListButtons = React.memo(function ListButtons() {
  const [editor] = useLexicalComposerContext();
  const { state: toolbarState } = useToolbar();

  return (
    <>
      {LIST_ITEMS.map((item) => {
        return (
          <ToolbarToggleButton
            icon={item.icon}
            isActive={toolbarState.blockType === item.name}
            key={item.name}
            onClick={() => {
              if (toolbarState.blockType === item.name) {
                editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
              } else {
                editor.dispatchCommand(item.command!, undefined);
              }
            }}
            title={item.name}
          />
        );
      })}
    </>
  );
});
