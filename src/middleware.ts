import { type EndpointOutput } from 'astro';
import { defineMiddleware } from 'astro:middleware';

import { DEFAULT_THEME, THEME } from '~constants';

export const onRequest = defineMiddleware(
    async (
        { cookies, redirect, request, url },
        next,
    ): Promise<Response | EndpointOutput> => {
        const shouldToggleTheme =
            request.method === 'GET' &&
            url.searchParams.get('theme') === 'toggle';

        if (shouldToggleTheme) {
            const currentTheme = cookies.get('theme')?.value ?? DEFAULT_THEME;

            const newTheme =
                currentTheme === THEME.DARK ? THEME.LIGHT : THEME.DARK;

            cookies.set('theme', newTheme, { path: '/' });

            url.searchParams.delete('theme');

            return redirect(url.toString());
        }

        return await next();
    },
);
