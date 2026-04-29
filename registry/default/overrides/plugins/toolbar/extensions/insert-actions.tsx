/* oxlint-disable */
// @ts-nocheck
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import {
  ImageIcon,
  LayoutDashboard,
  Minus,
  Pencil,
  Plus,
  Sigma,
  Table,
  ChevronLeft,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger, Button } from "@lana/ui";
import { ToolbarButton } from "./toolbar-button";
import React, { useState, lazy, Suspense, useCallback } from "react";
import { INSERT_TABLE_COMMAND } from "@lexical/table";
import {
  $getSelection,
  $isRangeSelection,
  $insertNodes,
  $isRootOrShadowRoot,
  $createParagraphNode,
} from "lexical";
import { $createImageNode } from "../../../nodes/image";
import { INSERT_LAYOUT_COMMAND } from "../../layout/commands";
import { $createExcalidrawNode } from "../../../nodes/excalidraw";
import { $wrapNodeInElement } from "@lexical/utils";
import type { AppState, BinaryFiles } from "@excalidraw/excalidraw/types";
import { type ExcalidrawInitialElements } from "../../../components/excalidraw-modal";
import { cn } from "@lana/utils";
import KatexEquationAlterer from "../../../components/katex-equation-editor";
import { INSERT_EQUATION_COMMAND } from "../../equations/commands";

const ExcalidrawModal = lazy(() => import("../../../components/excalidraw-modal"));

type View = "main" | "table" | "image" | "layout" | "equation";
const INSERT_PANEL_WIDTH = "w-64";

export const InsertDropDown = React.memo(function InsertDropDown() {
  const [editor] = useLexicalComposerContext();
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<View>("main");
  const [showExcalidrawModal, setShowExcalidrawModal] = useState(false);

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
      label: "Drawing",
      icon: Pencil,
      onClick: () => {
        setShowExcalidrawModal(true);
        close();
      },
    },
    {
      label: "Equation",
      icon: Sigma,
      onClick: () => setView("equation"),
    },
  ];

  return (
    <>
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <ToolbarButton disablePressAnimation icon={Plus} title="Insert" isActive={isOpen} />
        </PopoverTrigger>
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

      {showExcalidrawModal && (
        <Suspense fallback={null}>
          <ExcalidrawModal
            initialElements={[]}
            initialAppState={{} as AppState}
            initialFiles={{}}
            isShown={showExcalidrawModal}
            onDelete={() => setShowExcalidrawModal(false)}
            onClose={() => setShowExcalidrawModal(false)}
            onSave={(
              elements: ExcalidrawInitialElements,
              appState: Partial<AppState>,
              files: BinaryFiles,
            ) => {
              editor.update(() => {
                const excalidrawNode = $createExcalidrawNode();
                excalidrawNode.setData(
                  JSON.stringify({
                    appState,
                    elements,
                    files,
                  }),
                );
                $insertNodes([excalidrawNode]);
                if ($isRootOrShadowRoot(excalidrawNode.getParentOrThrow())) {
                  $wrapNodeInElement(excalidrawNode, $createParagraphNode).selectEnd();
                }
              });

              setShowExcalidrawModal(false);
            }}
            closeOnClickOutside={false}
          />
        </Suspense>
      )}
    </>
  );
});

// Internal sub-view components for cleaner code
import { Label } from "@lana/ui";
import { Input } from "@lana/ui";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@lana/ui";
import { ChevronDown, Upload } from "lucide-react";

function TablePopoverContent({
  onSubmit,
  onCancel,
}: {
  onSubmit: (r: number, c: number) => void;
  onCancel: () => void;
}) {
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);
  return (
    <div className="p-2 flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
            Rows
          </Label>
          <Input
            type="number"
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            className="h-8 text-xs focus:ring-1 focus:ring-primary/30"
          />
        </div>
        <div className="grid gap-1.5">
          <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
            Cols
          </Label>
          <Input
            type="number"
            value={columns}
            onChange={(e) => setColumns(Number(e.target.value))}
            className="h-8 text-xs focus:ring-1 focus:ring-primary/30"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" onClick={() => onSubmit(rows, columns)}>
          Insert Table
        </Button>
      </div>
    </div>
  );
}

function ImagePopoverContent({
  onSubmit,
  onCancel,
}: {
  onSubmit: (src: string, alt: string) => void;
  onCancel: () => void;
}) {
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) onSubmit(result, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-2">
      <div className="grid gap-1">
        <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
          URL
        </Label>
        <Input
          placeholder="https://..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="h-8 text-xs focus:ring-1 focus:ring-primary/30"
        />
      </div>
      <div className="grid gap-1">
        <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
          Alt Text
        </Label>
        <Input
          placeholder="Description"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          className="h-8 text-xs focus:ring-1 focus:ring-primary/30"
        />
      </div>
      <div className="flex justify-end gap-2 mt-1">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" disabled={!url} onClick={() => onSubmit(url, alt)}>
          Insert
        </Button>
      </div>
      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-[9px] uppercase">
          <span className="bg-popover px-2 text-muted-foreground tracking-tighter">Or</span>
        </div>
      </div>
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
      />
      <Button
        variant="outline"
        size="sm"
        className="w-full h-8 text-xs hover:bg-accent"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="size-3 mr-2" />
        Upload file
      </Button>
    </div>
  );
}

const LAYOUTS = [
  { label: "2 columns (equal)", value: "1fr 1fr" },
  { label: "2 columns (25/75)", value: "1fr 3fr" },
  { label: "3 columns (equal)", value: "1fr 1fr 1fr" },
  { label: "4 columns (equal)", value: "1fr 1fr 1fr 1fr" },
];

function LayoutPopoverContent({
  onSubmit,
  onCancel,
}: {
  onSubmit: (t: string) => void;
  onCancel: () => void;
}) {
  const [layout, setLayout] = useState(LAYOUTS[0].value);
  const selected = LAYOUTS.find((l) => l.value === layout);
  return (
    <div className="flex flex-col gap-4 p-2">
      <div className="grid gap-1.5">
        <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
          Layout
        </Label>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-8 w-full justify-between px-2 text-xs">
              {selected?.label}
              <ChevronDown className="size-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {LAYOUTS.map((l) => (
              <DropdownMenuItem
                key={l.value}
                onSelect={(e) => e.preventDefault()}
                onClick={() => setLayout(l.value)}
                className="text-xs"
              >
                {l.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" onClick={() => onSubmit(layout)}>
          Insert
        </Button>
      </div>
    </div>
  );
}

function EquationPopoverContent({ editor, onComplete }: { editor: any; onComplete: () => void }) {
  const onEquationConfirm = useCallback(
    (equation: string, inline: boolean) => {
      editor.dispatchCommand(INSERT_EQUATION_COMMAND, {
        equation,
        inline,
      });
      onComplete();
    },
    [editor, onComplete],
  );

  return (
    <div className="p-1">
      <KatexEquationAlterer onClose={onComplete} onConfirm={onEquationConfirm} />
    </div>
  );
}
