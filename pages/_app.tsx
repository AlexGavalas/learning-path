import type { AppProps } from 'next/app';

import Head from 'next/head';
import { AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import { ThemeProvider } from 'next-themes';

import '../styles/global.css';

import { Header } from '../components/header';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 36rem;
    margin: auto;
`;

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <ThemeProvider attribute="class">
            <Container>
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
            </Container>
        </ThemeProvider>
    );
};

export default App;
