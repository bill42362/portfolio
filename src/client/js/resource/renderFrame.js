// renderFrame.js
import {
  createBuffer,
  createTexture,
  createElementsBuffer,
  updateElementsBuffer,
} from '../resource/WebGL.js';
import CopyTexture from '../resource/CopyTexture.js';
import BlendTextureByAlpha from '../resource/BlendTextureByAlpha.js';
import CircularDeform from '../resource/CircularDeform.js';
import DrawDots from '../resource/DrawDots.js';

const textureNames = ['source', 'morphSource', 'morphResult', 'circularDeform'];
const frameBufferNames = ['morphResult', 'circularDeform'];
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

  this.blendTextureByAlpha = new BlendTextureByAlpha({ context: this.context });
  this.blendTextureByAlpha.dockBuffer({
    key: 'aPosition',
    buffer: this.buffer.aPosition,
  });
  this.blendTextureByAlpha.dockBuffer({
    key: 'aBaseTextCoord',
    buffer: this.buffer.aTextCoord,
  });
  this.blendTextureByAlpha.dockBuffer({
    key: 'aAddonTextCoord',
    buffer: this.buffer.aDotsTextCoord,
  });
  this.blendTextureByAlpha.dockBuffer({
    key: 'aAddonColor',
    buffer: this.buffer.aDotsColor,
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

Renderer.prototype.draw = async function ({
  pixelSource,
  morphPixelSource,
  faceData,
  deformData,
  morphData,
}) {
  if (!pixelSource || !this.context) {
    return;
  }

  const context = this.context;
  context.clearColor(...clearColor);
  context.clear(context.COLOR_BUFFER_BIT);

  const shouldRenderMorphLayer =
    morphPixelSource && morphData.faceData?.positions.array.length;

  if (shouldRenderMorphLayer) {
    context.bindTexture(context.TEXTURE_2D, this.texture.morphSource);
    context.texImage2D(
      context.TEXTURE_2D,
      0, // mip level
      context.RGBA, // internal format
      context.RGBA, // src format
      context.UNSIGNED_BYTE, // src type
      morphPixelSource
    );
  } else {
    context.bindTexture(context.TEXTURE_2D, this.texture.source);
    context.texImage2D(
      context.TEXTURE_2D,
      0, // mip level
      context.RGBA, // internal format
      context.RGBA, // src format
      context.UNSIGNED_BYTE, // src type
      pixelSource
    );
  }

  const hasCircularDeforms = !!deformData?.circularDeforms.length;
  const hasMovingLeastSquareMesh =
    !!deformData?.movingLeastSquareMesh.positions.array.length;

  if (shouldRenderMorphLayer) {
    const shouldUseFrameBuffer = hasCircularDeforms || hasMovingLeastSquareMesh;
    if (shouldUseFrameBuffer) {
      context.bindFramebuffer(
        context.FRAMEBUFFER,
        this.frameBuffer.morphResult
      );
      context.clearBufferfv(context.COLOR, 0, [0, 0, 0, 0]);
    }

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
      indexesData: morphData.faceData.indexes,
    });
    const targetFrameBuffer = shouldUseFrameBuffer
      ? this.frameBuffer.morphResult
      : undefined;
    this.copyTexture.draw({
      sourceTexture: this.texture.morphSource,
      sourceTextureIndex: textureIndex.morphSource,
      positionAttribute: morphData.faceData.positions,
      textureCoordAttribute: morphData.faceData.textCoords,
      elementsBuffer: this.buffer.elementIndexes,
      targetFrameBuffer,
    });
  }

  if (hasCircularDeforms && hasMovingLeastSquareMesh) {
    context.bindFramebuffer(
      context.FRAMEBUFFER,
      this.frameBuffer.circularDeform
    );
    context.clearBufferfv(context.COLOR, 1, [0.5, 0.5, 0.5, 1]);
  }

  if (hasCircularDeforms) {
    this.circularDeform.dockBuffer({
      key: 'aPosition',
      buffer: this.buffer.aPosition,
    });
    this.circularDeform.dockBuffer({
      key: 'aTextCoord',
      buffer: this.buffer.aTextCoord,
    });
    const sourceTexture = shouldRenderMorphLayer
      ? this.texture.morphResult
      : this.texture.source;
    const sourceTextureIndex = shouldRenderMorphLayer
      ? textureIndex.morphResult
      : textureIndex.source;
    this.circularDeform.draw({
      sourceTexture,
      sourceTextureIndex,
      positionAttribute,
      textureCoordAttribute: textCoordAttribute,
      circularDeforms: deformData.circularDeforms,
      targetFrameBuffer: hasMovingLeastSquareMesh
        ? this.frameBuffer.circularDeform
        : undefined,
    });
  }

  if (
    hasMovingLeastSquareMesh ||
    !(hasCircularDeforms || shouldRenderMorphLayer)
  ) {
    this.copyTexture.dockBuffer({
      key: 'aPosition',
      buffer: this.buffer.aPosition,
    });
    this.copyTexture.dockBuffer({
      key: 'aTextCoord',
      buffer: this.buffer.aTextCoord,
    });
  }
  if (hasMovingLeastSquareMesh) {
    this.buffer.elementIndexes = updateElementsBuffer({
      context,
      buffer: this.buffer.elementIndexes,
      indexesData: deformData.movingLeastSquareMesh.elementIndexes,
    });
    const sourceTexture = hasCircularDeforms
      ? this.texture.circularDeform
      : shouldRenderMorphLayer
      ? this.texture.morphResult
      : this.texture.source;
    const sourceTextureIndex = hasCircularDeforms
      ? textureIndex.circularDeform
      : shouldRenderMorphLayer
      ? textureIndex.morphResult
      : textureIndex.source;
    this.copyTexture.draw({
      sourceTexture,
      sourceTextureIndex,
      positionAttribute: deformData.movingLeastSquareMesh.positions,
      textureCoordAttribute: deformData.movingLeastSquareMesh.textCoords,
      elementsBuffer: this.buffer.elementIndexes,
    });
  } else if (!hasCircularDeforms && !shouldRenderMorphLayer) {
    this.copyTexture.draw({
      sourceTexture: this.texture.source,
      sourceTextureIndex: textureIndex.source,
      positionAttribute,
      textureCoordAttribute: textCoordAttribute,
    });
  }

  if (faceData?.positions.array.length) {
    this.drawDots.dockBuffer({
      key: 'aPosition',
      buffer: this.buffer.aDotsPosition,
    });
    this.drawDots.dockBuffer({
      key: 'aColor',
      buffer: this.buffer.aDotsColor,
    });
    this.drawDots.draw({
      positionAttribute: faceData.positions,
      colorAttribute: faceData.colors,
    });
    /*
    this.drawDots.draw({
      positionAttribute: configs.movingLeastSquarePositionAttribute,
      colorAttribute: configs.movingLeastSquareColorAttribute,
    });
    */
  }

  return createImageBitmap(this.canvas);
};

let renderer = null;
export const initRenderer = ({ sizes }) => {
  renderer = new Renderer({ sizes });
};

let isRendererBusy = false;
let outputBitmap = null;
const renderFrame = async ({
  imageBitmap,
  faceData,
  deformData,
  morphData,
}) => {
  if (isRendererBusy || !imageBitmap) {
    return outputBitmap;
  }
  isRendererBusy = true;

  if (!renderer) {
    outputBitmap?.close();
    outputBitmap = imageBitmap;
    isRendererBusy = false;
    return outputBitmap;
  }

  const newBitmap = await renderer.draw({
    pixelSource: imageBitmap,
    morphPixelSource: morphData.imageBitmap,
    faceData,
    deformData,
    morphData,
  });
  outputBitmap?.close();
  outputBitmap = newBitmap;
  isRendererBusy = false;
  return outputBitmap;
};

export default renderFrame;
