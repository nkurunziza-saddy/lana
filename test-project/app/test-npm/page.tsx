"use client";

import dynamic from "next/dynamic";

const NpmEditorClient = dynamic(() => import("@/components/npm-editor-client"), {
  ssr: false,
});

export default function TestNpmPage() {
  return <NpmEditorClient />;
}
