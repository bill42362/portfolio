// App.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader/root';
import { createGlobalStyle, StyleSheetManager } from 'styled-components';
import styledNormalize from 'styled-normalize';
import { Helmet } from 'react-helmet';

import XMenLogoSource from '../../img/x-men-school.svg';

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

const title = 'Portfolio';
const description = "Bill's portfolio";

const App = ({ request }) => {
  // eslint-disable-next-line no-console
  console.log('App() request:', request);
  return (
    <>
      <Helmet defaultTitle="Portfolio" titleTemplate="%s - Portfolio">
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta name="author" content="Bill" />
        <meta name="description" content={description} />

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
      </Helmet>
      <GlobalStyle />
      <div>
        <img src={XMenLogoSource} title="Xavier school" />
      </div>
    </>
  );
};

App.propTypes = {
  request: PropTypes.object,
};

App.defaultProps = {
  request: null,
};

const Body = ({ sheet, ...props }) => {
  if (sheet.instance) {
    return (
      <StyleSheetManager sheet={sheet.instance}>
        <App {...props} />
      </StyleSheetManager>
    );
  } else {
    return <App {...props} />;
  }
};

Body.propTypes = {
  ...App.propTypes,
  sheet: PropTypes.object,
};

Body.defaultProps = {
  ...App.defaultProps,
  sheet: {},
};

export default hot(Body);
