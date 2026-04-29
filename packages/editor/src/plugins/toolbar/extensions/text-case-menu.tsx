import React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND } from "lexical";
import { CaseLower, CaseUpper, type LucideIcon } from "lucide-react";
import { useCallback } from "react";
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from "@lana/ui";
import { ToolbarButton } from "./toolbar-button";
import { useToolbar } from "../context";

interface TextCaseOption {
  name: string;
  icon: LucideIcon;
  format: "capitalize" | "uppercase" | "lowercase";
}

const TEXT_CASE_OPTIONS: TextCaseOption[] = [
  { name: "Capitalize", icon: CaseUpper, format: "capitalize" },
  { name: "Uppercase", icon: CaseUpper, format: "uppercase" },
  { name: "Lowercase", icon: CaseLower, format: "lowercase" },
];

export const TextCaseMenu = React.memo(function TextCaseMenu() {
  const [editor] = useLexicalComposerContext();
  const { state: toolbarState } = useToolbar();

  const handleCaseChange = useCallback(
    (format: "capitalize" | "uppercase" | "lowercase") => {
      if (toolbarState.isCapitalized && format !== "capitalize") {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "capitalize");
      }
      if (toolbarState.isUppercase && format !== "uppercase") {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "uppercase");
      }
      if (toolbarState.isLowercase && format !== "lowercase") {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "lowercase");
      }
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
    },
    [editor, toolbarState.isCapitalized, toolbarState.isUppercase, toolbarState.isLowercase],
  );

  const isActive =
    toolbarState.isCapitalized || toolbarState.isUppercase || toolbarState.isLowercase;

  const activeFormat = toolbarState.isCapitalized
    ? "capitalize"
    : toolbarState.isUppercase
      ? "uppercase"
      : toolbarState.isLowercase
        ? "lowercase"
        : null;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        render={
          <ToolbarButton
            disablePressAnimation
            icon={CaseUpper}
            isActive={isActive}
            title="Text Case"
          />
        }
      />
      <DropdownMenuContent className="w-32" side="bottom" sideOffset={8}>
        {TEXT_CASE_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.format}
            onClick={() => handleCaseChange(option.format)}
            closeOnClick
            className={activeFormat === option.format ? "bg-accent" : ""}
          >
            <option.icon className="size-4" />
            <span>{option.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
