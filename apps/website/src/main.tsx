import React from "react";
import ReactDOM from "react-dom/client";
import { Editor } from "@lana/editor";
import "./style.css";

import { ThemeProvider, useTheme } from "next-themes";
import { Button } from "@lana/ui";

function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        React.startTransition(() => {
          setTheme(isDark ? "light" : "dark");
        });
      }}
      className="h-8 gap-2 rounded-full px-3 text-[0.72rem] tracking-[0.01em]"
    >
      {isDark ? "Switch to light" : "Switch to dark"}
    </Button>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-background px-4 py-8 text-foreground transition-colors duration-200 md:px-8 md:py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex items-start justify-between gap-4 px-1">
          <div className="flex flex-col gap-2">
            <span className="w-fit rounded-full border border-primary/10 bg-primary/6 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.14em] text-primary uppercase">
              Lana Editor
            </span>
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold tracking-[-0.06em] text-foreground md:text-5xl">
                Calm, precise writing UI.
              </h1>
              <p className="mt-3 text-[0.98rem] leading-7 text-muted-foreground md:text-lg">
                A quieter pass on the system: smaller radii, whisper borders, softer active states,
                and theme coherence across the page and editor.
              </p>
              <div className="mt-8 flex flex-col gap-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <span className="text-[0.62rem] font-bold uppercase tracking-widest text-primary/50">
                      Mira Style (Base UI)
                    </span>
                    <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2.5">
                      <code className="text-[0.78rem] font-mono text-muted-foreground select-all">
                        npx shadcn@latest add http://localhost:5173/r/mira/editor.json
                      </code>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-[0.62rem] font-bold uppercase tracking-widest text-primary/50">
                      Default Style (Radix UI)
                    </span>
                    <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2.5">
                      <code className="text-[0.78rem] font-mono text-muted-foreground select-all">
                        npx shadcn@latest add http://localhost:5173/r/default/editor.json
                      </code>
                    </div>
                  </div>
                </div>
                <p className="text-[0.8rem] text-muted-foreground/70">
                  <span className="font-semibold text-primary/80">RTL Ready:</span> Both styles use
                  logical CSS properties and support right-to-left layouts out of the box.
                </p>
              </div>
            </div>
          </div>
          <ThemeSwitch />
        </header>
        <main className="overflow-hidden rounded-[18px] border border-border/60 bg-card/92">
          <Editor
            className="min-h-[500px]"
            placeholder="Start typing your story..."
            showToolbar
            showFloatingToolbar
            enableSpeechToText
          />
        </main>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light" attribute="class" enableSystem disableTransitionOnChange>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
