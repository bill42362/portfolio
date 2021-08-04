// faceDetectionWorker.js
const faceLandmarksDetection = require('@tensorflow-models/face-landmarks-detection');

import './resource/faceLandmarkCore.js';
import {
  faceLandmarkConfig as defaultFaceLandmarkConfig,
  shrinkFactor,
} from './resource/faceLandmarkVariables.js';
import makeFaceMesh from './resource/makeFaceMesh.js';
import {
  addTwoVectors,
  getPointsVector,
  getVectorLength,
  getPointsVector2D,
  getVectorLength2D,
} from './resource/LinearAlgebra.js';

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

const getFaceDistance = (a, b) => {
  const bottomRightDistance = getVectorLength2D({
    vector: getPointsVector2D({
      origin: a.boundingBox.bottomRight,
      target: b.boundingBox.bottomRight,
    }),
  });
  const topLeftDistance = getVectorLength2D({
    vector: getPointsVector2D({
      origin: a.boundingBox.topLeft,
      target: b.boundingBox.topLeft,
    }),
  });
  return bottomRightDistance + topLeftDistance;
};

const getFaceSize = face => {
  return getVectorLength2D({
    vector: getPointsVector2D({
      origin: face.boundingBox.bottomRight,
      target: face.boundingBox.topLeft,
    }),
  });
};

let isDetectorBusy = false;
let lastDetectResult = null;
onmessage = async ({ data: { type, payload } }) => {
  switch (type) {
    case 'input-frame': {
      const { imageBitmap, faceLandmarkConfig } = payload;
      const bitmapSize = {
        width: imageBitmap.width,
        height: imageBitmap.height,
      };

      if (isDetectorBusy) {
        log('detection skipped due to busy');
        self.postMessage(lastDetectResult);
      } else {
        isDetectorBusy = true;

        let faces =
          (await detectFace({ imageBitmap, faceLandmarkConfig })) || [];

        // remove duplicated faces.
        faces = faces.reduce((cur, face) => {
          const size = getFaceSize(face);
          const threshold = (1 - defaultFaceLandmarkConfig.iouThreshold) * size;
          const overlapFace = cur.find(element => {
            const distance = getFaceDistance(element, face);
            return threshold > distance;
          });
          if (!overlapFace) {
            cur.push(face);
          }
          return cur;
        }, []);

        let noseTipDeltaVector = faces.reduce((current, newFace, index) => {
          if (!lastDetectResult?.faces[index]) {
            // always update faceMesh if face count changed.
            return [2, 2, 2];
          }
          const deltaVector = getPointsVector({
            origin: newFace.annotations.noseTip[0],
            target: lastDetectResult.faces[index].annotations.noseTip[0],
          });
          return addTwoVectors(current, deltaVector);
        }, lastDetectResult?.noseTipDeltaVector);

        let faceMeshs = lastDetectResult?.faceMeshs;
        let isNewFaceMeshes = false;
        const deltaLength = getVectorLength({ vector: noseTipDeltaVector });
        if (2 < deltaLength) {
          // only update faceMesh when accumulated enough noseTipDelta.
          faceMeshs = faces.map(face =>
            makeFaceMesh({ landmarks: face.scaledMesh, bitmapSize })
          );
          noseTipDeltaVector = [0, 0, 0];
          isNewFaceMeshes = true;
        }

        lastDetectResult = {
          faces,
          faceMeshs,
          noseTipDeltaVector,
          isNewFaceMeshes,
        };
        self.postMessage(lastDetectResult);

        isDetectorBusy = false;
      }
      break;
    }
    default:
      break;
  }
};
