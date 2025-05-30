/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'clover'],
      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        '*.config.*',
        'bin/',
        'test/',
        'src/openapi-mcp-server.d.ts'
      ]
    }
  }
})
