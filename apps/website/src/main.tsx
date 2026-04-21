import React from "react";
import ReactDOM from "react-dom/client";
import { Editor } from "@lana/editor";
import "./style.css";

import { ThemeProvider } from "next-themes";

function App() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-2.5 space-y-8">
        <main className="border">
          <Editor
            className="min-h-[500px]"
            placeholder="Start typing your story..."
            showToolbar
            showFloatingToolbar
            enableSpeechToText
          />
        </main>
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
