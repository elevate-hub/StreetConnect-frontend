/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#F97316', hover: '#EA6C0A' },
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        text: { primary: '#111827', secondary: '#6B7280' },
        surface: { bg: '#FAFAFA', card: '#FFFFFF', border: '#E5E7EB' }
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      borderRadius: { card: '12px', btn: '8px' },
      boxShadow: { card: '0 1px 3px rgba(0,0,0,0.08)' },
      spacing: { '4.5': '18px' }
    }
  },
  plugins: []
};
