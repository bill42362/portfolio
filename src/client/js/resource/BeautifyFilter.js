// BeautifyFilter.js
import { createBuffer, createTexture } from '../resource/WebGL.js';
import GreenBlueChannel from '../resource/GreenBlueChannel.js';
import GaussianBlurFilter from '../resource/GaussianBlurFilter.js';
import HighPassFilter from '../resource/HighPassFilter.js';
import HardLight from '../resource/HardLight.js';
import ToneCurve from '../resource/ToneCurve.js';
import MaskBlender from '../resource/MaskBlender.js';
import FillColor from '../resource/FillColor.js';
import CopyTexture from '../resource/CopyTexture.js';

const textureNames = [
  'source',
  'greenBlueChannel',
  'gaussianBlurMid',
  'gaussianBlur',
  'highPassFilter',
  'hardLight',
  'toneMap',
  'toneCurve',
  'maskBlender',
];
const frameBufferNames = [
  'greenBlueChannel',
  'gaussianBlurMid',
  'gaussianBlur',
  'highPassFilter',
  'hardLight',
  'toneCurve',
  'maskBlender',
];
const textureIndex = textureNames.reduce(
  (current, textureName, index) => ({ ...current, [textureName]: index }),
  {}
);
const clearColor = [0, 0, 0, 0];
const positionAttribute = {
  array: [-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1],
  numComponents: 2,
};
const textCoordAttribute = {
  array: [0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0],
  numComponents: 2,
};

