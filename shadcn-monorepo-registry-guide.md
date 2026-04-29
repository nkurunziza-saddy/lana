# Shadcn/UI Monorepo + Custom Registry Guide

### Full setup: `ui` package → `editor` package → shareable via shadcn registry

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Monorepo Scaffolding](#2-monorepo-scaffolding)
3. [The `ui` Package — Base shadcn Components](#3-the-ui-package--base-shadcn-components)
4. [The `editor` Package — Building on Top of `ui`](#4-the-editor-package--building-on-top-of-ui)
5. [CSS Variables & Theming Strategy](#5-css-variables--theming-strategy)
6. [Setting Up the shadcn Registry](#6-setting-up-the-shadcn-registry)
7. [registry.json — Full Configuration](#7-registryjson--full-configuration)
8. [Registry Items in Detail](#8-registry-items-in-detail)
9. [Namespaces — Let Users Install via `@your-org`](#9-namespaces--let-users-install-via-your-org)
10. [Build, Serve & Publish](#10-build-serve--publish)
11. [Commands Cheatsheet](#11-commands-cheatsheet)
12. [Good Practices & Scaling Tips](#12-good-practices--scaling-tips)
13. [Troubleshooting](#13-troubleshooting)

---

## 1. Architecture Overview

```
my-monorepo/
├── apps/
│   ├── web/                    ← your Next.js consumer app
│   └── registry/               ← the registry server (Next.js or Express)
│       ├── registry.json
│       ├── public/r/           ← built registry JSON files go here
│       └── registry/
│           └── new-york/
│               └── editor/     ← editor registry item source
├── packages/
│   ├── ui/                     ← base shadcn components
│   │   ├── src/components/ui/  ← button.tsx, input.tsx, etc.
│   │   ├── components.json
│   │   └── package.json
│   └── editor/                 ← your editor package
│       ├── src/
│       │   ├── components/     ← editor-specific components
│       │   ├── hooks/
│       │   └── lib/
│       ├── components.json
│       └── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

**Key concept:** The `ui` package is where all raw shadcn components live. The `editor` package depends on `ui`, adds its own components, and is exposed as a **sharable registry item** so any external consumer can install it with one command:

```bash
pnpm dlx shadcn@latest add https://your-registry.com/r/editor.json
```

---

## 2. Monorepo Scaffolding

### `pnpm-workspace.yaml`

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### Root `package.json`

```json
{
  "name": "my-monorepo",
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "registry:build": "turbo run registry:build",
    "registry:dev": "pnpm --filter @my-org/registry dev",
    "registry:publish": "turbo run registry:publish"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.0.0"
  }
}
```

### `turbo.json`

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "public/r/**"]
    },
    "registry:build": {
      "dependsOn": ["^build"],
      "outputs": ["public/r/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {}
  }
}
```

### Initialize the workspace

```bash
# Create the workspace structure
mkdir -p my-monorepo/{apps/{web,registry},packages/{ui,editor}}
cd my-monorepo

# Init pnpm workspace
echo "packages:\n  - 'apps/*'\n  - 'packages/*'" > pnpm-workspace.yaml

# Install turbo globally (or use npx)
pnpm add -Dw turbo typescript
```

---

## 3. The `ui` Package — Base shadcn Components

### `packages/ui/package.json`

```json
{
  "name": "@my-org/ui",
  "version": "0.1.0",
  "private": false,
  "exports": {
    "./components/*": "./src/components/*.tsx",
    "./lib/*": "./src/lib/*.ts",
    "./globals.css": "./src/globals.css"
  },
  "scripts": {
    "build": "tsc --emitDeclarationOnly",
    "lint": "eslint src/",
    "shadcn:add": "shadcn add"
  },
  "dependencies": {
    "@radix-ui/react-slot": "^1.0.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "peerDependencies": {
    "react": ">=18",
    "react-dom": ">=18"
  },
  "devDependencies": {
    "shadcn": "latest",
    "tailwindcss": "^4.0.0"
  }
}
```

### `packages/ui/components.json`

This is the critical config. Set `aliases` to point inside the package:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/globals.css",
    "baseColor": "zinc",
    "cssVariables": true
  },
  "aliases": {
    "components": "@my-org/ui/components",
    "utils": "@my-org/ui/lib/utils",
    "ui": "@my-org/ui/components/ui",
    "lib": "@my-org/ui/lib",
    "hooks": "@my-org/ui/hooks"
  },
  "iconLibrary": "lucide"
}
```

> **Tip:** Setting `style: "new-york"` once here means all components added to this package
> will follow the new-york style automatically. Consumers get consistency.

### Add base shadcn components to `ui`

```bash
# Run these from packages/ui
cd packages/ui

# Add foundational components
pnpm shadcn:add button
pnpm shadcn:add input
pnpm shadcn:add label
pnpm shadcn:add textarea
pnpm shadcn:add select
pnpm shadcn:add dialog
pnpm shadcn:add dropdown-menu
pnpm shadcn:add tooltip
pnpm shadcn:add separator
pnpm shadcn:add scroll-area

# Or add many at once
pnpm dlx shadcn@latest add button input label textarea select dialog tooltip separator
```

### `packages/ui/src/globals.css`

Your base theme variables. Consumers will import this CSS or extend it:

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  /* Shadcn base variables */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
}
```

### `packages/ui/src/lib/utils.ts`

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 4. The `editor` Package — Building on Top of `ui`

### `packages/editor/package.json`

```json
{
  "name": "@my-org/editor",
  "version": "0.1.0",
  "private": false,
  "exports": {
    "./components/*": "./src/components/*.tsx",
    "./hooks/*": "./src/hooks/*.ts",
    "./lib/*": "./src/lib/*.ts",
    "./editor.css": "./src/editor.css"
  },
  "scripts": {
    "build": "tsc --emitDeclarationOnly",
    "lint": "eslint src/"
  },
  "dependencies": {
    "@my-org/ui": "workspace:*",
    "@radix-ui/react-toolbar": "^1.0.4",
    "@tiptap/core": "^2.0.0",
    "@tiptap/react": "^2.0.0",
    "@tiptap/starter-kit": "^2.0.0",
    "lucide-react": "^0.400.0"
  },
  "peerDependencies": {
    "react": ">=18",
    "react-dom": ">=18"
  }
}
```

### `packages/editor/components.json`

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/editor.css",
    "baseColor": "zinc",
    "cssVariables": true
  },
  "aliases": {
    "components": "@my-org/editor/components",
    "utils": "@my-org/ui/lib/utils",
    "ui": "@my-org/ui/components/ui",
    "lib": "@my-org/editor/lib",
    "hooks": "@my-org/editor/hooks"
  }
}
```

> **Key detail:** `utils` and `ui` point back to `@my-org/ui`. This means the editor package
> reuses the base layer completely — no duplication.

### `packages/editor/src/editor.css`

Editor-specific CSS variables, namespaced with `editor-`:

```css
/* Import the base ui variables */
@import "@my-org/ui/globals.css";

:root {
  /* ── Editor surface ───────────────────────────── */
  --editor-bg: var(--background);
  --editor-surface: oklch(0.98 0 0);
  --editor-border: var(--border);
  --editor-radius: var(--radius);

  /* ── Editor toolbar ───────────────────────────── */
  --editor-toolbar-bg: oklch(0.97 0 0);
  --editor-toolbar-border: var(--border);
  --editor-toolbar-height: 2.75rem;

  /* ── Editor content area ──────────────────────── */
  --editor-content-padding: 1.5rem 2rem;
  --editor-min-height: 24rem;
  --editor-font-size: 0.9375rem;
  --editor-line-height: 1.75;

  /* ── Editor focus ring ────────────────────────── */
  --editor-ring: var(--ring);
  --editor-ring-width: 2px;

  /* ── Editor selection ─────────────────────────── */
  --editor-selection-bg: oklch(0.83 0.1 260 / 30%);
  --editor-selection-fg: inherit;

  /* ── Editor placeholder ───────────────────────── */
  --editor-placeholder-color: var(--muted-foreground);

  /* ── Editor active format indicators ─────────── */
  --editor-active-bg: var(--accent);
  --editor-active-fg: var(--accent-foreground);

  /* ── Editor code blocks ───────────────────────── */
  --editor-code-bg: oklch(0.95 0 0);
  --editor-code-border: var(--border);
  --editor-code-radius: calc(var(--radius) - 2px);
  --editor-code-font: "JetBrains Mono", "Fira Code", monospace;

  /* ── Editor blockquote ────────────────────────── */
  --editor-blockquote-border: var(--primary);
  --editor-blockquote-color: var(--muted-foreground);
}

.dark {
  --editor-surface: oklch(0.18 0 0);
  --editor-toolbar-bg: oklch(0.2 0 0);
  --editor-code-bg: oklch(0.22 0 0);
  --editor-selection-bg: oklch(0.55 0.12 260 / 35%);
}
```

### Example editor component — `packages/editor/src/components/editor.tsx`

```tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { cn } from "@my-org/ui/lib/utils";
import { EditorToolbar } from "./editor-toolbar";

interface EditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
}

export function Editor({
  value,
  onChange,
  placeholder = "Start writing...",
  className,
  readOnly = false,
}: EditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  return (
    <div
      className={cn(
        "flex flex-col rounded-[var(--editor-radius)] border border-[var(--editor-border)]",
        "bg-[var(--editor-surface)] ring-offset-background",
        "focus-within:outline-none focus-within:ring-[var(--editor-ring-width)]",
        "focus-within:ring-[var(--editor-ring)] focus-within:ring-offset-2",
        className,
      )}
    >
      {!readOnly && <EditorToolbar editor={editor} />}
      <EditorContent
        editor={editor}
        className="editor-content min-h-[var(--editor-min-height)] px-[var(--editor-content-padding)]"
        placeholder={placeholder}
      />
    </div>
  );
}
```

### Example hook — `packages/editor/src/hooks/use-editor-state.ts`

```typescript
import { useState, useCallback } from "react";

export function useEditorState(initialValue = "") {
  const [value, setValue] = useState(initialValue);
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = useCallback((newValue: string) => {
    setValue(newValue);
    setIsDirty(true);
  }, []);

  const reset = useCallback(() => {
    setValue(initialValue);
    setIsDirty(false);
  }, [initialValue]);

  return { value, isDirty, onChange: handleChange, reset };
}
```

---

## 5. CSS Variables & Theming Strategy

The `editor-*` variables are designed to be a **thin layer on top of the base shadcn tokens**. Here's the philosophy:

### Variable Layering Model

```
┌─────────────────────────────────────────┐
│  Consumer's global.css                  │
│  --background, --primary, etc.          │  ← shadcn base (consumer controls)
├─────────────────────────────────────────┤
│  @my-org/ui globals.css                 │
│  Maps tokens → tailwind theme           │  ← ui package (you control)
├─────────────────────────────────────────┤
│  @my-org/editor editor.css              │
│  --editor-* vars reference base tokens  │  ← editor package (your add-ons)
└─────────────────────────────────────────┘
```

### What this means in practice

- `--editor-bg: var(--background)` → when the consumer changes `--background`, the editor responds automatically.
- `--editor-toolbar-bg: oklch(0.97 0 0)` → this is editor-specific and has a sensible default that consumers can override just by declaring `--editor-toolbar-bg` in their own CSS.

### Letting consumers override editor vars

In the registry item (see section 8), we inject a `cssVars` block that sets the defaults. The consumer can override these by adding to their own `globals.css`:

```css
/* Consumer's globals.css — override editor vars */
:root {
  --editor-toolbar-height: 3.25rem; /* taller toolbar */
  --editor-font-size: 1rem;
  --editor-code-font: "Fira Code", monospace;
}
```

This gives consumers full control without touching package internals.

---

## 6. Setting Up the shadcn Registry

You need a **separate app** (or a route in an existing Next.js app) that serves the registry JSON. The simplest approach is a dedicated `apps/registry` Next.js project.

### Initialize the registry app

```bash
cd apps/registry
pnpm dlx create-next-app@latest . --typescript --tailwind --app --no-src-dir

# Install shadcn CLI in this workspace
pnpm add -D shadcn@latest
```

### `apps/registry/package.json` (scripts section)

```json
{
  "name": "@my-org/registry",
  "scripts": {
    "dev": "next dev --port 3001",
    "build": "next build",
    "start": "next start",
    "registry:build": "shadcn build",
    "registry:build:watch": "shadcn build --watch"
  }
}
```

### `apps/registry/next.config.ts`

Enable content negotiation so users can do `shadcn add https://your-registry.com`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/r/(.*)",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET" },
        ],
      },
    ];
  },
  // Content negotiation: serve registry JSON when shadcn CLI calls root
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          has: [
            {
              type: "header",
              key: "accept",
              value: "(.*)application/vnd\\.shadcn\\.v1\\+json(.*)",
            },
          ],
          destination: "/r/index.json",
        },
        {
          source: "/",
          has: [{ type: "header", key: "user-agent", value: "shadcn" }],
          destination: "/r/index.json",
        },
      ],
    };
  },
};

