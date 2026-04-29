import React from "react";
import ReactDOM from "react-dom/client";
import { Editor, EditorContent, EditorToolbar, EditorPlugins } from "@lana/editor";
import "./style.css";

import { ThemeProvider } from "next-themes";
import { Row, Cell } from "./components/grid";
import {
  Tag,
  Display,
  Lead,
  MonoLabel,
  StatN,
  StatL,
  Divider,
  FeatNum,
  FeatTitle,
  FeatDesc,
  Blockquote,
} from "./components/typography";
import { Layout, CopyCommand } from "./components/layout";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

function LandingView() {
  const [view, setView] = React.useState<"toolbar" | "minimal" | "speech">("toolbar");

  return (
    <>
      <Row cols="3-1">
        <Cell className="py-16 md:py-24">
          <Tag>v0.1.0</Tag>
          <Display>
            The editor is
            <br />
            the{" "}
            <em className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/50">
              canvas.
            </em>
          </Display>
          <Lead>
            A calm, precise writing UI built on top of Lexical. Smaller radii, whisper borders, and
            theme coherence.
          </Lead>

          <div className="mb-8 max-w-sm">
            <MonoLabel>Quick Install (Mira Style)</MonoLabel>
            <div className="mt-3">
              <CopyCommand command="npx shadcn add http://localhost:5173/r/mira/editor.json" />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              className="bg-foreground px-6 py-3 text-[12px] font-medium tracking-[0.04em] text-background border border-foreground transition-all duration-300 hover:bg-foreground/90 hover:shadow-md hover:-translate-y-0.5"
              style={{ fontFamily: "var(--ff-mono)" }}
            >
              start writing
            </button>
            <button
              className="bg-background px-6 py-3 text-[12px] font-medium tracking-[0.04em] text-foreground transition-all duration-300 hover:bg-muted border border-grid hover:border-foreground/20"
              style={{ fontFamily: "var(--ff-mono)" }}
            >
              view on github
            </button>
          </div>
        </Cell>
        <Cell noBorderRight className="flex flex-col justify-between">
          <MonoLabel>01 / stats</MonoLabel>
          <div>
            <StatN>100%</StatN>
            <StatL>TypeScript</StatL>
            <Divider />
            <StatN>24+</StatN>
            <StatL>Components</StatL>
            <Divider />
            <StatN>0</StatN>
            <StatL>Bloat</StatL>
          </div>
        </Cell>
      </Row>

      <Row cols="1">
        <Cell noBorderRight className="p-0!">
          <div className="flex border-b border-grid">
            {(["toolbar", "minimal", "speech"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-8 py-3 text-[11px] uppercase tracking-[0.1em] transition-colors border-r border-grid ${
                  view === v
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                style={{ fontFamily: "var(--ff-mono)" }}
              >
                {v.replace("-", " ")}
              </button>
            ))}
          </div>
          <div className="bg-muted/30 p-4 md:p-12 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-foreground/5 blur-[120px] rounded-full pointer-events-none z-0" />

            <div className="overflow-hidden bg-card rounded-xl shadow-2xl shadow-foreground/5 relative z-10 transition-all duration-500 hover:border-foreground/20 hover:shadow-foreground/10">
              <Editor key={view}>
                {view !== "minimal" && (
                  <div className="bg-muted/20">
                    <EditorToolbar enableSpeechToText={view === "speech"} />
                  </div>
                )}
                <div className="flex-1 overflow-y-auto">
                  <EditorContent
                    className="min-h-[450px]"
                    placeholder={
                      view === "minimal"
                        ? "Focus on your writing without distractions..."
                        : "Type or use commands..."
                    }
                  />
                </div>
                <EditorPlugins showFloatingToolbar={true} enableSpeechToText={view === "speech"} />
              </Editor>
            </div>
          </div>
        </Cell>
      </Row>

      <Row cols="3">
        <Cell className="py-12 md:py-16">
          <FeatNum>02 / architecture</FeatNum>
          <FeatTitle>Lexical Core</FeatTitle>
          <Divider />
          <FeatDesc>
            Built on Meta's Lexical framework. Completely headless logic coupled with beautifully
            designed shadcn/ui components for maximum performance and accessibility.
          </FeatDesc>
        </Cell>
        <Cell className="py-12 md:py-16">
          <FeatNum>03 / extensibility</FeatNum>
          <FeatTitle>Rich Ecosystem</FeatTitle>
          <Divider />
          <FeatDesc>
            Type <code className="text-foreground bg-muted px-1 rounded">/</code> to trigger slash
            commands. Seamlessly inject KaTeX equations, Excalidraw whiteboards, and draggable
            blocks into your canvas.
          </FeatDesc>
        </Cell>
        <Cell noBorderRight className="py-12 md:py-16">
          <FeatNum>04 / ownership</FeatNum>
          <FeatTitle>100% Yours</FeatTitle>
          <Divider />
          <FeatDesc>
            Not a black-box NPM package. Installed directly into your{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">components/editor</code>{" "}
            directory. You own the code, you tweak the styling.
          </FeatDesc>
        </Cell>
      </Row>

      <Row cols="1-2-1">
        <Cell className="flex min-h-[160px] flex-col justify-end">
          <MonoLabel>05 / quote</MonoLabel>
        </Cell>
        <Cell>
          <div className="py-12">
            <Blockquote>"Calm, precise writing UI."</Blockquote>
            <p
              className="text-[11px] text-muted-foreground uppercase tracking-widest"
              style={{ fontFamily: "var(--ff-mono)" }}
            >
              — Lana Design System
            </p>
          </div>
        </Cell>
        <Cell noBorderRight className="flex items-end">
          <MonoLabel>Built with precision</MonoLabel>
        </Cell>
      </Row>
    </>
  );
}

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingView,
});

