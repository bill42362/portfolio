// BeautifyFilter.js
import {
  createProgram,
  createBuffer,
  createTexture,
  dockBuffer,
} from '../resource/WebGL.js';
import mirrorVertexShaderSource from '../shaderSource/mirrorVertex.js';
import greenBlueChannelFragmentShaderSource from '../shaderSource/greenBlueChannelFragment.js';

const textureIndex = {
  SOURCE: 0,
  GREEN_BLUE_CHANNEL: 1,
};
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
  this.texture.source = createTexture({ context, index: textureIndex.SOURCE });
  this.texture.greenBlueChannel = createTexture({
    context,
    index: textureIndex.GREEN_BLUE_CHANNEL,
  });

  this.frameBuffer = {};
  this.frameBuffer.greenBlueChannel = context.createFramebuffer();
  context.bindFramebuffer(
    context.FRAMEBUFFER,
    this.frameBuffer.greenBlueChannel
  );
  context.framebufferTexture2D(
    context.FRAMEBUFFER,
    context.COLOR_ATTACHMENT0,
    context.TEXTURE_2D,
    this.texture.greenBlueChannel,
    0 // level
  );

  this.greenBlueChannel = {};
  this.greenBlueChannel.core = createProgram({
    context,
    vertexShaderSource: mirrorVertexShaderSource,
    fragmentShaderSource: greenBlueChannelFragmentShaderSource,
  });

  this.greenBlueChannel.location = {};
  this.greenBlueChannel.location.aPosition = context.getAttribLocation(
    this.greenBlueChannel.core.program,
    'aPosition'
  );
  this.greenBlueChannel.location.aTextCoord = context.getAttribLocation(
    this.greenBlueChannel.core.program,
    'aTextCoord'
  );
  this.greenBlueChannel.location.uSource = context.getUniformLocation(
    this.greenBlueChannel.core.program,
    'uSource'
  );
  context.enableVertexAttribArray(this.greenBlueChannel.location.aPosition);
  context.enableVertexAttribArray(this.greenBlueChannel.location.aTextCoord);

  dockBuffer({
    context,
    location: this.greenBlueChannel.location.aPosition,
    buffer: this.buffer.aPosition,
  });
  dockBuffer({
    context,
    location: this.greenBlueChannel.location.aTextCoord,
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

  context.useProgram(this.greenBlueChannel.core.program);
  context.bindFramebuffer(
    context.FRAMEBUFFER,
    this.frameBuffer.greenBlueChannel
  );
  context.bindTexture(context.TEXTURE_2D, this.texture.source);
  context.uniform1i(
    this.greenBlueChannel.location.uSource,
    textureIndex.SOURCE
  );
  context.texImage2D(
    context.TEXTURE_2D,
    0, // mip level
    context.RGBA, // internam format
    context.RGBA, // src format
    context.UNSIGNED_BYTE, // src type
    pixelSource
  );
  context.drawArrays(context.TRIANGLES, 0, this.buffer.aPosition.count);

  context.bindFramebuffer(context.FRAMEBUFFER, null);
  context.bindTexture(context.TEXTURE_2D, this.texture.greenBlueChannel);
  context.uniform1i(
    this.greenBlueChannel.location.uSource,
    textureIndex.GREEN_BLUE_CHANNEL
  );
  context.drawArrays(context.TRIANGLES, 0, this.buffer.aPosition.count);
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
