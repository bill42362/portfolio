// FillColor.js
import { createProgram, dockBuffer } from '../resource/WebGL.js';
import mirrorVertexShaderSource from '../shaderSource/mirrorVertex.js';
import fillColorFragmentShaderSource from '../shaderSource/fillColorFragment.js';

const FillColor = function ({ context, color = [0, 0, 0, 1] } = {}) {
  if (!context) {
    throw new Error('need context arg');
  }
  this.context = context;

  this.core = createProgram({
    context,
    vertexShaderSource: mirrorVertexShaderSource,
    fragmentShaderSource: fillColorFragmentShaderSource,
  });
  this.buffer = {};

  this.location = {};
  this.location.aPosition = context.getAttribLocation(
    this.core.program,
    'aPosition'
  );
  this.location.aTextCoord = context.getAttribLocation(
    this.core.program,
    'aTextCoord'
  );
  context.enableVertexAttribArray(this.location.aPosition);
  context.enableVertexAttribArray(this.location.aTextCoord);

  this.location.uIsFrameBuffer = context.getUniformLocation(
    this.core.program,
    'uIsFrameBuffer'
  );
  this.location.uColor = context.getUniformLocation(
    this.core.program,
    'uColor'
  );
  this.location.uSource = context.getUniformLocation(
    this.core.program,
    'uSource'
  );

  this.updateColor({ color });
};

FillColor.prototype.dockBuffer = function ({ key, buffer }) {
  if (!['aPosition', 'aTextCoord'].includes(key)) {
    throw new Error('invalid buffer name');
  }
  this.buffer[key] = buffer;
  dockBuffer({ context: this.context, location: this.location[key], buffer });
};

FillColor.prototype.updateColor = function ({ color } = {}) {
  if (color && (!Array.isArray(color) || 4 !== color.length)) {
    throw new Error('invalid color argument');
  }
  this._color = color || this._color;

  const context = this.context;
  context.useProgram(this.core.program);
  context.uniform4f(this.location.uColor, ...this._color);
};

FillColor.prototype.draw = function ({ targetFrameBuffer } = {}) {
  const context = this.context;
  context.useProgram(this.core.program);

  if (targetFrameBuffer) {
    context.bindFramebuffer(context.FRAMEBUFFER, targetFrameBuffer);
    context.uniform1i(this.location.uIsFrameBuffer, 1);
  } else {
    context.bindFramebuffer(context.FRAMEBUFFER, null);
    context.uniform1i(this.location.uIsFrameBuffer, 0);
  }
  context.drawArrays(context.TRIANGLES, 0, this.buffer.aPosition.count);
};

export default FillColor;
