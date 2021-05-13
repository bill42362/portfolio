// mirrorFragmentWithNormalMap.js

const mirrorFragmentWithNormalMap = `#version 300 es
precision lowp float;

uniform sampler2D uSource;
uniform sampler2D uNormalMap;
in vec2 vTextCoord;
out vec4 outColor;

void main() {
  vec4 normal = texture(uNormalMap, vTextCoord) - vec4(0.5);
  outColor = texture(uSource, vTextCoord - normal.xy);
}
`;

export default mirrorFragmentWithNormalMap;
