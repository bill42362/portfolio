// passTextureCoordVertex.js

const passTextureCoordVertex = `#version 300 es
in vec4 aPosition;
in vec2 aTextCoord;
uniform int uIsFrameBuffer;
out vec2 vTextCoord;

void main() {
  vec4 position = aPosition;
  if (1 == uIsFrameBuffer) {
    // frame buffer axis is opposite with canvas.
    position.y = -aPosition.y;
  }
  gl_Position = position;
  gl_PointSize = 4.0;
  vTextCoord = aTextCoord;
}
`;

export default passTextureCoordVertex;
