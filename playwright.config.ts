import type { PlaywrightTestConfig } from '@playwright/test';

const envVarBaseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL;

const baseURL =
    typeof envVarBaseUrl === 'string' ? envVarBaseUrl : 'http://localhost:3000';

const config: PlaywrightTestConfig = {
    use: {
        baseURL,
    },
    webServer: {
        command: 'pnpm dev',
        url: 'http://localhost:3000',
    },
};

export default config;
