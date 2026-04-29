"use client";

import { cn } from "@lana/utils";
import type { SlashCommand } from "./slash-command-items";

interface SlashCommandDropdownMenuItemProps {
  command: SlashCommand;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
}

export function SlashCommandDropdownMenuItem({
  command,
  isSelected,
  onClick,
  onMouseEnter,
}: SlashCommandDropdownMenuItemProps) {
  const Icon = command.icon;
  return (
    <li className="flex items-center group rounded-md" tabIndex={-1}>
      <button
        className={cn(
          "flex items-center group gap-3 p-1.5 rounded-md cursor-pointer transition-colors",
          "w-full appearance-none outline-none",
          isSelected ? "bg-accent text-accent-foreground" : "hover:bg-muted/50",
        )}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        type="button"
      >
        <Icon className="size-4 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
        <span className="text-xs font-medium truncate">{command.title}</span>
      </button>
    </li>
  );
}
