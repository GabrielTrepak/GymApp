/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Direção "giz e ferro": base clara e disciplinada, laranja de ação,
        // verde-ferro pra progresso positivo.
        bg: '#F7F7F5',
        surface: '#FFFFFF',
        ink: '#1A1D29',
        'ink-soft': '#2B2F3D',
        accent: '#FF4D2E',
        'accent-soft': '#FFE4DC',
        gain: '#2BB673',
        'gain-soft': '#DFF3E8',
        border: '#E5E6E1',
        muted: '#6B7280',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        data: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '10px',
      },
    },
  },
  plugins: [],
}
