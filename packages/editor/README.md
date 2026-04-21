# Lana Editor Documentation

`@lana/editor` is a flexible, performance-optimized rich text editor built on top of [Lexical](https://lexical.dev). It follows modern React best practices, supporting both a simple "plug-and-play" mode and a highly customizable "compound component" architecture.

## Installation

```bash
pnpm add @lana/editor
```

## Core Patterns

### 1. Simple Usage (Prop-based)

Best for quick implementations where the default layout is sufficient.

```tsx
import { Editor } from "@lana/editor";

function MyPage() {
  return (
    <Editor
      showToolbar
      enableSpeechToText
      placeholder="Start typing..."
      onChange={(val) => console.log(val)}
    />
  );
}
```

### 2. Compound Component Usage (Composition-based)

Best for custom layouts, selective feature sets, and better tree-shaking.

```tsx
import { Editor } from "@lana/editor";

function CustomEditor() {
  return (
    <Editor.Root initialValue="">
      {/* 1. Custom Toolbar Layout */}
      <Editor.Toolbar>
        <Editor.Toolbar.History />
        <Editor.Toolbar.Separator />
        <Editor.Toolbar.TextFormat />
        <Editor.Toolbar.Color />
      </Editor.Toolbar>

      {/* 2. Editable Area */}
      <Editor.Content minHeight="500px" />

      {/* 3. Explicit Plugin Management */}
      <Editor.Plugins showFloatingToolbar={true}>
        {/* Custom plugins can be added here as children */}
      </Editor.Plugins>
    </Editor.Root>
  );
}
```

---

## Component API

### `Editor` (Simple)

| Prop                  | Type      | Default | Description                                  |
| --------------------- | --------- | ------- | -------------------------------------------- |
| `initialValue`        | `string`  | `""`    | Initial Lexical JSON state string.           |
| `showToolbar`         | `boolean` | `false` | Whether to show the top toolbar.             |
| `showFloatingToolbar` | `boolean` | `true`  | Whether to show the selection-based toolbar. |
| `enableSpeechToText`  | `boolean` | `false` | Enables the microphone/dictation button.     |
| `readOnly`            | `boolean` | `false` | Disables editing.                            |

### `Editor.Root`

The provider component that initializes the Lexical context.

- **Props**: `initialValue`, `readOnly`, `className`, `children`.

### `Editor.Toolbar`

A composable container for editor actions. Can be used as a self-closing component for the default layout or with children for customization.

**Sub-components:**

- `Toolbar.History`: Undo/Redo.
- `Toolbar.BlockFormat`: H1, H2, Paragraph dropdown.
- `Toolbar.TextFormat`: Bold, Italic, Underline, Code.
- `Toolbar.TextCase`: Uppercase, Lowercase, Capitalize.
- `Toolbar.List`: Bullet, Numbered, Checklists.
- `Toolbar.Color`: Text color picker.
- `Toolbar.Highlight`: Text background color picker.
- `Toolbar.Align`: Left, Center, Right, Justify.
- `Toolbar.Insert`: Dropdown for Tables, Images, Excalidraw, Equations.
- `Toolbar.Separator`: Vertical divider.

---

## Examples

### Minimalist "Zen" Mode

No toolbars, just the text area.

```tsx
<Editor.Root>
  <Editor.Content placeholder="Write peacefully..." />
  <Editor.Plugins showFloatingToolbar={false} />
</Editor.Root>
```

### Bottom Toolbar (Mobile Optimized)

Place the toolbar after the content.

```tsx
<Editor.Root>
  <div className="flex flex-col h-full">
    <div className="flex-1 overflow-auto">
      <Editor.Content />
    </div>
    <Editor.Toolbar className="border-t">
      <Editor.Toolbar.TextFormat />
      <Editor.Toolbar.Insert />
    </Editor.Toolbar>
  </div>
  <Editor.Plugins />
</Editor.Root>
```

### Theming

The editor automatically detects and applies dark mode if a parent has the `.dark` class or via `next-themes` integration.

```tsx
// Ensure your globals.css includes the lana-editor theme variables
<div className="dark">
  <Editor />
</div>
```

---

## Best Practices

1.  **Lazy Loading**: Heavy components like `Excalidraw` and `Katex` are automatically lazy-loaded. No extra config required.
2.  **Performance**: Always wrap custom plugins in `React.memo` if they perform expensive operations during editor updates.
3.  **Stability**: Use `Editor.Root` to wrap the editor if you need to access the Lexical context via `useLexicalComposerContext` in sibling components.
