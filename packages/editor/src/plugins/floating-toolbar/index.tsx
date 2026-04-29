import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $patchStyleText } from "@lexical/selection";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  type TextFormatType,
} from "lexical";
import {
  Bold,
  Code,
  Highlighter,
  Italic,
  type LucideIcon,
  Palette,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
} from "lucide-react";
import { useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { cn } from "@lana/utils";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@lana/ui";
import { Separator } from "../../components/toolbar-separator";
import { HIGHLIGHT_COLORS } from "../../lib/colors";
import { useFloatingToolbar } from "../../lib/hooks/use-floating-toolbar";
import { ToolbarButton, ToolbarToggleButton } from "../toolbar/extensions/toolbar-button";

interface FormatItem {
  name: string;
  icon: LucideIcon;
  format: string;
  group: "basic" | "script" | "special";
}

const FORMAT_ITEMS: FormatItem[] = [
  { name: "Bold", icon: Bold, format: "bold", group: "basic" },
  { name: "Italic", icon: Italic, format: "italic", group: "basic" },
  { name: "Underline", icon: Underline, format: "underline", group: "basic" },
  {
    name: "Strikethrough",
    icon: Strikethrough,
    format: "strikethrough",
    group: "basic",
  },
  { name: "Code", icon: Code, format: "code", group: "special" },
  {
    name: "Superscript",
    icon: Superscript,
    format: "superscript",
    group: "script",
  },
  { name: "Subscript", icon: Subscript, format: "subscript", group: "script" },
];

export function FloatingToolbar({ anchorElem = document.body }: { anchorElem?: HTMLElement }) {
  const [editor] = useLexicalComposerContext();
  const { toolbarRef, isVisible, position, activeFormats, selectedText } =
    useFloatingToolbar(anchorElem);

  const formatText = useCallback(
    (format: string) => {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, format as TextFormatType);
    },
    [editor],
  );

  const formatHighlight = useCallback(
    (color: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, {
            "background-color": color || "transparent",
          });
        }
      });
    },
    [editor],
  );

  const groupedItems = useMemo(() => {
    const groups = FORMAT_ITEMS.reduce(
      (acc, item) => {
        if (!acc[item.group]) acc[item.group] = [];
        acc[item.group].push(item);
        return acc;
      },
      {} as Record<string, FormatItem[]>,
    );

    return groups;
  }, []);

  if (!isVisible) return null;

  return createPortal(
    <div
      className={cn(
        "absolute z-50 flex items-center gap-0.5 rounded-lg border border-border/70 bg-popover px-1.5 py-1.5 shadow-[var(--shadow-soft)] transition-[opacity,top,left] duration-100 ease-out will-change-[opacity,top,left]",
      )}
      ref={toolbarRef}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        opacity: position.opacity,
        pointerEvents: position.opacity > 0 ? "auto" : "none",
      }}
    >
      <div className="flex items-center gap-0.5">
        {groupedItems.basic?.map((item) => (
          <ToolbarToggleButton
            icon={item.icon}
            isActive={activeFormats.has(item.format)}
            key={item.name}
            onClick={() => formatText(item.format)}
            title={item.name}
          />
        ))}
      </div>

      <Separator />

      <div className="flex items-center gap-0.5">
        {groupedItems.special?.map((item) => (
          <ToolbarToggleButton
            icon={item.icon}
            isActive={activeFormats.has(item.format)}
            key={item.name}
            onClick={() => formatText(item.format)}
            title={item.name}
          />
        ))}
      </div>

      <Separator />

      <DropdownMenu>
        <DropdownMenuTrigger
          render={<ToolbarButton disablePressAnimation icon={Highlighter} title="Highlight" />}
        />
        <DropdownMenuContent
          finalFocus={false}
          align="center"
          side="bottom"
          sideOffset={8}
          className="w-48 border border-border/70 bg-popover p-2 shadow-[var(--shadow-soft)]"
        >
          <div className="grid grid-cols-4 gap-1 p-1">
            {HIGHLIGHT_COLORS.map((color) => (
              <button
                className="group relative flex items-center justify-center size-8 rounded-md hover:bg-muted transition-colors active:scale-90"
                key={color.value}
                onClick={() => formatHighlight(color.value)}
                title={color.name}
                type="button"
              >
                <div
                  className="size-5 rounded border border-border shadow-sm"
                  style={{ backgroundColor: color.value }}
                />
              </button>
            ))}
          </div>
          <DropdownMenuSeparator className="my-1 bg-border/50" />
          <DropdownMenuItem
            className="flex items-center gap-2 px-2 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground rounded focus:bg-accent"
            closeOnClick
            onClick={() => formatHighlight("")}
          >
            <Palette className="size-3.5" />
            Remove Highlight
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedText.length > 50 && (
        <>
          <Separator />
          <div className="text-[10px] font-medium text-muted-foreground/80 px-2 tabular-nums">
            {selectedText.length}
          </div>
        </>
      )}
    </div>,
    anchorElem,
  );
}
