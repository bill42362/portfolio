// CopyTextureWithNormalMap.js
import { createProgram, dockBuffer } from '../resource/WebGL.js';
import mirrorVertexShaderSource from '../shaderSource/mirrorVertex.js';
import mirrorFragmentWithNormalMapShaderSource from '../shaderSource/mirrorFragmentWithNormalMap.js';

const CopyTextureWithNormalMap = function ({ context } = {}) {
  if (!context) {
    throw new Error('need context arg');
  }
  this.context = context;

  this.core = createProgram({
    context,
    vertexShaderSource: mirrorVertexShaderSource,
    fragmentShaderSource: mirrorFragmentWithNormalMapShaderSource,
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
  this.location.uSource = context.getUniformLocation(
    this.core.program,
    'uSource'
  );
  this.location.uNormalMap = context.getUniformLocation(
    this.core.program,
    'uNormalMap'
  );
};

CopyTextureWithNormalMap.prototype.dockBuffer = function ({ key, buffer }) {
  if (!['aPosition', 'aTextCoord'].includes(key)) {
    throw new Error('invalid buffer name');
  }
  this.buffer[key] = buffer;
  dockBuffer({ context: this.context, location: this.location[key], buffer });
};

CopyTextureWithNormalMap.prototype.draw = function ({
  sourceTexture,
  sourceTextureIndex,
  normalMapTexture,
  normalMapTextureIndex,
  targetFrameBuffer,
}) {
  const context = this.context;
  context.useProgram(this.core.program);

  context.bindTexture(context.TEXTURE_2D, sourceTexture);
  context.uniform1i(this.location.uSource, sourceTextureIndex);
  context.bindTexture(context.TEXTURE_2D, normalMapTexture);
  context.uniform1i(this.location.uNormalMap, normalMapTextureIndex);

  if (targetFrameBuffer) {
    context.bindFramebuffer(context.FRAMEBUFFER, targetFrameBuffer);
    context.uniform1i(this.location.uIsFrameBuffer, 1);
  } else {
    context.bindFramebuffer(context.FRAMEBUFFER, null);
    context.uniform1i(this.location.uIsFrameBuffer, 0);
  }
  context.drawArrays(context.TRIANGLES, 0, this.buffer.aPosition.count);
};

export default CopyTextureWithNormalMap;
