const path = require('path');
const webpack = require('webpack');
const { execSync } = require("child_process");

const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';
const devtool = process.env.NODE_ENV === 'development' ? 'eval' : 'source-map';

module.exports = {
  mode,
  devtool,
  optimization: {
    moduleIds: 'deterministic'
  },
  entry: {
    application: './app/javascript/packs/react_main.jsx'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'app/assets/builds')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(png|jpe?g|gif|eot|woff2|woff|ttf|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8000
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),
    new webpack.DefinePlugin({
      'process.env.CODE_VERSION': JSON.stringify(execSync("git rev-parse --short HEAD").toString().trim()),
    })
  ]
};
