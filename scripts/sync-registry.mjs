import {
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
  mkdirSync,
  rmSync,
  existsSync,
} from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, "..");
const SOURCE_DIR = join(ROOT_DIR, "packages/editor/src");
const TARGET_MIRA = join(ROOT_DIR, "registry/mira/editor");
const TARGET_DEFAULT = join(ROOT_DIR, "registry/default/editor");
const OVERRIDES_DIR = join(ROOT_DIR, "registry/default/overrides");

const COMPONENT_MAP = {
  Button: "button",
  Input: "input",
  Label: "label",
  Toggle: "toggle",
  Tooltip: "tooltip",
  TooltipContent: "tooltip",
  TooltipTrigger: "tooltip",
  TooltipProvider: "tooltip",
  Popover: "popover",
  PopoverContent: "popover",
  PopoverTrigger: "popover",
  PopoverHeader: "popover",
  PopoverTitle: "popover",
  PopoverDescription: "popover",
  DropdownMenu: "dropdown-menu",
  DropdownMenuTrigger: "dropdown-menu",
  DropdownMenuContent: "dropdown-menu",
  DropdownMenuItem: "dropdown-menu",
  DropdownMenuGroup: "dropdown-menu",
  DropdownMenuLabel: "dropdown-menu",
  DropdownMenuCheckboxItem: "dropdown-menu",
  DropdownMenuRadioGroup: "dropdown-menu",
  DropdownMenuRadioItem: "dropdown-menu",
  DropdownMenuSeparator: "dropdown-menu",
  DropdownMenuShortcut: "dropdown-menu",
  DropdownMenuSub: "dropdown-menu",
  DropdownMenuSubTrigger: "dropdown-menu",
  DropdownMenuSubContent: "dropdown-menu",
  DropdownMenuPortal: "dropdown-menu",
  Dialog: "dialog",
  DialogTrigger: "dialog",
  DialogContent: "dialog",
  DialogHeader: "dialog",
  DialogFooter: "dialog",
  DialogTitle: "dialog",
  DialogDescription: "dialog",
  DialogClose: "dialog",
  DialogOverlay: "dialog",
  DialogPortal: "dialog",
  ScrollArea: "scroll-area",
  ScrollBar: "scroll-area",
};

function copyRecursive(src, dest, style) {
  const stats = statSync(src);
  if (stats.isDirectory()) {
    mkdirSync(dest, { recursive: true });
    readdirSync(src).forEach((child) => {
      copyRecursive(join(src, child), join(dest, child), style);
    });
  } else {
    // Only copy relevant files
    if ([".ts", ".tsx", ".svg", ".css"].includes(extname(src))) {
      let contentToProcess = "";

      if (style === "default") {
        // Path relative to packages/editor/src
        const relativePath = src.replace(SOURCE_DIR, "").replace(/^\//, "");
        const overridePath = join(OVERRIDES_DIR, relativePath);
        if (existsSync(overridePath)) {
          contentToProcess = readFileSync(overridePath, "utf8");
        } else {
          contentToProcess = readFileSync(src, "utf8");
        }
      } else {
        contentToProcess = readFileSync(src, "utf8");
      }

      let content = contentToProcess;
      if ([".ts", ".tsx"].includes(extname(src))) {
        content = transformContent(content, src);
      }
      writeFileSync(dest, content);
    }
  }
}

function transformContent(content, filePath) {
  // 1. Transform RTL CSS (physical to logical classes)
  // We avoid touching the editor theme config which relies on physical classes for lexical state
  if (!filePath.endsWith("lib/editor-theme/index.ts")) {
    content = content.replace(/\bpl-/g, "ps-");
    content = content.replace(/\bpr-/g, "pe-");
    content = content.replace(/\bml-/g, "ms-");
    content = content.replace(/\bmr-/g, "me-");
    content = content.replace(/\bleft-/g, "start-");
    content = content.replace(/\bright-/g, "end-");
    content = content.replace(/\btext-left\b/g, "text-start");
    content = content.replace(/\btext-right\b/g, "text-end");
  }

  // 2. Transform @lana/utils -> @/lib/utils
  if (content.includes("@lana/utils")) {
    content = content.replace(/['"]@lana\/utils['"]/g, "'@/lib/utils'");
  }

  // 3. Transform @lana/ui imports
  const lanaUiRegex = /import\s+\{([^}]+)\}\s+from\s+['"]@lana\/ui['"]/g;
  content = content.replace(lanaUiRegex, (match, importsStr) => {
    const imports = importsStr
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);
    const componentImports = {};

    imports.forEach((name) => {
      const component = COMPONENT_MAP[name];
      if (component) {
        if (!componentImports[component]) componentImports[component] = [];
        componentImports[component].push(name);
      } else {
        if (!componentImports["unknown"]) componentImports["unknown"] = [];
        componentImports["unknown"].push(name);
      }
    });

    return Object.entries(componentImports)
      .map(([comp, names]) => {
        if (comp === "unknown") {
          return `import { ${names.join(", ")} } from "@/components/ui"`;
        }
        return `import { ${names.join(", ")} } from "@/components/ui/${comp}"`;
      })
      .join("\n");
  });

  return content;
}

console.log("Cleaning target directories...");
rmSync(TARGET_MIRA, { recursive: true, force: true });
mkdirSync(TARGET_MIRA, { recursive: true });

rmSync(TARGET_DEFAULT, { recursive: true, force: true });
mkdirSync(TARGET_DEFAULT, { recursive: true });

console.log('Syncing "mira" style...');
copyRecursive(SOURCE_DIR, TARGET_MIRA, "mira");

console.log('Syncing "default" style...');
copyRecursive(SOURCE_DIR, TARGET_DEFAULT, "default");

console.log("Registry sync complete!");
