/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Premium Green Palette
                primary: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                    950: '#052e16',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'Inter', 'sans-serif'],
            },
            animation: {
                'shimmer': 'shimmer 2s linear infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'fadeIn': 'fadeIn 0.5s ease-out',
                'slideUp': 'slideUp 0.5s ease-out',
                'float': 'float 3s ease-in-out infinite',
            },
            keyframes: {
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)' },
                    '100%': { boxShadow: '0 0 30px rgba(34, 197, 94, 0.8)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
            boxShadow: {
                'glow-sm': '0 0 10px rgba(34, 197, 94, 0.3)',
                'glow-md': '0 0 20px rgba(34, 197, 94, 0.4)',
                'glow-lg': '0 0 30px rgba(34, 197, 94, 0.5)',
            },
        },
    },
    plugins: [],
}
