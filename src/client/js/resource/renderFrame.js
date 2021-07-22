// renderFrame.js
import Delaunator from 'delaunator';

import { createBuffer, createTexture } from '../resource/WebGL.js';
import CopyTexture from '../resource/CopyTexture.js';
import EnlargeEyes from '../resource/EnlargeEyes.js';
import DrawDots from '../resource/DrawDots.js';
import { shrinkFactor } from '../resource/facemeshVariables.js';
import {
  getEyeCenters,
  getEnlargeEyes,
} from '../resource/getFaceMeshTransform.js';

const textureNames = ['source', 'normalMap'];
const frameBufferNames = ['normalMap'];
const textureIndex = textureNames.reduce(
  (current, textureName, index) => ({ ...current, [textureName]: index }),
  {}
);

const clearColor = [34, 47, 62, 1.0];
const positionAttribute = {
  array: [-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1],
  numComponents: 2,
};
const textCoordAttribute = {
  array: [0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0],
  numComponents: 2,
};
const dotsPositionAttribute = {
  array: [],
  numComponents: 3,
};
const dotsTextCoordAttribute = {
  array: [],
  numComponents: 2,
};
const dotsColorAttribute = {
  array: [],
  numComponents: 3,
};

const Renderer = function ({ sizes }) {
  const canvas = new OffscreenCanvas(sizes.width, sizes.height);
  this.canvas = canvas;

  const context = canvas.getContext('webgl2');
  this.context = context;
  if (!context) {
    throw new Error('Browser not support WebGL2.0');
  }

  this.slice = textureNames.reduce(
    (current, textureName) => ({ ...current, [textureName]: {} }),
    {}
  );

  this.buffer = {};
  this.buffer.aPosition = createBuffer({
    context,
    attribute: positionAttribute,
  });
  this.buffer.aTextCoord = createBuffer({
    context,
    attribute: textCoordAttribute,
  });
  this.buffer.aDotsPosition = createBuffer({
    context,
    attribute: dotsPositionAttribute,
  });
  this.buffer.aDotsTextCoord = createBuffer({
    context,
    attribute: dotsTextCoordAttribute,
  });
  this.buffer.aDotsColor = createBuffer({
    context,
    attribute: dotsColorAttribute,
  });

  this.texture = {};
  textureNames.forEach(name => {
    this.texture[name] = createTexture({ context, index: textureIndex[name] });
  });

  this.frameBuffer = {};
  frameBufferNames.forEach(name => {
    this.frameBuffer[name] = context.createFramebuffer();
    context.bindFramebuffer(context.FRAMEBUFFER, this.frameBuffer[name]);
    context.framebufferTexture2D(
      context.FRAMEBUFFER,
      context.COLOR_ATTACHMENT0,
      context.TEXTURE_2D,
      this.texture[name],
      0 // level
    );
  });

  this.copyTexture = new CopyTexture({ context: this.context });
  this.copyTexture.dockBuffer({
    key: 'aPosition',
    buffer: this.buffer.aPosition,
  });
  this.copyTexture.dockBuffer({
    key: 'aTextCoord',
    buffer: this.buffer.aTextCoord,
  });

  this.enlargeEyes = new EnlargeEyes({ context: this.context });
  this.enlargeEyes.dockBuffer({
    key: 'aPosition',
    buffer: this.buffer.aPosition,
  });
  this.enlargeEyes.dockBuffer({
    key: 'aTextCoord',
    buffer: this.buffer.aTextCoord,
  });

  this.drawDots = new DrawDots({ context: this.context });
  this.drawDots.dockBuffer({
    key: 'aPosition',
    buffer: this.buffer.aDotsPosition,
  });
  this.drawDots.dockBuffer({
    key: 'aColor',
    buffer: this.buffer.aDotsColor,
  });
};

