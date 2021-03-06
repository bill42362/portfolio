// buildHtml.js
import fs from 'fs';
import HtmlMinifier from 'html-minifier';

import minifyHtmlConfig from './minifyHtmlConfig.js';
import renderHtml from './renderHtml.js';
import { resolveJsTags } from './resolveTags.js';

const buildHtml = () => {
  const webpackStats = require('../../dist/client/stats.json');
  const jsTags = resolveJsTags({ webpackStats });

  const html = renderHtml({ jsTags });
  const minifiedHtml = HtmlMinifier.minify(html, minifyHtmlConfig);

  const path = `${__dirname}/../../dist/client/html`;
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
    console.log('/dist/client/html dir created.');
  }
  fs.writeFileSync(`${path}/index.html`, minifiedHtml, 'utf8');
  return { html };
};

buildHtml();
