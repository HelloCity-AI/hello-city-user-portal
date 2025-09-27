import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/compoundComponents/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'hsl(var(--primary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        'accent-light': '#FFF5E6',
        support1: '#8AA8FF',
        support2: '#3C4CCC',
        disabledGray: '#CBD5E1',
        primaryBlack: '#383838',
        'apricot-dark': '#E69A4A',
        'purple-transition': '#B8A3FF',
        'primary-color': '#5C6DF7', // Move from backgroundImage to colors
        chat: {
          'user-message': '#5C6DF7',
          'user-message-light': '#EEF2FF',
          'user-message-pale': '#E8EEFF',
          'ai-message': '#FFFFFF',
          'ai-message-border': 'rgba(92, 109, 247, 0.08)',
          'ai-message-hover': '#FAFBFF',
          'background-primary': '#FAFBFF',
          'background-secondary': '#F8FAFC',
          accent: '#FFB663',
          'accent-light': '#FFF5E6',
          'accent-pale': '#FFF0DC',
          support: '#8AA8FF',
          'support-light': '#F0F4FF',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      fontFamily: {
        heading: ['Cabinet Grotesk"', 'sans-serif'],
        body: ['IBM Plex Sans"', 'sans-serif'],
        chatbot: ['Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #FFA863, #FF75B5, #6FA3FF)',
        'modal-gradient': 'linear-gradient(135deg, #FFB066, #80C3FF, #4788F2)',
        'disabled-gradient': 'linear-gradient(135deg, #E2E8F0, #CBD5E1)',
        'chat-background': 'linear-gradient(135deg, #FAFBFF 0%, #F8FAFC 50%, #FFF9FB 100%)',
        'chat-user-message': 'linear-gradient(135deg, #EEF2FF 0%, #E8EEFF 100%)',
        'chat-user-message-hover': 'linear-gradient(135deg, #E8EEFF 0%, #DDE4FF 100%)',
        'chat-input':
          'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
        'chat-sidebar':
          'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 251, 252, 0.98) 100%)',
        'chat-send': 'linear-gradient(135deg, #5C6DF7 0%, #8AA8FF 100%)',
        'chat-send-hover': 'linear-gradient(135deg, #4B5CE5 0%, #7A98FF 100%)',
        'brand-gradient':
          'linear-gradient(135deg, rgba(92, 109, 247, 0.05) 0%, rgba(138, 168, 255, 0.03) 50%, rgba(255, 182, 99, 0.05) 100%)',
        'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
        'chat-sidebar': '2px 0 16px rgba(0, 0, 0, 0.04)',
        'chat-sidebar-reverse': '-2px 0 16px rgba(0, 0, 0, 0.04)',
        'chat-send': '0 2px 12px rgba(92, 109, 247, 0.2)',
        'chat-send-hover': '0 4px 20px rgba(92, 109, 247, 0.3)',
        'chat-avatar-user': '0 2px 8px rgba(92, 109, 247, 0.2)',
        'chat-avatar-ai': '0 1px 3px rgba(0, 0, 0, 0.05)',
        'chat-card-hover': '0 4px 16px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        xl: '0.75rem',
        full: '9999px',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        'chat-user': '20px 20px 4px 20px',
      },
      keyframes: {
        marquee: {
          '0%': {
            transform: 'translateX(0%)',
          },
          '100%': {
            transform: 'translateX(-50%)',
          },
        },
        'fade-in': {
          from: {
            opacity: '0',
          },
          to: {
            opacity: '1',
          },
        },
        float: {
          '0%, 100%': {
            opacity: '0.8',
          },
          '50%': {
            opacity: '0.4',
          },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        'fade-in': 'fade-in 0.3s ease-out',
        float: 'float ease-in-out infinite',
      },
    },
  },
  plugins: [
    ({
      addUtilities,
    }: {
      addUtilities: (utilities: Record<string, Record<string, string>>) => void;
    }) => {
      addUtilities({
        '.paused': { 'animation-play-state': 'paused' },
        '.running': { 'animation-play-state': 'running' },
        '.glassmorphism': {
          background: 'rgba(255, 255, 255, 0.8)',
          'backdrop-filter': 'blur(20px)',
          '-webkit-backdrop-filter': 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          'box-shadow': '0 8px 32px rgba(0, 0, 0, 0.1)',
        },
        '.glassmorphism-hover:hover': {
          'box-shadow': '0 12px 40px rgba(0, 0, 0, 0.15)',
        },
      });
    },
    tailwindcssAnimate,
  ],
};
export default config;
