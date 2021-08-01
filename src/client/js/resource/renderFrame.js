// renderFrame.js
import {
  createBuffer,
  createTexture,
  createElementsBuffer,
  updateElementsBuffer,
} from '../resource/WebGL.js';
import CopyTexture from '../resource/CopyTexture.js';
import CircularDeform from '../resource/CircularDeform.js';
import DrawDots from '../resource/DrawDots.js';

const textureNames = ['source', 'circularDeform'];
const frameBufferNames = ['circularDeform'];
const textureIndex = textureNames.reduce(
  (current, textureName, index) => ({ ...current, [textureName]: index }),
  {}
);

const clearColor = [34, 47, 62, 1.0];
const positionAttribute = {
  array: [-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0],
  numComponents: 3,
};
const textCoordAttribute = {
  array: [0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0],
  numComponents: 2,
};
const indexesData = {
  array: [],
  numComponents: 1,
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
  this.buffer.elementIndexes = createElementsBuffer({
    context,
    indexesData,
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

  this.circularDeform = new CircularDeform({ context: this.context });
  this.circularDeform.dockBuffer({
    key: 'aPosition',
    buffer: this.buffer.aPosition,
  });
  this.circularDeform.dockBuffer({
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
    context.bindFramebuffer(
      context.FRAMEBUFFER,
      this.frameBuffer.circularDeform
    );
    context.clearBufferfv(context.COLOR, 0, [0.5, 0.5, 0.5, 1]);

    this.circularDeform.dockBuffer({
      key: 'aPosition',
      buffer: this.buffer.aPosition,
    });
    this.circularDeform.dockBuffer({
      key: 'aTextCoord',
      buffer: this.buffer.aTextCoord,
    });
    this.circularDeform.draw({
      sourceTexture: this.texture.source,
      sourceTextureIndex: textureIndex.source,
      positionAttribute: positionAttribute,
      textureCoordAttribute: textCoordAttribute,
      circularDeforms: configs.deformData.circularDeforms,
      targetFrameBuffer: this.frameBuffer.circularDeform,
    });

    this.copyTexture.dockBuffer({
      key: 'aPosition',
      buffer: this.buffer.aPosition,
    });
    this.copyTexture.dockBuffer({
      key: 'aTextCoord',
      buffer: this.buffer.aTextCoord,
    });
    this.buffer.elementIndexes = updateElementsBuffer({
      context,
      buffer: this.buffer.elementIndexes,
      indexesData: configs.movingLeastSquareElementIndexes,
    });
    this.copyTexture.draw({
      sourceTexture: this.texture.circularDeform,
      sourceTextureIndex: textureIndex.circularDeform,
      positionAttribute: configs.movingLeastSquarePositionAttribute,
      textureCoordAttribute: configs.movingLeastSquareTextCoordAttribute,
      elementsBuffer: this.buffer.elementIndexes,
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
      this.drawDots.draw({
        positionAttribute: configs.movingLeastSquarePositionAttribute,
        colorAttribute: configs.movingLeastSquareColorAttribute,
      });
    }
  }

  return createImageBitmap(this.canvas);
};

let renderer = null;
export const initRenderer = ({ sizes }) => {
  renderer = new Renderer({ sizes });
};

let isRendererBusy = false;
let outputBitmap = null;
const renderFrame = async ({ imageBitmap, faceData, deformConfig }) => {
  if (isRendererBusy || !imageBitmap || !faceData) {
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
  const mesh = faceData.faceMeshs?.[0];
  if (mesh) {
    configs = { ...deformConfig };
    configs.deformData = faceData.deformData;

    configs.positionAttribute = {
      array: mesh.dots.positions.flatMap(a => a),
      numComponents: 3,
    };
    configs.textCoordAttribute = {
      array: mesh.dots.textCoords.flatMap(a => a),
      numComponents: 2,
    };
    configs.colorAttribute = {
      array: mesh.dots.colors.flatMap(a => a),
      numComponents: 3,
    };

    configs.movingLeastSquarePositionAttribute = {
      array: faceData.deformData.movingLeastSquareMesh.positions,
      numComponents: 3,
    };
    configs.movingLeastSquareTextCoordAttribute = {
      array: faceData.deformData.movingLeastSquareMesh.textCoords,
      numComponents: 2,
    };
    configs.movingLeastSquareColorAttribute = {
      array: faceData.deformData.movingLeastSquareMesh.colors,
      numComponents: 3,
    };
    configs.movingLeastSquareElementIndexes = {
      array: faceData.deformData.movingLeastSquareMesh.elementIndexes,
      numComponents: 1,
    };
  }
  const newBitmap = await renderer.draw({ pixelSource: imageBitmap, configs });
  outputBitmap?.close();
  outputBitmap = newBitmap;
  isRendererBusy = false;
  return outputBitmap;
};

export default renderFrame;
