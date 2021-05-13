// mirrorFragmentWithNormalMap.js

const mirrorFragmentWithNormalMap = `#version 300 es
precision lowp float;

uniform sampler2D uSource;
uniform sampler2D uNormalMap;
in vec2 vTextCoord;
out vec4 outColor;

void main() {
  outColor = texture(uSource, vTextCoord);
}
`;

export default mirrorFragmentWithNormalMap;
