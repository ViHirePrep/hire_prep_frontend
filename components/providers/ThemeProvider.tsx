import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    resetToSystemTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme | undefined>(undefined);

    const applyTheme = (newTheme: Theme) => {
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const getSystemTheme = (): Theme => {
        if (typeof window === 'undefined') return 'light';

        return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme | null;

        let initialTheme: Theme;

        if (savedTheme) {
            initialTheme = savedTheme;
        } else {
            initialTheme = getSystemTheme();
        }

        setTheme(initialTheme);
        applyTheme(initialTheme);

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
            if (!localStorage.getItem('theme')) {
                const newSystemTheme = e.matches ? 'dark' : 'light';

                setTheme(newSystemTheme);
                applyTheme(newSystemTheme);
            }
        };

        mediaQuery.addEventListener('change', handleSystemThemeChange);

        return () => {
            mediaQuery.removeEventListener('change', handleSystemThemeChange);
        };
    }, []);

    const toggleTheme = () => {
        if (!theme) return;

        const newTheme = theme === 'light' ? 'dark' : 'light';

        localStorage.setItem('theme', newTheme);
        setTheme(newTheme);
        applyTheme(newTheme);
    };

    const resetToSystemTheme = () => {
        localStorage.removeItem('theme');

        const systemTheme = getSystemTheme();

        setTheme(systemTheme);
        applyTheme(systemTheme);
    };

    const contextValue = {
        theme: theme || 'light',
        toggleTheme,
        resetToSystemTheme,
    };

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (context === undefined) {
        return;
    }

    return context;
}
