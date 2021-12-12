// babel.config.js

const presets = [
  ['next/babel'],
];

const plugins = [
  ['styled-components', { ssr: true }],
];

const overrides = [];

module.exports = { presets, plugins, overrides };
