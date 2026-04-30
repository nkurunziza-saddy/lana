import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = join(fileURLToPath(import.meta.url), "..");
const ROOT_DIR = join(__dirname, "..");

const REGISTRY_FILES = ["registry.default.json", "registry.mira.json"];

function getFilesRecursive(dir, baseDir) {
  const results = [];
  const list = readdirSync(dir);
  list.forEach((file) => {
    file = join(dir, file);
    const stat = statSync(file);
    if (stat && stat.isDirectory()) {
      results.push(...getFilesRecursive(file, baseDir));
    } else {
      // Only include code/asset files
      if (/\.(tsx?|css|svg)$/.test(file)) {
        results.push(relative(baseDir, file));
      }
    }
  });
  return results;
}

function updateRegistry(registryPath) {
  const fullPath = join(ROOT_DIR, registryPath);
  const registry = JSON.parse(readFileSync(fullPath, "utf8"));
  const style = registryPath.includes("default") ? "default" : "mira";

  const editorItem = registry.items.find((item) => item.name === "editor");
  if (!editorItem) return;

  const sourceDir = join(ROOT_DIR, `registry/${style}/editor`);
  const files = getFilesRecursive(sourceDir, join(ROOT_DIR, `registry/${style}`));

  editorItem.files = files.map((file) => {
    const type =
      file.endsWith(".ts") || file.endsWith(".tsx")
        ? file.includes("/lib/") || file.includes("/utils/")
          ? "registry:lib"
          : "registry:component"
        : "registry:component";

    return {
      path: `registry/${style}/${file}`,
      type,
      target: file.replace("editor/", "components/editor/"),
    };
  });

  writeFileSync(fullPath, JSON.stringify(registry, null, 2));
  console.log(`Updated ${registryPath} with ${editorItem.files.length} files.`);
}

REGISTRY_FILES.forEach(updateRegistry);
