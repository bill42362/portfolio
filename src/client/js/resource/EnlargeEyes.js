// EnlargeEyes.js
import { createProgram, dockBuffer, updateBuffer } from '../resource/WebGL.js';
import mirrorVertexShaderSource from '../shaderSource/mirrorVertex.js';
import enlargeEyesFragmentShaderSource from '../shaderSource/enlargeEyesFragment.js';

const EnlargeEyes = function ({ context } = {}) {
  if (!context) {
    throw new Error('need context arg');
  }
  this.context = context;

  this.core = createProgram({
    context,
    vertexShaderSource: mirrorVertexShaderSource,
    fragmentShaderSource: enlargeEyesFragmentShaderSource,
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
  this.location.uEyesInfo = context.getUniformLocation(
    this.core.program,
    'uEyesInfo'
  );
  this.location.uEnlargeConfig = context.getUniformLocation(
    this.core.program,
    'uEnlargeConfig'
  );
};

EnlargeEyes.prototype.dockBuffer = function ({ key, buffer }) {
  if (!['aPosition', 'aTextCoord'].includes(key)) {
    throw new Error('invalid buffer name');
  }
  this.buffer[key] = buffer;
  dockBuffer({ context: this.context, location: this.location[key], buffer });
};

EnlargeEyes.prototype.updateBuffer = function ({ key, attribute }) {
  if (!['aPosition', 'aTextCoord'].includes(key)) {
    throw new Error('invalid buffer name');
  }
  const buffer = this.buffer[key];
  this.buffer[key] = updateBuffer({ context: this.context, buffer, attribute });
};

EnlargeEyes.prototype.draw = function ({
  sourceTexture,
  sourceTextureIndex,
  positionAttribute,
  textureCoordAttribute,
  eyesInfo = [0, 0, 0, 0], // [leftCenter.x, leftCenter.y, rightCenter.x, rightCenter.y]
  enlargeConfig = [0.0, 1.0], // [radius, ratio]
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

  context.uniform1fv(this.location.uEyesInfo, eyesInfo);
  context.uniform1fv(this.location.uEnlargeConfig, enlargeConfig);

  if (targetFrameBuffer) {
    context.bindFramebuffer(context.FRAMEBUFFER, targetFrameBuffer);
    context.uniform1i(this.location.uIsFrameBuffer, 1);
  } else {
    context.bindFramebuffer(context.FRAMEBUFFER, null);
    context.uniform1i(this.location.uIsFrameBuffer, 0);
  }
  context.drawArrays(context.TRIANGLES, 0, this.buffer.aPosition.count);
};

export default EnlargeEyes;
