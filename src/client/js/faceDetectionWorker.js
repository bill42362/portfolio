// faceDetectionWorker.js
const faceLandmarksDetection = require('@tensorflow-models/face-landmarks-detection');

import {
  faceLandmarkConfig as defaultFaceLandmarkConfig,
  shrinkFactor,
} from './resource/faceLandmarkVariables.js';
import makeFaceMesh from './resource/makeFaceMesh.js';

const canvas = new OffscreenCanvas(1280, 720);
const contex2d = canvas.getContext('2d');
let detector = null;

const log = (...message) => {
  // eslint-disable-next-line no-console
  if (message) console.log('faceDetectionWorker:', ...message);
};

const detectFace = async ({ imageBitmap, faceLandmarkConfig }) => {
  let result = null;
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
    log('error:', error.message);
  }
  // must strip canvas from return value as it cannot be transfered from worker thread
  if (result?.canvas) result.canvas = null;
  return result;
};

let frameCount = 0;
let isDetectorBusy = false;
let lastDetectResult = null;
onmessage = async ({ data: { type, payload } }) => {
  switch (type) {
    case 'input-frame': {
      const { imageBitmap, faceLandmarkConfig } = payload;
      ++frameCount;
      const skipFrame = Math.max(faceLandmarkConfig.skipFrame ?? 21, 0);
      const shouldDetect = skipFrame < frameCount;
      const bitmapSize = {
        width: imageBitmap.width,
        height: imageBitmap.height,
      };

      if (shouldDetect) {
        frameCount = 0;

        if (isDetectorBusy) {
          log('detection skipped due to busy');
          self.postMessage(lastDetectResult);
        } else {
          isDetectorBusy = true;

          const faces =
            (await detectFace({ imageBitmap, faceLandmarkConfig })) || [];
          lastDetectResult = {
            faces,
            faceMeshs: faces.map(face =>
              makeFaceMesh({ landmarks: face.scaledMesh, bitmapSize })
            ),
          };
          self.postMessage(lastDetectResult);

          isDetectorBusy = false;
        }
      }
      break;
    }
    default:
      break;
  }
};
