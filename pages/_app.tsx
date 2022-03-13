import type { AppProps } from 'next/app';
import Head from 'next/head';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from 'next-themes';

import '../styles/global.css';

import { UserContextProvider } from '@lib/use-user';
import { Header } from '@components/header';

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <ThemeProvider attribute="class">
            <div className="flex flex-col m-auto max-w-xl">
                <UserContextProvider>
                    <Head>
                        <link rel="icon" href="/favicon.ico" />
                        <title>Learning Path</title>
                    </Head>
                    <Header />
                    <AnimatePresence
                        exitBeforeEnter
                        initial={false}
                        onExitComplete={() => window.scrollTo(0, 0)}
                    >
                        <Component {...pageProps} />
                    </AnimatePresence>
                </UserContextProvider>
            </div>
        </ThemeProvider>
    );
};

export default App;
