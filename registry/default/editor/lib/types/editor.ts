/* oxlint-disable */
// @ts-nocheck
import type { EditorState, LexicalEditor } from "lexical";
import type React from "react";
import { type SlashCommand } from "../../plugins/slash-command/slash-command-items";

export interface EditorProps {
  initialValue?: string;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  maxHeight?: string;
  showToolbar?: boolean;
  showFloatingToolbar?: boolean;
  enableSpeechToText?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  onChange?: (value: string) => void;
  onSave?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  plugins?: React.ComponentType[];
  slashCommands?: SlashCommand[];
  theme?: Record<string, string>;
}

export interface EditorComponent extends React.FC<EditorProps> {
  Root: React.FC<{
    children: React.ReactNode;
    initialValue?: string;
    readOnly?: boolean;
    className?: string;
  }>;
  Content: React.FC<
    Pick<EditorProps, "placeholder" | "className" | "minHeight" | "maxHeight" | "readOnly">
  >;
  Plugins: React.FC<{
    showFloatingToolbar?: boolean;
    enableSpeechToText?: boolean;
    customPlugins?: React.ComponentType[];
    slashCommands?: SlashCommand[];
    anchorElem?: HTMLElement;
    onChange?: (editorState: EditorState, editor: LexicalEditor, tags: Set<string>) => void;
    children?: React.ReactNode;
  }>;
  Toolbar: any; // Will be typed in toolbar index
}
