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

const overrides = [
  {
    test: ['**/server/**'],
    sourceType: 'unambiguous',
    presets: [
      [
        '@babel/env',
        {
          targets: {
            node: 'current',
          },
        },
      ],
    ],
  },
];

module.exports = { presets, plugins, overrides };
