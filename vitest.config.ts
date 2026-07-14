import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", ".next", "out", "build", "coverage"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      exclude: [
        "node_modules/**",
        ".next/**",
        "out/**",
        "build/**",
        "coverage/**",
        "**/*.{test,spec}.{ts,tsx}",
        "vitest.config.ts",
        "vitest.setup.ts",
        "next.config.*",
        "postcss.config.*",
        "eslint.config.*",
      ],
    },
  },
});
