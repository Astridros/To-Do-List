// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    environmentOptions: {
      jsdom: { url: 'http://localhost' } // permite usar localStorage y eventos
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'], // tipos de reporte
      reportsDirectory: './coverage',      // carpeta donde se guardan
      lines: 70,
      functions: 70,
      statements: 70,
      branches: 60
    }
  }
});
