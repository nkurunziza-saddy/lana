import type { ReactNode, CSSProperties } from "react";
import { cn } from "@andi/ui";

interface CellProps {
  children?: ReactNode;
  span?: number; // grid-column: span N
  className?: string;
  style?: CSSProperties;
  noBorderRight?: boolean;
}

export function Cell({ children, span, className, style, noBorderRight }: CellProps) {
  return (
    <div
      className={cn("cell", className)}
      style={{
        gridColumn: span ? `span ${span}` : undefined,
        borderRight: noBorderRight ? "none" : "var(--border-grid)",
        borderBottom: "var(--border-grid)",
        padding: "28px 32px",
        position: "relative",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
