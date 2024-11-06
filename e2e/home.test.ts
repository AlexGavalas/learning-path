import { expect, test } from '@playwright/test';

test('page has correct title', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const title = await page.title();

    expect(title).toBe('Learning Path');
});

test('page is displaying correctly', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    await expect(page).toHaveScreenshot('home.png', {
        fullPage: true,
    });
});

test('page is displaying correctly in dark mode', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const themeSwitch = page.locator('header img[alt="Moon"]');

    await themeSwitch.click();

    await expect(page).toHaveScreenshot('home-dark.png', {
        fullPage: true,
    });
});

test.describe('navigation bar', () => {
    test('is visible', async ({ page }) => {
        await page.goto('/', { waitUntil: 'domcontentloaded' });

        const navBar = page.getByRole('navigation');

        await expect(navBar).toBeVisible();
    });

    test('has 2 links', async ({ page }) => {
        await page.goto('/', { waitUntil: 'domcontentloaded' });

        const links = page.locator('nav a');

        const linksCount = await links.count();

        expect(linksCount).toBe(2);
    });
});

test.describe('header', () => {
    test('is visible', async ({ page }) => {
        await page.goto('/', { waitUntil: 'domcontentloaded' });

        const header = page.locator('header');

        await expect(header).toBeVisible();
    });

    test.describe('theme switch', () => {
        test('is visible', async ({ page }) => {
            await page.goto('/', { waitUntil: 'domcontentloaded' });

            await page.waitForLoadState('networkidle');

            const themeSwitch = page.locator('header img[alt="Moon"]');

            await expect(themeSwitch).toBeVisible();
        });

        test.describe('when javascript is disabled', () => {
            test('is visible', async ({ browser }) => {
                const context = await browser.newContext({
                    javaScriptEnabled: false,
                });

                const page = await context.newPage();

                await page.goto('/', { waitUntil: 'domcontentloaded' });
                await page.waitForLoadState('networkidle');

                const themeSwitch = page.locator('header img[alt="Moon"]');

                await expect(themeSwitch).toBeVisible();

                await context.close();
            });
        });
    });
});

test.describe('search area', () => {
    test('field is visible', async ({ page }) => {
        await page.goto('/', { waitUntil: 'domcontentloaded' });

        const searchAreaField = page.getByLabel('Search the notes');

        await expect(searchAreaField).toBeVisible();
    });

    test('button is visible', async ({ page }) => {
        await page.goto('/', { waitUntil: 'domcontentloaded' });

        const searchAreaButton = page.getByRole('button', {
            name: 'Search',
        });

        await expect(searchAreaButton).toBeVisible();
    });

    test.describe('input', () => {
        test.describe('when user presses `/`', () => {
            test('input is focused', async ({ page }) => {
                await page.goto('/', { waitUntil: 'domcontentloaded' });

                const searchAreaField = page.getByLabel('Search the notes');

                await expect(searchAreaField).not.toBeFocused();

                await page.keyboard.press('/');

                await expect(searchAreaField).toBeFocused();
            });

            test.describe('when javascript is disabled', () => {
                test('input is not focused', async ({ browser }) => {
                    const context = await browser.newContext({
                        javaScriptEnabled: false,
                    });

                    const page = await context.newPage();

                    await page.goto('/', { waitUntil: 'domcontentloaded' });

                    const searchAreaField = page.getByLabel('Search the notes');

                    await expect(searchAreaField).not.toBeFocused();

                    await page.keyboard.press('/');

                    await expect(searchAreaField).not.toBeFocused();

                    await context.close();
                });
            });
        });
    });
});
