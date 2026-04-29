import { defineConfig } from "vite-plus";

export default defineConfig({
  lint: {
    options: { typeAware: true, typeCheck: true },
    ignorePatterns: ["registry/**", "apps/website/public/r/**"],
  },
  staged: {
    "!(registry/**|apps/**/public/r/**)": "vp check --fix",
  },
  run: {
    cache: true,
  },
});
