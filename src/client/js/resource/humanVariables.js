// humanVariables.js
import '@vladmandic/human/models/blazeface.bin';
import faceDetectorModlePath from '@vladmandic/human/models/blazeface.json';
import '@vladmandic/human/models/facemesh.bin';
import faceMeshModlePath from '@vladmandic/human/models/facemesh.json';

const isProd = 'production' === process.env.NODE_ENV;

export const shrinkFactor = 4;

export const humanConfig = {
  backend: 'humangl',
  async: true,
  warmup: 'face',
  face: {
    enabled: true,
    maxDetected: 3,
    detector: {
      skipFrame: 21,
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

export const annotationShape = {
  leftCheek: 1,
  leftEyeLower0: 9,
  leftEyeLower1: 9,
  leftEyeLower2: 9,
  leftEyeLower3: 9,
  leftEyeUpper0: 7,
  leftEyeUpper1: 7,
  leftEyeUpper2: 7,
  leftEyebrowLower: 6,
  leftEyebrowUpper: 8,
  lipsLowerInner: 11,
  lipsLowerOuter: 10,
  lipsUpperInner: 11,
  lipsUpperOuter: 11,
  midwayBetweenEyes: 1,
  noseBottom: 1,
  noseLeftCorner: 1,
  noseRightCorner: 1,
  noseTip: 1,
  rightCheek: 1,
  rightEyeLower0: 9,
  rightEyeLower1: 9,
  rightEyeLower2: 9,
  rightEyeLower3: 9,
  rightEyeUpper0: 7,
  rightEyeUpper1: 7,
  rightEyeUpper2: 7,
  rightEyebrowLower: 6,
  rightEyebrowUpper: 8,
  silhouette: 36,
};
