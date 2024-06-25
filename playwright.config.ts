import type { PlaywrightTestConfig } from '@playwright/test';

const envVarBaseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL;
const isCI = process.env.CI === 'true';

const baseURL =
    typeof envVarBaseUrl === 'string' ? envVarBaseUrl : 'http://localhost:4321';

const CI_PIXEL_DIFF = 0.1;

const config: PlaywrightTestConfig = {
    expect: {
        toHaveScreenshot: {
            maxDiffPixelRatio: isCI ? CI_PIXEL_DIFF : 0,
        },
    },
    preserveOutput: 'failures-only',
    snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{arg}{ext}',
    testDir: 'e2e',
    use: {
        baseURL,
    },
    ...(!isCI && {
        webServer: {
            command: 'cross-env PROD=true pnpm dev',
            reuseExistingServer: true,
            url: 'http://localhost:4321',
        },
    }),
};

export default config;
