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

export const Header = (): JSX.Element => {
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

    return (
        <header className="flex w-full items-center justify-between border-b border-solid border-b-light-border dark:border-b-dark-border">
            <a
                href="/"
                className="my-2 cursor-pointer rounded-lg p-2 text-2xl font-[700] text-black hover:bg-gray-300 hover:no-underline dark:text-white dark:hover:bg-gray-800 xs:text-3xl"
            >
                Learning Path
            </a>
            <div className="mr-3">
                {isMounted && (
                    <Button onClick={toggleTheme} variant="wrapper">
                        <img
                            src={image.src}
                            alt={image.alt}
                            width={20}
                            height={20}
                        />
                    </Button>
                )}
            </div>
        </header>
    );
};
