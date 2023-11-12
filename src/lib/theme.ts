import { DEFAULT_THEME, THEME } from '~constants';

export const getInitialTheme = (): string => {
    const cookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith('theme='));

    if (cookie !== undefined) {
        return cookie.split('=')[1];
    }

    return DEFAULT_THEME;
};

export const setThemeInPage = (newTheme: string): void => {
    document.documentElement.classList.toggle('dark', newTheme === THEME.DARK);

    document.documentElement.style.setProperty('color-scheme', newTheme);

    document.cookie = `theme=${newTheme}; path=/;`;
};
