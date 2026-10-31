import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    // ✅ NEW: container default (jodi `container` class use koren)
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',    // mobile 16px
        sm: '1.5rem',       // 640+
        lg: '2rem',         // 1024+
        xl: '2.5rem',       // 1280+
      },
      screens: {
        '2xl': '1280px',
      },
    },
    extend: {
      // ✅ NEW: extra small breakpoint (choto phone)
      screens: {
        xs: '375px',
      },
      colors: {
        primary: { DEFAULT: '#D81B60', 50: '#FCE4EC', 100: '#F8BBD0', 600: '#AD1457', 700: '#880E4F' },
        accent: { DEFAULT: '#F2A93B', 50: '#FEF5E6', 600: '#D98E1F' },
        ink: '#1B201D',
        muted: '#5E6A63',
        canvas: '#F5F7F4',
        surface: '#FFFFFF',
        line: '#E2E7E3',
        success: '#1E8E4E',
        warning: '#D99A00',
        danger: '#C93535',
      },
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      borderRadius: { sm: '6px', md: '10px', lg: '16px', xl: '24px' },
      boxShadow: {
        card: '0 1px 2px rgba(20,30,24,0.06), 0 4px 16px rgba(20,30,24,0.06)',
        lift: '0 12px 28px rgba(20,30,24,0.14)',
      },
      // ✅ NEW: responsive font/space utilities
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom, 0px)',
        'safe-top': 'env(safe-area-inset-top, 0px)',
      },
      // ✅ NEW: toast animation (globals.css er sathe match)
      keyframes: {
        'toast-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'toast-in': 'toast-in 0.25s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
      },
      // ✅ NEW: mobile e choto image container
      aspectRatio: {
        'product': '1 / 1',
        'banner-mobile': '4 / 3',
        'banner-desktop': '16 / 6',
      },
    },
  },
  plugins: [],
};

export default config;