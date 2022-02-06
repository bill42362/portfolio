// _app.js
import Head from 'next/head';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import styledNormalize from 'styled-normalize';
import serialize from 'serialize-javascript';

import env from '../resource/env.js';

import FaviconSource from '../public/img/x-men-school.svg';
import FaviconIcoSource from '../public/img/x-men-school.ico';

const GlobalStyle = createGlobalStyle`
  ${styledNormalize};
  *, ::after, ::before { box-sizing: border-box; }
  body {
    background-color: #101010;
    color: #efefef;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
      Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    font-weight: 400;
    -webkit-tap-highlight-color: transparent;
    overscroll-behavior-y: contain;
  }
  button {
    background-color: rgba(0, 0, 0, 0);
    cursor: pointer;
    &:disabled {
      cursor: not-allowed;
    }
  }
  input::placeholder,
  input::-webkit-input-placeholder,
  input::-moz-placeholder {
    line-height: normal !important;
    vertical-align: middle;
  }
  a { color: inherit; text-decoration: none; }
  a > * { opacity: inherit; }
  a:hover { opacity: .7; }
`;

// ref: https://flatuicolors.com/palette/ca
const theme = {
  colors: {
    lightPink: '#ff9ff3',
    lightYellow: '#feca57',
    lightRed: '#ff6b6b',
    lightCyan: '#48dbfb',
    lightGreen: '#1dd1a1',

    pink: '#f368e0',
    yellow: '#ff9f43',
    red: '#ee5253',
    cyan: '#0abde3',
    green: '#10ac84',

    lightJade: '#00d2d3',
    lightBlue: '#54a0ff',
    lightPurple: '#5f27cd',
    white: '#c8d6e5',
    darkGray: '#576574',

    jade: '#01a3a4',
    blue: '#2e86de',
    purple: '#341f97',
    gray: '#8395a7',
    black: '#222f3e',
  },
};

const title = `${env.branchName} | Portfolio`;
const description = "Bill's portfolio";

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta name="author" content="Bill" />
        <title>{title}</title>
        <meta name="description" content={description} />

        {/* add .src to fix next export issue */}
        <link
          rel="icon"
          href={FaviconSource.src || FaviconSource}
          type="image/svg+xml"
        />
        <link rel="icon" href={FaviconIcoSource.src || FaviconIcoSource} />

        <meta
          property="og:url"
          content={`https://github.com/bill42362/portfolio/${env.branchName}`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:site_name" content={title} />
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:site" content="@bill_portfolio" />
        <meta
          property="twitter:image"
          content={FaviconIcoSource.src || FaviconIcoSource}
        />
        <meta property="git:short_sha" content={env.shortSha} />
        <meta property="git:tag_name" content={env.tagName} />

        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              window.__SSR_ENVIRONMENT__ = ${serialize(env)};
            `,
          }}
        />
      </Head>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}

export default App;
