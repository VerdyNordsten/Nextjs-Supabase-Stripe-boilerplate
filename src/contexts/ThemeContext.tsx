'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes';

const ThemeContext = createContext<{
  theme: string | undefined;
  setTheme: (theme: string) => void;
  resolvedTheme: string | undefined;
}>({
  theme: undefined,
  setTheme: () => {},
  resolvedTheme: undefined,
});

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <ThemeContextInner>
        {children}
      </ThemeContextInner>
    </NextThemesProvider>
  );
}

function ThemeContextInner({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<string | undefined>(undefined);
  const [resolvedTheme, setResolvedTheme] = useState<string | undefined>(undefined);

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const currentTheme = storedTheme || systemTheme;

    setTheme(currentTheme);
    setResolvedTheme(currentTheme);

    if (storedTheme) {
      document.documentElement.classList.add(storedTheme);
      if (storedTheme === 'dark') {
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      document.documentElement.classList.add(systemTheme);
      if (systemTheme === 'dark') {
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const handleSetTheme = (newTheme: string) => {
    setTheme(newTheme);
    setResolvedTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
  };

  if (!mounted) {
    return <div>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};