const BeautifyFilter = function () {
  const canvas = document.createElement('canvas');
  this.canvas = canvas;

  const context = canvas.getContext('webgl2');
  this.context = context;

  this.slice = textureNames.reduce(
    (current, textureName) => ({ ...current, [textureName]: [] }),
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

  this.highPassFilter = new HighPassFilter({ context: this.context });
  this.highPassFilter.dockBuffer({
    key: 'aPosition',
    buffer: this.buffer.aPosition,
  });
  this.highPassFilter.dockBuffer({
    key: 'aTextCoord',
    buffer: this.buffer.aTextCoord,
  });

  this.hardLight = new HardLight({ context: this.context });
  this.hardLight.dockBuffer({
    key: 'aPosition',
    buffer: this.buffer.aPosition,
  });
  this.hardLight.dockBuffer({
    key: 'aTextCoord',
    buffer: this.buffer.aTextCoord,
  });

  this.toneCurve = new ToneCurve({
    context: this.context,
    toneMapTexture: this.texture.toneMap,
    toneMapTextureIndex: textureIndex.toneMap,
  });
  this.toneCurve.dockBuffer({
    key: 'aPosition',
    buffer: this.buffer.aPosition,
  });
  this.toneCurve.dockBuffer({
    key: 'aTextCoord',
    buffer: this.buffer.aTextCoord,
  });

  this.maskBlender = new MaskBlender({ context: this.context });
  this.maskBlender.dockBuffer({
    key: 'aPosition',
    buffer: this.buffer.aPosition,
  });
  this.maskBlender.dockBuffer({
    key: 'aTextCoord',
    buffer: this.buffer.aTextCoord,
  });

  this.fillColor = new FillColor({ context: this.context, color: clearColor });
  this.fillColor.dockBuffer({
    key: 'aPosition',
    buffer: this.buffer.aPosition,
  });
  this.fillColor.dockBuffer({
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

  this.exportTextureToCanvases({
    texture: this.texture.source,
    textureIndex: textureIndex.source,
    canvases: this.slice['source'],
  });

  this.greenBlueChannel.draw({
    sourceTexture: this.texture.source,
    sourceTextureIndex: textureIndex.source,
    targetFrameBuffer: this.frameBuffer.greenBlueChannel,
  });

  this.exportTextureToCanvases({
    texture: this.texture.greenBlueChannel,
    textureIndex: textureIndex.greenBlueChannel,
    canvases: this.slice['greenBlueChannel'],
  });

  this.gaussianBlur.draw({
    sourceTexture: this.texture.greenBlueChannel,
    sourceTextureIndex: textureIndex.greenBlueChannel,
    midFrameBuffer: this.frameBuffer.gaussianBlurMid,
    midTexture: this.texture.gaussianBlurMid,
    midTextureIndex: textureIndex.gaussianBlurMid,
    targetFrameBuffer: this.frameBuffer.gaussianBlur,
  });

  this.exportTextureToCanvases({
    texture: this.texture.gaussianBlur,
    textureIndex: textureIndex.gaussianBlur,
    canvases: this.slice['gaussianBlur'],
  });

  this.highPassFilter.draw({
    sourceTexture: this.texture.greenBlueChannel,
    sourceTextureIndex: textureIndex.greenBlueChannel,
    blurredSourceTexture: this.texture.gaussianBlur,
    blurredSourceTextureIndex: textureIndex.gaussianBlur,
    targetFrameBuffer: this.frameBuffer.highPassFilter,
  });

  this.exportTextureToCanvases({
    texture: this.texture.highPassFilter,
    textureIndex: textureIndex.highPassFilter,
    canvases: this.slice['highPassFilter'],
  });

  this.hardLight.draw({
    sourceTexture: this.texture.highPassFilter,
    sourceTextureIndex: textureIndex.highPassFilter,
    targetFrameBuffer: this.frameBuffer.hardLight,
  });

  this.exportTextureToCanvases({
    texture: this.texture.hardLight,
    textureIndex: textureIndex.hardLight,
    canvases: this.slice['hardLight'],
  });

  this.toneCurve.draw({
    sourceTexture: this.texture.source,
    sourceTextureIndex: textureIndex.source,
    targetFrameBuffer: this.frameBuffer.toneCurve,
  });

  this.exportTextureToCanvases({
    texture: this.texture.toneCurve,
    textureIndex: textureIndex.toneCurve,
    canvases: this.slice['toneCurve'],
  });

  this.maskBlender.draw({
    sourceTexture: this.texture.source,
    sourceTextureIndex: textureIndex.source,
    maskTexture: this.texture.highPassFilter,
    maskTextureIndex: textureIndex.highPassFilter,
    blendSourceTexture: this.texture.toneCurve,
    blendSourceTextureIndex: textureIndex.toneCurve,
    targetFrameBuffer: this.frameBuffer.maskBlender,
  });

  this.exportTextureToCanvases({
    texture: this.texture.maskBlender,
    textureIndex: textureIndex.maskBlender,
    canvases: this.slice['maskBlender'],
  });

  this.copyTexture.draw({
    sourceTexture: this.texture.maskBlender,
    sourceTextureIndex: textureIndex.maskBlender,
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

BeautifyFilter.prototype.registerSlice = function ({
  key = 'greenBlueChannel',
  canvas,
}) {
  if (!textureNames.includes(key) || !canvas || 'CANVAS' !== canvas.nodeName) {
    return;
  }
  return this.slice[key].push(canvas);
};

BeautifyFilter.prototype.exportTextureToCanvases = function ({
  texture,
  textureIndex,
  canvases,
}) {
  if (!texture || !textureIndex || !canvases?.length) return;

  const targetContexts = canvases
    .map(canvas => {
      if ('CANVAS' !== canvas?.nodeName) return;
      return canvas.getContext('2d');
    })
    .filter(Boolean);
  if (!targetContexts.length) return;

  this.copyTexture.draw({
    sourceTexture: texture,
    sourceTextureIndex: textureIndex,
  });

  targetContexts.forEach(targetContext => {
    const sourceCanvas = this.canvas;
    const sourceWidth = sourceCanvas.width;
    const sourceHeight = sourceCanvas.height;

    const targetWidth = targetContext.canvas.width;
    const targetHeight = targetContext.canvas.height;

    if (targetWidth !== sourceWidth || targetHeight !== sourceHeight) {
      targetContext.canvas.width = sourceWidth;
      targetContext.canvas.height = sourceHeight;
    }
    targetContext.clearRect(0, 0, sourceWidth, sourceHeight);
    targetContext.drawImage(sourceCanvas, 0, 0);
  });

  this.fillColor.draw();
};

BeautifyFilter.prototype.updateGaussianBlurKernal = function ({
  radius,
  sigma,
} = {}) {
  return this.gaussianBlur.updateKernal({ radius, sigma });
};

export default BeautifyFilter;
