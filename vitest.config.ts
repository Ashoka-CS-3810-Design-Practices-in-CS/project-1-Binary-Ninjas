
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: [
      "components/**/*.test.ts",
      "lib/**/*.test.ts",
    ],
    exclude: [
      "tests/**",
      "node_modules/**",
    ],
    coverage: {
      provider: "v8",
      include: ["components/**/*-operation.ts"],
      reporter: ["text", "html"],
    },
  },
});
