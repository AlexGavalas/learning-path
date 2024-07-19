import type { PlaywrightTestConfig } from '@playwright/test';

const ENV_BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL;

const IS_CI = process.env.CI === 'true';

const LOCAL_BASE_URL = 'http://localhost:4321';

const BASE_URL = ENV_BASE_URL || LOCAL_BASE_URL;

const CI_PIXEL_DIFF = 0.3;

const config: PlaywrightTestConfig = {
    expect: {
        toHaveScreenshot: {
            maxDiffPixelRatio: IS_CI ? CI_PIXEL_DIFF : 0,
        },
    },
    preserveOutput: 'failures-only',
    snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{arg}{ext}',
    testDir: 'e2e',
    use: {
        baseURL: BASE_URL,
    },
    ...(!IS_CI && {
        webServer: {
            command: 'cross-env PROD=true pnpm dev',
            reuseExistingServer: true,
            url: LOCAL_BASE_URL,
        },
    }),
};

export default config;
