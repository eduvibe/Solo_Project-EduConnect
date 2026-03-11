import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#EAF4F3',
                    100: '#CFE6E5',
                    200: '#A6CFCD',
                    300: '#77B2AF',
                    400: '#4F918F',
                    500: '#2F726F',
                    600: '#235D5B',
                    700: '#1D4746',
                    800: '#153534',
                    900: '#0F2626',
                },
            },
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
        },
    },

    plugins: [forms],
};
