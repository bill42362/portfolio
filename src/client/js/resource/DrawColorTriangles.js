// DrawColorTriangles.js
import { createProgram, dockBuffer, updateBuffer } from '../resource/WebGL.js';
import passColorVertexShaderSource from '../shaderSource/passColorVertex.js';
import passColorFragmentShaderSource from '../shaderSource/passColorFragment.js';

const DrawColorTriangles = function ({ context } = {}) {
  if (!context) {
    throw new Error('need context arg');
  }
  this.context = context;

  this.core = createProgram({
    context,
    vertexShaderSource: passColorVertexShaderSource,
    fragmentShaderSource: passColorFragmentShaderSource,
  });
  this.buffer = {};

  this.location = {};
  this.location.aPosition = context.getAttribLocation(
    this.core.program,
    'aPosition'
  );
  this.location.aColor = context.getAttribLocation(this.core.program, 'aColor');
  context.enableVertexAttribArray(this.location.aPosition);
  context.enableVertexAttribArray(this.location.aColor);

  this.location.uIsFrameBuffer = context.getUniformLocation(
    this.core.program,
    'uIsFrameBuffer'
  );
};

DrawColorTriangles.prototype.dockBuffer = function ({ key, buffer }) {
  if (!['aPosition', 'aColor'].includes(key)) {
    throw new Error('invalid buffer name');
  }
  this.buffer[key] = buffer;
  dockBuffer({ context: this.context, location: this.location[key], buffer });
};

DrawColorTriangles.prototype.updateBuffer = function ({ key, attribute }) {
  if (!['aPosition', 'aColor'].includes(key)) {
    throw new Error('invalid buffer name');
  }
  const buffer = this.buffer[key];
  this.buffer[key] = updateBuffer({ context: this.context, buffer, attribute });
};

DrawColorTriangles.prototype.draw = function ({
  positionAttribute,
  colorAttribute,
  targetFrameBuffer,
}) {
  const context = this.context;
  context.useProgram(this.core.program);

  this.updateBuffer({ key: 'aPosition', attribute: positionAttribute });
  this.updateBuffer({ key: 'aColor', attribute: colorAttribute });

  if (targetFrameBuffer) {
    context.bindFramebuffer(context.FRAMEBUFFER, targetFrameBuffer);
    context.uniform1i(this.location.uIsFrameBuffer, 1);
  } else {
    context.bindFramebuffer(context.FRAMEBUFFER, null);
    context.uniform1i(this.location.uIsFrameBuffer, 0);
  }
  context.drawArrays(context.TRIANGLES, 0, this.buffer.aPosition.count);
};

export default DrawColorTriangles;
