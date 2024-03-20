import { DEFAULT_THEME, ONE_YEAR, THEME } from '~constants';
import { darkTheme, lightTheme } from '~styles/theme.css';

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
    document.documentElement.classList.toggle(
        lightTheme,
        newTheme === THEME.LIGHT,
    );

    document.documentElement.classList.toggle(
        darkTheme,
        newTheme === THEME.DARK,
    );

    document.documentElement.style.setProperty('color-scheme', newTheme);

    document.cookie = `theme=${newTheme}; max-age=${ONE_YEAR}; path=/;`;
};
