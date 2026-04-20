import { $getSelectionStyleValueForProperty, $patchStyleText } from "@lexical/selection";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  type LexicalEditor,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
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

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        editor.read(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            setColor($getSelectionStyleValueForProperty(selection, "background-color", ""));
          }
        });
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor]);

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
