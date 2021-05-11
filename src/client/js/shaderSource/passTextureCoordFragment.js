// passTextureCoordFragment.js

const passTextureCoordFragment = `#version 300 es
precision lowp float;

in vec2 vTextCoord;
uniform sampler2D uTexture;
out vec4 outColor;

void main() {
  outColor = texture(uTexture, vTextCoord);
}
`;

export default passTextureCoordFragment;
