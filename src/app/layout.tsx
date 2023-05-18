import { Zilla_Slab } from 'next/font/google';
import type { ReactNode } from 'react';

import { Header } from '~features/header';
import '~styles/global.css';

import { Providers } from './provider';

const zillaSlab = Zilla_Slab({
    subsets: ['latin'],
    variable: '--font-zilla-slab',
    weight: '400',
    display: 'fallback',
});

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    <div
                        className={`${zillaSlab.variable} m-auto flex max-w-xl flex-col bg-white font-sans dark:bg-[#121212]`}
                    >
                        <Header />
                        <main className="mt-4 px-2">{children}</main>
                    </div>
                </Providers>
            </body>
        </html>
    );
}
