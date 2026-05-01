# Andi Editor

`andi-editor` is a flexible, performance-optimized rich text editor built on top of [Lexical](https://lexical.dev). It follows modern React best practices, supporting both a simple "plug-and-play" mode and a highly customizable "compound component" architecture.

## Installation

```bash
npm install andi-editor
```

## Usage

### 1. Simple Usage (Prop-based)

Best for quick implementations where the default layout is sufficient.

```tsx
import { Editor } from "andi-editor";
import "andi-editor/dist/andi-editor.css";

function MyPage() {
  return (
    <Editor
      showToolbar
      enableSpeechToText
      placeholder="Start typing..."
      onSave={(json) => console.log("Autosaved:", json)}
    />
  );
}
```

### 2. Compound Component Usage (Composition-based)

Best for custom layouts, selective feature sets, and better tree-shaking.

```tsx
import { Editor } from "andi-editor";
import "andi-editor/dist/andi-editor.css";

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
      <Editor.Plugins showFloatingToolbar={true} onSave={(json) => saveToDB(json)}>
        {/* Custom plugins can be added here as children */}
      </Editor.Plugins>
    </Editor.Root>
  );
}
```

---

## Component API

### `Editor` (Simple)

| Prop                  | Type       | Default | Description                                   |
| --------------------- | ---------- | ------- | --------------------------------------------- |
| `initialValue`        | `string`   | `""`    | Initial Lexical JSON state string.            |
| `showToolbar`         | `boolean`  | `false` | Whether to show the top toolbar.              |
| `showFloatingToolbar` | `boolean`  | `true`  | Whether to show the selection-based toolbar.  |
| `enableSpeechToText`  | `boolean`  | `false` | Enables the microphone/dictation button.      |
| `readOnly`            | `boolean`  | `false` | Disables editing.                             |
| `onSave`              | `function` | -       | Callback triggered with debounced state JSON. |
| `slashCommands`       | `array`    | -       | Custom list of slash command items.           |

### `Editor.Root`

The provider component that initializes the Lexical context.

- **Props**: `initialValue`, `readOnly`, `className`, `children`.

### `Editor.Content`

The main editable area.

- **Props**: `placeholder`, `className`, `minHeight`, `maxHeight`, `readOnly`.

### `Editor.Plugins`

Manages core and custom Lexical plugins.

- **Props**: `showFloatingToolbar`, `enableSpeechToText`, `customPlugins`, `slashCommands`, `onChange`, `onSave`, `children`.

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
- `Toolbar.Insert`: A cohesive tool for inserting Tables, Images, Columns, drawings, and Equations.
- `Toolbar.Separator`: Vertical divider.

---

## Styling

Don't forget to import the CSS file in your main app entry point:

```tsx
import "andi-editor/dist/andi-editor.css";
```

## Features

- **Slash Commands**: Quick access to formatting and insertion tools.
- **Floating Toolbar**: Context-sensitive formatting on selection.
- **Equations**: Integrated Katex support for mathematical notation.
- **Drawings**: Embedded Excalidraw for whiteboarding and diagrams.
- **Images**: Drag-and-drop or upload images with resizing support.
- **Tables**: Powerful table management with hover actions.
- **Speech-to-Text**: Voice dictation support.
- **Autosave**: Debounced callback for saving editor state.
