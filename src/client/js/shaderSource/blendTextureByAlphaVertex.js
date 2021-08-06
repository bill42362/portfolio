// blendTextureByAlphaVertex.js

const blendTextureByAlphaVertex = `#version 300 es
in vec4 aPosition;
in vec2 aBaseTextCoord;
in vec2 aAddonTextCoord;
in vec4 aAddonColor;
uniform int uIsFrameBuffer;
out vec2 vBaseTextCoord;
out vec2 vAddonTextCoord;
out float vAddonAlpha;

void main() {
  vec4 position = aPosition;
  if (1 == uIsFrameBuffer) {
    // frame buffer axis is opposite with canvas.
    position.y = -aPosition.y;
  }
  gl_Position = position;
  vBaseTextCoord = aBaseTextCoord;
  vAddonTextCoord = aAddonTextCoord;
  vAddonAlpha = aAddonColor.a;
  vAddonAlpha = 0.5;
}
`;

export default blendTextureByAlphaVertex;
