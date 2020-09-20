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
const createDevelopClientSideRender = app => {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const {
    default: clientConfig,
    hmrConfig,
  } = require('../../webpack/client.babel.js');

  const devOptions = {
    ...hmrConfig,
    publicPath: clientConfig.output.publicPath,
    log: console.log,
    headers: {
      'Service-Worker-Allowed': '/',
    },
    // stats: {
    //   cachedAssets: false,
    //   reasons: true,
    //   colors: true,
    // },
  };

  const compiler = webpack(clientConfig);
  app.use(webpackDevMiddleware(compiler, devOptions));
  app.use(webpackHotMiddleware(compiler, devOptions));

  const jsTags = '<script type=text/javascript src=/js/bundle.js></script>';
  const html = renderHtml({ jsTags });
  const minifiedHtml = HtmlMinifier.minify(html, minifyConfig);
  app.get(/^[^\.]*$/, (_, response) => response.send(minifiedHtml));

  return app;
}

async function createServer() {
  const app = Express();
  app.use(Helmet());

  const server = createDevelopClientSideRender(app);
  return server;
}

createServer().then(server =>
  server.listen(PORT, () => {
    console.log(`Server is listening ${PORT} port.`);
  })
);
