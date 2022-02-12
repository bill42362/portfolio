// loadScriptTag.js
'use strict';

const nullFunction = () => null;

/**
 * Load <script> tag. Same id tag will only load once.
 * @param {object} arguments - props will copy to script tag.
 * @param {string} {id} - unique script tag id.
 * @param {function} {onError} - onError function.
 * @param {function} {onLoad} - onLoad function.
 * @returns {Promise} resolved after script loaded.
 */
const loadScriptTag = ({
  id,
  async,
  type = 'text/javascript',
  onError = nullFunction,
  onLoad = nullFunction,
  ...rest
}) =>
  new Promise((resolve, reject) => {
    let scriptElement = document.getElementById(id);

    const isScriptMounted = !!scriptElement;

    if (!scriptElement) {
      scriptElement = document.createElement('script');
      Object.keys(rest).forEach(key => (scriptElement[key] = rest[key]));
      scriptElement.id = id;
      scriptElement.async = true;
      scriptElement.type = type;
    }

    const isScriptLoaded = scriptElement.isLoaded;
    if (isScriptLoaded) {
      if (scriptElement.isErrored) {
        const error = new Error('<script>.isErrored is true.');
        onError({ error });
        return reject({ error });
      }
      onLoad({ event, element: scriptElement });
      return resolve({ event, element: scriptElement });
    }

    scriptElement.addEventListener('error', error => {
      scriptElement.isLoaded = true;
      scriptElement.isErrored = true;
      onError({ error });
      return reject({ error });
    });

    if (rest.src) {
      scriptElement.addEventListener('load', event => {
        scriptElement.isLoaded = true;
        onLoad({ event, element: scriptElement });
        return resolve({ event, element: scriptElement });
      });
    }

    if (!isScriptMounted) {
      document.getElementsByTagName('head')[0].appendChild(scriptElement);
    }

    if (!rest.src) {
      scriptElement.isLoaded = true;
      onLoad({ element: scriptElement });
      return resolve({ element: scriptElement });
    }
  });

export default loadScriptTag;
