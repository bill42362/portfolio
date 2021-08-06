// CopyTexture.js
import { createProgram, dockBuffer, updateBuffer } from '../resource/WebGL.js';
import mirrorVertexShaderSource from '../shaderSource/mirrorVertex.js';
import mirrorFragmentShaderSource from '../shaderSource/mirrorFragment.js';

const attributeLocationKeys = ['aPosition', 'aTextCoord'];

const CopyTexture = function ({ context } = {}) {
  if (!context) {
    throw new Error('need context arg');
  }
  this.context = context;

  this.core = createProgram({
    context,
    vertexShaderSource: mirrorVertexShaderSource,
    fragmentShaderSource: mirrorFragmentShaderSource,
  });
  this.buffer = {};

  this.location = {};
  attributeLocationKeys.forEach(key => {
    this.location[key] = context.getAttribLocation(this.core.program, key);
    context.enableVertexAttribArray(this.location[key]);
  });

  this.location.uIsFrameBuffer = context.getUniformLocation(
    this.core.program,
    'uIsFrameBuffer'
  );
  this.location.uSource = context.getUniformLocation(
    this.core.program,
    'uSource'
  );
};

CopyTexture.prototype.dockBuffer = function ({ key, buffer }) {
  if (!['aPosition', 'aTextCoord'].includes(key)) {
    throw new Error('invalid buffer name');
  }
  this.buffer[key] = buffer;
  dockBuffer({ context: this.context, location: this.location[key], buffer });
};

CopyTexture.prototype.updateBuffer = function ({ key, attribute }) {
  if (!['aPosition', 'aTextCoord'].includes(key)) {
    throw new Error('invalid buffer name');
  }
  const buffer = this.buffer[key];
  this.buffer[key] = updateBuffer({ context: this.context, buffer, attribute });
};

CopyTexture.prototype.draw = function ({
  sourceTexture,
  sourceTextureIndex,
  positionAttribute,
  textureCoordAttribute,
  elementsBuffer,
  targetFrameBuffer,
}) {
  const context = this.context;
  context.useProgram(this.core.program);

  positionAttribute &&
    this.updateBuffer({ key: 'aPosition', attribute: positionAttribute });
  textureCoordAttribute &&
    this.updateBuffer({ key: 'aTextCoord', attribute: textureCoordAttribute });
  context.bindTexture(context.TEXTURE_2D, sourceTexture);
  context.uniform1i(this.location.uSource, sourceTextureIndex);

  if (targetFrameBuffer) {
    context.bindFramebuffer(context.FRAMEBUFFER, targetFrameBuffer);
    context.uniform1i(this.location.uIsFrameBuffer, 1);
  } else {
    context.bindFramebuffer(context.FRAMEBUFFER, null);
    context.uniform1i(this.location.uIsFrameBuffer, 0);
  }

  if (elementsBuffer) {
    context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, elementsBuffer.buffer);
    context.drawElements(
      context.TRIANGLES,
      elementsBuffer.count,
      elementsBuffer.type,
      elementsBuffer.offset
    );
  } else {
    context.drawArrays(context.TRIANGLES, 0, this.buffer.aPosition.count);
  }
};

export default CopyTexture;
