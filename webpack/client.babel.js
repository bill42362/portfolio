// client.babel.js
import path from 'path';
import {
  EnvironmentPlugin,
  HotModuleReplacementPlugin,
  NoEmitOnErrorsPlugin,
} from 'webpack';
import StatsPlugin from 'stats-webpack-plugin';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import gifsicle from 'imagemin-gifsicle';
import mozjpeg from 'imagemin-mozjpeg';
import pngquant from 'imagemin-pngquant';
import svgo from 'imagemin-svgo';

import EnvConfig from '../config.json';

const nodeEnv = process.env.NODE_ENV || 'develop';
const isProd = 'production' === nodeEnv;
const htmlBase = process.env.HTML_BASE;
const eslintConfigFilepath = path.resolve(
  __dirname,
  isProd ? '../.eslintrc.strict.json' : '../.eslintrc.json'
);

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
const prodPlugins = [new StatsPlugin('stats.json')];

export const hmrConfig = {
  path: '/__webpack_hmr',
  timeout: 20000,
  reload: true,
  logLevel: 'warn',
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
    deformWorker: ['./src/client/js/deformWorker.js'],
  },
  output: {
    filename: () => (isProd ? 'js/[name].[chunkhash:8].js' : 'js/[name].js'),
    // default use output.filename if it's string.
    chunkFilename: isProd ? 'js/[name].[chunkhash:8].js' : 'js/[name].js',
    path: path.resolve(__dirname, '../dist/client/'),
    publicPath: htmlBase ? './' : '/',
    globalObject: "(typeof self !== 'undefined' ? self : this)",
  },
  externals: ['fs', 'buffer', 'util', 'os'],
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'eslint-loader',
            options: { configFile: eslintConfigFilepath },
          },
        ],
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [{ loader: 'babel-loader', options: { cacheDirectory: true } }],
      },
      {
        test: /human\/models\/.*\.json$/i,
        type: 'javascript/auto',
        use: [
          {
            loader: 'file-loader',
            options: {
              name: isProd
                ? 'model/[name].[contenthash:8].[ext]'
                : 'model/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /human\/models\/.*\.bin$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              // can't use hash, relative path in model json file
              name: 'model/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico|ttf|eof|otf)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: isProd ? 1024 : 0, // no base64 to prevent localhost SSR warning
              fallback: 'file-loader',
              name: isProd
                ? 'img/[name].[contenthash:8].[ext]'
                : 'img/[name].[ext]',
            },
          },
          {
            loader: 'img-loader',
            options: {
              enabled: isProd,
              plugins: [
                gifsicle({ interlaced: false }),
                mozjpeg({ progressive: true, arithmetic: false }),
                pngquant({ speed: 2, strip: true }),
                svgo({
                  plugins: [{ removeTitle: true }, { convertPathData: false }],
                }),
              ],
            },
          },
        ],
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
