export default {
  plugins: {
    'tailwindcss/nesting': {},
    'postcss-import': {},
    'tailwindcss': {},
    'postcss-preset-env': {
      stage: 1,
      features: {
        'nesting-rules': true,
      },
    },
    'autoprefixer': {},
  },
};
