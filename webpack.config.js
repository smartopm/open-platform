const path = require('path');
const webpack = require('webpack');

const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';

module.exports = {
  mode,
  optimization: {
    moduleIds: 'deterministic'
  },
  entry: {
    application: './app/javascript/packs/react_main.jsx'
  },
  output: {
    filename: '[name].js',
    sourceMapFilename: '[name].js.map',
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
    })
  ]
};
