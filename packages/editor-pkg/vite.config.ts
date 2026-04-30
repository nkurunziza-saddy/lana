import dts from "vite-plugin-dts";
import { defineConfig } from "vite-plus";

export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: "./tsconfig.json",
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: {
        index: "src/index.tsx",
      },
      formats: ["es"],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    target: "esnext",
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        /^@lexical\//,
        /^lexical/,
        "katex",
        "katex/dist/katex.css",
        "@excalidraw/excalidraw",
        /^lucide-react/,
        "react-error-boundary",
        /^@base-ui\//,
        /^use-sync-external-store/,
        "next-themes",
      ],
    },
    cssCodeSplit: false,
  },
  css: {
    // Prevent Vite from inlining/processing external CSS imports
    preprocessorOptions: {},
  },
});
