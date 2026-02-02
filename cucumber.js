module.exports = {
  default: {
    // 特性文件路徑
    paths: ['features/**/*.feature'],

    // 步驟定義
    require: [
      'features/step-definitions/**/*.ts',
      'features/support/**/*.ts',
    ],

    // 使用 TypeScript
    requireModule: ['ts-node/register'],

    // 報告格式
    format: [
      'progress-bar',
      'html:test-results/cucumber-report.html',
      'json:test-results/cucumber-report.json',
    ],

    // 語言設定
    language: 'zh-TW',

    // 平行執行
    parallel: 2,

    // 失敗重試
    retry: 1,
    retryTagFilter: '@flaky',

    // 嚴格模式
    strict: true,

    // 發布設定
    publish: false,
  },

  // CI 環境配置
  ci: {
    paths: ['features/**/*.feature'],
    require: [
      'features/step-definitions/**/*.ts',
      'features/support/**/*.ts',
    ],
    requireModule: ['ts-node/register'],
    format: [
      'json:test-results/cucumber-report.json',
      '@cucumber/pretty-formatter',
    ],
    parallel: 4,
    strict: true,
    publish: false,
  },

  // 開發環境配置
  dev: {
    paths: ['features/**/*.feature'],
    require: [
      'features/step-definitions/**/*.ts',
      'features/support/**/*.ts',
    ],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'html:test-results/cucumber-report.html',
    ],
    parallel: 1,
    strict: false,
    dryRun: false,
  },

  // WIP (Work In Progress) 配置
  wip: {
    paths: ['features/**/*.feature'],
    require: [
      'features/step-definitions/**/*.ts',
      'features/support/**/*.ts',
    ],
    requireModule: ['ts-node/register'],
    format: ['progress-bar'],
    tags: '@wip',
    strict: false,
    dryRun: false,
  },
};
