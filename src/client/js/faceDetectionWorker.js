// faceDetectionWorker.js
const faceLandmarksDetection = require('@tensorflow-models/face-landmarks-detection');

import {
  faceLandmarkConfig as defaultFaceLandmarkConfig,
  shrinkFactor,
} from './resource/faceLandmarkVariables.js';

const canvas = new OffscreenCanvas(1280, 720);
const contex2d = canvas.getContext('2d');
let faceDetectedResult = {};
let detector = null;

const log = (...message) => {
  // eslint-disable-next-line no-console
  if (message) console.log('faceDetectionWorker:', ...message);
};

let isDetectorBusy = false;
const detectFace = async ({ imageBitmap, faceLandmarkConfig }) => {
  if (isDetectorBusy) {
    log('detection skipped due to busy');
    return;
  }
  isDetectorBusy = true;
  let result = {};
  try {
    if (!detector) {
      detector = await faceLandmarksDetection.load(
        faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
        faceLandmarkConfig
      );
    }
    contex2d.drawImage(
      imageBitmap,
      0,
      0,
      imageBitmap.width / shrinkFactor,
      imageBitmap.height / shrinkFactor
    );
    result = await detector.estimateFaces({
      ...defaultFaceLandmarkConfig,
      ...faceLandmarkConfig,
      input: contex2d.getImageData(
        0,
        0,
        imageBitmap.width / shrinkFactor,
        imageBitmap.height / shrinkFactor
      ),
    });
    imageBitmap.close();
  } catch (error) {
    result.error = error.message;
    log('error:', error.message);
  }
  // must strip canvas from return value as it cannot be transfered from worker thread
  if (result.canvas) result.canvas = null;
  faceDetectedResult = result;
  if (faceDetectedResult) {
    self.postMessage({ faces: faceDetectedResult });
  } else {
    log('detectFace() no result');
  }
  isDetectorBusy = false;
};

let frameCount = 0;
onmessage = async ({ data: { type, payload } }) => {
  switch (type) {
    case 'input-frame': {
      const { imageBitmap, faceLandmarkConfig } = payload;
      ++frameCount;
      const skipFrame = Math.max(faceLandmarkConfig.skipFrame ?? 21, 0);
      const shouldDetect = skipFrame < frameCount;

      if (shouldDetect) {
        detectFace({ imageBitmap, faceLandmarkConfig });
        frameCount = 0;
      }
      break;
    }
    default:
      break;
  }
};
