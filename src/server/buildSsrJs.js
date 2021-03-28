// buildSsrJs.js
import fs from 'fs';
import renderSsrJs from './renderSsrJs.js';

const buildSsrJs = () => {
  const js = renderSsrJs();

  const path = `${__dirname}/../../dist/client/js`;
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
    console.log('/dist/client/js dir created.');
  }
  fs.writeFileSync(`${path}/ssrJs.js`, js, 'utf8');
  return { js };
};

buildSsrJs();
