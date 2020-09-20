// index.js
import Express from 'express';
import Helmet from 'helmet';
import ExpressStaticGzip from 'express-static-gzip';
import HtmlMinifier from 'html-minifier';

import renderHtml from './renderHtml.js';

const PORT = process.env.PORT || 3000;

const minifyConfig = {
  collapseWhitespace: true,
  html5: true,
  removeAttributeQuotes: true,
  removeComments: true,
  removeEmptyAttributes: true,
  removeRedundantAttributes: true,
  minifyCSS: true,
  minifyJS: true,
};

/**
 * Create client side render server for develop.
 * @param {Express.Express} app
 * @return Express.Express
 */
function createDevelopClientSideRender(app) {
  // this `__dirname` will be `src/server`.
  app.use(
    '/js',
    ExpressStaticGzip(`${__dirname}/../client/js`, {
      enableBrotli: true,
      orderPreference: ['br'],
      index: false,
    })
  );

  // const jsTags = '<script type=text/javascript src=/js/bundle.js></script>';
  const html = renderHtml();
  const minifiedHtml = HtmlMinifier.minify(html, minifyConfig);
  app.get(/^[^\.]*$/, (_, response) => response.send(minifiedHtml));

  return app;
}

async function createServer() {
  const app = Express();
  app.use(Helmet());

  const server = await createDevelopClientSideRender(app);
  return server;
}

createServer().then(server =>
  server.listen(PORT, () => {
    console.log(`Server is listening ${PORT} port.`);
  })
);
