// WebGL.js
const createShader = (context, type, source) => {
  const shader = context.createShader(type);
  context.shaderSource(shader, source);
  context.compileShader(shader);
  return shader;
};

export const createProgram = ({
  context,
  vertexShaderSource,
  fragmentShaderSource,
}) => {
  if (!context || !vertexShaderSource || !fragmentShaderSource) {
    return;
  }
  const vertexShader = createShader(
    context,
    context.VERTEX_SHADER,
    vertexShaderSource
  );
  const fragmentShader = createShader(
    context,
    context.FRAGMENT_SHADER,
    fragmentShaderSource
  );
  const program = context.createProgram();
  context.attachShader(program, vertexShader);
  context.attachShader(program, fragmentShader);
  context.linkProgram(program);
  const success = context.getProgramParameter(program, context.LINK_STATUS);
  if (success) {
    return { vertexShader, fragmentShader, program };
  }
  // eslint-disable-next-line no-console
  console.error('Link failed:', context.getProgramInfoLog(program));
  // eslint-disable-next-line no-console
  console.error('vs info-log:', context.getShaderInfoLog(vertexShader));
  // eslint-disable-next-line no-console
  console.error('fs info-log:', context.getShaderInfoLog(fragmentShader));
  context.deleteShader(vertexShader);
  context.deleteShader(fragmentShader);
  context.deleteProgram(program);
  return;
};

export const clearGlCore = ({
  context,
  vertexShader,
  fragmentShader,
  program,
} = {}) => {
  if (!context) {
    return;
  }
  vertexShader && context.deleteShader(vertexShader);
  fragmentShader && context.deleteShader(fragmentShader);
  program && context.deleteProgram(program);
};

export const createBuffer = ({ context, attribute }) => {
  const buffer = context.createBuffer();
  context.bindBuffer(context.ARRAY_BUFFER, buffer);
  context.bufferData(
    context.ARRAY_BUFFER,
    new Float32Array(attribute.array),
    context.STATIC_DRAW
  );
  return {
    buffer,
    numComponents: attribute.numComponents,
    count: Math.floor(attribute.array.length / attribute.numComponents),
    type: context.FLOAT,
    normalize: false,
    offset: 0,
    // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    stride: 0,
  };
};

export const createTexture = ({ context, index = 0 }) => {
  const ctx = context;
  const texture = ctx.createTexture();
  ctx.activeTexture(ctx.TEXTURE0 + index);
  ctx.bindTexture(ctx.TEXTURE_2D, texture);
  ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
  ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
  ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
  ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);
  return texture;
};

export const dockBuffer = ({ context, location, buffer }) => {
  context.bindBuffer(context.ARRAY_BUFFER, buffer.buffer);
  context.vertexAttribPointer(
    location,
    buffer.numComponents,
    buffer.type,
    buffer.normalize,
    buffer.stride,
    buffer.offset
  );
};