export default nextConfig;
```

---

## 7. registry.json — Full Configuration

Place this at `apps/registry/registry.json`. This is the source of truth — `shadcn build` reads it and generates individual JSON files under `public/r/`.

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "my-org",
  "homepage": "https://registry.my-org.com",
  "items": [
    {
      "name": "editor",
      "type": "registry:block",
      "title": "Rich Text Editor",
      "description": "A full-featured rich text editor built with Tiptap and shadcn/ui. Includes toolbar, theming via editor-* CSS variables, and hooks.",
      "registryDependencies": ["button", "separator", "tooltip", "toggle"],
      "dependencies": [
        "@tiptap/core@^2.0.0",
        "@tiptap/react@^2.0.0",
        "@tiptap/starter-kit@^2.0.0",
        "@tiptap/extension-placeholder@^2.0.0",
        "@tiptap/extension-character-count@^2.0.0",
        "lucide-react"
      ],
      "cssVars": {
        "light": {
          "editor-bg": "var(--background)",
          "editor-surface": "oklch(0.98 0 0)",
          "editor-border": "var(--border)",
          "editor-radius": "var(--radius)",
          "editor-toolbar-bg": "oklch(0.97 0 0)",
          "editor-toolbar-border": "var(--border)",
          "editor-toolbar-height": "2.75rem",
          "editor-min-height": "24rem",
          "editor-font-size": "0.9375rem",
          "editor-line-height": "1.75",
          "editor-ring": "var(--ring)",
          "editor-ring-width": "2px",
          "editor-selection-bg": "oklch(0.83 0.1 260 / 30%)",
          "editor-placeholder-color": "var(--muted-foreground)",
          "editor-active-bg": "var(--accent)",
          "editor-active-fg": "var(--accent-foreground)",
          "editor-code-bg": "oklch(0.95 0 0)",
          "editor-code-border": "var(--border)",
          "editor-code-radius": "calc(var(--radius) - 2px)",
          "editor-blockquote-border": "var(--primary)",
          "editor-blockquote-color": "var(--muted-foreground)"
        },
        "dark": {
          "editor-surface": "oklch(0.18 0 0)",
          "editor-toolbar-bg": "oklch(0.20 0 0)",
          "editor-code-bg": "oklch(0.22 0 0)",
          "editor-selection-bg": "oklch(0.55 0.12 260 / 35%)"
        }
      },
      "files": [
        {
          "path": "registry/new-york/editor/editor.tsx",
          "type": "registry:component"
        },
        {
          "path": "registry/new-york/editor/editor-toolbar.tsx",
          "type": "registry:component"
        },
        {
          "path": "registry/new-york/editor/editor-bubble-menu.tsx",
          "type": "registry:component"
        },
        {
          "path": "registry/new-york/editor/hooks/use-editor-state.ts",
          "type": "registry:hook"
        },
        {
          "path": "registry/new-york/editor/lib/editor-utils.ts",
          "type": "registry:lib"
        }
      ]
    },

    {
      "name": "editor-theme",
      "type": "registry:theme",
      "title": "Editor Theme",
      "description": "Minimal theme override for the editor that extends the shadcn/ui base.",
      "cssVars": {
        "light": {
          "editor-font-size": "1rem",
          "editor-min-height": "20rem"
        },
        "dark": {
          "editor-surface": "oklch(0.16 0 0)"
        }
      }
    }
  ]
}
```

