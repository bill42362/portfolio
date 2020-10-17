// manifestHandler.js
import fs from 'fs';
import path from 'path';
import querystring from 'querystring';

const manifestHandler = ({ relativePath }) => {
  let manifestString = null;
  let manifest = null;

  return (request, response) => {
    if (!manifest) {
      try {
        const manifestPath = path.resolve(
          __dirname,
          relativePath,
          `.${request.path}`
        );
        manifestString = fs.readFileSync(manifestPath);
        manifest = JSON.parse(manifestString);
        // eslint-disable-next-line no-empty
      } catch (_) {}
    }
    if (!manifest) {
      return response.sendStatus(404);
    }

    response.set('Content-Type', 'application/json');
    if (0 === Object.keys(request.query).length) {
      return response.status(200).send(manifestString);
    }

    const url = new URL(manifest.start_url, 'https://random.url');
    url.search = querystring.encode(request.query);
    url.searchParams.append('utm_content', 'pwa');
    return response.status(200).send(
      JSON.stringify({
        ...manifest,
        start_url: `${url.pathname}${url.search}`,
      })
    );
  };
};

export default manifestHandler;
