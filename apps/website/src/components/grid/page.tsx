import type { ReactNode } from "react";
import { Cross } from "./cross";

export function Page({ children }: { children: ReactNode }) {
  return (
    <div
      className="bg-background text-foreground"
      style={{
        position: "relative",
        border: "var(--border-grid)",
        fontFamily: "var(--ff-sans)",
        margin: "20px",
      }}
    >
      <Cross corner="tl" />
      <Cross corner="tr" />
      <Cross corner="bl" />
      <Cross corner="br" />
      {children}
    </div>
  );
}
