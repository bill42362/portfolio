// BeautifyFilter.js
import {
  createProgram,
  createBuffer,
  createTexture,
  dockBuffer,
} from '../resource/WebGL.js';
import mirrorVertexShaderSource from '../shaderSource/mirrorVertex.js';
import mirrorFragmentShaderSource from '../shaderSource/mirrorFragment.js';

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

  this.texture = {};
  this.texture.source = createTexture({ context, index: 0 });

  this.frameBuffer = {};
  this.frameBuffer.source = context.createFramebuffer();

  this.copySource = {};
  this.copySource.core = createProgram({
    context,
    vertexShaderSource: mirrorVertexShaderSource,
    fragmentShaderSource: mirrorFragmentShaderSource,
  });

  this.copySource.location = {};
  this.copySource.location.aPosition = context.getAttribLocation(
    this.copySource.core.program,
    'aPosition'
  );
  this.copySource.location.aTextCoord = context.getAttribLocation(
    this.copySource.core.program,
    'aTextCoord'
  );
  this.copySource.location.uSource = context.getUniformLocation(
    this.copySource.core.program,
    'uSource'
  );
  context.enableVertexAttribArray(this.copySource.location.aPosition);
  context.enableVertexAttribArray(this.copySource.location.aTextCoord);

  this.copySource.buffer = {};
  this.copySource.buffer.aPosition = createBuffer({
    context,
    attribute: positionAttribute,
  });
  this.copySource.buffer.aTextCoord = createBuffer({
    context,
    attribute: textCoordAttribute,
  });
  dockBuffer({
    context,
    location: this.copySource.location.aPosition,
    buffer: this.copySource.buffer.aPosition,
  });
  dockBuffer({
    context,
    location: this.copySource.location.aTextCoord,
    buffer: this.copySource.buffer.aTextCoord,
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

  context.useProgram(this.copySource.core.program);
  context.uniform1i(this.copySource.location.uSource, 0);
  context.texImage2D(
    context.TEXTURE_2D,
    0, // mip level
    context.RGBA, // internam format
    context.RGBA, // src format
    context.UNSIGNED_BYTE, // src type
    pixelSource
  );
  context.drawArrays(
    context.TRIANGLES,
    0,
    this.copySource.buffer.aPosition.count
  );
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
  }
};

export default BeautifyFilter;
