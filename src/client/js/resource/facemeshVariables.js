// facemeshVariables.js
import * as tf from '@tensorflow/tfjs-core';
import { setWasmPaths } from '@tensorflow/tfjs-backend-wasm';

import wasmSource from '@tensorflow/tfjs-backend-wasm/dist/tfjs-backend-wasm.wasm';
import wasmSimdSource from '@tensorflow/tfjs-backend-wasm/dist/tfjs-backend-wasm-simd.wasm';
import wasmSimdThreadedSource from '@tensorflow/tfjs-backend-wasm/dist/tfjs-backend-wasm-threaded-simd.wasm';

const isProd = 'production' === process.env.NODE_ENV;
const wasmSourceBase = isProd ? '../' : '';

setWasmPaths({
  'tfjs-backend-wasm.wasm': `${wasmSourceBase}${wasmSource}`,
  'tfjs-backend-wasm-simd.wasm': `${wasmSourceBase}${wasmSimdSource}`,
  'tfjs-backend-wasm-threaded-simd.wasm': `${wasmSourceBase}${wasmSimdThreadedSource}`,
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

  skipFrame: 2, // 2
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
