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
                    50: '#EAF4FF',
                    100: '#D6EAFF',
                    200: '#ADD5FF',
                    300: '#7DBBFF',
                    400: '#4AA0FF',
                    500: '#1F86FF',
                    600: '#0B74D1',
                    700: '#075EAA',
                    800: '#064A86',
                    900: '#053B66',
                },
            },
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
        },
    },

    plugins: [forms],
};
