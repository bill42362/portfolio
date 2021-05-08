// deform-worker.js
import Human from '@vladmandic/human/dist/human.esm.js';
import '@vladmandic/human/models/blazeface.bin';
import faceDetectorModlePath from '@vladmandic/human/models/blazeface.json';

const isProd = 'production' === process.env.NODE_ENV;

let busy = false;
const human = new Human({
  face: {
    detector: {
      modelPath: faceDetectorModlePath.replace(/^.*model\//, 'model/'),
    },
  },
  modelBasePath: isProd ? '../' : '',
});
// eslint-disable-next-line no-console
console.log('human:', human);
// eslint-disable-next-line no-console
console.log('faceDetectorModlePath:', faceDetectorModlePath);

const log = (...message) => {
  //const dt = new Date();
  //const ts = `${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}.${dt.getMilliseconds().toString().padStart(3, '0')}`;
  // eslint-disable-next-line no-console
  if (message) console.log('Human:', ...message);
};

onmessage = async ({ data: { imageBitmap, action, config } }) => {
  if (busy) return;
  busy = true;

  switch (action) {
    case 'detect': {
      let result = {};
      try {
        result = await human.detect(imageBitmap, config);
      } catch (error) {
        result.error = error.message;
        log('worker thread error:', error.message);
      }
      // must strip canvas from return value as it cannot be transfered from worker thread
      if (result.canvas) result.canvas = null;
      // eslint-disable-next-line no-console
      console.log('result:', result);
      postMessage({ type: 'deformed-bitmap', imageBitmap });
      break;
    }
    case 'warmup':
    default:
      break;
  }

  busy = false;
};
