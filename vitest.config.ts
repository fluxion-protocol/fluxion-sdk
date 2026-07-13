import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      statements: 95,
      branches: 90,
      functions: 95,
      lines: 95,
      exclude: ['node_modules/', 'dist/', '**/*.test.ts'],
    },
    include: ['tests/**/*.test.ts'],
  },
});
