// renderSsrJs.js
import serialize from 'serialize-javascript';

const TEN_MIN_SECS = 10 * 60;
const ssrEnvironment = {
  branchName: process.env.BRANCH_NAME || '',
};

const renderSsrJs = () => {
  return `window.__SSR_ENVIRONMENT__=${serialize(ssrEnvironment)}`;
};

export const ssrJsHandler = () => {
  let ssrJs = null;

  return (_, response) => {
    response.set('Content-Type', 'application/javascript; charset=utf-8');
    response.setHeader('Cache-Control', `max-age=${TEN_MIN_SECS}, public`);
    if (ssrJs) {
      return response.send(ssrJs);
    }
    ssrJs = renderSsrJs();
    return response.send(ssrJs);
  };
};

export default renderSsrJs;
