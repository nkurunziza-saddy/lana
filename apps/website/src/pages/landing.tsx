import React from "react";
import { Row, Cell } from "../components/grid";
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
} from "../components/typography";
import { CopyCommand } from "../components/layout";
import { SITE_URL } from "@andi/utils";
import { Editor, EditorContent, EditorToolbar, EditorPlugins } from "@andi/editor";

export function LandingView() {
  const [view, setView] = React.useState<"toolbar" | "minimal" | "speech">("toolbar");

  return (
    <>
      <Row cols="3-1">
        <Cell className="py-16 md:py-24">
          <Tag>v0.3.1</Tag>
          <Display>
            The editor is
            <br />
            the{" "}
            <em className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/50">
              canvas.
            </em>
          </Display>
          <Lead>
            A calm, precise writing UI built on top of Lexical. Extremely lightweight with
            lazy-loaded plugins.
          </Lead>

          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <div>
              <MonoLabel>Registry (Recommended)</MonoLabel>
              <div className="mt-3">
                <CopyCommand command={`npx shadcn add ${SITE_URL}/r/mira/editor.json`} />
              </div>
            </div>
            <div>
              <MonoLabel>NPM Package</MonoLabel>
              <div className="mt-3">
                <CopyCommand command="npm install andi-editor" />
              </div>
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
            <StatN>153KB</StatN>
            <StatL>NPM Package</StatL>
            <Divider />
            <StatN>250KB</StatN>
            <StatL>Total CSS</StatL>
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
            blocks. Heavy plugins are lazy-loaded at runtime.
          </FeatDesc>
        </Cell>
        <Cell noBorderRight className="py-12 md:py-16">
          <FeatNum>04 / flexibility</FeatNum>
          <FeatTitle>Two Ways to Play</FeatTitle>
          <Divider />
          <FeatDesc>
            Install as a standalone{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">andi-editor</code> package for
            speed, or via the shadcn registry to own the source code in your{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">components/editor</code>{" "}
            directory.
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
              — Andi Design System
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
