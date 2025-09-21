/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dynamic segment-aware colors using CSS custom properties
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        foreground: 'var(--color-foreground)',
        muted: 'var(--color-muted)',
        border: 'var(--color-border)',
        ring: 'var(--color-ring)',
        
        // Legacy brand colors (keeping for backward compatibility)
        brand: {
          50: '#f8f4ef',
          100: '#efe6d9',
          200: '#e1cfb3',
          300: '#cfae86',
          400: '#b7895f',
          500: '#8e623f' /* primary brown */,
          600: '#6f4b30',
          700: '#563a25',
          800: '#3d291a',
          900: '#2b1c12',
        },
      },
      boxShadow: {
        // Dynamic segment-aware shadows
        'segment-sm': 'var(--shadow-sm)',
        'segment-md': 'var(--shadow-md)',
        'segment-lg': 'var(--shadow-lg)',
        'segment-xl': 'var(--shadow-xl)',
        
        // Legacy shadows
        soft: '0 8px 30px rgba(0,0,0,0.06)',
        dark: '0 8px 30px rgba(0,0,0,0.3)',
      },
      borderRadius: {
        // Dynamic segment-aware radius
        'segment-sm': 'var(--radius-sm)',
        'segment-md': 'var(--radius-md)',
        'segment-lg': 'var(--radius-lg)',
        'segment-xl': 'var(--radius-xl)',
        'segment-2xl': 'var(--radius-2xl)',
        
        // Legacy radius
        '2xl': '1rem',
      },
      animation: {
        'fade-in': 'fadeIn var(--duration-normal) var(--easing-smooth)',
        'slide-up': 'slideUp var(--duration-fast) var(--easing-default)',
        'slide-down': 'slideDown var(--duration-fast) var(--easing-default)',
        'scale-in': 'scaleIn var(--duration-fast) var(--easing-spring)',
        'bounce-gentle': 'bounceGentle var(--duration-slow) var(--easing-spring)',
        
        // Segment-specific animations
        'segment-hover': 'segmentHover var(--duration-fast) var(--easing-default)',
        'segment-pulse': 'segmentPulse 2s var(--easing-smooth) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-4px)' },
          '60%': { transform: 'translateY(-2px)' },
        },
        segmentHover: {
          '0%': { transform: 'scale(1) rotate(0deg)' },
          '50%': { transform: 'scale(1.02) rotate(1deg)' },
          '100%': { transform: 'scale(1.05) rotate(0deg)' },
        },
        segmentPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      spacing: {
        'segment-section': 'var(--spacing-section)',
        'segment-component': 'var(--spacing-component)',
      },
      backgroundImage: {
        'segment-texture': 'var(--bg-texture)',
        'segment-overlay': 'var(--bg-overlay)',
        'segment-card': 'var(--bg-card)',
      },
    },
  },
  plugins: [],
}
