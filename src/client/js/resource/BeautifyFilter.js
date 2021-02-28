// BeautifyFilter.js
import { createBuffer, createTexture } from '../resource/WebGL.js';
import GreenBlueChannel from '../resource/GreenBlueChannel.js';
import GaussianBlurFilter from '../resource/GaussianBlurFilter.js';
import CopyTexture from '../resource/CopyTexture.js';

const textureIndex = {
  source: 0,
  greenBlueChannel: 1,
  gaussianBlurMid: 2,
  gaussianBlur: 3,
};
const positionAttribute = {
  array: [-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1],
  numComponents: 2,
};
const textCoordAttribute = {
  array: [0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0],
  numComponents: 2,
};
const textureNames = [
  'source',
  'greenBlueChannel',
  'gaussianBlurMid',
  'gaussianBlur',
];
const frameBufferNames = [
  'greenBlueChannel',
  'gaussianBlurMid',
  'gaussianBlur',
];

const BeautifyFilter = function () {
  const canvas = document.createElement('canvas');
  this.canvas = canvas;
  window.canvas = canvas;

  const context = canvas.getContext('webgl2');
  this.context = context;
  window.context = context;

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

  this.greenBlueChannel = new GreenBlueChannel({ context: this.context });
  this.greenBlueChannel.dockBuffer({
    key: 'aPosition',
    buffer: this.buffer.aPosition,
  });
  this.greenBlueChannel.dockBuffer({
    key: 'aTextCoord',
    buffer: this.buffer.aTextCoord,
  });

  this.gaussianBlur = new GaussianBlurFilter({ context: this.context });
  this.gaussianBlur.dockBuffer({
    key: 'aPosition',
    buffer: this.buffer.aPosition,
  });
  this.gaussianBlur.dockBuffer({
    key: 'aTextCoord',
    buffer: this.buffer.aTextCoord,
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

BeautifyFilter.prototype.draw = function ({ pixelSource }) {
  if (!pixelSource || !this.context) {
    return;
  }

  this.updateCanvasSize({ pixelSource });

  const context = this.context;
  context.clearColor(0, 0, 0, 1);
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

  this.greenBlueChannel.draw({
    sourceTexture: this.texture.source,
    sourceTextureIndex: textureIndex.source,
    targetFrameBuffer: this.frameBuffer.greenBlueChannel,
  });

  this.gaussianBlur.draw({
    sourceTexture: this.texture.greenBlueChannel,
    sourceTextureIndex: textureIndex.greenBlueChannel,
    midFrameBuffer: this.frameBuffer.gaussianBlurMid,
    midTexture: this.texture.gaussianBlurMid,
    midTextureIndex: textureIndex.gaussianBlurMid,
    targetFrameBuffer: this.frameBuffer.gaussianBlur,
  });

  this.copyTexture.draw({
    sourceTexture: this.texture.gaussianBlur,
    sourceTextureIndex: textureIndex.gaussianBlur,
  });
};

BeautifyFilter.prototype.updateCanvasSize = function ({ pixelSource }) {
  if (!pixelSource || !this.context) {
    return;
  }

  const context = this.context;
  let sourceWidth = this.context.canvas.width;
  let sourceHeight = this.context.canvas.height;
  if ('VIDEO' === pixelSource.nodeName) {
    sourceWidth = pixelSource.videoWidth;
    sourceHeight = pixelSource.videoHeight;
  } else if ('CANVAS' === pixelSource.nodeName) {
    sourceWidth = pixelSource.width;
    sourceHeight = pixelSource.height;
  }

  const canvasWidth = context.canvas.width;
  const canvasHeight = context.canvas.height;
  if (canvasWidth !== sourceWidth || canvasHeight !== sourceHeight) {
    context.canvas.width = sourceWidth;
    context.canvas.height = sourceHeight;
    context.viewport(0, 0, sourceWidth, sourceHeight);
    // update texture sizes
    Object.keys(this.texture).forEach(textureKey => {
      const texture = this.texture[textureKey];
      context.bindTexture(context.TEXTURE_2D, texture);
      context.texImage2D(
        context.TEXTURE_2D,
        0, // level
        context.RGBA, // internal format
        sourceWidth,
        sourceHeight,
        0, // border
        context.RGBA, // src format
        context.UNSIGNED_BYTE, // src type
        null
      );
    });
  }
};

export default BeautifyFilter;
