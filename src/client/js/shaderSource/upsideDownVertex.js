// upsideDownVertex.js

const upsideDownVertex = `#version 300 es
in vec4 aPosition;
in vec2 aTextCoord;
out vec2 vTextCoord;

void main() {
  gl_Position = aPosition;
  vTextCoord = vec2(aTextCoord.x, -aTextCoord.y);
}
`;

export default upsideDownVertex;
