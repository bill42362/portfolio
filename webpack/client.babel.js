// client.babel.js
import {
  EnvironmentPlugin,
  HotModuleReplacementPlugin,
  NoEmitOnErrorsPlugin,
} from 'webpack';
import TerserWebpackPlugin from 'terser-webpack-plugin';

import EnvConfig from '../config.json';

const nodeEnv = process.env.NODE_ENV || 'develop';
const isProd = 'production' === nodeEnv;

const plugins = [
  new EnvironmentPlugin({
    ...EnvConfig,
    NODE_ENV: nodeEnv,
  }),
];

const devPlugins = [
  new HotModuleReplacementPlugin(),
  new NoEmitOnErrorsPlugin(),
];
const prodPlugins = [
];

export const hmrConfig = {
  path: '/__webpack_hmr',
  timeout: 20000,
  reload: true,
  logLevel: 'error',
  heartbeat: 10 * 1000,
  clientLogLevel: 'silent',
  noInfo: true,
  quiet: true,
  state: 'errors-only',
  overlay: false,
  compress: true,
};

// https://github.com/webpack-contrib/webpack-hot-middleware#client
const hmrSearch = new URLSearchParams(hmrConfig);
const hotMiddlewareScript = `webpack-hot-middleware/client?${hmrSearch.toString()}`;

const bundle = ['./src/client/js/index.js'];
const devBundle = [hotMiddlewareScript];

export default {
  name: 'client',
  entry: {
    bundle: isProd ? bundle : [...bundle, ...devBundle],
  },
  output: {
    filename: chunkData =>
      isProd
        ? 'js/[name].[chunkhash:8].js'
        : 'js/[name].js',
    // default use output.filename if it's string.
    chunkFilename: isProd ? 'js/[name].[chunkhash:8].js' : 'js/[name].js',
    path: `${__dirname}/../dist/client/`,
    publicPath: '/',
    globalObject: "(typeof self !== 'undefined' ? self : this)",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [{ loader: 'babel-loader', options: { cacheDirectory: true } }],
      },
    ],
  },
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? 'source-map' : 'cheap-eval-source-map',
  plugins: isProd ? [...plugins, ...prodPlugins] : [...plugins, ...devPlugins],
  optimization: {
    minimize: isProd,
    minimizer: [
      new TerserWebpackPlugin({
        test: /\.js(\?.*)?$/i,
        parallel: true,
        sourceMap: true,
      }),
    ],
    splitChunks: {
      minSize: 64 * 1024,
      minChunks: 1,
      maxAsyncRequests: 6,
      maxInitialRequests: 4,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          minSize: 256 * 1024,
          maxSize: 512 * 1024,
          priority: -10,
          reuseExistingChunk: true,
        },
        bundle: {
          // will broken with devBundle
          chunks: chunk => isProd && chunk.name === 'bundle',
          maxSize: 256 * 1024,
          priority: -30,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
};
