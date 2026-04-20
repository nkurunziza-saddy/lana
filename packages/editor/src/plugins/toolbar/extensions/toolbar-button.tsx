import type { VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@lana/utils";
import { Button, buttonVariants, Toggle } from "@lana/ui";

interface ToggleProps {
  onClick: () => void;
  isActive: boolean;
  icon: LucideIcon;
  title: string;
}

export function ToolbarToggleButton({ onClick, isActive, icon: Icon, title }: ToggleProps) {
  return (
    <Toggle
      onMouseDown={(e: React.MouseEvent) => e.preventDefault()}
      onPressedChange={onClick}
      pressed={isActive}
      size="sm"
      title={title}
    >
      <Icon className="size-4" />
    </Toggle>
  );
}

type ToolbarButtonProps = React.ComponentProps<typeof Button> &
  Partial<VariantProps<typeof buttonVariants>> & {
    isActive?: boolean;
    icon?: LucideIcon;
    children?: React.ReactNode;
  };

export const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, isActive = false, children, icon: Icon, variant, size = "sm", ...props }, ref) => {
    return (
      <Button
        className={cn("h-7 w-7 px-0", className)}
        ref={ref}
        size={size as any}
        variant={variant ?? (isActive ? "secondary" : "ghost")}
        {...props}
        onMouseDown={(e) => {
          e.preventDefault();
          props.onMouseDown?.(e);
        }}
      >
        {children}
        {Icon && <Icon className="size-4" />}
      </Button>
    );
  },
);

ToolbarButton.displayName = "ToolbarButton";
