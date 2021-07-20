// enlargeEyesFragment.js

const enlargeEyesFragment = `#version 300 es
precision lowp float;

uniform sampler2D uSource;
uniform float uEyesInfo[4]; // [leftCenter.x, leftCenter.y, rightCenter.x, rightCenter.y]
uniform float uEnlargeConfig[2]; // [radius, ratio]
in vec2 vTextCoord;
out vec4 outColor;

vec2 getOffset(vec2 origin, vec2 target, float radius, float ratio) {
  float weight = distance(target, origin) / radius;
  weight = clamp(weight, 0.0, 1.0);
  weight = (1.0 - weight * weight) * (1.0 - ratio);

  return (target - origin) * weight;
}

void main() {
  vec2 leftEyeCenter = vec2(uEyesInfo[0], uEyesInfo[1]);
  vec2 rightEyeCenter = vec2(uEyesInfo[2], uEyesInfo[3]);

  vec2 leftOffset = getOffset(leftEyeCenter, vTextCoord, uEnlargeConfig[0], uEnlargeConfig[1]);
  vec2 rightOffset = getOffset(rightEyeCenter, vTextCoord, uEnlargeConfig[0], uEnlargeConfig[1]);

  outColor = texture(uSource, vTextCoord + leftOffset + rightOffset);
}
`;

export default enlargeEyesFragment;
