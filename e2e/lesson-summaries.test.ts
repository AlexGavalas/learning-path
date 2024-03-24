import { expect, test } from '@playwright/test';

test('page has correct title', async ({ page }) => {
    await page.goto('/summaries');

    const title = await page.title();

    expect(title).toBe('Lesson Summaries | Learning Path');
});

test('page is displaying correctly', async ({ page }) => {
    await page.goto('/summaries');

    await expect(page).toHaveScreenshot('lesson-summaries.png', {
        fullPage: true,
        stylePath: './e2e/screenshot.css',
    });
});

test('page is displaying correctly in dark mode', async ({ page }) => {
    await page.goto('/summaries');

    const themeSwitch = page.locator('header img[alt="Moon"]');

    await themeSwitch.click();

    await expect(page).toHaveScreenshot('lesson-summaries-dark.png', {
        fullPage: true,
        stylePath: './e2e/screenshot.css',
    });
});
