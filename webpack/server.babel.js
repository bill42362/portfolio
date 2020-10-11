// server.babel.js

// https://medium.com/front-end-hacking/adding-a-server-side-rendering-support-for-an-existing-react-application-using-express-and-webpack-5a3d60cf9762

import fs from 'fs';
import os from 'os';
import { EnvironmentPlugin, optimize } from 'webpack';
import nodeExternals from 'webpack-node-externals';

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
    ],
  },
  mode: isProd ? 'production' : 'development',
  plugins: plugins,
};
