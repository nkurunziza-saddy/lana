import type { Klass, LexicalNode, LexicalCommand, LexicalEditor } from "lexical";
import type React from "react";

export interface ToolbarContribution {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  section: "insert" | "format" | "action";
  onClick: (editor: LexicalEditor) => void;
}

export interface EditorPlugin {
  /** Unique plugin identifier */
  id: string;

  /** Human-readable name */
  name: string;

  /** Lexical nodes this plugin registers */
  nodes?: Klass<LexicalNode>[];

  /** Commands this plugin handles */
  commands?: {
    command: LexicalCommand<any>;
    handler: (payload: any, editor: LexicalEditor) => boolean;
  }[];

  /** Toolbar items contributed by this plugin */
  toolbarItems?: ToolbarContribution[];

  /** Called when plugin is first activated (lazy loading happens here) */
  load?: () => Promise<void>;

  /** Cleanup */
  destroy?: () => void;
}
