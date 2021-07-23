// faceLandmarkVariables.js
import * as tf from '@tensorflow/tfjs-core';
import { setWasmPaths } from '@tensorflow/tfjs-backend-wasm';

import wasmSource from '@tensorflow/tfjs-backend-wasm/dist/tfjs-backend-wasm.wasm';
import wasmSimdSource from '@tensorflow/tfjs-backend-wasm/dist/tfjs-backend-wasm-simd.wasm';
import wasmSimdThreadedSource from '@tensorflow/tfjs-backend-wasm/dist/tfjs-backend-wasm-threaded-simd.wasm';

const htmlBase = process.env.HTML_BASE;

setWasmPaths({
  'tfjs-backend-wasm.wasm': `${htmlBase}${wasmSource}`,
  'tfjs-backend-wasm-simd.wasm': `${htmlBase}${wasmSimdSource}`,
  'tfjs-backend-wasm-threaded-simd.wasm': `${htmlBase}${wasmSimdThreadedSource}`,
});

tf.setBackend('wasm');

export const shrinkFactor = 4;

export const facemeshConfig = {
  shouldLoadIrisModel: false, // true
  maxContinuousChecks: 3, // 5
  // detectionConfidence: 0.9, // 0.9
  maxFaces: 2, // 10
  // iouThreshold: 0.3, // 0.3
  // scoreThreshold: 0.75, // 0.75
  // modelUrl: facemeshModlePath, // null
  // irisModelUrl: null, // null
  // flipHorizontal: true, // true
  predictIrises: false, // true

  skipFrame: 4, // 2
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

export const faceLandmarksIndex = {
  leftEye: {
    upper: {
      inner: [398, 384, 385, 386, 387, 388, 466],
      middle: [414, 286, 258, 257, 259, 260, 467],
      outer: [413, 441, 442, 443, 444, 445, 342],
    },
    lower: {
      inner: [362, 382, 381, 380, 374, 373, 390, 249, 263],
      middle: [463, 341, 256, 252, 253, 254, 339, 255, 359],
      outer: [464, 453, 452, 451, 450, 449, 448, 261, 446],
    },
  },
  rightEye: {
    upper: {
      inner: [173, 157, 158, 159, 160, 161, 246],
      middle: [190, 56, 28, 27, 29, 30, 247],
      outer: [189, 221, 222, 223, 224, 225, 113],
    },
    lower: {
      inner: [133, 155, 154, 153, 145, 144, 163, 7, 33],
      middle: [243, 112, 26, 22, 23, 24, 110, 25, 130],
      outer: [244, 233, 232, 231, 230, 229, 228, 31, 226],
    },
  },
};
