import { $getSelectionStyleValueForProperty, $patchStyleText } from "@lexical/selection";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  type LexicalEditor,
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

export function HighlightPicker({
  editor,
  disabled = false,
}: {
  editor: LexicalEditor;
  disabled?: boolean;
}) {
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
      setColor($getSelectionStyleValueForProperty(selection, "background-color", ""));
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
            disabled={disabled}
            title="Highlight"
            isActive={!!color && color !== "transparent"}
          >
            <Highlighter className="size-4" style={{ color: color || undefined }} />
          </ToolbarButton>
        }
      />
      <DropdownMenuContent
        align="start"
        side="top"
        sideOffset={10}
        className="animate-in slide-in-from-top-2 duration-200 min-w-[150px]"
      >
        {HIGHLIGHT_COLORS.map((c) => {
          const isActive = color === c.value;

          return (
            <DropdownMenuItem
              className="flex items-center justify-between"
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
        <DropdownMenuItem className="flex items-center" onClick={() => applyColor("")}>
          Remove Highlight
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