---

## 8. Registry Items in Detail

### File layout inside `apps/registry/registry/new-york/editor/`

```
apps/registry/registry/new-york/editor/
├── editor.tsx                  ← main component (registry:component)
├── editor-toolbar.tsx          ← toolbar (registry:component)
├── editor-bubble-menu.tsx      ← floating menu (registry:component)
├── hooks/
│   └── use-editor-state.ts     ← custom hook (registry:hook)
└── lib/
    └── editor-utils.ts         ← helper functions (registry:lib)
```

> **Rule:** All imports inside registry files must use `@/registry` paths. The shadcn CLI
> rewrites these to the consumer's project paths on install.

### `apps/registry/registry/new-york/editor/editor.tsx`

```tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { cn } from "@/lib/utils";
import { EditorToolbar } from "@/registry/new-york/editor/editor-toolbar";

interface EditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
  minHeight?: string;
}

export function Editor({
  value,
  onChange,
  placeholder = "Start writing...",
  className,
  readOnly = false,
}: EditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder })],
    content: value,
    editable: !readOnly,
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
  });

  return (
    <div
      data-registry="my-org-editor"
      className={cn(
        "flex flex-col overflow-hidden rounded-[--editor-radius]",
        "border border-[--editor-border] bg-[--editor-surface]",
        "ring-offset-background transition-shadow",
        "focus-within:ring-[--editor-ring-width] focus-within:ring-[--editor-ring] focus-within:ring-offset-2",
        className,
      )}
    >
      {!readOnly && <EditorToolbar editor={editor} />}
      <EditorContent
        editor={editor}
        className={cn(
          "prose prose-sm dark:prose-invert max-w-none flex-1 px-4 py-3",
          "min-h-[--editor-min-height] text-[length:--editor-font-size]",
          "leading-[--editor-line-height] focus:outline-none",
        )}
      />
    </div>
  );
}
```

