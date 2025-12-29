import { useEffect, useState } from 'react';

import Link from 'next/link';

import { getCurrentUser, logout } from '@/lib/api';
import { useTheme } from '@/components/providers/ThemeProvider';

const navItems = [
    { label: 'Home', href: '/' },
    { label: 'README', href: '/readme' },
];

export default function Header() {
    const [user, setUser] = useState<any>(null);
    const themeContext = useTheme();
    const theme = themeContext?.theme || 'light';
    const toggleTheme = themeContext?.toggleTheme;

    useEffect(() => {
        setUser(getCurrentUser());

        const handleStorage = () => setUser(getCurrentUser());
        const handleAuthEvent = () => setUser(getCurrentUser());

        window.addEventListener('storage', handleStorage);
        window.addEventListener('auth-changed', handleAuthEvent);

        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('auth-changed', handleAuthEvent);
        };
    }, []);

    const handleLogout = async () => {
        await logout();
    };

    return (
        <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <Link className="group flex items-center gap-3" href="/">
                    <span className="text-lg font-bold tracking-tight text-primary transition-all duration-300 group-hover:scale-105">
                        HirePrep
                    </span>
                </Link>

                <nav className="flex items-center gap-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {item.label}
                        </Link>
                    ))}

                    <button
                        onClick={toggleTheme}
                        className="group relative flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background transition-colors hover:bg-muted"
                        aria-label="Toggle theme"
                    >
                        <svg
                            className={`absolute h-4 w-4 transition-all duration-300 ${
                                theme === 'light'
                                    ? 'rotate-0 scale-100 opacity-100'
                                    : 'rotate-90 scale-0 opacity-0'
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                        </svg>
                        <svg
                            className={`absolute h-4 w-4 transition-all duration-300 ${
                                theme === 'dark'
                                    ? 'rotate-0 scale-100 opacity-100'
                                    : '-rotate-90 scale-0 opacity-0'
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                            />
                        </svg>
                    </button>

                    {user ? (
                        <div className="flex items-center gap-4">
                            {user.avatar && (
                                <img
                                    src={user.avatar}
                                    alt="avatar"
                                    className="h-8 w-8 rounded-full object-cover"
                                />
                            )}
                            <span className="text-sm text-muted-foreground">
                                {user.name || user.email}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="rounded-lg bg-secondary px-5 py-2 text-sm font-medium transition-colors hover:bg-accent text-white"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-dark"
                        >
                            Sign in
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}
