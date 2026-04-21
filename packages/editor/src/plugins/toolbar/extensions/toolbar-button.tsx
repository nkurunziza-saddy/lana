import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@lana/utils";
import { Button, Toggle, Tooltip, TooltipContent, TooltipTrigger } from "@lana/ui";

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
              "transition-all duration-200 ease-in-out active:scale-95",
              isActive ? "bg-secondary shadow-sm" : "hover:bg-muted/80",
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
                "transition-transform duration-200",
                isActive && "scale-110",
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
  isActive?: boolean;
  icon?: LucideIcon;
  children?: React.ReactNode;
  title?: string;
};

export const ToolbarButton = React.memo(
  React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
    ({ className, isActive = false, children, icon: Icon, variant, title, ...props }, ref) => {
      const button = (
        <Button
          className={cn(
            BTN_SIZE,
            "px-0 shrink-0 transition-all duration-200 ease-in-out active:scale-95",
            isActive ? "bg-secondary shadow-sm" : "hover:bg-muted/80",
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
                "transition-transform duration-200",
                isActive && "scale-110",
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
