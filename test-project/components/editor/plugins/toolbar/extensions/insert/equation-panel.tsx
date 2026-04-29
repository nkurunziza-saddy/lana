"use client";

import React, { useCallback } from "react";
import KatexEquationAlterer from "../../../../components/katex-equation-editor";
import { INSERT_EQUATION_COMMAND } from "../../../equations/commands";

interface EquationPopoverContentProps {
  editor: any;
  onComplete: () => void;
}

export function EquationPopoverContent({ editor, onComplete }: EquationPopoverContentProps) {
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
