import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const shadcnCli = path.join(
  rootDir,
  "packages",
  "ui",
  "node_modules",
  "shadcn",
  "dist",
  "index.js",
);
const baseOutputDir = path.join(rootDir, "apps", "website", "public", "r");

const registries = [
  { config: "registry.mira.json", output: "mira" },
  { config: "registry.default.json", output: "default" },
];

for (const { config, output } of registries) {
  const outputDir = path.join(baseOutputDir, output);
  mkdirSync(outputDir, { recursive: true });

  console.log(`Building registry for style: ${output}...`);
  const result = spawnSync(
    process.execPath,
    [shadcnCli, "build", path.join(rootDir, config), "--output", outputDir, "--cwd", rootDir],
    {
      cwd: rootDir,
      stdio: "inherit",
    },
  );

  if (result.status !== 0) {
    console.error(`Failed to build registry for style: ${output}`);
    process.exit(result.status ?? 1);
  }
}

console.log("All registries built successfully.");