### `apps/registry/registry/new-york/editor/editor-toolbar.tsx`

```tsx
"use client";

import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Minus,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface EditorToolbarProps {
  editor: Editor | null;
}

type FormatButton = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  action: () => void;
  isActive: () => boolean;
  shortcut?: string;
};

export function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) return null;

  const formats: FormatButton[] = [
    {
      icon: Bold,
      label: "Bold",
      shortcut: "⌘B",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
    },
    {
      icon: Italic,
      label: "Italic",
      shortcut: "⌘I",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
    },
    {
      icon: Strikethrough,
      label: "Strikethrough",
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive("strike"),
    },
    {
      icon: Code,
      label: "Inline code",
      shortcut: "⌘E",
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: () => editor.isActive("code"),
    },
  ];

  const blocks: FormatButton[] = [
    {
      icon: List,
      label: "Bullet list",
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive("bulletList"),
    },
    {
      icon: ListOrdered,
      label: "Numbered list",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive("orderedList"),
    },
    {
      icon: Quote,
      label: "Blockquote",
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive("blockquote"),
    },
  ];

  return (
    <div
      className={cn(
        "flex h-[--editor-toolbar-height] items-center gap-0.5 px-2",
        "border-b border-[--editor-toolbar-border] bg-[--editor-toolbar-bg]",
      )}
    >
      {formats.map((btn) => (
        <ToolbarButton key={btn.label} {...btn} />
      ))}
      <Separator orientation="vertical" className="mx-1 h-5" />
      {blocks.map((btn) => (
        <ToolbarButton key={btn.label} {...btn} />
      ))}
      <Separator orientation="vertical" className="mx-1 h-5" />
      <ToolbarButton
        icon={Undo}
        label="Undo"
        shortcut="⌘Z"
        action={() => editor.chain().focus().undo().run()}
        isActive={() => false}
      />
      <ToolbarButton
        icon={Redo}
        label="Redo"
        shortcut="⌘⇧Z"
        action={() => editor.chain().focus().redo().run()}
        isActive={() => false}
      />
    </div>
  );
}

function ToolbarButton({ icon: Icon, label, action, isActive, shortcut }: FormatButton) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Toggle
          size="sm"
          pressed={isActive()}
          onPressedChange={action}
          aria-label={label}
          className="h-7 w-7 p-0 data-[state=on]:bg-[--editor-active-bg] data-[state=on]:text-[--editor-active-fg]"
        >
          <Icon className="h-3.5 w-3.5" />
        </Toggle>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        {label}
        {shortcut && <span className="ml-1.5 text-muted-foreground">{shortcut}</span>}
      </TooltipContent>
    </Tooltip>
  );
}
```