Renderer.prototype.draw = async function ({ pixelSource, configs }) {
  if (!pixelSource || !this.context) {
    return;
  }

  const context = this.context;
  context.clearColor(...clearColor);
  context.clear(context.COLOR_BUFFER_BIT);

  context.bindTexture(context.TEXTURE_2D, this.texture.source);
  context.texImage2D(
    context.TEXTURE_2D,
    0, // mip level
    context.RGBA, // internam format
    context.RGBA, // src format
    context.UNSIGNED_BYTE, // src type
    pixelSource
  );

  if (!configs) {
    this.copyTexture.dockBuffer({
      key: 'aPosition',
      buffer: this.buffer.aPosition,
    });
    this.copyTexture.dockBuffer({
      key: 'aTextCoord',
      buffer: this.buffer.aTextCoord,
    });
    this.copyTexture.draw({
      sourceTexture: this.texture.source,
      sourceTextureIndex: textureIndex.source,
    });
  } else {
    //context.bindFramebuffer(context.FRAMEBUFFER, this.frameBuffer.normalMap);
    //context.clearBufferfv(context.COLOR, 0, [0.5, 0.5, 0.5, 1]);

    this.enlargeEyes.dockBuffer({
      key: 'aPosition',
      buffer: this.buffer.aPosition,
    });
    this.enlargeEyes.dockBuffer({
      key: 'aTextCoord',
      buffer: this.buffer.aTextCoord,
    });
    this.enlargeEyes.draw({
      sourceTexture: this.texture.source,
      sourceTextureIndex: textureIndex.source,
      eyesInfo: [
        configs.eyeCentersTextCoord.left[0],
        configs.eyeCentersTextCoord.left[1],
        configs.eyeCentersTextCoord.right[0],
        configs.eyeCentersTextCoord.right[1],
      ],
      enlargeConfig: [0.03, configs.eyesEnlargeRatio],
    });

    if (configs.needDots) {
      this.drawDots.dockBuffer({
        key: 'aPosition',
        buffer: this.buffer.aDotsPosition,
      });
      this.drawDots.dockBuffer({
        key: 'aColor',
        buffer: this.buffer.aDotsColor,
      });
      this.drawDots.draw({
        positionAttribute: configs.positionAttribute,
        colorAttribute: configs.colorAttribute,
      });
    }
  }

  return createImageBitmap(this.canvas);
};

let renderer = null;
export const initRenderer = ({ sizes }) => {
  renderer = new Renderer({ sizes });
};

const translateLandmark =
  ({ width, height, shrinkFactor }) =>
  ([x, y]) => {
    return [
      (2 * shrinkFactor * x) / width - 1,
      (-2 * shrinkFactor * y) / height + 1,
      0,
    ];
  };
const vertexToTextCoord = v => [0.5 + v[0] / 2, 0.5 - v[1] / 2];

let isRendererBusy = false;
let outputBitmap = null;
const renderFrame = async ({
  imageBitmap,
  humanDetectedResult,
  deformConfig,
}) => {
  if (isRendererBusy || !imageBitmap || !humanDetectedResult) {
    return outputBitmap;
  }
  isRendererBusy = true;

  if (!renderer) {
    outputBitmap?.close();
    outputBitmap = imageBitmap;
    isRendererBusy = false;
    return outputBitmap;
  }

  let configs = null;
  const mesh = humanDetectedResult[0]?.scaledMesh;
  if (mesh) {
    const translator = translateLandmark({
      width: imageBitmap.width,
      height: imageBitmap.height,
      shrinkFactor,
    });
    const dotPositions = mesh.map(translator);
    const dotTextCoords = dotPositions.map(vertexToTextCoord);
    const dotColors = dotPositions.map(() => [1, 1, 0]);
    const dotPositionsEyesEnlarged = getEnlargeEyes({
      dotPositions,
      ratio: deformConfig.eyesEnlarge,
    });

    // transform list of points [[x, y], [x, y], ...]
    // into triangles composed with point indexes
    // [[1, 2, 3], [2, 3, 4], [3, 4, 5], ...]
    const { triangles } = Delaunator.from(dotPositions);
    let dotsIndexGroups = [];
    for (let i = 0; i < triangles.length; i += 3) {
      dotsIndexGroups.push([triangles[i], triangles[i + 1], triangles[i + 2]]);
    }

    // transform triangles composed with point indexes
    // into point array
    // [[x, y], [x, y], ...]
    const triangleChunks = dotsIndexGroups.flatMap(a => a);
    const trianglePositions = triangleChunks.map(
      a => dotPositionsEyesEnlarged[a]
    );
    const triangleTextCoords = triangleChunks.map(a => dotTextCoords[a]);
    const triangleColors = triangleChunks.map(a => dotColors[a]);

    configs = { ...deformConfig };
    configs.eyeCentersPosition = getEyeCenters({ dotPositions });
    configs.eyeCentersTextCoord = {
      left: vertexToTextCoord(configs.eyeCentersPosition.left),
      right: vertexToTextCoord(configs.eyeCentersPosition.right),
    };
    configs.eyesEnlargeRatio = deformConfig.eyesEnlarge;
    configs.positionAttribute = {
      array: dotPositions.flatMap(a => a),
      numComponents: 3,
    };
    configs.textCoordAttribute = {
      array: dotTextCoords.flatMap(a => a),
      numComponents: 2,
    };
    configs.colorAttribute = {
      array: dotColors.flatMap(a => a),
      numComponents: 3,
    };
    configs.trianglePositionAttribute = {
      array: trianglePositions.flatMap(a => a),
      numComponents: 3,
    };
    configs.triangleTextCoordAttribute = {
      array: triangleTextCoords.flatMap(a => a),
      numComponents: 2,
    };
    configs.triangleColorAttribute = {
      array: triangleColors.flatMap(a => a),
      numComponents: 3,
    };
  }
  const newBitmap = await renderer.draw({ pixelSource: imageBitmap, configs });
  outputBitmap?.close();
  outputBitmap = newBitmap;
  isRendererBusy = false;
  return outputBitmap;
};

export default renderFrame;
