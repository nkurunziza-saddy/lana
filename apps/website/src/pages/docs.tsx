import React from "react";
import { Row, Cell } from "../components/grid";
import { Tag, Display, Lead, MonoLabel, Divider, Blockquote } from "../components/typography";
import { CopyCommand } from "../components/layout";
import { SITE_URL } from "@andi/utils";

export function DocsView() {
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
          <a href="#plugins" className="text-[12px] text-muted-foreground hover:text-foreground">
            03 / Plugins
          </a>
          <a href="#compounds" className="text-[12px] text-muted-foreground hover:text-foreground">
            04 / Compounds
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
            Andi is designed to be added to your project via shadcn/ui registry. This gives you full
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
    "@andi": "${SITE_URL}/r/{style}"
  }
}`}
                </pre>
                <p className="text-sm text-muted-foreground mt-3 mb-2">
                  Then install using the namespace:
                </p>
                <CopyCommand command="npx shadcn add @andi/editor" />
              </div>

              <div>
                <MonoLabel>02 / Direct Install</MonoLabel>
                <p className="text-sm text-muted-foreground mb-3 mt-1">
                  Or install directly using the URL for the{" "}
                  {styleTab === "mira" ? "Mira" : "Default"} style:
                </p>
                <CopyCommand command={`npx shadcn add ${SITE_URL}/r/${styleTab}/editor.json`} />
              </div>

              <div>
                <MonoLabel>03 / Next.js Usage (SSR)</MonoLabel>
                <p className="text-sm text-muted-foreground mb-3 mt-1">
                  Rich-text editors require browser APIs. For Next.js, wrap the compound components
                  and load via{" "}
                  <code className="text-[11px] bg-muted px-1 py-0.5 rounded">next/dynamic</code>:
                </p>
                <pre className="p-3 bg-muted/30 border border-grid text-[11px] font-mono text-muted-foreground overflow-x-auto rounded">
                  {`// components/editor-client.tsx
"use client";
import { Editor, EditorToolbar, EditorContent, EditorPlugins } from "@/components/editor";

export default function EditorClient() {
  return (
    <Editor>
      <EditorToolbar />
      <EditorContent />
      <EditorPlugins />
    </Editor>
  );
}

// app/page.tsx
import dynamic from "next/dynamic";
const EditorClient = dynamic(() => import("@/components/editor-client"), { ssr: false });`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section id="props" className="mb-20">
          <MonoLabel>02 / Props & Components</MonoLabel>
          <div className="grid gap-8 mt-6">
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

        <section id="plugins" className="mb-20">
          <MonoLabel>03 / Plugins & Performance</MonoLabel>
          <div className="grid gap-8 mt-6">
            <div>
              <h4 className="font-mono text-[13px] mb-2">Lazy-Loaded Architecture</h4>
              <p className="text-muted-foreground text-sm">
                The editor separates its core bundle (45KB) from its heavy features. Large features
                like KaTeX Equations and Excalidraw whiteboards are dynamically imported at runtime
                only when they are rendered on the screen.
              </p>
            </div>
            <div>
              <h4 className="font-mono text-[13px] mb-2">The EditorPlugin Interface</h4>
              <p className="text-muted-foreground text-sm mb-2">
                You can build your own lazy-loaded capabilities by implementing the{" "}
                <code className="text-foreground">EditorPlugin</code> interface.
              </p>
              <pre className="p-3 bg-muted/30 border border-grid text-[11px] font-mono text-muted-foreground overflow-x-auto rounded mt-2">
                {`export interface EditorPlugin {
  id: string;
  name: string;
  nodes?: LexicalNode[]; // Automatically registered
  load?: () => Promise<void>; // Pre-load heavy assets
  component?: React.ComponentType; // Extends the canvas
}`}
              </pre>
            </div>
          </div>
        </section>

        <section id="compounds">
          <MonoLabel>04 / Architecture</MonoLabel>
          <Blockquote>Use compound components for maximum flexibility.</Blockquote>
          <pre className="p-4 bg-muted/30 border border-grid text-[12px] font-mono text-muted-foreground overflow-x-auto mt-4">
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
