/* oxlint-disable */
declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

declare module "katex/dist/katex.css";
declare module "@excalidraw/excalidraw/index.css";
