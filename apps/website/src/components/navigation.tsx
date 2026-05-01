import { useTheme } from "next-themes";
import React from "react";
import { Link } from "@tanstack/react-router";

export function Nav() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <nav
      className="flex items-center justify-between px-8 py-4"
      style={{ borderBottom: "var(--border-grid)" }}
    >
      <Link
        to="/"
        className="text-[13px] font-medium tracking-[-0.02em]"
        style={{ fontFamily: "var(--ff-mono)" }}
      >
        andi<span className="opacity-40">/</span>editor
      </Link>
      <div className="hidden gap-7 md:flex">
        <Link
          to="/"
          className="text-[12px] tracking-[0.04em] text-muted-foreground hover:text-foreground [&.active]:text-foreground"
          style={{ fontFamily: "var(--ff-mono)" }}
        >
          editor
        </Link>
        <Link
          to="/docs"
          className="text-[12px] tracking-[0.04em] text-muted-foreground hover:text-foreground [&.active]:text-foreground"
          style={{ fontFamily: "var(--ff-mono)" }}
        >
          documentation
        </Link>
        <a
          href="#"
          className="text-[12px] tracking-[0.04em] text-muted-foreground hover:text-foreground"
          style={{ fontFamily: "var(--ff-mono)" }}
        >
          registry
        </a>
        <a
          href="#"
          className="text-[12px] tracking-[0.04em] text-muted-foreground hover:text-foreground"
          style={{ fontFamily: "var(--ff-mono)" }}
        >
          github
        </a>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            React.startTransition(() => {
              setTheme(isDark ? "light" : "dark");
            });
          }}
          className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground hover:text-foreground"
          style={{ fontFamily: "var(--ff-mono)" }}
        >
          {isDark ? "Light" : "Dark"}
        </button>
        <button
          className="bg-none px-[18px] py-2 text-[12px] tracking-[0.04em] text-foreground hover:bg-muted"
          style={{
            fontFamily: "var(--ff-mono)",
            border: "var(--border-grid)",
          }}
        >
          get access →
        </button>
      </div>
    </nav>
  );
}
