// passColorVertex.js

const passColorVertex = `#version 300 es
in vec4 aPosition;
in vec4 aColor;
uniform int uIsFrameBuffer;
out vec4 vColor;

void main() {
  vec4 position = aPosition;
  if (1 == uIsFrameBuffer) {
    // frame buffer axis is opposite with canvas.
    position.y = -aPosition.y;
  }
  gl_Position = position;
  gl_PointSize = 4.0;
  vColor = aColor;
}
`;

export default passColorVertex;
