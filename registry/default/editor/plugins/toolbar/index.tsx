/* oxlint-disable */
// @ts-nocheck
import { Mic, MicOff } from "lucide-react";
import { cn } from '@/lib/utils';
import React from "react";
import { Separator } from "../../components/toolbar-separator";
import { AlignButtons } from "./extensions/align-buttons";
import { BlockFormatDropDown } from "./extensions/block-format-dropdown";
import { BlockTypeButtons } from "./extensions/block-type-buttons";
import { ColorPicker } from "./extensions/color-picker";
import { HighlightPicker } from "./extensions/highlight-picker";
import { FileActions } from "./extensions/file-actions";
import { HistoryButtons } from "./extensions/history-buttons";
import { InsertDropDown } from "./extensions/insert-actions";
import { LinkButton } from "./extensions/link-button";
import { ListButtons } from "./extensions/list-buttons";
import { TableButtons } from "./extensions/table-buttons";
import { TextCaseMenu } from "./extensions/text-case-menu";
import { TextFormatButtons } from "./extensions/text-format-buttons";
import { ToolbarButton } from "./extensions/toolbar-button";
import { useSpeechToTextState } from "../../plugins/speech-to-text";
import { ToolbarProvider, useToolbar, type ToolbarState } from "./context";

export { ToolbarProvider, useToolbar, type ToolbarState };

export function ToolbarRoot({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 overflow-x-auto px-3 py-2 scrollbar-none transition-all duration-150",
        "md:sticky md:top-0 md:z-10 md:border-b md:border-border/45 md:bg-[color-mix(in_oklab,var(--background)_97%,white)]",
        "max-md:sticky max-md:bottom-0 max-md:z-10 max-md:border-t max-md:border-border/45 max-md:bg-[color-mix(in_oklab,var(--background)_98%,white)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function ToolbarInternal({
  enableSpeechToText = false,
  children,
}: {
  enableSpeechToText?: boolean;
  children?: React.ReactNode;
}) {
  const { state: toolbarState } = useToolbar();
  const { isListening: isSpeechToTextActive } = useSpeechToTextState();

  return (
    <ToolbarRoot>
      {children || (
        <>
          <HistoryButtons />

          <Separator />
          <BlockFormatDropDown />

          <Separator />

          <ListButtons />
          <BlockTypeButtons />

          <Separator />

          <TextFormatButtons />
          <TextCaseMenu />
          <Separator />
          <ColorPicker />
          <HighlightPicker />

          <Separator />
          <LinkButton />

          <Separator />

          <InsertDropDown />

          <Separator />

          <AlignButtons />

          {enableSpeechToText && (
            <>
              <Separator />
              <ToolbarButton
                icon={isSpeechToTextActive ? MicOff : Mic}
                isActive={isSpeechToTextActive}
                onClick={() => {
                  const event = new CustomEvent("toggle-speech-to-text");
                  window.dispatchEvent(event);
                }}
                title={isSpeechToTextActive ? "Stop Speech to Text" : "Start Speech to Text"}
              />
            </>
          )}

          {toolbarState.isTable && (
            <>
              <Separator />
              <TableButtons />
            </>
          )}

          <Separator />

          <FileActions />
        </>
      )}
    </ToolbarRoot>
  );
}

export interface ToolbarComponent extends React.FC<{
  enableSpeechToText?: boolean;
  children?: React.ReactNode;
}> {
  Root: typeof ToolbarRoot;
  History: typeof HistoryButtons;
  BlockFormat: typeof BlockFormatDropDown;
  List: typeof ListButtons;
  BlockType: typeof BlockTypeButtons;
  TextFormat: typeof TextFormatButtons;
  TextCase: typeof TextCaseMenu;
  Color: typeof ColorPicker;
  Highlight: typeof HighlightPicker;
  Link: typeof LinkButton;
  Align: typeof AlignButtons;
  File: typeof FileActions;
  Table: typeof TableButtons;
  Insert: typeof InsertDropDown;
  Separator: typeof Separator;
}

export const Toolbar = (({
  enableSpeechToText = false,
  children,
}: {
  enableSpeechToText?: boolean;
  children?: React.ReactNode;
}) => {
  return (
    <ToolbarProvider>
      <ToolbarInternal enableSpeechToText={enableSpeechToText}>{children}</ToolbarInternal>
    </ToolbarProvider>
  );
}) as ToolbarComponent;

Toolbar.Root = ToolbarRoot;
Toolbar.History = HistoryButtons;
Toolbar.BlockFormat = BlockFormatDropDown;
Toolbar.List = ListButtons;
Toolbar.BlockType = BlockTypeButtons;
Toolbar.TextFormat = TextFormatButtons;
Toolbar.TextCase = TextCaseMenu;
Toolbar.Color = ColorPicker;
Toolbar.Highlight = HighlightPicker;
Toolbar.Link = LinkButton;
Toolbar.Align = AlignButtons;
Toolbar.File = FileActions;
Toolbar.Table = TableButtons;
Toolbar.Insert = InsertDropDown;
Toolbar.Separator = Separator;
