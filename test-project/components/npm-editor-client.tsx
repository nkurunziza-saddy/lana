"use client";

import { Editor, EditorToolbar, EditorContent, EditorPlugins } from "lana-editor";
import "lana-editor/styles.css";

export default function NpmEditorClient() {
  return (
    <div className="mx-auto max-w-4xl mt-12 p-4">
      <h1 className="text-2xl font-bold mb-8">NPM Package Test</h1>
      <Editor>
        <EditorToolbar enableSpeechToText={true} />
        <EditorContent
          placeholder="Start typing with the NPM package..."
          className="min-h-[500px]"
        />
        <EditorPlugins showFloatingToolbar={true} enableSpeechToText={true} />
      </Editor>
    </div>
  );
}
