// enlargeEyesFragment.js

const enlargeEyesFragment = `#version 300 es
precision lowp float;

uniform sampler2D uSource;
uniform float uEyesInfo[4]; // [leftCenter.x, leftCenter.y, rightCenter.x, rightCenter.y]
uniform float uEnlargeConfig[2]; // [radius, ratio]
in vec2 vTextCoord;
out vec4 outColor;

void main() {
  outColor = texture(uSource, vTextCoord);
}
`;

export default enlargeEyesFragment;
