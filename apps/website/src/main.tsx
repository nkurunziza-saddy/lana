import React from "react";
import ReactDOM from "react-dom/client";
import { Editor } from "@lana/editor";
import "./style.css";

import { ThemeProvider } from "next-themes";

function App() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Lana Editor</h1>
          <p className="text-muted-foreground text-lg">
            A powerful rich-text editor built with Lexical and shadcn/ui.
          </p>
        </header>

        <main className="border rounded-xl shadow-sm bg-card overflow-hidden">
          <Editor
            className="min-h-[500px]"
            placeholder="Start typing your story..."
            showToolbar
            showFloatingToolbar
          />
        </main>

        <footer className="text-center text-sm text-muted-foreground pt-8">
          Built with React 19, Tailwind CSS v4, and Lexical.
        </footer>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" enableSystem disableTransitionOnChange>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