function DocsView() {
  const [styleTab, setStyleTab] = React.useState<"mira" | "default">("mira");

  return (
    <Row cols="1-3">
      <Cell className="py-16">
        <MonoLabel>API / Guide</MonoLabel>
        <div className="sticky top-10 flex flex-col gap-4">
          <a href="#setup" className="text-[12px] text-muted-foreground hover:text-foreground">
            01 / Setup
          </a>
          <a href="#props" className="text-[12px] text-muted-foreground hover:text-foreground">
            02 / Props
          </a>
          <a href="#compounds" className="text-[12px] text-muted-foreground hover:text-foreground">
            03 / Compounds
          </a>
        </div>
      </Cell>
      <Cell noBorderRight className="py-16 max-w-3xl">
        <section id="setup" className="mb-20">
          <Tag>Documentation</Tag>
          <Display>Editor API</Display>
          <Lead>
            The editor is built for composition. Build your own rich text editor using the primitive
            components.
          </Lead>
          <Divider />
          <h3 className="text-xl mb-4">Quick Setup</h3>
          <p className="text-muted-foreground text-sm mb-6">
            Lana is designed to be added to your project via shadcn/ui registry. This gives you full
            control over the source code.
          </p>

          <div className="mb-8 border border-grid bg-card overflow-hidden max-w-2xl">
            <div className="flex border-b border-grid bg-muted/30">
              <button
                onClick={() => setStyleTab("mira")}
                className={`px-4 py-2 text-[11px] uppercase tracking-wider transition-colors border-r border-grid ${
                  styleTab === "mira"
                    ? "bg-background text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                style={{ fontFamily: "var(--ff-mono)" }}
              >
                Base UI (Mira)
              </button>
              <button
                onClick={() => setStyleTab("default")}
                className={`px-4 py-2 text-[11px] uppercase tracking-wider transition-colors ${
                  styleTab === "default"
                    ? "bg-background text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                style={{ fontFamily: "var(--ff-mono)" }}
              >
                Radix UI (Default)
              </button>
            </div>

            <div className="p-6 flex flex-col gap-6">
              <div>
                <MonoLabel>01 / Namespace Setup (Recommended)</MonoLabel>
                <p className="text-sm text-muted-foreground mb-3 mt-1">
                  Add the registry to your{" "}
                  <code className="text-[11px] bg-muted px-1 py-0.5 rounded">components.json</code>{" "}
                  to enable shorter install commands:
                </p>
                <pre className="p-3 bg-muted/30 border border-grid text-[11px] font-mono text-muted-foreground overflow-x-auto rounded">
                  {`{
  "registries": {
    "@lana": "http://localhost:5173/r/{style}"
  }
}`}
                </pre>
                <p className="text-sm text-muted-foreground mt-3 mb-2">
                  Then install using the namespace:
                </p>
                <CopyCommand command="npx shadcn add @lana/editor" />
              </div>

              <div>
                <MonoLabel>02 / Direct Install</MonoLabel>
                <p className="text-sm text-muted-foreground mb-3 mt-1">
                  Or install directly using the URL for the{" "}
                  {styleTab === "mira" ? "Mira" : "Default"} style:
                </p>
                <CopyCommand
                  command={`npx shadcn add http://localhost:5173/r/${styleTab}/editor.json`}
                />
              </div>
            </div>
          </div>
        </section>

        <section id="props" className="mb-20">
          <MonoLabel>02 / Props & Components</MonoLabel>
          <div className="grid gap-8">
            <div>
              <h4 className="font-mono text-[13px] mb-2">&lt;Editor /&gt;</h4>
              <p className="text-muted-foreground text-sm mb-2">
                The root context provider and wrapper.
              </p>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>
                  <code className="text-foreground">initialValue?: string</code> — A JSON string
                  representing the Lexical editor state.
                </li>
                <li>
                  <code className="text-foreground">readOnly?: boolean</code> — Disables all editing
                  capabilities.
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-[13px] mb-2">&lt;EditorContent /&gt;</h4>
              <p className="text-muted-foreground text-sm mb-2">The editable text area canvas.</p>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>
                  <code className="text-foreground">placeholder?: string</code> — Displayed when
                  empty.
                </li>
                <li>
                  <code className="text-foreground">minHeight?: string</code> — Ensures the editor
                  doesn't shrink too small.
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-[13px] mb-2">&lt;EditorPlugins /&gt;</h4>
              <p className="text-muted-foreground text-sm mb-2">
                Injects rich-text features (Slash Commands, Drag & Drop, Equations, etc).
              </p>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>
                  <code className="text-foreground">onChange?: (json: string) =&gt; void</code> —
                  Fires on every editor state change (debounced).
                </li>
                <li>
                  <code className="text-foreground">onSave?: (json: string) =&gt; void</code> —
                  Triggered when the user hits Cmd+S or the save button.
                </li>
                <li>
                  <code className="text-foreground">showFloatingToolbar?: boolean</code> — Enables
                  the highlight context menu.
                </li>
                <li>
                  <code className="text-foreground">enableSpeechToText?: boolean</code> — Enables
                  experimental dictation.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section id="features" className="mb-20">
          <MonoLabel>03 / Features & Capabilities</MonoLabel>
          <div className="grid gap-8">
            <div>
              <h4 className="font-mono text-[13px] mb-2">Slash Commands</h4>
              <p className="text-muted-foreground text-sm">
                Type <code className="text-foreground bg-muted px-1 rounded">/</code> anywhere to
                trigger a Notion-style popup menu. It includes Headings, Lists, Quotes, Tables,
                KaTeX Equations, and Excalidraw boards.
              </p>
            </div>
            <div>
              <h4 className="font-mono text-[13px] mb-2">Drag and Drop</h4>
              <p className="text-muted-foreground text-sm">
                Hover over any block (paragraph, image, table) to reveal a draggable grip handle on
                the left side, allowing for seamless block reordering.
              </p>
            </div>
            <div>
              <h4 className="font-mono text-[13px] mb-2">AutoSave & History</h4>
              <p className="text-muted-foreground text-sm">
                Built-in undo/redo history tracking. The{" "}
                <code className="text-foreground">onChange</code> callback provides a JSON
                representation of the editor state that can be securely stored in your database.
              </p>
            </div>
          </div>
        </section>

        <section id="compounds">
          <MonoLabel>04 / Architecture</MonoLabel>
          <Blockquote>Use compound components for maximum flexibility.</Blockquote>
          <pre className="p-4 bg-muted/30 border border-grid text-[12px] font-mono text-muted-foreground overflow-x-auto">
            {`<Editor>
  <EditorToolbar />
  <EditorContent />
  <EditorPlugins />
</Editor>`}
          </pre>
        </section>
      </Cell>
    </Row>
  );
}

const docsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/docs",
  component: DocsView,
});

const routeTree = rootRoute.addChildren([indexRoute, docsRoute]);
const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light" attribute="class" enableSystem disableTransitionOnChange>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
);
