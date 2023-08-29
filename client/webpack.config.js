const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");
const { InjectManifest } = require("workbox-webpack-plugin");

// TODO: Add and configure workbox plugins for a service worker and manifest file.
// TODO: Add CSS loaders and babel to webpack.

module.exports = () => {
  return {
    mode: "development",
    entry: {
      main: "./src/js/index.js",
      install: "./src/js/install.js",
    },
    output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "dist"),
    },
    plugins: [
      // generates a new html page that has all necessery links on it
      new HtmlWebpackPlugin({
        template: "./index.html",
        title: "Text-Editor",
      }),
      // creating caching
      new InjectManifest({
        swSrc: "./src-sw.js",
        swDest: "src-sw.js",
      }),
      // running the app offline
      new WebpackPwaManifest({
        name: "Text-Editor",
        fingerprints: false,
        inject: true,
        short_name: "TE",
        description: "Edit the text!",
        background_color: "#7eb4e2",
        theme_color: "#7eb4e2",
        start_url: "./",
        publicPath: "./",
        icons: [
          {
            src: path.resolve("src/images/logo.png"),
            sizes: [96, 128, 192, 256, 384, 512],
            destination: path.join("assets", "icons"), // creates assets/icons directory. inside of the icons folder there will be six images with different sizes
          },
        ],
      }),
    ],

    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.m?js$/, // .mjsc .js
          exclude: /node_modules/,
          use: {
            // converts the java script to be compatible with different env ES5 / ES6
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"], // renders the env of the browser
              plugins: [
                "@babel/plugin-proposal-object-rest-spread", // ensures that you are using ES6 or 5 with spread operator
                "@babel/transform-runtime", // reduces the size of teh package
              ],
            },
          },
        },
      ],
    },
  };
};
