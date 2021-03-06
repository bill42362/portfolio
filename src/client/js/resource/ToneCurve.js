// ToneCurve.js
import { createProgram, dockBuffer } from '../resource/WebGL.js';
import { getCurvePoints } from '../resource/CardinalSpline.js';
import mirrorVertexShaderSource from '../shaderSource/mirrorVertex.js';
import toneCurveFragmentShaderSource from '../shaderSource/toneCurveFragment.js';

const defaultRedControlPoints = [
  { x: 0, y: 0 },
  { x: 120, y: 146 }, // default
  { x: 255, y: 255 },
];
const defaultControlPoints = {
  red: defaultRedControlPoints,
  green: defaultRedControlPoints,
  blue: defaultRedControlPoints,
};

const ToneCurve = function ({
  context,
  toneMapTexture,
  toneMapTextureIndex,
  strength = 0.5,
  controlPoints = defaultControlPoints,
  tension = 0.5,
} = {}) {
  if (!context || !toneMapTexture || !toneMapTextureIndex) {
    throw new Error('not enough arguments');
  }
  this.context = context;
  this.toneMapTexture = toneMapTexture;
  this.toneMapTextureIndex = toneMapTextureIndex;

  this.core = createProgram({
    context,
    vertexShaderSource: mirrorVertexShaderSource,
    fragmentShaderSource: toneCurveFragmentShaderSource,
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
  this.location.uStrength = context.getUniformLocation(
    this.core.program,
    'uStrength'
  );
  this.location.uSource = context.getUniformLocation(
    this.core.program,
    'uSource'
  );
  this.location.uTone = context.getUniformLocation(this.core.program, 'uTone');

  context.useProgram(this.core.program);
  context.uniform1i(this.location.uTone, this.toneMapTextureIndex);

  this.updateStrength({ strength });
  this.updateCurvePoints({ controlPoints, tension });
};

ToneCurve.prototype.dockBuffer = function ({ key, buffer }) {
  if (!['aPosition', 'aTextCoord'].includes(key)) {
    throw new Error('invalid buffer name');
  }
  this.buffer[key] = buffer;
  dockBuffer({ context: this.context, location: this.location[key], buffer });
};

ToneCurve.prototype.updateStrength = function ({ strength } = {}) {
  if (isNaN(strength)) {
    throw new Error('invalid strength argument');
  }
  this._strength = Math.max(Math.min(strength, 1), 0) || this._strength;

  const context = this.context;
  context.useProgram(this.core.program);
  context.uniform1f(this.location.uStrength, this._strength);
};

ToneCurve.prototype.updateCurvePoints = function ({
  controlPoints,
  tension,
} = {}) {
  if (
    controlPoints &&
    (!controlPoints.red || !controlPoints.green || !controlPoints.blue)
  ) {
    throw new Error('invalid controlPoints argument');
  }
  if (tension && isNaN(tension)) {
    throw new Error('invalid tension argument');
  }
  if (
    (!controlPoints || controlPoints === this._controlPoints) &&
    (!tension || tension === this._tension)
  ) {
    return;
  }
  this._controlPoints = controlPoints || this._controlPoints;
  this._tension = tension || this._tension;
  this._curvePoints = {
    red: getCurvePoints({
      points: this._controlPoints.red,
      tension: this._tension,
    }),
    green: getCurvePoints({
      points: this._controlPoints.green,
      tension: this._tension,
    }),
    blue: getCurvePoints({
      points: this._controlPoints.blue,
      tension: this._tension,
    }),
  };
  this._curveImageData = new ImageData(
    new Uint8ClampedArray(
      new Array(256)
        .fill(0)
        .flatMap((_, index) => [
          this._curvePoints.red[index].y,
          this._curvePoints.green[index].y,
          this._curvePoints.blue[index].y,
          255,
        ])
    ),
    256
  );
};

ToneCurve.prototype.draw = function ({
  sourceTexture,
  sourceTextureIndex,
  targetFrameBuffer,
}) {
  const context = this.context;
  context.useProgram(this.core.program);

  context.bindTexture(context.TEXTURE_2D, sourceTexture);
  context.uniform1i(this.location.uSource, sourceTextureIndex);

  context.bindTexture(context.TEXTURE_2D, this.toneMapTexture);
  context.texImage2D(
    context.TEXTURE_2D,
    0, // mip level
    context.RGBA, // internam format
    context.RGBA, // src format
    context.UNSIGNED_BYTE, // src type
    this._curveImageData
  );

  if (targetFrameBuffer) {
    context.bindFramebuffer(context.FRAMEBUFFER, targetFrameBuffer);
    context.uniform1i(this.location.uIsFrameBuffer, 1);
  } else {
    context.bindFramebuffer(context.FRAMEBUFFER, null);
    context.uniform1i(this.location.uIsFrameBuffer, 0);
  }
  context.drawArrays(context.TRIANGLES, 0, this.buffer.aPosition.count);
};

export default ToneCurve;
