// deform-worker.js
import Human from '@vladmandic/human/dist/human.esm.js';

import { humanConfig, shrinkFactor } from './resource/humanVariables.js';
import renderFrame, { initRenderer } from './resource/renderFrame.js';

let humanDetectedResult = {};
const human = new Human(humanConfig);
// eslint-disable-next-line no-console
// console.log('human:', human);

const log = (...message) => {
  //const dt = new Date();
  //const ts = `${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}.${dt.getMilliseconds().toString().padStart(3, '0')}`;
  // eslint-disable-next-line no-console
  if (message) console.log('Human:', ...message);
};

let isDetectorBusy = true;
const detectFace = async ({ imageBitmap, humanConfig }) => {
  if (isDetectorBusy) {
    return;
  }
  isDetectorBusy = true;
  let result = {};
  try {
    result = await human.detect(imageBitmap, humanConfig);
    imageBitmap.close();
  } catch (error) {
    result.error = error.message;
    log('worker thread error:', error.message);
  }
  // must strip canvas from return value as it cannot be transfered from worker thread
  if (result.canvas) result.canvas = null;
  humanDetectedResult = result;
  if (!humanDetectedResult) {
    // eslint-disable-next-line no-console
    console.log('detectFace() no result');
  }
  isDetectorBusy = false;
};

let frameCount = 0;
let bitmaprenderer = null;
onmessage = async ({ data: { type, payload } }) => {
  switch (type) {
    case 'canvas': {
      const { canvas, sizes } = payload;
      canvas.width = sizes.width;
      canvas.height = sizes.height;
      initRenderer({ sizes });
      bitmaprenderer = canvas.getContext('bitmaprenderer');
      break;
    }
    case 'input-frame': {
      const {
        imageBitmap,
        humanConfig,
        landmarkToggles,
        deformConfig,
      } = payload;
      ++frameCount;
      const skipFrame = Math.max(
        humanConfig.face?.detector?.skipFrame ?? 21,
        0
      );
      const shouldDetect = skipFrame < frameCount;
      let imageBitmapForHuman = null;
      if (shouldDetect) {
        imageBitmapForHuman = await createImageBitmap(imageBitmap, {
          resizeWidth: imageBitmap.width / shrinkFactor,
          resizeHeight: imageBitmap.height / shrinkFactor,
        });
      }

      const outputBitmap = await renderFrame({
        imageBitmap,
        humanDetectedResult,
        landmarkToggles,
        deformConfig,
      });
      bitmaprenderer.transferFromImageBitmap(outputBitmap);

      if (shouldDetect) {
        setTimeout(() =>
          detectFace({ imageBitmap: imageBitmapForHuman, humanConfig })
        );
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
isDetectorBusy = false;
