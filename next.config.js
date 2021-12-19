// next.config.js
const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const optimizedImages = require('next-optimized-images');
const withPlugins = require('next-compose-plugins');

const nodeEnv = process.env.NODE_ENV || 'develop';
const isProd = 'production' === nodeEnv;
const eslintConfigFilepath = path.resolve(
  __dirname,
  isProd ? './.eslintrc.strict.json' : './.eslintrc.json'
);

const config = {
  webpack: (config, { dev }) => {
    if (dev) {
      config.plugins.push(new ESLintPlugin({
        overrideConfigFile: eslintConfigFilepath,
        threads: true,
      }));
    }
    return config;
  },
  reactStrictMode: true,

  /* config for next-optimized-images */
  images: {
    loader: 'custom',
  },

  // https://simonallen.coderbridge.io/2021/07/15/nextjs-export-static/
  assetPrefix: '.',
};

const configWithPlugins = withPlugins(
  [
    [
      optimizedImages,
      {
        // optimisation disabled by default, to enable check https://github.com/cyrilwanner/next-optimized-images
        optimizeImages: true,
        inlineImageLimit: 8, // just for test image loader
      },
    ],
  ],
  config,
);

module.exports = configWithPlugins;
