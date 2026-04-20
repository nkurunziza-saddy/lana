import { $createCodeNode } from "@lexical/code";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createQuoteNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $createParagraphNode, $getRoot, $getSelection, $isRangeSelection } from "lexical";
import type { ToolbarState } from "..";
import { BLOCK_FORMAT_ITEMS } from "../toolbar-items";
import { ToolbarToggleButton } from "./toolbar-button";

const BLOCK_TYPE_ITEMS = BLOCK_FORMAT_ITEMS.filter((item) => item.format);

export function BlockTypeButtons({ toolbarState }: { toolbarState: ToolbarState }) {
  const [editor] = useLexicalComposerContext();

  const onClickHandler = (format: string) => {
    editor.update(() => {
      const selection = $getSelection();
      const root = $getRoot();

      // Handle empty root — create the target node directly
      if (root.getChildrenSize() === 0) {
        if (toolbarState.blockType === format) {
          const p = $createParagraphNode();
          root.append(p);
          p.selectEnd();
        } else if (format === "quote") {
          const q = $createQuoteNode();
          root.append(q);
          q.selectEnd();
        } else if (format === "code") {
          const c = $createCodeNode();
          root.append(c);
          c.selectEnd();
        }
        return;
      }

      if (toolbarState.blockType === format) {
        $setBlocksType(selection, () => $createParagraphNode());
      } else {
        if (format === "quote") {
          $setBlocksType(selection, () => $createQuoteNode());
        } else if (format === "code") {
          let sel = selection;
          if (!sel) return;
          if (!$isRangeSelection(sel) || sel.isCollapsed()) {
            $setBlocksType(sel, () => $createCodeNode());
          } else {
            const textContent = sel.getTextContent();
            const codeNode = $createCodeNode();
            sel.insertNodes([codeNode]);
            sel = $getSelection();
            if ($isRangeSelection(sel)) {
              sel.insertRawText(textContent);
            }
          }
        }
      }
    });
  };

  return (
    <>
      {BLOCK_TYPE_ITEMS.map((item) => {
        return (
          <ToolbarToggleButton
            icon={item.icon}
            isActive={toolbarState.blockType === item.name}
            key={item.name}
            onClick={() => onClickHandler(item.format!)}
            title={item.name}
          />
        );
      })}
    </>
  );
}
