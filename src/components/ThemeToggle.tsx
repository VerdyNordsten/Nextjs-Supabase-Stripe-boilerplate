'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="w-10 h-10 rounded-lg border border-border bg-background hover:bg-muted transition-colors flex items-center justify-center"
        aria-label="Toggle theme"
      >
        <div className="w-5 h-5 animate-pulse bg-muted-foreground rounded" />
      </button>
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="w-10 h-10 rounded-lg border border-border bg-background hover:bg-muted transition-all duration-200 flex items-center justify-center group relative overflow-hidden"
      aria-label="Toggle theme"
    >
      <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity" />

      <Sun
        className={`h-5 w-5 text-yellow-500 absolute transition-all duration-300 ${
          isDark
            ? 'opacity-0 scale-0 rotate-180'
            : 'opacity-100 scale-100 rotate-0'
        }`}
      />

      <Moon
        className={`h-5 w-5 text-blue-400 absolute transition-all duration-300 ${
          !isDark
            ? 'opacity-0 scale-0 -rotate-180'
            : 'opacity-100 scale-100 rotate-0'
        }`}
      />

      <div className="h-5 w-5" />
    </button>
  );
}