"use client";

import React from "react";
import { $getSelectionStyleValueForProperty, $patchStyleText } from "@lexical/selection";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { mergeRegister } from "@lexical/utils";
import { Highlighter, Check } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@lana/ui";
import { HIGHLIGHT_COLORS } from "../../../lib/colors";
import { ToolbarButton } from "./toolbar-button";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
export const HighlightPicker = React.memo(function HighlightPicker({
  disabled = false,
}: {
  disabled?: boolean;
}) {
  const [editor] = useLexicalComposerContext();
  const [color, setColor] = useState("");

  const applyColor = useCallback(
    (newColor: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, { "background-color": newColor });
        }
      });
    },
    [editor],
  );

  const updateColor = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const nextColor = $getSelectionStyleValueForProperty(selection, "background-color", "");
      setColor((currentColor) => (currentColor === nextColor ? currentColor : nextColor));
    }
  }, []);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateColor();
    });
  }, [editor, updateColor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateColor();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateColor();
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    );
  }, [editor, updateColor]);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        render={
          <ToolbarButton
            disablePressAnimation
            disabled={disabled}
            title="Highlight"
            isActive={!!color && color !== "transparent"}
          >
            <Highlighter className="size-4" style={{ color: color || undefined }} />
          </ToolbarButton>
        }
      />
      <DropdownMenuContent align="start" side="bottom" sideOffset={8} className="min-w-[150px]">
        {HIGHLIGHT_COLORS.map((c) => {
          const isActive = color === c.value;

          return (
            <DropdownMenuItem
              className="flex items-center justify-between"
              closeOnClick
              key={c.name}
              onClick={() => applyColor(c.value)}
            >
              <div className="flex items-center gap-3">
                <div
                  className="size-4 rounded-sm border shadow-sm"
                  style={{ backgroundColor: c.value }}
                />
                <span className="text-sm">{c.name}</span>
              </div>
              {isActive && <Check className="size-4" />}
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center" closeOnClick onClick={() => applyColor("")}>
          Remove Highlight
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
