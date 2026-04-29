"use client";

import React, { createContext, useContext, useReducer, useCallback, useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  type ElementNode,
  type TextNode,
} from "lexical";
import { $isCodeNode } from "@lexical/code";
import { $isLinkNode } from "@lexical/link";
import { $isListNode, ListNode } from "@lexical/list";
import { $isHeadingNode, $isQuoteNode } from "@lexical/rich-text";
import { $isTableCellNode } from "@lexical/table";
import { $findMatchingParent, $getNearestNodeOfType, mergeRegister } from "@lexical/utils";

const initialState = {
  isBold: false,
  isItalic: false,
  isUnderline: false,
  isStrikethrough: false,
  isCode: false,
  isLink: false,
  isSubscript: false,
  isSuperscript: false,
  isCapitalized: false,
  isUppercase: false,
  isLowercase: false,
  isTable: false,
  isBulletedList: false,
  isNumberedList: false,
  isCheckList: false,
  isQuote: false,
  isCodeBlock: false,
  linkUrl: "",
  blockType: "paragraph",
  canUndo: false,
  canRedo: false,
};

export type ToolbarState = typeof initialState;
type Action =
  | { type: "UPDATE"; payload: Partial<ToolbarState> }
  | { type: "SET_CAN_UNDO"; payload: boolean }
  | { type: "SET_CAN_REDO"; payload: boolean };

const toolbarReducer = (state: ToolbarState, action: Action): ToolbarState => {
  switch (action.type) {
    case "UPDATE": {
      let hasChanges = false;

      for (const [key, value] of Object.entries(action.payload) as [
        keyof ToolbarState,
        ToolbarState[keyof ToolbarState],
      ][]) {
        if (state[key] !== value) {
          hasChanges = true;
          break;
        }
      }

      return hasChanges ? { ...state, ...action.payload } : state;
    }
    case "SET_CAN_UNDO":
      return state.canUndo === action.payload ? state : { ...state, canUndo: action.payload };
    case "SET_CAN_REDO":
      return state.canRedo === action.payload ? state : { ...state, canRedo: action.payload };
    default:
      return state;
  }
};

const ToolbarContext = createContext<{
  state: ToolbarState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function ToolbarProvider({ children }: { children: React.ReactNode }) {
  const [editor] = useLexicalComposerContext();
  const [state, dispatch] = useReducer(toolbarReducer, initialState);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    const newToolbarState = {
      isBulletedList: false,
      isNumberedList: false,
      isCheckList: false,
      isQuote: false,
      isCodeBlock: false,
      isStrikethrough: false,
      isBold: false,
      isItalic: false,
      isUnderline: false,
      isCode: false,
      isLink: false,
      isSubscript: false,
      isSuperscript: false,
      isCapitalized: false,
      isUppercase: false,
      isLowercase: false,
      isTable: false,
      linkUrl: "",
      blockType: "paragraph",
    };

    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root" ? anchorNode : anchorNode.getTopLevelElementOrThrow();

      let blockType = "paragraph";
      if ($isListNode(element)) {
        const parentList = $getNearestNodeOfType(anchorNode, ListNode);
        blockType = parentList ? parentList.getListType() : element.getListType();
      } else {
        if ($isHeadingNode(element)) {
          blockType = element.getTag();
        } else if ($isQuoteNode(element)) {
          blockType = "quote";
        } else if ($isCodeNode(element)) {
          blockType = "code";
        }
      }
      newToolbarState.blockType = blockType;

      const cell = $findMatchingParent(anchorNode, (node) => $isTableCellNode(node));
      newToolbarState.isTable = cell !== null;

      let isLink = false;
      let node: ElementNode | TextNode | null = anchorNode;
      while (node) {
        if ($isLinkNode(node)) {
          isLink = true;
          break;
        }
        const parent: ElementNode | null = node.getParent();
        if (parent === node) break;
        node = parent;
      }
      newToolbarState.isLink = isLink;
      newToolbarState.linkUrl = isLink && $isLinkNode(node) ? node.getURL() : "";

      newToolbarState.isBulletedList = blockType === "bullet";
      newToolbarState.isNumberedList = blockType === "number";
      newToolbarState.isCheckList = blockType === "check";
      newToolbarState.isQuote = blockType === "quote";
      newToolbarState.isCodeBlock = blockType === "code";

      newToolbarState.isBold = selection.hasFormat("bold");
      newToolbarState.isItalic = selection.hasFormat("italic");
      newToolbarState.isUnderline = selection.hasFormat("underline");
      newToolbarState.isStrikethrough = selection.hasFormat("strikethrough");
      newToolbarState.isCode = selection.hasFormat("code");
      newToolbarState.isSubscript = selection.hasFormat("subscript");
      newToolbarState.isSuperscript = selection.hasFormat("superscript");
      newToolbarState.isCapitalized = selection.hasFormat("capitalize");
      newToolbarState.isUppercase = selection.hasFormat("uppercase");
      newToolbarState.isLowercase = selection.hasFormat("lowercase");
    }

    dispatch({ type: "UPDATE", payload: newToolbarState });
  }, []);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateToolbar();
    });
  }, [editor, updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload: boolean) => {
          dispatch({ type: "SET_CAN_UNDO", payload });
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload: boolean) => {
          dispatch({ type: "SET_CAN_REDO", payload });
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    );
  }, [editor, updateToolbar]);

  return <ToolbarContext.Provider value={{ state, dispatch }}>{children}</ToolbarContext.Provider>;
}

export function useToolbar() {
  const context = useContext(ToolbarContext);
  if (!context) {
    throw new Error("useToolbar must be used within a ToolbarProvider");
  }
  return context;
}
