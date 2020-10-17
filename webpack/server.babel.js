// server.babel.js

// https://medium.com/front-end-hacking/adding-a-server-side-rendering-support-for-an-existing-react-application-using-express-and-webpack-5a3d60cf9762

import fs from 'fs';
import os from 'os';
import { EnvironmentPlugin, optimize } from 'webpack';
import nodeExternals from 'webpack-node-externals';
import gifsicle from 'imagemin-gifsicle';
import mozjpeg from 'imagemin-mozjpeg';
import pngquant from 'imagemin-pngquant';
import svgo from 'imagemin-svgo';

const isProd = 'production' === process.env.NODE_ENV;
const plugins = [
  new EnvironmentPlugin({
    BRANCH_NAME: 'local',
    TAG_NAME: '',
    SHORT_SHA: '',
  }),
  // Prevent get loading component on SSR.
  new optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
];

export default {
  target: 'node',
  node: false,
  externals: [nodeExternals()],
  entry: {
    index: ['./src/server/index.js'],
  },
  output: {
    filename: '[name].js',
    path: `${__dirname}/../dist/server/`,
    publicPath: isProd ? '/' : '/',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [{ loader: 'babel-loader', options: { cacheDirectory: true } }],
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
              emitFile: false,
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
  plugins: plugins,
};
