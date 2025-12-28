import type { AppProps } from 'next/app';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

import Header from '../components/layout/Header';
import { ThemeProvider } from '../components/providers/ThemeProvider';
import '../styles/globals.css';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export default function App({ Component, pageProps }: AppProps) {
    return (
        <div
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
            <ThemeProvider>
                <Toaster position="top-right" />
                <div className="min-h-screen bg-background text-foreground">
                    <Header />
                    <main className="mx-auto max-w-7xl px-6 py-12">
                        <Component {...pageProps} />
                    </main>
                </div>
            </ThemeProvider>
        </div>
    );
}
