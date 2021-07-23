// deform-worker.js
const faceLandmarksDetection = require('@tensorflow-models/face-landmarks-detection');

import {
  facemeshConfig,
  shrinkFactor,
} from './resource/faceLandmarkVariables.js';
import renderFrame, { initRenderer } from './resource/renderFrame.js';

const canvas = new OffscreenCanvas(1280, 720);
const contex2d = canvas.getContext('2d');
let humanDetectedResult = {};
let facemesh = null;

const log = (...message) => {
  //const dt = new Date();
  //const ts = `${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}.${dt.getMilliseconds().toString().padStart(3, '0')}`;
  // eslint-disable-next-line no-console
  if (message) console.log('facemesh:', ...message);
};

let isDetectorBusy = false;
const detectFace = async ({ imageBitmap, humanConfig }) => {
  if (isDetectorBusy) {
    return;
  }
  isDetectorBusy = true;
  let result = {};
  try {
    if (!facemesh) {
      facemesh = await faceLandmarksDetection.load(
        faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
        facemeshConfig
      );
    }
    contex2d.drawImage(
      imageBitmap,
      0,
      0,
      imageBitmap.width,
      imageBitmap.height
    );
    result = await facemesh.estimateFaces({
      ...facemeshConfig,
      ...humanConfig,
      input: contex2d.getImageData(0, 0, imageBitmap.width, imageBitmap.height),
    });
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
      const { imageBitmap, humanConfig, landmarkToggles, deformConfig } =
        payload;
      ++frameCount;
      const skipFrame = Math.max(humanConfig.skipFrame ?? 21, 0);
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
