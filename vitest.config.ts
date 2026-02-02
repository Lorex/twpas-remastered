import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // 排除 E2E 測試目錄，E2E 測試使用 Playwright 執行
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/e2e/**',
    ],
    // 只包含 src 目錄下的測試
    include: ['src/**/*.test.ts'],
    // 全域設定
    globals: true,
  },
});
