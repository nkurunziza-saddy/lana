"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import { INSERT_TABLE_COMMAND } from "@lexical/table";
import { Popover, PopoverContent, PopoverTrigger, Button } from "@andi/ui";
import { cn } from "@andi/utils";
import { $getSelection, $isRangeSelection } from "lexical";
import {
  ChevronLeft,
  ImageIcon,
  LayoutDashboard,
  Minus,
  Pencil,
  Plus,
  Sigma,
  Table,
} from "lucide-react";
import React, { useCallback, useState } from "react";

import { $createImageNode } from "../../../nodes/image";
import { INSERT_LAYOUT_COMMAND } from "../../layout/commands";
import { ToolbarButton } from "./toolbar-button";

import { TablePopoverContent } from "./insert/table-panel";
import { ImagePopoverContent } from "./insert/image-panel";
import { LayoutPopoverContent } from "./insert/layout-panel";
import { EquationPopoverContent } from "./insert/equation-panel";
import { INSERT_EXCALIDRAW_COMMAND } from "../../excalidraw/commands";

type View = "main" | "table" | "image" | "layout" | "equation";
const INSERT_PANEL_WIDTH = "w-64";

export const InsertDropDown = React.memo(function InsertDropDown() {
  const [editor] = useLexicalComposerContext();
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<View>("main");

  const close = useCallback(() => {
    setIsOpen(false);
    setView("main");
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setView("main");
    }
  }, []);

  const handleTableSubmit = (rows: number, columns: number) => {
    const validRows = Math.max(1, Math.min(rows, 20));
    const validColumns = Math.max(1, Math.min(columns, 20));
    editor.dispatchCommand(INSERT_TABLE_COMMAND, {
      columns: validColumns.toString(),
      rows: validRows.toString(),
    });
    close();
  };

  const handleImageSubmit = (src: string, alt: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const imageNode = $createImageNode({ src, altText: alt });
        selection.insertNodes([imageNode]);
      }
    });
    close();
  };

  const handleLayoutSubmit = (template: string) => {
    editor.dispatchCommand(INSERT_LAYOUT_COMMAND, template);
    close();
  };

  const menuItems = [
    {
      label: "Divider",
      icon: Minus,
      onClick: () => {
        editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
        close();
      },
    },
    {
      label: "Table",
      icon: Table,
      onClick: () => setView("table"),
    },
    {
      label: "Image",
      icon: ImageIcon,
      onClick: () => setView("image"),
    },
    {
      label: "Columns",
      icon: LayoutDashboard,
      onClick: () => setView("layout"),
    },
    {
      label: "Equation",
      icon: Sigma,
      onClick: () => setView("equation"),
    },
    {
      label: "Drawing",
      icon: Pencil,
      onClick: () => {
        editor.dispatchCommand(INSERT_EXCALIDRAW_COMMAND, undefined);
        close();
      },
    },
  ];

  return (
    <>
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger
          render={
            <ToolbarButton disablePressAnimation icon={Plus} title="Insert" isActive={isOpen} />
          }
        />
        <PopoverContent
          align="start"
          side="bottom"
          sideOffset={8}
          finalFocus={false}
          className={cn(INSERT_PANEL_WIDTH, "border border-border bg-popover p-1 ")}
        >
          {view === "main" ? (
            <div className="flex flex-col gap-0.5 animate-in fade-in duration-100">
              {menuItems.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  size="sm"
                  className="h-8 justify-start px-2 text-xs font-normal"
                  onClick={item.onClick}
                >
                  <item.icon className="size-3.5 mr-2 text-muted-foreground" />
                  {item.label}
                </Button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col animate-in fade-in duration-100">
              <Button
                variant="ghost"
                size="sm"
                className="self-start h-7 px-1.5 text-[10px] text-muted-foreground hover:text-foreground mb-1 hover:bg-transparent"
                onClick={() => setView("main")}
              >
                <ChevronLeft className="size-3 mr-1" />
                Back
              </Button>

              <div className="flex-1">
                {view === "table" && (
                  <TablePopoverContent onSubmit={handleTableSubmit} onCancel={close} />
                )}
                {view === "image" && (
                  <ImagePopoverContent onSubmit={handleImageSubmit} onCancel={close} />
                )}
                {view === "layout" && (
                  <LayoutPopoverContent onSubmit={handleLayoutSubmit} onCancel={close} />
                )}
                {view === "equation" && (
                  <EquationPopoverContent editor={editor} onComplete={close} />
                )}
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
});
