import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", ".next", "out", "build", "coverage"],
    passWithNoTests: true,
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
        "next.config.*",
        "postcss.config.*",
        "eslint.config.*",
      ],
    },
  },
});
