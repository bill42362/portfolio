// mirrorFragment.js

const mirrorFragment = `#version 300 es
precision lowp float;

uniform sampler2D uSource;
in vec2 vTextCoord;
out vec4 outColor;

void main() {
  outColor = texture(uSource, vTextCoord);
}
`;

export default mirrorFragment;
