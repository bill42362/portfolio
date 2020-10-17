// babel.config.js

const presets = [
  [
    '@babel/env',
    {
      targets: {
        browsers: '> 0.2%, not dead',
      },
      useBuiltIns: 'usage',
      corejs: '3',
    },
  ],
  '@babel/react',
];

const plugins = ['react-hot-loader/babel'];

module.exports = { presets, plugins };
