import type { Config } from "tailwindcss";

export default {
  darkMode: 'media',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          light: '#62cff4',
          dark: '#1e4fc7',
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          light: '#e0f2fe',
          dark: '#bae6fd',
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          light: '#7DD3FC',
          dark: '#0EA5E9',
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        danger: {
          DEFAULT: '#DC2626',
          light: '#F87171',
          dark: '#B91C1C',
        },
        neutral: {
          DEFAULT: '#F8FAFC',
          dark: '#1E293B',
          darker: '#0F172A',
        },
        text: {
          DEFAULT: '#0F172A',
          light: '#64748B',
          dark: '#F8FAFC',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#1E293B',
        }
      },
      backgroundImage: {
        'gradient-blue-sky': 'linear-gradient(135deg, #62cff4 0%, #2c67f2 100%)',
        'gradient-blue-sky-reverse': 'linear-gradient(135deg, #2c67f2 0%, #62cff4 100%)',
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(0,0,0,0.05)',
        'hover': '0 4px 6px -1px rgba(44, 103, 242, 0.1), 0 2px 4px -1px rgba(44, 103, 242, 0.06)',
        'blue-glow': '0 0 20px rgba(98, 207, 244, 0.3)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        'blob': 'blob 7s infinite',
      },
      keyframes: {
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
