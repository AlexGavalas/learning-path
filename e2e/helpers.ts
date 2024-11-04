import { type Page, expect } from '@playwright/test';

export const expectScreenshotToMatch = async (page: Page, name: string) => {
    // Temporary hack to work around pixel diff issue on CI
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForFunction('window.scrollY === 0');

    await expect(page).toHaveScreenshot(name, {
        fullPage: true,
    });
};
