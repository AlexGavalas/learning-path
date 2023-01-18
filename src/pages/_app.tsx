import { Zilla_Slab } from '@next/font/google';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from 'next-themes';
import { type AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import { useEffect } from 'react';

import { Head as HTMLHead } from '~components/head';
import { Header } from '~features/header';
import { UserContextProvider } from '~lib/use-user';
import '~styles/global.css';

const GOOGLE_MEASUREMENT_ID = 'G-2CSN2TQ5R3';

const GoogleAnalytics = () => (
    <>
        <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_MEASUREMENT_ID}`}
        />
        <Script id="google-analytics" strategy="afterInteractive">
            {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GOOGLE_MEASUREMENT_ID}');
            `}
        </Script>
    </>
);

const isProd = process.env.NODE_ENV === 'production';

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
        <>
            {isProd && <GoogleAnalytics />}
            <ThemeProvider attribute="class">
                <UserContextProvider>
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
                </UserContextProvider>
            </ThemeProvider>
        </>
    );
};

export default App;
