import { defineConfig } from 'vitest/config';

/** Shared Vitest defaults for workspace packages (run from package directory). */
export default defineConfig({
  test: {
    passWithNoTests: true,
    include: ['src/**/*.test.ts'],
  },
});
