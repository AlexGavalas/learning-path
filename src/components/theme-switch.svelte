<script>
    import Button from '~components/button.svelte';
    import { DEFAULT_THEME, STORAGE_KEY, THEME } from '~constants';

    const LIGHT_IMG_PROPS = {
        src: '/moon.svg',
        alt: 'Moon',
    };

    const DARK_IMG_PROPS = {
        src: '/sun.svg',
        alt: 'Sun',
    };

    let theme =
        typeof localStorage !== 'undefined'
            ? localStorage.getItem(STORAGE_KEY.THEME) ?? DEFAULT_THEME
            : DEFAULT_THEME;

    const toggleTheme = () => {
        const newTheme = theme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT;

        document.documentElement.classList.toggle(
            'dark',
            newTheme === THEME.DARK,
        );

        document.documentElement.style.setProperty('color-scheme', newTheme);

        localStorage.setItem(STORAGE_KEY.THEME, newTheme);

        theme = newTheme;
    };

    $: image = theme === THEME.LIGHT ? LIGHT_IMG_PROPS : DARK_IMG_PROPS;
</script>

<Button on:click={toggleTheme} variant="wrapper">
    <img src={image.src} alt={image.alt} width={20} height={20} />
</Button>
