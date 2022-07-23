// _document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';
import { ServerStyleSheet } from 'styled-components';
import serialize from 'serialize-javascript';

import env from '../resource/env.js';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html>
        <Head>
          <Script
            type="text/javascript"
            id="ssr-enviroment"
            // beforeInteractive script must put in _document.js's <Head>
            // and only works in next.js above 12.1.7
            // https://github.com/vercel/next.js/issues/37741#issuecomment-1157358712
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                  window.__SSR_ENVIRONMENT__ = ${serialize(env)};
                `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
