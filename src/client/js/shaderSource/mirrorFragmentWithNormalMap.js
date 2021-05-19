// mirrorFragmentWithNormalMap.js

const mirrorFragmentWithNormalMap = `#version 300 es
precision lowp float;

uniform sampler2D uSource;
uniform sampler2D uNormalMap;
in vec2 vTextCoord;
out vec4 outColor;

void main() {
  vec4 textureNormal = texture(uNormalMap, vTextCoord) - vec4(0.5);
  vec2 normal = vec2(textureNormal.x, -textureNormal.y);
  outColor = texture(uSource, vTextCoord + 0.1 * normal);
}
`;

export default mirrorFragmentWithNormalMap;
