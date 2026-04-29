import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Shared token — change here to resize both button types together
const BTN_SIZE = "size-8";
const ICON_SIZE = "size-4";

interface ToggleProps {
  onClick: (val: boolean) => void;
  isActive: boolean;
  icon: LucideIcon;
  title: string;
  disabled?: boolean;
}

export const ToolbarToggleButton = React.memo(function ToolbarToggleButton({
  onClick,
  isActive,
  icon: Icon,
  title,
  disabled,
}: ToggleProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Toggle
            className={cn(
              BTN_SIZE,
              "rounded-[7px] transition-all duration-150 ease-in-out active:scale-95",
              isActive
                ? "border-border/60 bg-accent text-foreground shadow-none"
                : "hover:bg-muted/72",
            )}
            disabled={disabled}
            onMouseDown={(e: React.MouseEvent) => e.preventDefault()}
            onPressedChange={onClick}
            pressed={isActive}
            size="sm"
            aria-label={title}
          >
            <Icon
              className={cn(
                ICON_SIZE,
                "transition-transform duration-150",
                isActive && "scale-105",
              )}
            />
          </Toggle>
        }
      />
      <TooltipContent side="top" sideOffset={10} className="animate-in fade-in duration-200">
        <p className="text-[10px] font-medium tracking-tight">{title}</p>
      </TooltipContent>
    </Tooltip>
  );
});

type ToolbarButtonProps = React.ComponentProps<typeof Button> & {
  disablePressAnimation?: boolean;
  isActive?: boolean;
  icon?: LucideIcon;
  children?: React.ReactNode;
  title?: string;
};

export const ToolbarButton = React.memo(
  React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
    (
      {
        className,
        disablePressAnimation = false,
        isActive = false,
        children,
        icon: Icon,
        variant,
        title,
        ...props
      },
      ref,
    ) => {
      const button = (
        <Button
          className={cn(
            BTN_SIZE,
            "shrink-0 rounded-[7px] px-0 transition-all duration-150 ease-in-out",
            !disablePressAnimation && "active:scale-95",
            isActive
              ? "border-border/60 bg-accent text-foreground shadow-none"
              : "hover:bg-muted/72",
            className,
          )}
          ref={ref}
          size="sm"
          variant={variant ?? (isActive ? "secondary" : "ghost")}
          {...props}
          onMouseDown={(e) => {
            e.preventDefault();
            props.onMouseDown?.(e);
          }}
          aria-label={title || (props["aria-label"] as string)}
        >
          {children}
          {Icon && (
            <Icon
              className={cn(
                ICON_SIZE,
                "transition-transform duration-150",
                isActive && "scale-105",
              )}
            />
          )}
        </Button>
      );

      if (!title) return button;

      return (
        <Tooltip>
          <TooltipTrigger render={button} />
          <TooltipContent side="top" sideOffset={10} className="animate-in fade-in duration-200">
            <p className="text-[10px] font-medium tracking-tight">{title}</p>
          </TooltipContent>
        </Tooltip>
      );
    },
  ),
);

ToolbarButton.displayName = "ToolbarButton";
