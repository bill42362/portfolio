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
