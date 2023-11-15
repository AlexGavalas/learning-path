import { expect, test } from '@playwright/test';

test('page has correct title', async ({ page }) => {
    await page.goto('/');
    const title = await page.title();
    expect(title).toBe('Learning Path');
});

test.describe('navigation bar', () => {
    test('is visible', async ({ page }) => {
        await page.goto('/');
        const isNavBarVisible = await page.isVisible('nav');
        expect(isNavBarVisible).toBe(true);
    });

    test('has 2 links', async ({ page }) => {
        await page.goto('/');
        const navBarLinks = await page.$$('nav a');
        expect(navBarLinks.length).toBe(2);
    });
});

test.describe('header', () => {
    test('is visible', async ({ page }) => {
        await page.goto('/');
        const isHeaderVisible = await page.isVisible('header');
        expect(isHeaderVisible).toBe(true);
    });

    test.describe('theme switch', () => {
        test('is visible', async ({ page }) => {
            await page.goto('/');

            await page.waitForLoadState('networkidle');

            const themeSwitch = await page.$('header img[alt="Moon"]');

            const isThemeSwitchVisible = await themeSwitch?.isVisible();

            expect(isThemeSwitchVisible).toBe(true);
        });

        test.describe('when javascript is disabled', () => {
            test('is visible', async ({ browser }) => {
                const context = await browser.newContext({
                    javaScriptEnabled: false,
                });

                const page = await context.newPage();

                await page.goto('/');
                await page.waitForLoadState('networkidle');

                const themeSwitch = await page.$('header img[alt="Moon"]');

                const isThemeSwitchVisible = await themeSwitch?.isVisible();

                expect(isThemeSwitchVisible).toBe(true);

                await context.close();
            });
        });
    });
});

test.describe('search area', () => {
    test('heading is visible', async ({ page }) => {
        await page.goto('/');

        const isSearchAreaHeadingVisible = await page
            .getByText('Search notes')
            .isVisible();

        expect(isSearchAreaHeadingVisible).toBe(true);
    });

    test('button is visible', async ({ page }) => {
        await page.goto('/');

        const isSearchAreaButtonVisible = await page
            .getByRole('button', { name: 'Search' })
            .isVisible();

        expect(isSearchAreaButtonVisible).toBe(true);
    });

    test.describe('input', () => {
        test('input is visible', async ({ page }) => {
            await page.goto('/');

            const isSearchAreaInputVisible = await page
                .getByLabel('Search notes')
                .isVisible();

            expect(isSearchAreaInputVisible).toBe(true);
        });

        test.describe('when user presses `/`', () => {
            test('input is focused', async ({ page }) => {
                await page.goto('/');

                const searchAreaInput = page.getByLabel('Search notes');

                await expect(searchAreaInput).not.toBeFocused();

                await page.keyboard.press('/');

                await expect(searchAreaInput).toBeFocused();
            });

            test.describe('when javascript is disabled', () => {
                test('input is not focused', async ({ browser }) => {
                    const context = await browser.newContext({
                        javaScriptEnabled: false,
                    });

                    const page = await context.newPage();

                    await page.goto('/');

                    const searchAreaInput = page.getByLabel('Search notes');

                    await expect(searchAreaInput).not.toBeFocused();

                    await page.keyboard.press('/');

                    await expect(searchAreaInput).not.toBeFocused();

                    await context.close();
                });
            });
        });
    });
});
