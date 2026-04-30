/* oxlint-disable */
"use client";

import { TRANSFORMERS } from "@lexical/markdown";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { $createParagraphNode, $getRoot, type EditorState, type LexicalEditor } from "lexical";
import * as React from "react";
import { useMemo, useState, memo } from "react";

import { cn } from "@/lib/utils";
import { EDITOR_CONFIG } from "./lib/configs";
import type { EditorProps } from "./lib/types/editor";
import { FloatingToolbar } from "./plugins/floating-toolbar";
import SlashCommandPlugin from "./plugins/slash-command";
import { FloatingLinkEditorPlugin } from "./plugins/floating-link-editor";
import TableHoverActionsPlugin from "./plugins/table-hover-actions";
import SpeechToTextPlugin from "./plugins/speech-to-text";
import { Toolbar } from "./plugins/toolbar";
import EquationsPlugin from "./plugins/equations";
import ExcalidrawPlugin from "./plugins/excalidraw";
import DraggableBlockPlugin from "./plugins/draggable-block";
import { LayoutPlugin } from "./plugins/layout";
import { type SlashCommand } from "./plugins/slash-command/slash-command-items";
import AutosavePlugin from "./plugins/autosave";

export * from "./plugin-system";
export { EquationsPluginDef } from "./plugins/equations";
export { ExcalidrawPluginDef } from "./plugins/excalidraw";

export const EditorContent = memo(function EditorContent({
  placeholder = "Start writing ...",
  className = "",
  minHeight = "400px",
  maxHeight,
  readOnly = false,
}: Pick<EditorProps, "placeholder" | "className" | "minHeight" | "maxHeight" | "readOnly">) {
  const editorStyle = useMemo(
    () => ({
      minHeight,
      maxHeight,
      caretColor: "hsl(var(--editor-primary))",
    }),
    [minHeight, maxHeight],
  );

  return (
    <div className="relative w-full animate-in fade-in duration-200">
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            className={cn(
              "ps-14 pe-7 py-8 md:pe-9 md:py-9",
              "outline-none",
              "max-w-none",
              "w-full",
              "min-h-[inherit]",
              "will-change-auto",
              "cursor-text",
              "text-[0.98rem] leading-7 tracking-[-0.01em] transition-colors duration-100",
              className,
            )}
            readOnly={readOnly}
            style={editorStyle}
            aria-label="Rich text editor"
            aria-multiline="true"
            role="textbox"
          />
        }
        ErrorBoundary={LexicalErrorBoundary}
        placeholder={
          <div className="pointer-events-none absolute top-8 start-14 select-none text-[0.98rem] leading-7 text-muted-foreground/38 animate-in fade-in duration-300 md:top-9">
            {placeholder}
          </div>
        }
      />
    </div>
  );
});

export const EditorPlugins = memo(function EditorPlugins({
  showFloatingToolbar = true,
  enableSpeechToText = false,
  customPlugins = [],
  slashCommands,
  anchorElem = typeof document !== "undefined" ? document.body : undefined,
  onChange,
  onSave,
  children,
}: {
  showFloatingToolbar?: boolean;
  enableSpeechToText?: boolean;
  customPlugins?: React.ComponentType[];
  slashCommands?: SlashCommand[];
  anchorElem?: HTMLElement;
  onChange?: (editorState: EditorState, editor: LexicalEditor, tags: Set<string>) => void;
  onSave?: (editorStateString: string) => void;
  children?: React.ReactNode;
}) {
  const pluginElements = useMemo(
    () => customPlugins.map((Plugin, index) => <Plugin key={index} />),
    [customPlugins],
  );

  return (
    <>
      <HistoryPlugin />
      <AutoFocusPlugin />
      <ListPlugin />
      <CheckListPlugin />
      <LinkPlugin />
      <ClickableLinkPlugin newTab={true} />
      <HorizontalRulePlugin />
      {/* table plugins - order matters */}
      <TablePlugin hasCellBackgroundColor={true} hasCellMerge={true} hasTabHandler={true} />
      <TableHoverActionsPlugin anchorElem={anchorElem} />
      <SlashCommandPlugin commands={slashCommands} />
      <EquationsPlugin />
      <ExcalidrawPlugin />
      <LayoutPlugin />
      <DraggableBlockPlugin anchorElem={anchorElem} />
      {enableSpeechToText && <SpeechToTextPlugin anchorElem={anchorElem} />}
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      {onSave && <AutosavePlugin onSave={onSave} />}
      {onChange && <OnChangePlugin onChange={onChange} />}
      {showFloatingToolbar && anchorElem && (
        <>
          <FloatingToolbar anchorElem={anchorElem} />
          <FloatingLinkEditorPlugin anchorElem={anchorElem} />
        </>
      )}
      {pluginElements}
      {children}
    </>
  );
});

export function Editor({
  children,
  initialValue = "",
  readOnly = false,
  className = "",
}: {
  children: React.ReactNode;
  initialValue?: string;
  readOnly?: boolean;
  className?: string;
}) {
  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);

  const onRef = (floatingAnchorElem: HTMLDivElement) => {
    if (floatingAnchorElem !== null) {
      setFloatingAnchorElem(floatingAnchorElem);
    }
  };

  const initialConfig = useMemo(() => {
    let editorState: string | (() => void) | null = null;
    if (initialValue && typeof initialValue === "string" && initialValue.trim() !== "") {
      try {
        const parsed = JSON.parse(initialValue);
        if (parsed && typeof parsed === "object" && parsed.root) {
          editorState = initialValue;
        } else {
          console.warn(
            "Parsed JSON is not a valid Lexical state (missing root), falling back to default.",
            parsed,
          );
        }
      } catch (e) {
        console.warn("Invalid initialValue JSON, falling back to default.", e);
      }
    }

    if (editorState === null) {
      editorState = () => {
        const root = $getRoot();
        if (root.getChildrenSize() === 0) {
          root.append($createParagraphNode());
        }
      };
    }

    return {
      ...EDITOR_CONFIG,
      editorState,
      editable: !readOnly,
    };
  }, [initialValue, readOnly]);

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div
        className={cn(
          "relative flex h-full w-full flex-col overflow-hidden rounded-lg border border-border bg-background transition-colors duration-150",
          className,
        )}
        ref={onRef}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            // Only pass anchorElem to React components, not DOM elements
            if (typeof child.type !== "string") {
              return React.cloneElement(child as React.ReactElement<any>, {
                anchorElem: floatingAnchorElem || undefined,
              });
            }
          }
          return child;
        })}
      </div>
    </LexicalComposer>
  );
}

export const EditorToolbar = Toolbar;
