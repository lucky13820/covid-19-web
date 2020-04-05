module.exports = {
    theme: {
        colors: {
            orange: {
                100: '#FDF0EA',
                500: '#EA6D30',
                700: '#C05621'
            },
            pink: {
                100: '#FEEFF2',
                300: '#F9CBD5',
                500: '#F06381'
            },
            gray: {
                100: '#F6F6F7',
                200: '#dcdddd',
                300: '#E1E4E9',
                500: '#828282',
                700: '#1D1E1F',
            },
            white: '#f1f1f1',
            black: '#1e2022',
        },
        fontFamily: {
            'display': ['Texta Heavy', '-apple-system', 'BlinkMacSystemFont', "Segoe UI", 'Roboto,tahoma', 'Verdana,arial', "PingFang SC", "Hiragino Sans GB", "WenQuanYi Micro Hei", 'STXihei', "华文细黑", "Microsoft Yahei", "微软雅黑", 'sans-serif'],
            'body': ['Rubik Light', '-apple-system', 'BlinkMacSystemFont', "Segoe UI", 'Roboto,tahoma', 'Verdana,arial', "PingFang SC", "Hiragino Sans GB", "WenQuanYi Micro Hei", 'STXihei', "华文细黑", "Microsoft Yahei", "微软雅黑", 'sans-serif'],
        },
        fontSize: {
            'xs': '.75rem',
            'sm': '.875rem',
            'base': '1rem',
            'lg': '1.125rem',
            'xl': '1.25rem',
            '2xl': '1.5rem',
            '3xl': '2rem',
            '4xl': '2.5rem',
            '5xl': '3rem'
        },
        boxShadow: {
            'default': '0 1px 3px 0 rgba(0, 0, 0, .1), 0 1px 2px 0 rgba(0, 0, 0, .06)',
            'md': ' 0px 1px 3px rgba(9, 41, 120, 0.13), 0px 4px 8px rgba(0, 0, 0, 0.13)',
            'lg': ' 0px 3px 6px rgba(9, 41, 120, 0.13), 0px 8px 16px rgba(0, 0, 0, 0.13)',
            'xl': ' 0 20px 25px -5px rgba(0, 0, 0, .1), 0 10px 10px -5px rgba(0, 0, 0, .04)'
        },
        letterSpacing: {
            wide: '.015em',
            wider: '.025em'
        },
        screens: {
            'sm': '320px',
            'md': '780px',
            'lg': '1024px',
            'xl': '1440px',
        },
        fluidContainer: {
            'default': {
                maxWidth: '1240px', // defaults to null (no maximum width)
                padding: '48px', // defaults to '15px'
                responsivePadding: { // defaults to {}
                    'sm': '30px', // at screen 'sm', the padding will change to 30px
                },
            },
        },
        height: {
            "xl": '380px',
            "64": "320px",
        },
    },

    variants: { // for the utilities
        fluidContainer: ['responsive'], // defaults to ['responsive']
    },
    plugins: [
        require('tailwindcss-fluid-container')({
            componentPrefix: 'c-', // defaults to 'c-'
            widthUtilities: true, // defaults to true
            paddingUtilities: true, // defaults to true
            marginUtilities: true, // defaults to true
            negativeMarginUtilities: true, // defaults to true
        }),
    ],
}