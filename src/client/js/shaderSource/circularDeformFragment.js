// circularDeformFragment.js

const circularDeformFragment = `#version 300 es
precision lowp float;

#define MAX_CIRCLE_COUNT 40

uniform sampler2D uSource;

uniform int uCircleCount;
uniform vec3 uCircle[MAX_CIRCLE_COUNT]; // { origin.x, origin.y, radius }
uniform vec3 uDeform[MAX_CIRCLE_COUNT]; // { target.x, target.y, ratio }

in vec2 vTextCoord;
out vec4 outColor;

vec2 getOffset(vec2 origin, vec2 target, vec2 current, float radius, float ratio) {
  float weight = distance(current, origin) / (radius * clamp(ratio, 1.0, 3.0));
  weight = clamp(weight, 0.0, 1.0);
  weight = (1.0 - weight) * (1.0 - ratio);

  return (current - target) * weight;
}

void main() {
  vec2 offset = vec2(0.0);

  for(int iCount = 0; iCount < uCircleCount; ++iCount) {
    offset += getOffset(
      uCircle[iCount].xy,
      uDeform[iCount].xy,
      vTextCoord,
      uCircle[iCount].z,
      uDeform[iCount].z
    );
  }

  outColor = texture(uSource, vTextCoord + offset);
}
`;

export default circularDeformFragment;
