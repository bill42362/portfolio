// index.js
import fs from 'fs';
import https from 'https';
import Express from 'express';
import Helmet from 'helmet';
import ExpressStaticGzip from 'express-static-gzip';
import HtmlMinifier from 'html-minifier';
import morgan from 'morgan';

import manifestHandler from './manifestHandler.js';
import { ssrJsHandler } from './renderSsrJs.js';
import renderHtml from './renderHtml.js';
import minifyHtmlConfig from './minifyHtmlConfig.js';

const isProd = 'production' === process.env.NODE_ENV;
const PORT = process.env.PORT || 3000;
const ONE_YEAR_MSEC = 365 * 24 * 60 * 60 * 1000;

/**
 * Create client side render server for production.
 * @param {Express.Express} app
 * @return Express.Express
 */
const createProductionClientSideRender = app => {
  app.get('/manifest*.json', manifestHandler({ relativePath: '../client' }));
  app.get('/js/ssrJs.js', ssrJsHandler());
  // this `__dirname` will be `/dist/server`.
  app.use(
    ExpressStaticGzip(`${__dirname}/../client`, {
      enableBrotli: true,
      orderPreference: ['br'],
      index: false,
      serveStatic: {
        maxAge: ONE_YEAR_MSEC,
        immutable: true,
      },
    })
  );
  // both these two line is essential
  app.use('/', Express.static(`${__dirname}/../client/html`));
  app.use('/*', Express.static(`${__dirname}/../client/html/index.html`));

  return app;
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

  const hotOptions = {
    ...hmrConfig,
    publicPath: clientConfig.output.publicPath,
    // eslint-disable-next-line no-console
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

  // avaliable option keys:
  // { mimeTypes?, writeToDisk?, methods?, headers?, publicPath?, serverSideRender?, outputFileSystem?, index? }
  const devOptions = {
    headers: hotOptions.headers,
    publicPath: hotOptions.publicPath,
    serverSideRender: true,
  };

  const compiler = webpack(clientConfig);
  app.use(webpackDevMiddleware(compiler, devOptions));
  app.use(webpackHotMiddleware(compiler, hotOptions));

  const jsTags = `
    <script type=text/javascript src=/js/ssrJs.js></script>
    <script type=text/javascript src=/js/bundle.js></script>
  `;
  const html = renderHtml({ jsTags });
  const minifiedHtml = HtmlMinifier.minify(html, minifyHtmlConfig);
  app.get(/^[^.]*$/, (_, response) => response.send(minifiedHtml));
  app.get('/js/ssrJs.js', ssrJsHandler());

  return app;
};

async function createServer() {
  const app = Express();
  if (process.env.MORGAN) {
    app.use(morgan(process.env.MORGAN));
  }
  if ('false' !== process.env.HELMET) {
    app.use(Helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          connectSrc: ["'self'", 'https://api.developer.deepar.ai'],
        },
      },
    }));
  }

  let server = null;
  if (isProd) {
    server = createProductionClientSideRender(app);
  } else {
    server = createDevelopClientSideRender(app);
  }

  if (process.env.HTTPS) {
    server = https.createServer(
      {
        key: fs.readFileSync('./devserver.key'),
        cert: fs.readFileSync('./devserver.crt'),
      },
      server
    );
  }

  return server;
}

createServer().then(server =>
  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is listening ${PORT} port.`);
  })
);
