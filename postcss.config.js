const purgecss = require("@fullhuman/postcss-purgecss");
const cssnano = require("cssnano");

module.exports = {
  plugins: [
    require("tailwindcss"),
    require('postcss-nested'),
    require("autoprefixer"),
    cssnano({
      preset: "default"
    }),
    purgecss({
      content: [
        "./src/*.html",
        './node_modules/tailwindcss-dark-mode/prefers-dark.js',
      ],
      defaultExtractor: content => content.match(/[\w-/:]*[\w-/:]/g) || []
    })
  ]
};
