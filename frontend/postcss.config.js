// postcss.config.js
module.exports = {
  plugins: {
    'tailwindcss': {},
    'postcss-nesting': {}, // Enables `@nest` (not `@apply`) nesting
    'postcss-preset-env': {
      stage: 1, // Enables future CSS features like nesting, custom at-rules
      features: {
        'nesting-rules': true,
      },
    },
    'autoprefixer': {},
  },
}
