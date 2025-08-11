import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5C6DF7', // Soft Indigo
        accent: '#FFB663', // Warm Apricot
        support1: '#8AA8FF', // Soft Blue
        support2: '#3C4CCC', // Deep Blue-Violet
        disabledGray: '#CBD5E1', // Disabled Gray
      },
      fontFamily: {
        heading: ['"Cabinet Grotesk"', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
        chatbot: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #FFA863, #FF75B5, #6FA3FF)',
        'modal-gradient': 'linear-gradient(135deg, #FFB066, #80C3FF, #4788F2)',
        'disabled-gradient': 'linear-gradient(135deg, #E2E8F0, #CBD5E1)',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        xl: '0.75rem', // Primary CTA
        full: '9999px', // Rounded button
      },
    },
  },
  plugins: [],
};
export default config;
