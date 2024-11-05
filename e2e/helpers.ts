import { type Page, expect } from '@playwright/test';

export const expectScreenshotToMatch = async (page: Page, name: string) => {
    await expect(page).toHaveScreenshot(name, {
        fullPage: true,
    });
};
