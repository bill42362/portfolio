// faceLandmarkCore.js
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
