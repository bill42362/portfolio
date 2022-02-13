// next.config.js
const path = require('path');

const nodeEnv = process.env.NODE_ENV || 'develop';
const isProd = 'production' === nodeEnv;
const eslintConfigFilepath = path.resolve(
  __dirname,
  isProd ? './.eslintrc.strict.json' : './.eslintrc.json'
);

const devConfig = {
  /* config for next-optimized-images */
  images: {
    loader: 'custom',
    disableStaticImages: true,
  },
};

const prodConfig = {
  basePath: process.env.HTML_BASE,
  distDir: 'dist/server',
  generateBuildId: async () => process.env.SHORT_SHA || null,
  swcMinify: true,
};

const config = {
  compiler: {
    // ssr and displayName are configured by default
    styledComponents: {
      ssr: true,
      displayName: true,
    },
  },

  webpack: (config, { dev }) => {
    const publicAssetConfig = {
      test: /public.*\.(pmx|vmd|dds|png)$/i,
      type: 'asset/resource',
      generator: {
        // https://webpack.js.org/configuration/module/#rulegenerator
        // https://webpack.js.org/configuration/output/#outputfilename
        filename: pathData => {
          const path = pathData.filename.replace(/^public(.*\/)[^\/]*$/g, '$1');
          // return `${path}[name].[contenthash:8][ext]`;
          return `${path}[name][ext]`;
        },
        publicPath: '.',
        emit: false,
      },
    };
    config.module.rules = [publicAssetConfig, ...config.module.rules];
    if (dev) {
      const ESLintPlugin = require('eslint-webpack-plugin');
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

  ...(isProd ? prodConfig : devConfig),
};

let configWithPlugins = config;

if (!isProd) {
  const optimizedImages = require('next-optimized-images');
  const withPlugins = require('next-compose-plugins');

  configWithPlugins = withPlugins(
    [
      [
        optimizedImages,
        {
          // optimisation disabled by default, to enable check https://github.com/cyrilwanner/next-optimized-images
          optimizeImages: true,
          // inlineImageLimit: 8, // just for test image loader
          handleImages: ['jpeg', 'png', 'svg', 'webp', 'gif', 'ico'],
        },
      ],
    ],
    config,
  );
}

module.exports = configWithPlugins;
