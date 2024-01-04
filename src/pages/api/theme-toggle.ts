import { type APIRoute } from 'astro';

import { DEFAULT_THEME, ONE_YEAR, THEME } from '~constants';

export const POST: APIRoute = ({ cookies, request, redirect }) => {
    const referer = request.headers.get('referer');

    const currentTheme = cookies.get('theme')?.value ?? DEFAULT_THEME;

    const newTheme = currentTheme === THEME.DARK ? THEME.LIGHT : THEME.DARK;

    cookies.set('theme', newTheme, {
        maxAge: ONE_YEAR,
        httpOnly: false,
        path: '/',
    });

    return redirect(referer ?? '/', 302);
};
