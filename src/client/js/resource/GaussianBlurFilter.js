// GaussianBlurFilter.js
import { createProgram, dockBuffer } from '../resource/WebGL.js';
import mirrorVertexShaderSource from '../shaderSource/mirrorVertex.js';
import gaussianBlurFragmentShaderSource from '../shaderSource/gaussianBlurFragment.js';

const getKernal = (inputRadius, sigma) => {
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

const GaussianBlurFilter = function ({ context, radius = 16, sigma = 5 } = {}) {
  if (!context) {
    throw new Error('need context arg');
  }
  this.context = context;

  this.core = createProgram({
    context,
    vertexShaderSource: mirrorVertexShaderSource,
    fragmentShaderSource: gaussianBlurFragmentShaderSource,
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
  this.location.uResolution = context.getUniformLocation(
    this.core.program,
    'uResolution'
  );
  this.location.uKernalRadius = context.getUniformLocation(
    this.core.program,
    'uKernalRadius'
  );
  this.location.uKernelData = context.getUniformLocation(
    this.core.program,
    'uKernelData'
  );
  this.location.uIsVertical = context.getUniformLocation(
    this.core.program,
    'uIsVertical'
  );

  this.updateKernal({ radius, sigma });
};

GaussianBlurFilter.prototype.dockBuffer = function ({ key, buffer }) {
  if (!['aPosition', 'aTextCoord'].includes(key)) {
    throw new Error('invalid buffer name');
  }
  this.buffer[key] = buffer;
  dockBuffer({ context: this.context, location: this.location[key], buffer });
};

GaussianBlurFilter.prototype.updateKernal = function ({ radius, sigma } = {}) {
  if (radius && 32 < radius) {
    throw new Error('radius must <= 32');
  }
  this._radius = radius || this._radius;
  this._sigma = sigma || this._sigma;
  this._kernal = getKernal(this._radius, this._sigma);

  const context = this.context;
  context.useProgram(this.core.program);
  context.uniform1i(this.location.uKernalRadius, this._kernal.radius);
  context.uniform1fv(this.location.uKernelData, this._kernal.data);
};

GaussianBlurFilter.prototype.draw = function ({
  sourceTexture,
  sourceTextureIndex,
  midFrameBuffer,
  midTexture,
  midTextureIndex,
  targetFrameBuffer,
}) {
  const context = this.context;
  context.useProgram(this.core.program);
  context.uniform2f(
    this.location.uResolution,
    context.canvas.width,
    context.canvas.height
  );

  context.bindTexture(context.TEXTURE_2D, sourceTexture);
  context.uniform1i(this.location.uSource, sourceTextureIndex);

  context.bindFramebuffer(context.FRAMEBUFFER, midFrameBuffer);
  context.uniform1i(this.location.uIsFrameBuffer, 1);
  context.uniform1i(this.location.uIsVertical, 1);
  context.drawArrays(context.TRIANGLES, 0, this.buffer.aPosition.count);

  context.bindTexture(context.TEXTURE_2D, midTexture);
  context.uniform1i(this.location.uSource, midTextureIndex);

  if (targetFrameBuffer) {
    context.bindFramebuffer(context.FRAMEBUFFER, targetFrameBuffer);
  } else {
    context.bindFramebuffer(context.FRAMEBUFFER, null);
    context.uniform1i(this.location.uIsFrameBuffer, 0);
  }
  context.uniform1i(this.location.uIsVertical, 0);
  context.drawArrays(context.TRIANGLES, 0, this.buffer.aPosition.count);
};

export default GaussianBlurFilter;
