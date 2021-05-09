// renderFrame.js
import { createBuffer, createTexture } from '../resource/WebGL.js';
import CopyTexture from '../resource/CopyTexture.js';

const textureNames = ['source'];
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

  this.texture = {};
  textureNames.forEach(name => {
    this.texture[name] = createTexture({ context, index: textureIndex[name] });
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
};

Renderer.prototype.draw = async function ({ pixelSource }) {
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

  this.copyTexture.draw({
    sourceTexture: this.texture.source,
    sourceTextureIndex: textureIndex.source,
  });

  return createImageBitmap(this.canvas);
};

let renderer = null;
export const initRenderer = ({ sizes }) => {
  renderer = new Renderer({ sizes });
};

let isRendererBusy = false;
let outputBitmap = null;
const renderFrame = async ({ imageBitmap, humanDetectedResult }) => {
  if (isRendererBusy || !imageBitmap || !humanDetectedResult) {
    return outputBitmap;
  }
  isRendererBusy = true;

  if (!renderer) {
    outputBitmap = imageBitmap;
    isRendererBusy = false;
    return outputBitmap;
  }

  outputBitmap = await renderer.draw({ pixelSource: imageBitmap });
  isRendererBusy = false;
  return outputBitmap;
};

export default renderFrame;
