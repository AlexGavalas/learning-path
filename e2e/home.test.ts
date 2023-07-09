import { expect, test } from '@playwright/test';

test('page has title of "Learning Path"', async ({ page }) => {
    await page.goto('/');
    const title = await page.title();
    expect(title).toBe('Learning Path');
});
