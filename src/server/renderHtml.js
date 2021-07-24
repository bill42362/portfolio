// renderHtml.js

const title = 'Portfolio';
const description = "Bill's portfolio";
const shortSha = process.env.SHORT_SHA;
const htmlBase = process.env.HTML_BASE;

const defaultHelmet = {
  htmlAttributes: '',
  meta: `
    <meta data-react-helmet=true charset=utf-8 />
    <meta data-react-helmet=true name=viewport content="width=device-width, initial-scale=1" />
    <meta data-react-helmet=true name=author content=Bill />
    <meta data-react-helmet=true name=description content="${description}" />
    <meta data-react-helmet=true property=og:url content=https://github.com/bill42362/portfolio />
    <meta data-react-helmet=true property=og:type content=website />
    <meta data-react-helmet=true property=og:title content="${title}" />
    <meta data-react-helmet=true property=og:description content="${description}" />
    <meta data-react-helmet=true property=og:site_name content="${title}" />
    <meta data-react-helmet=true property=webapp:short_sha content="${shortSha}"/>
  `,
  title: `<title data-react-helmet=true>${title}</title>`,
  link: '',
  script: '',
};

export const renderHtml = ({
  helmet = defaultHelmet,
  styleTags = '',
  app = '',
  jsTags: inputJsTags = '',
  workerVariablesTag = '',
} = {}) => {
  const jsTags = htmlBase
    ? inputJsTags.replace(/='\/js/gi, "='js").replace(/=\/js/gi, '=js')
    : inputJsTags;
  return `
    <!doctype html>
    <html ${helmet.htmlAttributes.toString()}>
    <head>
      ${htmlBase ? `<base href="${htmlBase}" />` : ''}
      <style>
        body {
          background-color: #191919;
        }
      </style>
      ${helmet.meta.toString()}
      ${helmet.title.toString()}
      ${helmet.link.toString()}
      ${helmet.script.toString()}
      ${workerVariablesTag}
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
