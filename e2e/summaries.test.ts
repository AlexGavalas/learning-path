import { expect, test } from '@playwright/test';

test('page has correct title', async ({ page }) => {
    await page.goto('/summaries', { waitUntil: 'domcontentloaded' });

    const title = await page.title();

    expect(title).toBe('Summaries | Learning Path');
});

test('page is displaying correctly', async ({ page }) => {
    await page.goto('/summaries', { waitUntil: 'domcontentloaded' });

    await page.setViewportSize({ height: 749, width: 1280 });

    await expect(page).toHaveScreenshot('summaries.png', {
        fullPage: true,
    });
});

test('page is displaying correctly in dark mode', async ({ page }) => {
    await page.goto('/summaries', { waitUntil: 'domcontentloaded' });

    const themeSwitch = page.locator('header img[alt="Moon"]');

    await themeSwitch.click();

    await page.setViewportSize({ height: 749, width: 1280 });

    await expect(page).toHaveScreenshot('summaries-dark.png', {
        fullPage: true,
    });
});
