process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const { merge, devServer } = require('@rails/webpacker');
// eslint-disable-next-line import/no-extraneous-dependencies
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpackConfig = require('./base');

module.exports = merge(webpackConfig, {
  plugins: [
    new ReactRefreshWebpackPlugin({
      overlay: {
        sockPort: devServer.port
      }
    })
  ]
});
