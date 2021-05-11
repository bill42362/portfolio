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

// coords are based on img/face-1024.png
export const annotationShape = {
  leftCheek: 1,
  leftEyeLower0: 9,
  leftEyeLower1: 9,
  leftEyeLower2: [
    [574, 375],
    [594, 392],
    [624, 400],
    [650, 409],
    [682, 417],
    [719, 417],
    [749, 408],
    [770, 391],
    [776, 365],
  ],
  leftEyeLower3: 9,
  leftEyeUpper0: 7,
  leftEyeUpper1: 7,
  leftEyeUpper2: [
    [760, 336],
    [736, 315],
    [703, 302],
    [672, 300],
    [638, 303],
    [600, 315],
    [577, 342],
  ],
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
