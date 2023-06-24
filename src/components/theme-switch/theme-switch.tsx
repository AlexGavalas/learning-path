import { useEffect, useState } from 'react';

import { Button } from '~components/button';
import { DEFAULT_THEME, STORAGE_KEY, THEME } from '~constants';

const LIGHT_IMG_PROPS = {
    src: '/moon.svg',
    alt: 'Moon',
};

const DARK_IMG_PROPS = {
    src: '/sun.svg',
    alt: 'Sun',
};

export const ThemeSwitch = (): JSX.Element | null => {
    const [isMounted, setIsMounted] = useState(false);

    const [theme, setTheme] = useState(
        typeof localStorage !== 'undefined'
            ? localStorage.getItem(STORAGE_KEY.THEME) ?? DEFAULT_THEME
            : DEFAULT_THEME,
    );

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const toggleTheme = (): void => {
        const newTheme = theme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT;

        setTheme(newTheme);

        document.documentElement.classList.toggle(
            'dark',
            newTheme === THEME.DARK,
        );

        document.documentElement.style.setProperty('color-scheme', newTheme);

        localStorage.setItem(STORAGE_KEY.THEME, newTheme);
    };

    const image = theme === THEME.LIGHT ? LIGHT_IMG_PROPS : DARK_IMG_PROPS;

    if (!isMounted) {
        return null;
    }

    return (
        <Button onClick={toggleTheme} variant="wrapper">
            <img {...image} width={20} height={20} />
        </Button>
    );
};
