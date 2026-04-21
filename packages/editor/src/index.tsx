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
import type React from "react";
import { useMemo, useRef, useState } from "react";
import { cn } from "@lana/utils";
import { EDITOR_CONFIG } from "./lib/configs";
import type { EditorProps } from "./lib/types/editor";
import { FloatingToolbar } from "./plugins/floating-toolbar";
import SlashCommandPlugin from "./plugins/slash-command";
import { FloatingLinkEditorPlugin } from "./plugins/floating-link-editor";
import TableHoverActionsPlugin from "./plugins/table-hover-actions";
import SpeechToTextPlugin from "./plugins/speech-to-text";
import { Toolbar } from "./plugins/toolbar";
import { debounce } from "./lib/debounce";
import EquationsPlugin from "./plugins/equations";
import ExcalidrawPlugin from "./plugins/excalidraw";
import DraggableBlockPlugin from "./plugins/draggable-block";
import { LayoutPlugin } from "./plugins/layout";

function EditorContent({
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
    <div className="relative w-full">
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            className={cn(
              "pl-12 pr-6 py-6 md:pr-8 md:py-8",
              "outline-none",
              "max-w-none",
              "w-full",
              "min-h-[inherit]",
              "will-change-auto",
              "cursor-text",
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
          <div className="absolute top-6 md:top-8 left-12 text-muted-foreground/60 pointer-events-none select-none text-base md:text-lg leading-relaxed">
            {placeholder}
          </div>
        }
      />
    </div>
  );
}

function EditorPlugins({
  showFloatingToolbar = true,
  enableSpeechToText = false,
  customPlugins = [],
  anchorElem = document.body,
  onChange,
}: {
  showFloatingToolbar?: boolean;
  enableSpeechToText?: boolean;
  customPlugins?: React.ComponentType[];
  anchorElem?: HTMLElement;
  onChange: (editorState: EditorState, editor: LexicalEditor, tags: Set<string>) => void;
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
      <SlashCommandPlugin anchorElem={anchorElem} />
      <EquationsPlugin />
      <ExcalidrawPlugin />
      <LayoutPlugin />
      <DraggableBlockPlugin anchorElem={anchorElem} />
      {enableSpeechToText && <SpeechToTextPlugin anchorElem={anchorElem} />}
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      <OnChangePlugin onChange={onChange} />
      {showFloatingToolbar && anchorElem && (
        <>
          <FloatingToolbar anchorElem={anchorElem} />
          <FloatingLinkEditorPlugin anchorElem={anchorElem} />
        </>
      )}
      {pluginElements}
    </>
  );
}

export function Editor({
  initialValue = "",
  placeholder = 'Start writing or use "/" for quick commands',
  className = "",
  minHeight = "400px",
  maxHeight,
  showToolbar = false,
  showFloatingToolbar = true,
  enableSpeechToText = false,
  readOnly = false,
  onChange,
  plugins = [],
}: EditorProps) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

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

    // When no initial state is provided, ensure the editor starts with
    // a paragraph node so toolbar actions work immediately on first click.
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

  const handleEditorChange = useMemo(
    () =>
      debounce((editorState: EditorState) => {
        const jsonState = editorState.toJSON();
        const jsonString = JSON.stringify(jsonState);
        onChangeRef.current?.(jsonString);
      }, 300),
    [],
  );

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div
        className={cn("relative overflow-hidden w-full flex flex-col h-full", className)}
        ref={onRef}
      >
        <div className={cn(showToolbar && "order-last md:order-first")}>
          {showToolbar && <Toolbar enableSpeechToText={enableSpeechToText} />}
        </div>

        <div className="flex-1 w-full overflow-y-auto order-first md:order-none">
          <EditorContent
            maxHeight={maxHeight}
            minHeight={minHeight}
            placeholder={placeholder}
            readOnly={readOnly}
            className={className}
          />
        </div>

        <EditorPlugins
          customPlugins={plugins}
          onChange={handleEditorChange}
          showFloatingToolbar={showFloatingToolbar}
          enableSpeechToText={enableSpeechToText}
          anchorElem={floatingAnchorElem || undefined}
        />
      </div>
    </LexicalComposer>
  );
}