---

## 9. Namespaces — Let Users Install via `@your-org`

The namespace system lets consumers install from your registry without typing full URLs.

### Registering your namespace (user-side `components.json`)

You document this in your registry's README. Consumers add one line to their `components.json`:

```json
{
  "registries": {
    "@my-org": "https://registry.my-org.com/r/{name}.json"
  }
}
```

Then they can install:

```bash
# Install the editor from your registry
pnpm dlx shadcn@latest add @my-org/editor

# Install with a specific version via params (if you set it up)
pnpm dlx shadcn@latest add @my-org/editor

# Install multiple at once
pnpm dlx shadcn@latest add @my-org/editor @my-org/editor-theme
```

### If you want them to use a full URL instead (no namespace config needed)

```bash
# Direct URL install — works without any components.json registry config
pnpm dlx shadcn@latest add https://registry.my-org.com/r/editor.json

# Preview what will be installed before committing
pnpm dlx shadcn@latest view https://registry.my-org.com/r/editor.json
```

### Cross-registry dependency in your `registry.json`

If your editor depends on another registry item from a third party:

```json
{
  "registryDependencies": ["button", "tooltip", "https://other-registry.com/r/some-component.json"]
}
```

The shadcn CLI will resolve all of these automatically during install.

---

## 10. Build, Serve & Publish

