// BeautifyFilter.js
import {
  createProgram,
  createBuffer,
  createTexture,
  dockBuffer,
} from '../resource/WebGL.js';
import mirrorVertexShaderSource from '../shaderSource/mirrorVertex.js';
import mirrorFragmentShaderSource from '../shaderSource/mirrorFragment.js';
import greenBlueChannelFragmentShaderSource from '../shaderSource/greenBlueChannelFragment.js';
import gaussianBlurFragmentShaderSource from '../shaderSource/gaussianBlurFragment.js';

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

const getGussianBlurKernal = (inputRadius, sigma) => {
  const radius = Math.floor(Math.abs(inputRadius));
  const sigma2 = sigma * sigma;
  const data = new Array(radius * 2 + 1);
  let sum = 0;
  for (let x = -radius; x <= radius; ++x) {
    const index = x + radius;
    data[index] =
      Math.exp(-(x * x) / (2.0 * sigma2)) / Math.sqrt(2.0 * Math.PI * sigma2);
    sum += data[index];
  }
  const normalizedData = data.map(value => value / sum);
  return { data: new Float32Array(normalizedData), radius };
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

  this.greenBlueChannel.location.uIsFrameBuffer = context.getUniformLocation(
    this.greenBlueChannel.core.program,
    'uIsFrameBuffer'
  );
  this.greenBlueChannel.location.uSource = context.getUniformLocation(
    this.greenBlueChannel.core.program,
    'uSource'
  );

  this.gaussianBlur = {};
  this.gaussianBlur.core = createProgram({
    context,
    vertexShaderSource: mirrorVertexShaderSource,
    fragmentShaderSource: gaussianBlurFragmentShaderSource,
  });

  this.gaussianBlur.location = {};
  this.gaussianBlur.location.aPosition = context.getAttribLocation(
    this.gaussianBlur.core.program,
    'aPosition'
  );
  this.gaussianBlur.location.aTextCoord = context.getAttribLocation(
    this.gaussianBlur.core.program,
    'aTextCoord'
  );
  context.enableVertexAttribArray(this.gaussianBlur.location.aPosition);
  context.enableVertexAttribArray(this.gaussianBlur.location.aTextCoord);
  dockBuffer({
    context,
    location: this.gaussianBlur.location.aPosition,
    buffer: this.buffer.aPosition,
  });
  dockBuffer({
    context,
    location: this.gaussianBlur.location.aTextCoord,
    buffer: this.buffer.aTextCoord,
  });

  this.gaussianBlur.location.uIsFrameBuffer = context.getUniformLocation(
    this.gaussianBlur.core.program,
    'uIsFrameBuffer'
  );
  this.gaussianBlur.location.uSource = context.getUniformLocation(
    this.gaussianBlur.core.program,
    'uSource'
  );
  this.gaussianBlur.location.uResolution = context.getUniformLocation(
    this.gaussianBlur.core.program,
    'uResolution'
  );
  this.gaussianBlur.location.uKernalRadius = context.getUniformLocation(
    this.gaussianBlur.core.program,
    'uKernalRadius'
  );
  this.gaussianBlur.location.uKernelData = context.getUniformLocation(
    this.gaussianBlur.core.program,
    'uKernelData'
  );
  this.gaussianBlur.location.uIsVertical = context.getUniformLocation(
    this.gaussianBlur.core.program,
    'uIsVertical'
  );
  this.gaussianBlur.kernal = getGussianBlurKernal(16, 5);

  this.mirrorTexture = {};
  this.mirrorTexture.core = createProgram({
    context,
    vertexShaderSource: mirrorVertexShaderSource,
    fragmentShaderSource: mirrorFragmentShaderSource,
  });

  this.mirrorTexture.location = {};
  this.mirrorTexture.location.aPosition = context.getAttribLocation(
    this.mirrorTexture.core.program,
    'aPosition'
  );
  this.mirrorTexture.location.aTextCoord = context.getAttribLocation(
    this.mirrorTexture.core.program,
    'aTextCoord'
  );
  context.enableVertexAttribArray(this.mirrorTexture.location.aPosition);
  context.enableVertexAttribArray(this.mirrorTexture.location.aTextCoord);
  dockBuffer({
    context,
    location: this.mirrorTexture.location.aPosition,
    buffer: this.buffer.aPosition,
  });
  dockBuffer({
    context,
    location: this.mirrorTexture.location.aTextCoord,
    buffer: this.buffer.aTextCoord,
  });

  this.mirrorTexture.location.uIsFrameBuffer = context.getUniformLocation(
    this.mirrorTexture.core.program,
    'uIsFrameBuffer'
  );
  this.mirrorTexture.location.uSource = context.getUniformLocation(
    this.mirrorTexture.core.program,
    'uSource'
  );
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
  context.uniform1i(this.greenBlueChannel.location.uIsFrameBuffer, 1);
  context.uniform1i(
    this.greenBlueChannel.location.uSource,
    textureIndex.source
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

  context.useProgram(this.gaussianBlur.core.program);
  context.uniform2f(
    this.gaussianBlur.location.uResolution,
    context.canvas.width,
    context.canvas.height
  );
  context.uniform1i(
    this.gaussianBlur.location.uKernalRadius,
    this.gaussianBlur.kernal.radius
  );
  context.uniform1fv(
    this.gaussianBlur.location.uKernelData,
    this.gaussianBlur.kernal.data
  );

  context.bindFramebuffer(
    context.FRAMEBUFFER,
    this.frameBuffer.gaussianBlurMid
  );
  context.bindTexture(context.TEXTURE_2D, this.texture.greenBlueChannel);
  context.uniform1i(this.gaussianBlur.location.uIsFrameBuffer, 1);
  context.uniform1i(
    this.gaussianBlur.location.uSource,
    textureIndex.greenBlueChannel
  );
  context.uniform1i(this.gaussianBlur.location.uIsVertical, 1);
  context.drawArrays(context.TRIANGLES, 0, this.buffer.aPosition.count);

  context.bindFramebuffer(context.FRAMEBUFFER, this.frameBuffer.gaussianBlur);
  context.bindTexture(context.TEXTURE_2D, this.texture.gaussianBlurMid);
  context.uniform1i(this.gaussianBlur.location.uIsFrameBuffer, 1);
  context.uniform1i(
    this.gaussianBlur.location.uSource,
    textureIndex.gaussianBlurMid
  );
  context.uniform1i(this.gaussianBlur.location.uIsVertical, 0);
  context.drawArrays(context.TRIANGLES, 0, this.buffer.aPosition.count);

  context.useProgram(this.mirrorTexture.core.program);
  context.bindFramebuffer(context.FRAMEBUFFER, null);
  context.bindTexture(context.TEXTURE_2D, this.texture.gaussianBlur);
  context.uniform1i(this.mirrorTexture.location.uIsFrameBuffer, 0);
  context.uniform1i(
    this.mirrorTexture.location.uSource,
    textureIndex.gaussianBlur
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
