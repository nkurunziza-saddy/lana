import type { ReactNode } from "react";
import { cn } from "@andi/ui";

interface RowProps {
  children: ReactNode;
  cols?: "2" | "3" | "3-1" | "1-3" | "1-2-1" | (string & {});
  className?: string;
}

const colMap: Record<string, string> = {
  "2": "1fr 1fr",
  "3": "1fr 1fr 1fr",
  "3-1": "2fr 1fr",
  "1-3": "1fr 2fr",
  "1-2-1": "1fr 2fr 1fr",
};

export function Row({ children, cols = "3", className }: RowProps) {
  return (
    <div
      className={cn("grid", className)}
      style={{
        display: "grid",
        gridTemplateColumns: colMap[cols] ?? cols,
      }}
    >
      {children}
    </div>
  );
}
