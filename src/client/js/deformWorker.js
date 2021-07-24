// deform-worker.js
const faceLandmarksDetection = require('@tensorflow-models/face-landmarks-detection');

import {
  faceLandmarkConfig as defaultFaceLandmarkConfig,
  shrinkFactor,
} from './resource/faceLandmarkVariables.js';
import renderFrame, { initRenderer } from './resource/renderFrame.js';

const canvas = new OffscreenCanvas(1280, 720);
const contex2d = canvas.getContext('2d');
let faceDetectedResult = {};
let facemesh = null;

const log = (...message) => {
  //const dt = new Date();
  //const ts = `${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}.${dt.getMilliseconds().toString().padStart(3, '0')}`;
  // eslint-disable-next-line no-console
  if (message) console.log('facemesh:', ...message);
};

let isDetectorBusy = false;
const detectFace = async ({ imageBitmap, faceLandmarkConfig }) => {
  if (isDetectorBusy) {
    return;
  }
  isDetectorBusy = true;
  let result = {};
  try {
    if (!facemesh) {
      facemesh = await faceLandmarksDetection.load(
        faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
        faceLandmarkConfig
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
      ...defaultFaceLandmarkConfig,
      ...faceLandmarkConfig,
      input: contex2d.getImageData(0, 0, imageBitmap.width, imageBitmap.height),
    });
    imageBitmap.close();
  } catch (error) {
    result.error = error.message;
    log('worker thread error:', error.message);
  }
  // must strip canvas from return value as it cannot be transfered from worker thread
  if (result.canvas) result.canvas = null;
  faceDetectedResult = result;
  if (!faceDetectedResult) {
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
      const { imageBitmap, faceLandmarkConfig, landmarkToggles, deformConfig } =
        payload;
      ++frameCount;
      const skipFrame = Math.max(faceLandmarkConfig.skipFrame ?? 21, 0);
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
        faceDetectedResult,
        landmarkToggles,
        deformConfig,
      });
      bitmaprenderer.transferFromImageBitmap(outputBitmap);

      if (shouldDetect) {
        setTimeout(() =>
          detectFace({ imageBitmap: imageBitmapForHuman, faceLandmarkConfig })
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
