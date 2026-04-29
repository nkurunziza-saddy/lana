"use client";

import { Editor, EditorToolbar, EditorContent, EditorPlugins } from "@/components/editor";

export default function EditorClient() {
  return (
    <Editor>
      <EditorToolbar enableSpeechToText={true} />
      <EditorContent placeholder="Start typing..." />
      <EditorPlugins showFloatingToolbar={true} enableSpeechToText={true} />
    </Editor>
  );
}
