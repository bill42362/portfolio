// _app.js
import Head from 'next/head';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import styledNormalize from 'styled-normalize';
import serialize from 'serialize-javascript';

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

const isServer = typeof window === 'undefined';
const title = 'Portfolio';
const description = "Bill's portfolio";
const ssrEnviroment = isServer
  ? {
      branchName: process.env.BRANCH_NAME,
    }
  : window.__SSR_ENVIRONMENT__;

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta name="author" content="Bill" />
        <meta name="description" content={description} />
        <link rel="icon" href="img/x-men-school.ico" />

        <meta
          property="og:url"
          content="https://github.com/bill42362/portfolio"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:site_name" content={title} />
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:site" content="@bill_portfolio" />
        {/* <meta property="twitter:image" content={twitterImageSource} /> */}

        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              window.__SSR_ENVIRONMENT__ = ${serialize(ssrEnviroment)};
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
