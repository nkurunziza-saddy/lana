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
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
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

export function FloatingToolbar() {
  const [editor] = useLexicalComposerContext();
  const { toolbarRef, isVisible, position, activeFormats, selectedText } = useFloatingToolbar();

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

  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (!isVisible) return null;

  return createPortal(
    <div
      className={
        isMobile
          ? // Mobile: stable full-width bar locked to bottom
            "fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-0.5 px-3 py-2 pb-safe bg-popover/97 backdrop-blur-md border-t border-border/40 shadow-2xl transition-[opacity,transform] duration-200 ease-out will-change-[opacity,transform]"
          : // Desktop: floating bubble above selection
            "fixed z-50 flex items-center gap-0.5 px-2 py-1.5 bg-popover/95 backdrop-blur-md border border-border/50 rounded-xl shadow-xl transition-[opacity,transform] duration-200 ease-out will-change-[opacity,transform]"
      }
      ref={toolbarRef}
      style={{
        ...(isMobile
          ? {}
          : {
              top: `${position.top}px`,
              left: `${position.left}px`,
            }),
        opacity: position.opacity,
        transform: `translateY(${position.opacity === 1 ? "0px" : isMobile ? "6px" : "3px"})`,
        pointerEvents: position.opacity > 0 ? "auto" : "none",
      }}
    >
      {groupedItems.basic?.map((item) => (
        <ToolbarToggleButton
          icon={item.icon}
          isActive={activeFormats.has(item.format)}
          key={item.name}
          onClick={() => formatText(item.format)}
          title={item.name}
        />
      ))}

      <Separator />

      {groupedItems.special?.map((item) => (
        <ToolbarToggleButton
          icon={item.icon}
          isActive={activeFormats.has(item.format)}
          key={item.name}
          onClick={() => formatText(item.format)}
          title={item.name}
        />
      ))}

      <Separator />

      {groupedItems.script?.map((item) => (
        <ToolbarToggleButton
          icon={item.icon}
          isActive={activeFormats.has(item.format)}
          key={item.name}
          onClick={() => formatText(item.format)}
          title={item.name}
        />
      ))}

      <Separator />

      <DropdownMenu>
        <DropdownMenuTrigger render={<ToolbarButton icon={Highlighter} title="Highlight" />} />
        <DropdownMenuContent
          align="center"
          className="w-48 animate-in slide-in-from-top-2 duration-200"
        >
          <div className="grid grid-cols-3 gap-1 p-2">
            {HIGHLIGHT_COLORS.map((color) => (
              <button
                className="flex flex-col items-center gap-1 p-2 rounded hover:bg-muted/50 transition-colors"
                key={color.value}
                onClick={() => formatHighlight(color.value)}
                title={color.name}
                type="button"
              >
                <div
                  className="w-6 h-4 rounded border border-border/50 shadow-sm"
                  style={{ backgroundColor: color.value }}
                />
                <span className="text-xs text-muted-foreground">{color.name}</span>
              </button>
            ))}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-center gap-2" onClick={() => formatHighlight("")}>
            <Palette className="size-4" />
            Remove Highlight
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedText.length > 50 && (
        <>
          <Separator />
          <div className="text-xs text-muted-foreground px-2">{selectedText.length} chars</div>
        </>
      )}
    </div>,
    document.body,
  );
}
