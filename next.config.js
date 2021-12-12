// next.config.js
const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');

const nodeEnv = process.env.NODE_ENV || 'develop';
const isProd = 'production' === nodeEnv;
const eslintConfigFilepath = path.resolve(
  __dirname,
  isProd ? './.eslintrc.strict.json' : './.eslintrc.json'
);

module.exports = {
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
}
