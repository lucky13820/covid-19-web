const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  // This option controls if and how source maps are generated.
  // https://webpack.js.org/configuration/devtool/
  devtool: "eval-cheap-module-source-map",

  // https://webpack.js.org/concepts/entry-points/#multi-page-application
  entry: {
    main: "./src/main.js"
  },

  // https://webpack.js.org/configuration/dev-server/
  devServer: {
    port: 7077,
    writeToDisk: false // https://webpack.js.org/configuration/dev-server/#devserverwritetodisk-
  },

  // https://webpack.js.org/concepts/loaders/
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"]
        }
      },
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader"
          // Please note we are not running postcss here
        ]
      },
      {
        test: /\.(gif|png|jpe?g|svg|ico)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              publicPath: "/",
              name: "[path][name].[ext]",
              context: "src"
            }
          }
        ]
      },
      {
        test: /\.woff(2)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000,
              publicPath: "/",
              name: "./fonts/[path][name].[ext]",
              mimetype: "application/font-woff"
            }
          }
        ]
      },
      { test: /\.xml$/, loader: "xml-loader" }
    ]
  },

  // https://webpack.js.org/concepts/plugins/
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: "body",
      chunks: ["main", "index"],
      filename: "index.html"
    })
  ]
};