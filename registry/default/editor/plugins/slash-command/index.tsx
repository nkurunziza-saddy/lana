/* oxlint-disable */
// @ts-nocheck
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import type { TextNode } from "lexical";
import { useCallback, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { SLASH_COMMANDS, type SlashCommand } from "./slash-command-items";
import { SlashCommandDropdownMenuItem } from "./slash-command-menu-item";

class SlashCommandOption extends MenuOption {
  command: SlashCommand;

  constructor(command: SlashCommand) {
    super(command.title);
    this.command = command;
  }
}

export default function SlashCommandPlugin({
  commands = SLASH_COMMANDS,
}: {
  commands?: SlashCommand[];
}) {
  const [editor] = useLexicalComposerContext();
  const [query, setQuery] = useState<string | null>(null);

  const triggerFn = useBasicTypeaheadTriggerMatch("/", { minLength: 0 });

  const options = useMemo(() => {
    const filteredCommands = query
      ? commands.filter(
          (cmd) =>
            cmd.title.toLowerCase().includes(query.toLowerCase()) ||
            cmd.keywords.some((keyword) => keyword.toLowerCase().includes(query.toLowerCase())),
        )
      : commands;

    return filteredCommands.map((cmd) => new SlashCommandOption(cmd));
  }, [query, commands]);

  const onSelectOption = useCallback(
    (option: SlashCommandOption, nodeToRemove: TextNode | null, closeMenu: () => void) => {
      editor.update(() => {
        nodeToRemove?.remove();
        option.command.action(editor);
        closeMenu();
      });
    },
    [editor],
  );

  return (
    <LexicalTypeaheadMenuPlugin
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
      ) => {
        const anchorElement = anchorElementRef.current;

        if (!anchorElement || options.length === 0) {
          return null;
        }

        return createPortal(
          <div
            className="absolute z-50 w-44 max-h-(--available-height) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-md animate-in fade-in zoom-in-95 slide-in-from-top-1 duration-150"
            style={{
              top: anchorElement.offsetHeight - 4,
              left: 0,
            }}
          >
            {options.map((option, i) => (
              <SlashCommandDropdownMenuItem
                command={option.command}
                isSelected={selectedIndex === i}
                key={option.key}
                onClick={() => {
                  setHighlightedIndex(i);
                  selectOptionAndCleanUp(option);
                }}
                onMouseEnter={() => {
                  setHighlightedIndex(i);
                }}
              />
            ))}
          </div>,
          anchorElement,
        );
      }}
      onQueryChange={setQuery}
      onSelectOption={onSelectOption}
      options={options}
      triggerFn={triggerFn}
    />
  );
}
