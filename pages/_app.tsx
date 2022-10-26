import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Analytics } from '@vercel/analytics/react';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from 'next-themes';

import '../styles/global.css';

import { UserContextProvider } from '@lib/use-user';
import { Header } from '@components/header';

const isProd = process.env.NODE_ENV === 'production';

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <>
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
            {isProd && <Analytics />}
        </>
    );
};

export default App;
