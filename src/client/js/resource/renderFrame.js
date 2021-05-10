// renderFrame.js
import { createBuffer, createTexture } from '../resource/WebGL.js';
import CopyTexture from '../resource/CopyTexture.js';
import DrawDots from '../resource/DrawDots.js';
import { annotationShape, shrinkFactor } from '../resource/humanVariables.js';

const textureNames = ['source'];
const textureIndex = textureNames.reduce(
  (current, textureName, index) => ({ ...current, [textureName]: index }),
  {}
);

const clearColor = [34, 47, 62, 1.0];
const positionAttribute = {
  array: [-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1],
  numComponents: 2,
};
const textCoordAttribute = {
  array: [0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0],
  numComponents: 2,
};
const dotsPositionAttribute = {
  array: [],
  numComponents: 3,
};
const dotsColorAttribute = {
  array: [],
  numComponents: 3,
};
const dotsColor = [84 / 255, 160 / 255, 255 / 255];
const dotsColorHighlight = [238 / 255, 82 / 255, 83 / 255];

const Renderer = function ({ sizes }) {
  const canvas = new OffscreenCanvas(sizes.width, sizes.height);
  this.canvas = canvas;

  const context = canvas.getContext('webgl2');
  this.context = context;
  if (!context) {
    throw new Error('Browser not support WebGL2.0');
  }

  this.slice = textureNames.reduce(
    (current, textureName) => ({ ...current, [textureName]: {} }),
    {}
  );

  this.buffer = {};
  this.buffer.aPosition = createBuffer({
    context,
    attribute: positionAttribute,
  });
  this.buffer.aTextCoord = createBuffer({
    context,
    attribute: textCoordAttribute,
  });
  this.buffer.aDotsPosition = createBuffer({
    context,
    attribute: dotsPositionAttribute,
  });
  this.buffer.aDotsColor = createBuffer({
    context,
    attribute: dotsColorAttribute,
  });

  this.texture = {};
  textureNames.forEach(name => {
    this.texture[name] = createTexture({ context, index: textureIndex[name] });
  });

  this.copyTexture = new CopyTexture({ context: this.context });
  this.copyTexture.dockBuffer({
    key: 'aPosition',
    buffer: this.buffer.aPosition,
  });
  this.copyTexture.dockBuffer({
    key: 'aTextCoord',
    buffer: this.buffer.aTextCoord,
  });

  this.drawDots = new DrawDots({ context: this.context });
  this.drawDots.dockBuffer({
    key: 'aPosition',
    buffer: this.buffer.aDotsPosition,
  });
  this.drawDots.dockBuffer({
    key: 'aColor',
    buffer: this.buffer.aDotsColor,
  });
};

Renderer.prototype.draw = async function ({ pixelSource, dots }) {
  if (!pixelSource || !this.context) {
    return;
  }

  const context = this.context;
  context.clearColor(...clearColor);
  context.clear(context.COLOR_BUFFER_BIT);

  context.bindTexture(context.TEXTURE_2D, this.texture.source);
  context.texImage2D(
    context.TEXTURE_2D,
    0, // mip level
    context.RGBA, // internam format
    context.RGBA, // src format
    context.UNSIGNED_BYTE, // src type
    pixelSource
  );

  this.copyTexture.dockBuffer({
    key: 'aPosition',
    buffer: this.buffer.aPosition,
  });
  this.copyTexture.dockBuffer({
    key: 'aTextCoord',
    buffer: this.buffer.aTextCoord,
  });
  this.copyTexture.draw({
    sourceTexture: this.texture.source,
    sourceTextureIndex: textureIndex.source,
  });

  if (dots) {
    this.drawDots.dockBuffer({
      key: 'aPosition',
      buffer: this.buffer.aDotsPosition,
    });
    this.drawDots.dockBuffer({
      key: 'aColor',
      buffer: this.buffer.aDotsColor,
    });
    this.drawDots.draw({
      positionAttribute: dots.positionAttribute,
      colorAttribute: dots.colorAttribute,
    });
  }

  return createImageBitmap(this.canvas);
};

let renderer = null;
export const initRenderer = ({ sizes }) => {
  renderer = new Renderer({ sizes });
};

let isRendererBusy = false;
let outputBitmap = null;
const landmarkKeys = Object.keys(annotationShape);
const renderFrame = async ({
  imageBitmap,
  humanDetectedResult,
  landmarkToggles,
}) => {
  if (isRendererBusy || !imageBitmap || !humanDetectedResult) {
    return outputBitmap;
  }
  isRendererBusy = true;

  if (!renderer) {
    outputBitmap?.close();
    outputBitmap = imageBitmap;
    isRendererBusy = false;
    return outputBitmap;
  }

  let dots = null;
  const annotations = humanDetectedResult.face?.[0]?.annotations;
  if (annotations) {
    const positions = [];
    const colors = [];
    landmarkKeys.forEach(landmarkKey => {
      const landmarks = annotations[landmarkKey];
      positions.push(
        ...landmarks.map(([x, y]) => {
          return [
            (2 * shrinkFactor * x) / imageBitmap.width - 1,
            (-2 * shrinkFactor * y) / imageBitmap.height + 1,
            0,
          ];
        })
      );
      colors.push(
        ...landmarks.map((_, index) => {
          const color = landmarkToggles[landmarkKey]
            ? dotsColorHighlight
            : dotsColor;
          return [(index + 1) / landmarks.length, color[1], color[2]];
        })
      );
    });
    dots = {};
    dots.positionAttribute = {
      array: positions.flatMap(a => a),
      numComponents: 3,
    };
    dots.colorAttribute = {
      array: colors.flatMap(a => a),
      numComponents: 3,
    };
  }
  const newBitmap = await renderer.draw({ pixelSource: imageBitmap, dots });
  outputBitmap?.close();
  outputBitmap = newBitmap;
  isRendererBusy = false;
  return outputBitmap;
};

export default renderFrame;
