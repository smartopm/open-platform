process.env.NODE_ENV = process.env.NODE_ENV || "development";

const { devServer } = require("@rails/webpacker");
// eslint-disable-next-line import/no-extraneous-dependencies
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const environment = require("./environment");

environment.plugins.append(
    'ReactRefreshWebpackPlugin',
    new ReactRefreshWebpackPlugin({
      overlay: {
        sockPort: devServer.port
      }
    })
  )

module.exports = environment.toWebpackConfig();
