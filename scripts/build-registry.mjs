import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getBaseUrl } from "../packages/utils/src/index.ts";

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
const baseOutputDir = path.join(rootDir, "apps/website/public/r");

const homepage = getBaseUrl();

console.log(`Building registry with homepage: ${homepage}`);

const registries = [
  { config: "registry.mira.json", output: "mira" },
  { config: "registry.default.json", output: "default" },
];

for (const { config, output } of registries) {
  const outputDir = path.join(baseOutputDir, output);
  mkdirSync(outputDir, { recursive: true });

  const configPath = path.join(rootDir, config);
  const registryData = JSON.parse(readFileSync(configPath, "utf8"));

  // Update homepage dynamically
  registryData.homepage = homepage;

  // Create a temporary config file for the build
  const tempConfigPath = path.join(rootDir, `temp.${config}`);
  writeFileSync(tempConfigPath, JSON.stringify(registryData, null, 2));

  console.log(`Building registry for style: ${output}...`);
  const result = spawnSync(
    process.execPath,
    [shadcnCli, "build", tempConfigPath, "--output", outputDir, "--cwd", rootDir],
    {
      cwd: rootDir,
      stdio: "inherit",
    },
  );

  // Clean up temp file
  rmSync(tempConfigPath);

  if (result.status !== 0) {
    console.error(`Failed to build registry for style: ${output}`);
    process.exit(result.status ?? 1);
  }
}

console.log("All registries built successfully.");
