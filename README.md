# Lana

Lana is a minimal rich-text editor system with a shared UI layer and a `shadcn` registry for reusing its theme and primitives across projects.

## Development

```bash
vp run ready
vp run dev
```

## Registry

The repository ships a first-party `shadcn` registry with two styles: `mira` (Base UI) and `default` (Radix UI).

Build the registry JSON payloads:

```bash
vp run registry:build
```

This generates static installable items in `apps/website/public/r`, organized by style:

- `r/default/editor.json` - Lexical-based editor with Radix UI primitives.
- `r/mira/editor.json` - Lexical-based editor with Base UI primitives.

Use the built registry item directly with the CLI:

```bash
# To install the Mira style editor
npx shadcn@latest add https://lanaaa.vercel.app/r/mira/editor.json

# To install the Default style editor
npx shadcn@latest add https://lanaaa.vercel.app/r/default/editor.json
```

The `editor` item installs the full rich-text surface including toolbar, floating toolbar, slash commands, equations, excalidraw, and more.

## Validation

```bash
vp check
vp test
```
