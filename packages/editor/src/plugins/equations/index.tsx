import type { JSX } from "react";

import "katex/dist/katex.css";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $wrapNodeInElement } from "@lexical/utils";
import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  type LexicalEditor,
} from "lexical";
import { useCallback, useEffect } from "react";
import { $createEquationNode, EquationNode } from "../../nodes/equation/equation-node";
import KatexEquationAlterer from "../../components/katex-equation-editor";
import { INSERT_EQUATION_COMMAND, type INSERT_EQUATION_COMMAND_PAYLOAD } from "./commands";

export function InsertEquationDialog({
  activeEditor,
  onClose,
}: {
  activeEditor: LexicalEditor;
  onClose: () => void;
}): JSX.Element {
  const onEquationConfirm = useCallback(
    (equation: string, inline: boolean) => {
      activeEditor.dispatchCommand(INSERT_EQUATION_COMMAND, {
        equation,
        inline,
      });
      onClose();
    },
    [activeEditor, onClose],
  );

  return <KatexEquationAlterer onClose={onClose} onConfirm={onEquationConfirm} />;
}

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
