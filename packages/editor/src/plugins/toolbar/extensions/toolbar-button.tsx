import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@lana/utils";
import { Button, Toggle } from "@lana/ui";

// Shared token — change here to resize both button types together
const BTN_SIZE = "size-8" as const;
const ICON_SIZE = "size-4" as const;

interface ToggleProps {
  onClick: () => void;
  isActive: boolean;
  icon: LucideIcon;
  title: string;
  disabled?: boolean;
}

export function ToolbarToggleButton({
  onClick,
  isActive,
  icon: Icon,
  title,
  disabled,
}: ToggleProps) {
  return (
    <Toggle
      className={BTN_SIZE}
      disabled={disabled}
      onMouseDown={(e: React.MouseEvent) => e.preventDefault()}
      onPressedChange={onClick}
      pressed={isActive}
      size="sm"
      title={title}
    >
      <Icon className={ICON_SIZE} />
    </Toggle>
  );
}

type ToolbarButtonProps = React.ComponentProps<typeof Button> & {
  isActive?: boolean;
  icon?: LucideIcon;
  children?: React.ReactNode;
};

export const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, isActive = false, children, icon: Icon, variant, ...props }, ref) => {
    return (
      <Button
        className={cn(BTN_SIZE, "px-0 shrink-0", className)}
        ref={ref}
        size="sm"
        variant={variant ?? (isActive ? "secondary" : "ghost")}
        {...props}
        onMouseDown={(e) => {
          e.preventDefault();
          props.onMouseDown?.(e);
        }}
      >
        {children}
        {Icon && <Icon className={ICON_SIZE} />}
      </Button>
    );
  },
);

ToolbarButton.displayName = "ToolbarButton";
