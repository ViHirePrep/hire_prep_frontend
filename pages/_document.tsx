import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="en">
            <Head />
            <body>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function() {
                                try {
                                    const theme = localStorage.getItem('theme');
                                    if (theme === 'dark') {
                                        document.documentElement.classList.add('dark');
                                    } else if (!theme) {
                                        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                                        if (prefersDark) {
                                            document.documentElement.classList.add('dark');
                                        }
                                    }
                                } catch (e) {}
                            })();
                        `,
                    }}
                />
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
