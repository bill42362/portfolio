// HardLight.js
import { createProgram, dockBuffer } from '../resource/WebGL.js';
import mirrorVertexShaderSource from '../shaderSource/mirrorVertex.js';
import hardLightFragmentShaderSource from '../shaderSource/hardLightFragment.js';

const HardLight = function ({ context, cycles = 3 } = {}) {
  if (!context) {
    throw new Error('need context arg');
  }
  this.context = context;

  this.core = createProgram({
    context,
    vertexShaderSource: mirrorVertexShaderSource,
    fragmentShaderSource: hardLightFragmentShaderSource,
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
  this.location.uCycles = context.getUniformLocation(
    this.core.program,
    'uCycles'
  );
  this.location.uSource = context.getUniformLocation(
    this.core.program,
    'uSource'
  );

  this.updateCycles({ cycles });
};

HardLight.prototype.dockBuffer = function ({ key, buffer }) {
  if (!['aPosition', 'aTextCoord'].includes(key)) {
    throw new Error('invalid buffer name');
  }
  this.buffer[key] = buffer;
  dockBuffer({ context: this.context, location: this.location[key], buffer });
};

HardLight.prototype.updateCycles = function ({ cycles } = {}) {
  if (!cycles || isNaN(cycles)) {
    throw new Error('invalid cycles argument');
  }
  this._cycles = Math.max(Math.floor(cycles), 0) || this._cycles;

  const context = this.context;
  context.useProgram(this.core.program);
  context.uniform1i(this.location.uCycles, this._cycles);
};

HardLight.prototype.draw = function ({
  sourceTexture,
  sourceTextureIndex,
  targetFrameBuffer,
}) {
  const context = this.context;
  context.useProgram(this.core.program);

  context.bindTexture(context.TEXTURE_2D, sourceTexture);
  context.uniform1i(this.location.uSource, sourceTextureIndex);

  if (targetFrameBuffer) {
    context.bindFramebuffer(context.FRAMEBUFFER, targetFrameBuffer);
    context.uniform1i(this.location.uIsFrameBuffer, 1);
  } else {
    context.bindFramebuffer(context.FRAMEBUFFER, null);
    context.uniform1i(this.location.uIsFrameBuffer, 0);
  }
  context.drawArrays(context.TRIANGLES, 0, this.buffer.aPosition.count);
};

export default HardLight;
