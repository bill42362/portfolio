// renderHtml.js

const websiteTitle = 'Portfolio';
const websiteDescription = "Bill's portfolio";

const defaultHelmet = {
  htmlAttributes: '',
  meta: `
    <meta data-react-helmet=true charset=utf-8 />
    <meta data-react-helmet=true name=viewport content="width=device-width, initial-scale=1" />
    <meta data-react-helmet=true name=author content=Bill />
    <meta data-react-helmet=true name=description content="${websiteDescription}" />
    <meta data-react-helmet=true property=og:url content=https://github.com/bill42362/portfolio />
    <meta data-react-helmet=true property=og:type content=website />
    <meta data-react-helmet=true property=og:title content="${websiteTitle}" />
    <meta data-react-helmet=true property=og:description content="${websiteDescription}" />
    <meta data-react-helmet=true property=og:site_name content="${websiteTitle}" />
  `,
  title: `<title data-react-helmet=true>${websiteTitle}</title>`,
  link: '',
  script: '',
};

export const renderHtml = ({
  helmet = defaultHelmet,
  styleTags = '',
  app = '',
  jsTags = '',
} = {}) => {
  return `
    <!doctype html>
    <html ${helmet.htmlAttributes.toString()}>
    <head>
      <style>
        body {
          background-color: #191919;
        }
      </style>
      ${helmet.meta.toString()}
      ${helmet.title.toString()}
      ${helmet.link.toString()}
      ${helmet.script.toString()}
      ${styleTags}
    </head>
    <body>
      <div id=app-root>${app}</div>
      <div id=modal-root></div>
      ${jsTags}
    </body>
    </html>
  `;
};

export default renderHtml;
