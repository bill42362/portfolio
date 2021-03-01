// maskBlenderFragment.js

const maskBlenderFragment = `#version 300 es
precision highp float;

uniform sampler2D uSource;
uniform sampler2D uMask;
uniform sampler2D uBlendSource;
in vec2 vTextCoord;

out vec4 outColor;

void main() {
  vec4 originColor = texture(uSource, vTextCoord);
  vec4 maskColor = texture(uMask, vTextCoord);
  vec4 blendColor = texture(uBlendSource, vTextCoord);
  outColor = vec4(mix(originColor.rgb, blendColor.rgb, 1.0 - maskColor.b), 1.0);
}
`;

export default maskBlenderFragment;