### The build pipeline

```bash
# 1. Build packages first (TypeScript declarations, etc.)
pnpm build

# 2. Build the registry JSON files
# This reads registry.json and outputs individual files to apps/registry/public/r/
pnpm registry:build

# Output:
# apps/registry/public/r/
# ├── index.json          ← registry root
# ├── editor.json         ← individual item
# └── editor-theme.json
```

### Development workflow

```bash
# Watch mode — rebuilds registry JSON on file changes
pnpm --filter @my-org/registry registry:build:watch

# In another terminal, start the Next.js server
pnpm --filter @my-org/registry dev

# Test installing from local registry
pnpm dlx shadcn@latest add http://localhost:3001/r/editor.json

# Or, if you configured the namespace locally:
# Set components.json registries -> "@my-org": "http://localhost:3001/r/{name}.json"
pnpm dlx shadcn@latest add @my-org/editor
```

### Verifying the built JSON

```bash
# Pretty-print the built registry item
cat apps/registry/public/r/editor.json | jq .

# Check what shadcn CLI sees (via content negotiation)
curl -H "User-Agent: shadcn" http://localhost:3001/ | jq .name

# View the item before installing (from CLI)
pnpm dlx shadcn@latest view http://localhost:3001/r/editor.json
```

### Publishing to production

