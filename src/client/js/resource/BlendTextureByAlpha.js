// BlendTextureByAlpha.js
import { createProgram, dockBuffer, updateBuffer } from '../resource/WebGL.js';
import blendTextureByAlphaVertexShaderSource from '../shaderSource/blendTextureByAlphaVertex.js';
import blendTextureByAlphaFragmentShaderSource from '../shaderSource/blendTextureByAlphaFragment.js';

const attributeLocationKeys = [
  'aPosition',
  'aBaseTextCoord',
  'aAddonTextCoord',
  'aAddonColor',
];

const BlendTextureByAlpha = function ({ context } = {}) {
  if (!context) {
    throw new Error('need context arg');
  }
  this.context = context;

  this.core = createProgram({
    context,
    vertexShaderSource: blendTextureByAlphaVertexShaderSource,
    fragmentShaderSource: blendTextureByAlphaFragmentShaderSource,
  });
  context.useProgram(this.core.program);

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
  this.location.uBaseSource = context.getUniformLocation(
    this.core.program,
    'uBaseSource'
  );
  this.location.uAddonSource = context.getUniformLocation(
    this.core.program,
    'uAddonSource'
  );
};

BlendTextureByAlpha.prototype.dockBuffer = function ({ key, buffer }) {
  if (!attributeLocationKeys.includes(key)) {
    throw new Error('invalid buffer name');
  }
  this.buffer[key] = buffer;
  dockBuffer({ context: this.context, location: this.location[key], buffer });
};

BlendTextureByAlpha.prototype.updateBuffer = function ({ key, attribute }) {
  if (!attributeLocationKeys.includes(key)) {
    throw new Error('invalid buffer name');
  }
  const buffer = this.buffer[key];
  this.buffer[key] = updateBuffer({ context: this.context, buffer, attribute });
};

BlendTextureByAlpha.prototype.draw = function ({
  baseSourceTexture,
  baseSourceTextureIndex,
  addonSourceTexture,
  addonSourceTextureIndex,
  positionAttribute,
  baseTextureCoordAttribute,
  addonTextureCoordAttribute,
  addonColorAttribute,
  elementsBuffer,
  targetFrameBuffer,
}) {
  const context = this.context;
  context.useProgram(this.core.program);

  positionAttribute &&
    this.updateBuffer({ key: 'aPosition', attribute: positionAttribute });
  baseTextureCoordAttribute &&
    this.updateBuffer({
      key: 'aBaseTextCoord',
      attribute: baseTextureCoordAttribute,
    });
  addonTextureCoordAttribute &&
    this.updateBuffer({
      key: 'aAddonTextCoord',
      attribute: addonTextureCoordAttribute,
    });
  addonColorAttribute &&
    this.updateBuffer({ key: 'aAddonColor', attribute: addonColorAttribute });
  context.bindTexture(context.TEXTURE_2D, baseSourceTexture);
  context.uniform1i(this.location.uBaseSource, baseSourceTextureIndex);
  context.bindTexture(context.TEXTURE_2D, addonSourceTexture);
  context.uniform1i(this.location.uAddonSource, addonSourceTextureIndex);

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

export default BlendTextureByAlpha;
