import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from 'next-themes';
import { type AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';

import { Header } from '~features/header';
import { UserContextProvider } from '~lib/use-user';

import '../styles/global.css';

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

const App = ({ Component, pageProps, router }: AppProps) => {
    const q = router.query.q?.toString();

    const title = q ? `${BASE_URL} - ${q}` : BASE_URL;

    return (
        <>
            {isProd && <GoogleAnalytics />}
            <ThemeProvider attribute="class">
                <UserContextProvider>
                    <Head>
                        <title>{title}</title>
                        <meta
                            name="viewport"
                            content="width=device-width, initial-scale=1"
                        />
                    </Head>
                    <div className="flex flex-col m-auto max-w-xl">
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
