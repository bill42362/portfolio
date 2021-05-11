// DrawTexturedTriandleFans.js
import { createProgram, dockBuffer, updateBuffer } from '../resource/WebGL.js';
import passTextureCoordVertexShaderSource from '../shaderSource/passTextureCoordVertex.js';
import passTextureCoordFragmentShaderSource from '../shaderSource/passTextureCoordFragment.js';

const DrawTexturedTriandleFans = function ({
  context,
  inputeImage,
  inputTexture,
  inputTextureIndex,
} = {}) {
  if (!context) {
    throw new Error('need context arg');
  }
  this.context = context;
  this.inputTexture = inputTexture;
  this.inputTextureIndex = inputTextureIndex;

  this.core = createProgram({
    context,
    vertexShaderSource: passTextureCoordVertexShaderSource,
    fragmentShaderSource: passTextureCoordFragmentShaderSource,
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
  this.location.uTexture = context.getUniformLocation(
    this.core.program,
    'uTexture'
  );

  context.useProgram(this.core.program);
  context.uniform1i(this.location.uTexture, this.inputTextureIndex);
  context.bindTexture(context.TEXTURE_2D, this.inputTexture);
  context.texImage2D(
    context.TEXTURE_2D,
    0, // mip level
    context.RGBA, // internam format
    context.RGBA, // src format
    context.UNSIGNED_BYTE, // src type
    inputeImage
  );
};

DrawTexturedTriandleFans.prototype.dockBuffer = function ({ key, buffer }) {
  if (!['aPosition', 'aTextCoord'].includes(key)) {
    throw new Error('invalid buffer name');
  }
  this.buffer[key] = buffer;
  dockBuffer({ context: this.context, location: this.location[key], buffer });
};

DrawTexturedTriandleFans.prototype.updateBuffer = function ({
  key,
  attribute,
}) {
  if (!['aPosition', 'aTextCoord'].includes(key)) {
    throw new Error('invalid buffer name');
  }
  const buffer = this.buffer[key];
  this.buffer[key] = updateBuffer({ context: this.context, buffer, attribute });
};

DrawTexturedTriandleFans.prototype.draw = function ({
  positionAttribute,
  textureCoordAttribute,
  targetFrameBuffer,
}) {
  const context = this.context;
  context.useProgram(this.core.program);

  this.updateBuffer({ key: 'aPosition', attribute: positionAttribute });
  this.updateBuffer({ key: 'aTextCoord', attribute: textureCoordAttribute });
  context.bindTexture(context.TEXTURE_2D, this.inputTexture);
  context.uniform1i(this.location.uTexture, this.inputTextureIndex);

  if (targetFrameBuffer) {
    context.bindFramebuffer(context.FRAMEBUFFER, targetFrameBuffer);
    context.uniform1i(this.location.uIsFrameBuffer, 1);
  } else {
    context.bindFramebuffer(context.FRAMEBUFFER, null);
    context.uniform1i(this.location.uIsFrameBuffer, 0);
  }
  context.drawArrays(context.TRIANGLE_FAN, 0, this.buffer.aPosition.count);
};

export default DrawTexturedTriandleFans;
