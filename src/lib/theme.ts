import { DEFAULT_THEME, STORAGE_KEY, THEME } from '~constants';

export const getInitialTheme = (): string => {
    return typeof localStorage !== 'undefined'
        ? localStorage.getItem(STORAGE_KEY.THEME) ?? DEFAULT_THEME
        : DEFAULT_THEME;
};

export const setThemeInPage = (newTheme: string): void => {
    document.documentElement.classList.toggle('dark', newTheme === THEME.DARK);

    document.documentElement.style.setProperty('color-scheme', newTheme);

    localStorage.setItem(STORAGE_KEY.THEME, newTheme);
};
