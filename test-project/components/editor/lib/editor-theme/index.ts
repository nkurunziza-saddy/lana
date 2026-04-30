/* oxlint-disable */
import type { EditorThemeClasses } from "lexical";

export const theme: EditorThemeClasses = {
  ltr: "text-left",
  rtl: "text-right",

  paragraph: "relative m-0 mt-5 leading-7 first:mt-0",

  heading: {
    h1: "mt-14 mb-4 text-[2.4rem] leading-[1.02] font-bold tracking-[-0.05em] text-foreground first:mt-0",
    h2: "mt-12 mb-4 text-[1.95rem] leading-[1.08] font-bold tracking-[-0.04em] text-foreground first:mt-0",
    h3: "mt-10 mb-3 text-[1.55rem] leading-[1.15] font-semibold tracking-[-0.03em] text-foreground first:mt-0",
    h4: "mt-9 mb-2 text-[1.18rem] leading-[1.2] font-semibold tracking-[-0.02em] text-foreground first:mt-0",
    h5: "mt-8 mb-2 text-[1rem] leading-6 font-semibold tracking-[-0.01em] text-foreground first:mt-0",
    h6: "mt-8 mb-2 text-[0.9rem] leading-6 font-semibold tracking-[0.01em] text-muted-foreground first:mt-0",
  },

  quote:
    "my-8 border-l-2 border-border ps-4 text-[0.98rem] leading-7 text-muted-foreground italic first:mt-0",

  list: {
    nested: {
      listitem: "list-none",
    },
    olDepth: [
      "list-decimal list-outside ml-6",
      "list-[upper-alpha] list-outside ml-6",
      "list-[lower-alpha] list-outside ml-6",
      "list-[upper-roman] list-outside ml-6",
      "list-[lower-roman] list-outside ml-6",
    ],
    ol: "list-decimal list-outside my-6 ml-6 space-y-1 first:mt-0",
    ul: "list-disc list-outside my-6 ml-6 space-y-1 first:mt-0",
    listitem: "pl-2 leading-7",
    listitemChecked:
      "relative block min-h-[1.5em] pl-6 list-none outline-none text-muted-foreground/50 line-through before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:size-4 before:rounded-sm before:border before:border-foreground before:bg-foreground before:cursor-pointer before:flex before:items-center before:justify-center before:[content:'✓'] before:text-background before:text-xs before:font-bold",
    listitemUnchecked:
      "relative block min-h-[1.5em] pl-6 list-none outline-none before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:size-4 before:rounded-sm before:border before:border-border before:bg-muted before:cursor-pointer hover:before:border-foreground/50 transition-colors duration-80",
    checklist: "my-6 space-y-2 pl-1 first:mt-0",
  },

  text: {
    bold: "font-bold",
    capitalize: "capitalize",
    code: "mx-0.5 rounded-md border border-border/80 bg-muted px-1.5 py-0.5 text-[0.875em] leading-snug font-mono text-foreground",
    highlight: "bg-yellow-200/40 dark:bg-yellow-900/30 px-1 rounded-sm",
    italic: "italic",
    lowercase: "lowercase",
    strikethrough: "line-through opacity-70",
    subscript: "text-xs align-sub",
    superscript: "text-xs align-super",
    underline: "underline decoration-auto underline-offset-auto",
    underlineStrikethrough: "underline line-through opacity-70",
    uppercase: "uppercase",
  },

  code: "relative my-5 block overflow-x-auto rounded-lg border border-border/70 bg-muted/88 px-4 py-3.5 text-[0.9rem] leading-7 font-mono first:mt-0 dark:bg-muted/60",
  codeHighlight: {
    atrule: "text-blue-600 dark:text-blue-400",
    attr: "text-blue-600 dark:text-blue-400",
    boolean: "text-purple-600 dark:text-purple-400",
    builtin: "text-green-600 dark:text-green-400",
    cdata: "text-gray-500 dark:text-gray-400",
    char: "text-green-600 dark:text-green-400",
    class: "text-red-600 dark:text-red-400",
    "class-name": "text-red-600 dark:text-red-400",
    comment: "text-gray-500 dark:text-gray-400 italic",
    constant: "text-purple-600 dark:text-purple-400",
    deleted: "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700",
    doctype: "text-gray-500 dark:text-gray-400",
    entity: "text-orange-600 dark:text-orange-400",
    function: "text-red-600 dark:text-red-400",
    important: "text-yellow-600 dark:text-yellow-400 font-bold",
    inserted: "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700",
    keyword: "text-blue-600 dark:text-blue-400 font-medium",
    namespace: "text-yellow-600 dark:text-yellow-400",
    number: "text-purple-600 dark:text-purple-400",
    operator: "text-orange-600 dark:text-orange-400",
    prolog: "text-gray-500 dark:text-gray-400",
    property: "text-purple-600 dark:text-purple-400",
    punctuation: "text-gray-600 dark:text-gray-300",
    regex: "text-yellow-600 dark:text-yellow-400",
    selector: "text-green-600 dark:text-green-400",
    string: "text-green-600 dark:text-green-400",
    symbol: "text-purple-600 dark:text-purple-400",
    tag: "text-purple-600 dark:text-purple-400",
    unchanged: "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600",
    url: "text-orange-600 dark:text-orange-400 underline",
    variable: "text-yellow-600 dark:text-yellow-400",
  },

  link: "cursor-pointer text-editor-link underline underline-offset-3 decoration-from-font decoration-editor-link/35 transition-colors hover:text-editor-link/80",

  table:
    "my-8 w-full max-w-full table-fixed border-separate border-spacing-0 overflow-hidden rounded-lg border border-editor-border bg-editor-background [&_tr:last-child_td]:border-b-0 [&_tr:last-child_th]:border-b-0",
  tableAddColumns:
    "absolute h-full w-5 top-0 -right-5 hover:bg-editor-muted cursor-pointer border-0 rounded-sm transition-all duration-200 opacity-0 hover:opacity-100 after:content-['+'] after:absolute after:flex after:items-center after:justify-center after:w-full after:h-full after:text-editor-muted-foreground after:text-lg after:font-bold",
  tableAddRows:
    "absolute w-full h-5 left-0 -bottom-5 hover:bg-editor-muted cursor-pointer border-0 rounded-sm transition-all duration-200 opacity-0 hover:opacity-100 after:content-['+'] after:absolute after:flex after:items-center after:justify-center after:w-full after:h-full after:text-editor-muted-foreground after:text-lg after:font-bold",
  tableAlignment: {
    center: "mx-auto",
    right: "ml-auto",
  },
  tableCell:
    "relative min-w-[7.5rem] overflow-auto border-r border-b border-editor-border p-3 align-top text-left outline-none last:border-r-0 md:min-w-[5rem] md:p-2.5 md:text-sm [&_p]:mt-0",
  tableCellActionButton:
    "absolute top-0 right-0 z-10 w-6 h-6 bg-editor-background border border-editor-border rounded-bl-sm hover:bg-editor-muted transition-colors duration-200 flex items-center justify-center text-xs text-editor-muted-foreground hover:text-editor-foreground cursor-pointer opacity-0 group-hover:opacity-100",
  tableCellActionButtonContainer: "absolute top-0 right-0 w-6 h-6 pointer-events-auto",
  tableCellHeader:
    "relative min-w-[7.5rem] overflow-auto border-r border-b border-editor-border bg-muted/65 p-3 align-top text-left text-sm font-semibold outline-none last:border-r-0 md:min-w-[5rem] md:p-2.5 [&_p]:mt-0",
  tableCellResizer:
    "absolute right-0 top-0 h-full w-1 bg-transparent cursor-col-resize hover:bg-editor-primary/50 transition-colors duration-200",
  tableCellSelected: "bg-editor-primary/10 outline-2 outline-editor-primary",
  tableFrozenColumn: "sticky left-0 z-20 bg-editor-background border border-editor-border",
  tableFrozenRow: "sticky top-0 z-10 bg-editor-background border border-editor-border",
  tableRowStriping: "",
  tableScrollableWrapper: "my-0 mb-6 overflow-x-auto rounded-lg border border-editor-border/90",
  tableSelected: "outline-2 outline-editor-primary",
  tableSelection: "bg-editor-primary/10 border-2 border-editor-primary/50 rounded-sm",

  hr: "my-10 h-px border-none bg-border/90",
  hrSelected: "outline-2 outline-primary rounded-sm select-none",

  hashtag:
    "bg-blue-100/60 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1 rounded-sm font-medium",

  blockCursor:
    "block absolute pointer-events-none after:content-[''] after:absolute after:block after:-top-0.5 after:w-5 after:border-t-2 after:border-foreground after:animate-[cursor-blink_1.1s_steps(2,start)_infinite]",

  characterLimit: "bg-red-200 dark:bg-red-900/50",

  mark: "bg-yellow-200/40 px-1 rounded-sm",
  markOverlap: "bg-yellow-300/60 px-1 rounded-sm",

  embedBlock: {
    base: "select-none my-2",
    focus: "outline-2 outline-editor-primary rounded-sm",
  },

  layoutContainer: "grid gap-4 my-4",
  layoutItem: "min-w-0 max-w-full rounded-lg border border-dashed border-border p-4",

  autocomplete: "text-editor-muted-foreground bg-muted/50 px-2 py-1 rounded-sm",

  tab: "relative inline-block no-underline w-[4ch]",

  specialText:
    "bg-yellow-300/60 dark:bg-yellow-900/40 text-yellow-900 dark:text-yellow-100 px-1 rounded-sm font-medium",

  image:
    "my-8 h-auto max-w-full rounded-lg border border-border/70 transition-[outline,box-shadow] outline-[3px] outline-transparent",
  inlineImage: "inline-block max-h-6 rounded-sm",
};

export default theme;
