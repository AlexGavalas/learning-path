import type { PlaywrightTestConfig } from '@playwright/test';

const envVarBaseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL;
const isCI = process.env.CI === 'true';

const baseURL =
    typeof envVarBaseUrl === 'string' ? envVarBaseUrl : 'http://localhost:4321';

const config: PlaywrightTestConfig = {
    use: {
        baseURL,
    },
    preserveOutput: 'never',
    testDir: 'e2e',
    snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{arg}{ext}',
    expect: {
        toHaveScreenshot: {
            maxDiffPixelRatio: 0.1,
            stylePath: './e2e/screenshot.css',
        },
    },
    ...(isCI
        ? {
              reporter: 'github',
          }
        : {
              webServer: {
                  reuseExistingServer: true,
                  command: 'pnpm dev',
                  url: 'http://localhost:4321',
              },
          }),
};

export default config;
