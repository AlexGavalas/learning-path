import { type APIRoute } from 'astro';

import { DEFAULT_THEME, THEME } from '~constants';

export const POST: APIRoute = ({ cookies, request, redirect }) => {
    const referer = request.headers.get('referer');

    const currentTheme = cookies.get('theme')?.value ?? DEFAULT_THEME;

    const newTheme = currentTheme === THEME.DARK ? THEME.LIGHT : THEME.DARK;

    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    cookies.set('theme', newTheme, {
        expires: oneYearFromNow,
        httpOnly: false,
        path: '/',
    });

    return redirect(referer ?? '/', 302);
};
