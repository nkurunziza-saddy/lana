import { Editor, EditorToolbar, EditorContent, EditorPlugins } from "@/components/editor";

export default function Home() {
  return (
    <Editor>
      <EditorToolbar enableSpeechToText={true} />
      <EditorContent placeholder="Start typing..." />
      <EditorPlugins showFloatingToolbar={true} enableSpeechToText={true} />
    </Editor>
  );
}