Option A — deploy `apps/registry` to Vercel:

```bash
# From the monorepo root
pnpm dlx vercel --filter=@my-org/registry

# Set environment variables on Vercel if you need private registry auth
vercel env add REGISTRY_SECRET
```

Option B — export as static files (if no server-side logic needed):

```bash
# In apps/registry, add to next.config.ts:
# output: "export"

pnpm --filter @my-org/registry build
# Deploy the `out/` folder to any static host (Cloudflare Pages, GitHub Pages, S3+CDN)
```

---

## 11. Commands Cheatsheet

```bash
# ═══════════════════════════════════════
# WORKSPACE SETUP
# ═══════════════════════════════════════
pnpm install                                  # Install all workspace deps
pnpm build                                    # Build everything (turbo)

# ═══════════════════════════════════════
# ADDING SHADCN COMPONENTS TO ui PACKAGE
# ═══════════════════════════════════════
pnpm --filter @my-org/ui dlx shadcn@latest add button
pnpm --filter @my-org/ui dlx shadcn@latest add button input label select
pnpm --filter @my-org/ui dlx shadcn@latest add dialog dropdown-menu tooltip

# ═══════════════════════════════════════
# REGISTRY DEVELOPMENT
# ═══════════════════════════════════════
pnpm registry:build                           # Build registry JSON files
pnpm registry:dev                             # Start registry dev server
pnpm --filter @my-org/registry registry:build:watch   # Watch & rebuild

# ═══════════════════════════════════════
# TESTING REGISTRY ITEMS
# ═══════════════════════════════════════
# View a local item
pnpm dlx shadcn@latest view http://localhost:3001/r/editor.json

# Install from local registry into a test app
pnpm dlx shadcn@latest add http://localhost:3001/r/editor.json

# List all items in your registry
pnpm dlx shadcn@latest search http://localhost:3001

# ═══════════════════════════════════════
# CONSUMER COMMANDS (what your users run)
# ═══════════════════════════════════════
# Full URL install
pnpm dlx shadcn@latest add https://registry.my-org.com/r/editor.json

# Namespace install (after they add registry to components.json)
pnpm dlx shadcn@latest add @my-org/editor

# Preview before installing
pnpm dlx shadcn@latest view @my-org/editor

# ═══════════════════════════════════════
# MAINTENANCE
# ═══════════════════════════════════════
pnpm dlx shadcn@latest diff           # Check for shadcn component updates
pnpm --filter @my-org/ui dlx shadcn@latest diff button   # Diff a specific component
```

---

## 12. Good Practices & Scaling Tips

### Package architecture

**Keep `ui` purely about base components.** Never add business logic, icons packs beyond what shadcn uses, or complex hooks there. It should be boring and stable.

**Keep `editor` self-contained.** Everything the editor needs should be declared in its own `package.json`. Avoid relying on implicit transitive dependencies.

**One registry item per logical feature.** Don't bundle unrelated things. Users should be able to install just the editor toolbar without getting the full editor.

### CSS variable naming

Always prefix with your package name: `editor-*`. This prevents collisions with base shadcn variables, other packages, and future shadcn additions. Stick to a flat namespace — avoid `editor-toolbar-button-hover-bg` (too deep). If you need that level of control, let the consumer use a CSS selector instead.

### Registry item granularity

Good — three separate items:

```
editor            → full editor (pulls in toolbar, hooks)
editor-toolbar    → just the toolbar (standalone use case)
editor-theme      → only CSS var overrides, no components
```

Bad — one giant item:

```
editor-everything → editor + toolbar + theme + related utilities + examples
```

### Versioning strategy

Add version tags to your registry URL pattern so users can pin:

```
"@my-org": "https://registry.my-org.com/v/{name}.json"
             where v = v1, v2, latest
```

And document breaking changes prominently — once users install from your registry, they own the code. Version bumps don't auto-update.

### Documentation as code

