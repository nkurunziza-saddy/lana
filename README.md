# Lana

Lana is a minimal rich-text editor system with a shared UI layer and a `shadcn` registry for reusing its theme and primitives across projects.

## Development

```bash
vp run ready
vp run dev
```

## Registry

The repository ships a first-party `shadcn` registry under the `mira` style namespace.

Build the registry JSON payloads:

```bash
vp run registry:build
```

This generates static installable items in `apps/website/public/r`, including:

- `lana-base.json`
- `lana-theme.json`
- `lana-button.json`
- `lana-input.json`
- `lana-dropdown-menu.json`

Use the built registry item directly with the CLI:

```bash
npx shadcn@latest add http://localhost:5173/r/lana-base.json
```

The `lana-base` item installs the theme tokens, font setup, utility helpers, and compact Base UI primitives used by the editor surface.

## Validation

```bash
vp check
vp test
```
