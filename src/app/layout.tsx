'use client';

import { ThemeProvider } from 'next-themes';
import { Zilla_Slab } from 'next/font/google';

import { Head } from '~components/head';
import { Header } from '~features/header';
import '~styles/global.css';

const zillaSlab = Zilla_Slab({
    subsets: ['latin'],
    variable: '--font-zilla-slab',
    weight: '400',
    display: 'fallback',
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <Head />
            </head>
            <body>
                <ThemeProvider attribute="class">
                    <div
                        className={`${zillaSlab.variable} m-auto flex max-w-xl flex-col bg-white font-sans dark:bg-[#121212]`}
                    >
                        <Header />
                        <main className="mt-4 px-2">{children}</main>
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
