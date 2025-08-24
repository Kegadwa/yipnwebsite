import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './styles/**/*.css',
  ],
  theme: {
    extend: {
      colors: {
        // Core Brand Colors
        background: '#F7F1E1',      // Cream background
        foreground: '#66371B',      // Dark brown text
        primary: '#66371B',         // Dark brown/maroon
        'primary-foreground': '#F7F1E1', // Cream text on primary
        secondary: '#8A6240',       // Medium brown/tan
        'secondary-foreground': '#F7F1E1', // Cream text on secondary
        
        // Wellness Colors
        wellness: '#7ACC7A',        // Wellness green
        'wellness-foreground': '#66371B', // Dark brown text on wellness
        
        // UI Element Colors
        muted: {
          DEFAULT: '#F0E8D8',      // Muted background
          foreground: '#9B7A5C',   // Muted text
        },
        accent: '#8A6240',          // Accent color
        border: '#E8DCC8',          // Border color
        input: '#EFE4D0',           // Input background
        card: '#F7F1E1',            // Card background
        
        // Interactive Colors
        destructive: '#DC2626',     // Danger/error color
        'destructive-foreground': '#FFFFFF', // White text on destructive
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'bounce-in': 'bounceIn 0.8s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
