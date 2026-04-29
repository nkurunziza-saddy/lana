/* oxlint-disable */
// @ts-nocheck
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useRef } from "react";

export interface AutosavePluginProps {
  onSave: (editorState: string) => void;
  debounceMS?: number;
}

export default function AutosavePlugin({ onSave, debounceMS = 1000 }: AutosavePluginProps): null {
  const [editor] = useLexicalComposerContext();
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  useEffect(() => {
    let timer: any;

    return editor.registerUpdateListener(({ editorState }) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const jsonString = JSON.stringify(editorState.toJSON());
        onSaveRef.current(jsonString);
      }, debounceMS);
    });
  }, [editor, debounceMS]);

  return null;
}
