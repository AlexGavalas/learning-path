import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from 'next-themes';
import { type AppProps } from 'next/app';
import { Zilla_Slab } from 'next/font/google';
import Head from 'next/head';
import { useEffect } from 'react';

import { Head as HTMLHead } from '~components/head';
import { Header } from '~features/header';
import '~styles/global.css';

const BASE_URL = 'Learning Path';

const zillaSlab = Zilla_Slab({
    subsets: ['latin'],
    variable: '--font-zilla-slab',
    weight: '400',
    display: 'fallback',
});

const App = ({ Component, pageProps, router }: AppProps) => {
    const q = router.query.q?.toString();

    const title = q ? `${q} | ${BASE_URL}` : BASE_URL;

    useEffect(() => {
        document.documentElement.lang = 'en';
    }, []);

    return (
        <ThemeProvider attribute="class">
            <Head>
                <HTMLHead />
                <title>{title}</title>
            </Head>
            <div
                className={`${zillaSlab.variable} m-auto flex max-w-xl flex-col bg-white font-sans dark:bg-[#121212]`}
            >
                <Header />
                <AnimatePresence mode="wait" initial={false}>
                    <Component {...pageProps} />
                </AnimatePresence>
            </div>
        </ThemeProvider>
    );
};

export default App;
