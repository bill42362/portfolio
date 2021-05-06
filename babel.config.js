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

const plugins = [
  'react-hot-loader/babel',
  '@babel/plugin-syntax-dynamic-import',
  ['babel-plugin-styled-components', { ssr: true }],
  '@babel/plugin-proposal-object-rest-spread',
  '@babel/plugin-transform-spread',
  ['@babel/plugin-proposal-class-properties', { loose: true }],
  ['@babel/plugin-proposal-optional-chaining', { loose: false }],
  ['@babel/plugin-proposal-private-methods', { loose: true }],
];

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
