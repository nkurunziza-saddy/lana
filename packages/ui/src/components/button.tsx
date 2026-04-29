import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@lana/ui/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[calc(var(--radius)-1px)] border border-transparent bg-clip-padding text-[0.8125rem]/[1.2] font-semibold tracking-[-0.01em] whitespace-nowrap transition-[color,background-color,border-color,box-shadow,transform] outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/14 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/30 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_8px_20px_rgb(0_117_222_/_0.12)] hover:bg-[color-mix(in_oklab,var(--primary)_92%,black)]",
        outline:
          "border-border bg-card text-foreground hover:bg-muted/65 hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:bg-input/30",
        secondary:
          "border-border/70 bg-secondary text-secondary-foreground hover:bg-secondary/90 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "shadow-none hover:bg-muted/75 hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive text-white shadow-[0_10px_24px_rgb(210_61_52_/_0.14)] hover:bg-[color-mix(in_oklab,var(--destructive)_90%,black)] focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:hover:bg-destructive/90 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-9 gap-1.5 px-3 has-data-[icon=inline-end]:pe-2.5 has-data-[icon=inline-start]:ps-2.5 [&_svg:not([class*='size-'])]:size-3.5",
        xs: "h-6 gap-1 rounded-[calc(var(--radius)-3px)] px-2 text-[0.6875rem] has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&_svg:not([class*='size-'])]:size-2.5",
        sm: "h-8 gap-1.5 px-2.5 text-[0.75rem]/[1.2] has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2 [&_svg:not([class*='size-'])]:size-3",
        lg: "h-10 gap-1.5 px-4 text-[0.875rem]/[1.2] has-data-[icon=inline-end]:pe-3 has-data-[icon=inline-start]:ps-3 [&_svg:not([class*='size-'])]:size-4",
        icon: "size-9 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-xs":
          "size-6 rounded-[calc(var(--radius)-3px)] [&_svg:not([class*='size-'])]:size-2.5",
        "icon-sm": "size-8 [&_svg:not([class*='size-'])]:size-3",
        "icon-lg": "size-10 [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
