// passColorFragment.js

const passColorFragment = `#version 300 es
precision lowp float;

in vec4 vColor;
out vec4 outColor;

void main() {
  outColor = vColor;
}
`;

export default passColorFragment;
