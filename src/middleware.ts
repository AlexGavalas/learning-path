import { defineMiddleware } from 'astro:middleware';

import { DEFAULT_THEME, THEME } from '~constants';

// eslint-disable-next-line @typescript-eslint/promise-function-async
export const onRequest = defineMiddleware(({ request, cookies, url }, next) => {
    const shouldToggleTheme =
        request.method === 'GET' && url.searchParams.get('theme') === 'toggle';

    if (shouldToggleTheme) {
        const currentTheme = cookies.get('theme')?.value ?? DEFAULT_THEME;

        const newTheme = currentTheme === THEME.DARK ? THEME.LIGHT : THEME.DARK;

        cookies.set('theme', newTheme);

        url.searchParams.delete('theme');

        return Response.redirect(url);
    }

    return next();
});