Add a `"description"` to every file entry in your registry item, and write a proper `"title"` and `"description"` for the item itself. The shadcn CLI and AI tools read these to help users understand what they're installing.

### Testing

Create a `apps/demo` workspace app that installs your registry items locally and uses them. This is the closest simulation of what consumers experience. Run `shadcn add` in it as part of your CI:

```bash
# In CI
pnpm --filter @my-org/registry registry:build
pnpm dlx shadcn@latest add http://localhost:3001/r/editor.json --cwd apps/demo --yes
```

### Dependency pinning in registry items

Use `name@version` format for pinned deps and `name@^version` for ranges:

```json
"dependencies": [
  "@tiptap/core@^2.5.0",      ← range — good for libraries with frequent patches
  "some-exact-tool@3.2.1"     ← pin — good for things that break between minors
]
```

### Monorepo-specific tips

- Use `workspace:*` for internal deps in `package.json` — turbo handles resolution.
- Set `"private": false` only on packages you intend to publish to npm. The `editor` package can be `private: false` (published to npm) AND be in the registry (distributed as source via shadcn). They serve different use cases.
- Configure tsconfig paths in the root `tsconfig.json` so editors resolve `@my-org/ui/*` correctly across the monorepo.

### Root `tsconfig.json` paths

```json
{
  "compilerOptions": {
    "paths": {
      "@my-org/ui": ["./packages/ui/src/index.ts"],
      "@my-org/ui/*": ["./packages/ui/src/*"],
      "@my-org/editor": ["./packages/editor/src/index.ts"],
      "@my-org/editor/*": ["./packages/editor/src/*"]
    }
  }
}
```

---

## 13. Troubleshooting

### "Registry item not found" when installing

Check that `shadcn build` ran successfully and the file exists at `public/r/editor.json`. The CLI fetches `{registry-url}/r/{name}.json` by default.

```bash
ls apps/registry/public/r/
# Should show: editor.json, editor-theme.json, index.json
```

### CSS variables not injecting into consumer's `globals.css`

The `cssVars` in your registry item are only injected when the user runs `shadcn add`. If they already have a `globals.css` that was set up before, you may need to merge manually. Document this in your registry README.

### `@/registry` imports break after install

This is expected — the shadcn CLI rewrites `@/registry/new-york/editor/*` to `@/components/ui/*` (or whatever the consumer's aliases are) on install. Always test with a fresh `shadcn add` to a dummy app.

### Turbo not rebuilding registry on changes

Add `"public/r/**"` to the `outputs` array of the `registry:build` turbo task (already shown in section 2). Also make sure your source files are in the `inputs` or not in `.gitignore` in a way turbo ignores.

### Dark mode `editor-*` vars not applying

Ensure the consumer has a dark mode setup that uses the `.dark` class (shadcn default). If they use `data-theme="dark"` or media query, they'll need to add a CSS override. Document this incompatibility clearly.

### Radix-UI + React version conflicts

Pin peer dependency ranges carefully:

```json
"peerDependencies": {
  "react": ">=18.0.0 <20.0.0",
  "react-dom": ">=18.0.0 <20.0.0"
}
```

And test with both React 18 and 19 in CI.

---

## Quick Reference — File Map

| File                                      | Purpose                                        |
| ----------------------------------------- | ---------------------------------------------- |
| `packages/ui/components.json`             | Shadcn config for the ui package               |
| `packages/editor/components.json`         | Shadcn config for the editor package           |
| `packages/ui/src/globals.css`             | Base shadcn CSS variables                      |
| `packages/editor/src/editor.css`          | Editor-specific `editor-*` variables           |
| `apps/registry/registry.json`             | Registry source — defines all items            |
| `apps/registry/public/r/editor.json`      | Built output — what shadcn CLI fetches         |
| `apps/registry/registry/new-york/editor/` | Source files that get embedded in the registry |
| `pnpm-workspace.yaml`                     | Monorepo package roots                         |
| `turbo.json`                              | Build pipeline                                 |

---

_Built to scale. Start with one editor item, grow to a full design system registry._
