import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from 'next-themes';

import '../styles/global.css';

import { UserContextProvider } from '~lib/use-user';
import { Header } from '~features/header';

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

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <>
            {isProd && <GoogleAnalytics />}
            {isProd && <Analytics />}
            <ThemeProvider attribute="class">
                <UserContextProvider>
                    <Head>
                        <title>Learning Path</title>
                        <meta
                            name="viewport"
                            content="width=device-width, initial-scale=1"
                        />
                    </Head>
                    <div className="flex flex-col m-auto max-w-xl">
                        <Header />
                        <AnimatePresence
                            mode="wait"
                            initial={false}
                            onExitComplete={() => window.scrollTo(0, 0)}
                        >
                            <Component {...pageProps} />
                        </AnimatePresence>
                    </div>
                </UserContextProvider>
            </ThemeProvider>
        </>
    );
};

export default App;
