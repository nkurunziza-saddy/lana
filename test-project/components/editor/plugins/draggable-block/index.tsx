"use client";

import type { JSX } from "react";
import { DraggableBlockPlugin_EXPERIMENTAL } from "@lexical/react/LexicalDraggableBlockPlugin";
import { useRef } from "react";
import { GripVertical } from "lucide-react";

const DRAGGABLE_BLOCK_MENU_CLASSNAME = "draggable-block-menu";

function isOnMenu(element: HTMLElement): boolean {
  return !!element.closest(`.${DRAGGABLE_BLOCK_MENU_CLASSNAME}`);
}

export default function DraggableBlockPlugin({
  anchorElem = typeof document !== "undefined" ? document.body : undefined,
}: {
  anchorElem?: HTMLElement;
}): JSX.Element {
  const menuRef = useRef<HTMLDivElement>(null);
  const targetLineRef = useRef<HTMLDivElement>(null);

  return (
    <DraggableBlockPlugin_EXPERIMENTAL
      anchorElem={anchorElem}
      menuRef={menuRef}
      targetLineRef={targetLineRef}
      menuComponent={
        <div
          ref={menuRef}
          className={`${DRAGGABLE_BLOCK_MENU_CLASSNAME} flex items-center size-7 rounded-md bg-background border border-border shadow-sm opacity-0 transition-opacity duration-200 cursor-grab active:cursor-grabbing hover:opacity-100 will-change-transform absolute start-0 top-0 z-50`}
        >
          <div className="flex items-center justify-center w-full h-full hover:bg-accent transition-colors rounded-md">
            <GripVertical className="size-3.5 text-muted-foreground" />
          </div>
        </div>
      }
      targetLineComponent={
        <div
          ref={targetLineRef}
          className="draggable-block-target-line pointer-events-none bg-primary/40 h-1 absolute start-0 top-0 opacity-0 will-change-transform rounded-full"
        />
      }
      isOnMenu={isOnMenu}
    />
  );
}
