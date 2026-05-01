import type { ReactNode } from "react";
import { Page } from "./grid";
import { Nav } from "./navigation";
import { Ticker } from "./ticker";
import React from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background p-4 md:p-10">
      <Page>
        <Nav />
        <Ticker
          items={[
            "Responsive by default",
            "Dark mode ready",
            "Accessible",
            "TypeScript first",
            "Zero dependencies",
            "MIT licensed",
            "React 19",
            "Radix UI",
            "Tailwind v4",
          ]}
        />
        {children}
        <footer className="grid grid-cols-1 md:grid-cols-3">
          <div
            className="px-8 py-4.5 text-[11px] text-muted-foreground border-b border-grid md:border-b-0 border-r border-grid"
            style={{ fontFamily: "var(--ff-mono)" }}
          >
            © 2026 andi/editor
          </div>
          <div
            className="flex gap-5 px-8 py-4.5 text-[11px] text-muted-foreground border-b border-grid md:border-b-0 border-r border-grid"
            style={{ fontFamily: "var(--ff-mono)" }}
          >
            <a href="#" className="hover:text-foreground">
              twitter
            </a>
            <a href="#" className="hover:text-foreground">
              github
            </a>
            <a href="#" className="hover:text-foreground">
              discord
            </a>
          </div>
          <div
            className="px-8 py-4.5 text-[11px] text-muted-foreground md:text-right"
            style={{ fontFamily: "var(--ff-mono)" }}
          >
            built with precision
          </div>
        </footer>
      </Page>
    </div>
  );
}

export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = React.useState(false);

  const copy = () => {
    void navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between border border-grid bg-muted/30 px-3 py-2 transition-colors hover:bg-muted/50">
      <code className="text-[11px] text-muted-foreground" style={{ fontFamily: "var(--ff-mono)" }}>
        {command}
      </code>
      <button
        onClick={copy}
        className="text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
        style={{ fontFamily: "var(--ff-mono)" }}
      >
        {copied ? "copied" : "copy"}
      </button>
    </div>
  );
}
