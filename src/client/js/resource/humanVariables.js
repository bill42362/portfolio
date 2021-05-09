// humanVariables.js
import '@vladmandic/human/models/blazeface.bin';
import faceDetectorModlePath from '@vladmandic/human/models/blazeface.json';
import '@vladmandic/human/models/facemesh.bin';
import faceMeshModlePath from '@vladmandic/human/models/facemesh.json';

const isProd = 'production' === process.env.NODE_ENV;

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
