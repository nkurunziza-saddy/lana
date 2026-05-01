import React from "react";
import { Tag, Display, Lead, Divider, MonoLabel } from "../../components/typography";
import { CopyCommand } from "../../components/layout";
import { SITE_URL } from "@andi/utils";

export function InstallationPage() {
  const [styleTab, setStyleTab] = React.useState<"mira" | "default">("mira");

  return (
    <section id="installation" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Tag>Setup</Tag>
      <Display>Installation</Display>
      <Lead>
        Choose the method that best fits your workflow. Own the source code or use the standalone
        package.
      </Lead>
      <Divider className="mb-10" />

      <div className="space-y-16">
        <div id="npm-install" className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-normal font-display">Method A: NPM Package (Fastest)</h3>
            <p className="text-[14px] leading-[1.6] text-muted-foreground">
              The best choice if you want the quickest setup and don't need to modify the internal
              logic of the editor.
            </p>
          </div>
          <div className="max-w-md">
            <CopyCommand command="npm install andi-editor" />
          </div>
        </div>

        <div id="registry-install" className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-normal font-display">
              Method B: Shadcn Registry (Customizable)
            </h3>
            <p className="text-[14px] leading-[1.6] text-muted-foreground">
              The best choice if you want to own the source code and customize every part of the
              editor UI.
            </p>
          </div>

          <div className="mb-8 border border-grid bg-card overflow-hidden max-w-2xl">
            <div className="flex border-b border-grid bg-muted/30">
              {(["mira", "default"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStyleTab(s)}
                  className={`px-4 py-2 text-[11px] uppercase tracking-wider transition-colors border-r border-grid ${
                    styleTab === s
                      ? "bg-background text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  style={{ fontFamily: "var(--ff-mono)" }}
                >
                  {s === "mira" ? "Base UI (Mira)" : "Radix UI (Default)"}
                </button>
              ))}
            </div>

            <div className="p-6 flex flex-col gap-8">
              <div className="space-y-3">
                <MonoLabel className="mb-0">01 / Namespace Setup (Recommended)</MonoLabel>
                <p className="text-[13px] text-muted-foreground leading-[1.6]">
                  Add the registry to your{" "}
                  <code className="text-[11px] bg-muted px-1 py-0.5 rounded">components.json</code>:
                </p>
                <pre className="p-3 bg-muted/30 border border-grid text-[11px] font-mono text-muted-foreground overflow-x-auto rounded leading-[1.6]">
                  {`{
  "registries": {
    "@andi": "${SITE_URL}/r/{style}"
  }
}`}
                </pre>
                <p className="text-[13px] text-muted-foreground mt-3">
                  Then install using the namespace:
                </p>
                <CopyCommand command="npx shadcn add @andi/editor" />
              </div>

              <div className="space-y-3">
                <MonoLabel className="mb-0">02 / Direct Install</MonoLabel>
                <p className="text-[13px] text-muted-foreground leading-[1.6]">
                  Or install directly using the URL:
                </p>
                <CopyCommand command={`npx shadcn add ${SITE_URL}/r/${styleTab}/editor.json`} />
              </div>
            </div>
          </div>
        </div>

        <div id="ssr-setup" className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-normal font-display">SSR Setup (Next.js)</h3>
            <p className="text-[14px] leading-[1.6] text-muted-foreground">
              Rich-text editors require browser APIs. Load via{" "}
              <code className="text-[11px] bg-muted px-1 py-0.5 rounded">next/dynamic</code> to
              prevent hydration errors.
            </p>
          </div>
          <pre className="p-4 bg-muted/30 border border-grid text-[11px] font-mono text-muted-foreground overflow-x-auto rounded leading-[1.6]">
            {`"use client";
import dynamic from "next/dynamic";
// or import { Editor } from "@/components/editor" if using registry
const Editor = dynamic(() => import("andi-editor").then(m => m.Editor), { ssr: false });

export default function MyPage() {
  return <Editor placeholder="Type here..." />;
}`}
          </pre>
        </div>
      </div>
    </section>
  );
}
