"use client";

import type { JSX } from "react";
import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $wrapNodeInElement } from "@lexical/utils";
import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
} from "lexical";
import { $createEquationNode, EquationNode } from "../../nodes/equation/equation-node";
import { INSERT_EQUATION_COMMAND, type INSERT_EQUATION_COMMAND_PAYLOAD } from "./commands";
import type { EditorPlugin } from "../../plugin-system/types";

export const EquationsPluginDef: EditorPlugin = {
  id: "equations",
  name: "Equations",
  nodes: [EquationNode],
  load: async () => {
    // Use a variable to bypass Tailwind v4 static analysis and avoid bundling KaTeX fonts
    const katexCss = "katex/dist/katex.css";
    await import(/* @vite-ignore */ katexCss);
  },
};

export default function EquationsPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([EquationNode])) {
      throw new Error("EquationsPlugins: EquationsNode not registered on editor");
    }

    return editor.registerCommand<INSERT_EQUATION_COMMAND_PAYLOAD>(
      INSERT_EQUATION_COMMAND,
      (payload) => {
        const { equation, inline } = payload;
        const equationNode = $createEquationNode(equation, inline);

        $insertNodes([equationNode]);
        if ($isRootOrShadowRoot(equationNode.getParentOrThrow())) {
          $wrapNodeInElement(equationNode, $createParagraphNode).selectEnd();
        }

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}
