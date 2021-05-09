// deform-worker.js
import Human from '@vladmandic/human/dist/human.esm.js';
import '@vladmandic/human/models/blazeface.bin';
import faceDetectorModlePath from '@vladmandic/human/models/blazeface.json';
import '@vladmandic/human/models/facemesh.bin';
import faceMeshModlePath from '@vladmandic/human/models/facemesh.json';

const isProd = 'production' === process.env.NODE_ENV;

let humanDetectedResult = {};
const humanConfig = {
  warmup: 'face',
  face: {
    enabled: true,
    detector: {
      modelPath: faceDetectorModlePath.replace(/^.*model\//, 'model/'),
    },
    mesh: {
      enabled: true,
      modelPath: faceMeshModlePath.replace(/^.*model\//, 'model/'),
    },
    description: { enabled: false },
    iris: { enabled: false },
    emotion: { enabled: false },
  },
  filter: { enabled: false },
  gesture: { enabled: false },
  mesh: { enabled: false },
  iris: { enabled: false },
  description: { enabled: false },
  emotion: { enabled: false },
  body: { enabled: false },
  hand: { enabled: false },
  object: { enabled: false },
  modelBasePath: isProd ? '../' : '',
};
const human = new Human(humanConfig);
// eslint-disable-next-line no-console
// console.log('human:', human);

const log = (...message) => {
  //const dt = new Date();
  //const ts = `${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}.${dt.getMilliseconds().toString().padStart(3, '0')}`;
  // eslint-disable-next-line no-console
  if (message) console.log('Human:', ...message);
};

let busy = true;
const detectFace = async ({ imageBitmap, config }) => {
  if (busy) return;
  busy = true;
  let result = {};
  try {
    result = await human.detect(imageBitmap, config);
  } catch (error) {
    result.error = error.message;
    log('worker thread error:', error.message);
  }
  // must strip canvas from return value as it cannot be transfered from worker thread
  if (result.canvas) result.canvas = null;
  humanDetectedResult = result;
  if (!humanDetectedResult) {
    // eslint-disable-next-line no-console
    console.log('onmessage() no result');
  }
  busy = false;
};

let frameCount = 0;
onmessage = ({ data: { imageBitmap, action, config } }) => {
  switch (action) {
    case 'input-frame': {
      postMessage({ type: 'output-frame', imageBitmap });

      ++frameCount;
      const skipFrame = Math.max(config.face?.detector?.skipFrame ?? 21, 0);
      if (skipFrame < frameCount) {
        setTimeout(() => detectFace({ imageBitmap, config }));
        frameCount = 0;
      }
      break;
    }
    case 'warmup':
    default:
      break;
  }
};

human.load(humanConfig);
// human.warmup(humanConfig); // don't know why break :(
busy = false;
