import type { Config } from "tailwindcss"

const config: Config = {
  purge: ['./src/**/**/*.{js,ts,jsx,tsx,mdx}'],

  content: [
    "./src/**/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1rem',
        lg: 'rem',
        xl: '1rem',
        '2xl': '1.5rem',
      },
      screens: {
        sm: "100%",
        md: "100%",
        lg: "1024px",
        xl: "1232px",
      },
    },
    fontFamily: {
      'univers': ['"Univers LT Std"', 'system-ui', 'sans-serif'],
      'laila': ['"Laila"', 'system-ui', 'sans-serif'],
      'opensans': ['"Open Sans"', 'system-ui', 'sans-serif']
    },
    fontSize: {
      '0': '0',
      'xs': '0.625rem', //10px
      'sm': '0.75rem', //12px
      'm': '0.875rem', // 14px
      'base': '1rem', //16px
      'l': '1.125rem', // 18px
      'xl': '1.25rem', //20px
      'xxl': '1.5rem', //24px
      'xxxl': '1.75rem', // 28px
      '2xl': '1.875rem', // 30px
      '3xl': '2rem', // 32px
      '4xl': '2.25rem', // 36px
      '5xl': '2.5rem', // 40px
      '6xl': '3.125rem', // 50px
    },
    extend: {
      colors: {
        'primary': '#f7265d',
        'default-black': '#363e44',
        'color-secondary': '#FEEBF1',
        'color-tertiary': '#ffbe21',
        'color-neutral': '#5a6872',
        'color-pink-500': '#fcbacc',
        'red': '#cd0000',
        'red-100': '#a70000',
        'red-wine': '#31020E',
        'gray': '#ccc',
        'shadow-gray': '#f8f8f8',
        'shadow-dark-gray': '#e7e7e7',
        'gray-200': '#e9eaf0',
        'light-pink': '#fff5f8',
        'light-gray': '#5a6872',
        'gray-100': '#f8f9f9',
        'gray-300': '#e9ebed',
        'gray-400': '#f0f2f5',
        'gray-500': '#c2c8cc',
        'gray-600': '#f9fafb',
        'blue': '#4856df',
        'gray-700': '#e5e7fa',
        'orange': '#fff3d6'
      },
      maxWidth: {
        '1/2': '50%',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
}

export default config
