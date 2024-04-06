import { type APIRoute } from 'astro';

import { DEFAULT_THEME, ONE_YEAR, THEME } from '~constants';

const HTTP_STATUS_FOUND = 302;

export const POST: APIRoute = ({ cookies, request, redirect }) => {
    const referer = request.headers.get('referer');

    const currentTheme = cookies.get('theme')?.value ?? DEFAULT_THEME;

    const newTheme = currentTheme === THEME.DARK ? THEME.LIGHT : THEME.DARK;

    cookies.set('theme', newTheme, {
        httpOnly: false,
        maxAge: ONE_YEAR,
        path: '/',
    });

    return redirect(referer ?? '/', HTTP_STATUS_FOUND);
};
