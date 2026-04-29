import React from "react";
import ReactDOM from "react-dom/client";
import { Editor } from "@lana/editor";
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

// Root Route
const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

// Landing Page
function LandingView() {
  const [view, setView] = React.useState<"toolbar" | "minimal" | "speech">("toolbar");

  return (
    <>
      <Row cols="3-1">
        <Cell className="py-16 md:py-24">
          <Tag>v0.1.0 — beta</Tag>
          <Display>
            The editor is
            <br />
            the <em>canvas.</em>
          </Display>
          <Lead>
            A calm, precise writing UI built on top of Lexical. Smaller radii, whisper borders, and
            theme coherence.
          </Lead>

          <div className="mb-8 max-w-sm">
            <CopyCommand command="npx shadcn add http://localhost:5173/r/mira/editor.json" />
          </div>

          <div className="flex gap-2">
            <button
              className="bg-foreground px-5 py-2.5 text-[12px] tracking-[0.04em] text-background border border-grid"
              style={{ fontFamily: "var(--ff-mono)" }}
            >
              start writing
            </button>
            <button
              className="bg-none px-5 py-2.5 text-[12px] tracking-[0.04em] text-foreground hover:bg-muted border border-grid"
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
          <div className="bg-muted/30 p-4 md:p-8">
            <div className="overflow-hidden bg-card">
              <Editor
                key={view}
                className="min-h-[400px]"
                placeholder={
                  view === "minimal"
                    ? "Focus on your writing without distractions..."
                    : "Type or use commands..."
                }
                showToolbar={view !== "minimal"}
                showFloatingToolbar={true}
                enableSpeechToText={view === "speech"}
              />
            </div>
          </div>
        </Cell>
      </Row>

      <Row cols="3">
        <Cell className="py-12 md:py-16">
          <FeatNum>02 / structure</FeatNum>
          <FeatTitle>Lexical Powered</FeatTitle>
          <Divider />
          <FeatDesc>
            Built on top of Meta's Lexical, ensuring a robust, accessible, and high-performance
            editing experience.
          </FeatDesc>
        </Cell>
        <Cell className="py-12 md:py-16">
          <FeatNum>03 / aesthetics</FeatNum>
          <FeatTitle>Bordered Precision</FeatTitle>
          <Divider />
          <FeatDesc>
            Every element lives on the grid. Alignment is automatic, consistency is guaranteed.
          </FeatDesc>
        </Cell>
        <Cell noBorderRight className="py-12 md:py-16">
          <FeatNum>04 / styles</FeatNum>
          <FeatTitle>Two Variations</FeatTitle>
          <Divider />
          <FeatDesc>
            Choose between Mira Style for a minimal look or Default Style for a familiar Radix
            experience.
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

// Docs Page
function DocsView() {
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
            The editor is built for composition. Use the high-level &lt;Editor /&gt; or build your
            own with compound components.
          </Lead>
          <Divider />
          <h3 className="text-xl mb-4">Quick Setup</h3>
          <p className="text-muted-foreground text-sm mb-6">
            Lana is designed to be added to your project via shadcn/ui registry. This gives you full
            control over the source code.
          </p>
          <div className="max-w-md">
            <CopyCommand command="npx shadcn add http://localhost:5173/r/mira/editor.json" />
          </div>
        </section>

        <section id="props" className="mb-20">
          <MonoLabel>02 / Props</MonoLabel>
          <div className="grid gap-8">
            <div>
              <h4 className="font-mono text-[13px] mb-2">initialValue?: string</h4>
              <p className="text-muted-foreground text-sm">
                A JSON string representing the Lexical editor state.
              </p>
            </div>
            <div>
              <h4 className="font-mono text-[13px] mb-2">showToolbar?: boolean</h4>
              <p className="text-muted-foreground text-sm">
                Whether to show the top/bottom sticky toolbar.
              </p>
            </div>
            <div>
              <h4 className="font-mono text-[13px] mb-2">readOnly?: boolean</h4>
              <p className="text-muted-foreground text-sm">Disables all editing capabilities.</p>
            </div>
          </div>
        </section>

        <section id="compounds">
          <MonoLabel>03 / Compounds</MonoLabel>
          <Blockquote>Use compound components for maximum flexibility.</Blockquote>
          <pre className="p-4 bg-muted/30 border border-grid text-[12px] font-mono text-muted-foreground overflow-x-auto">
            {`<Editor.Root>
  <Editor.Toolbar />
  <Editor.Content />
  <Editor.Plugins />
</Editor.Root>`}
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

// Router Setup
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
