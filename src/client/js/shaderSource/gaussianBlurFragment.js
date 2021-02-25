// gaussianBlurFragment.js

const gaussianBlurFragment = `#version 300 es
precision highp float;

uniform sampler2D uSource;
uniform vec2 uResolution;
uniform int uKernalRadius;
uniform float uKernelData[65];
uniform int uIsVertical;
in vec2 vTextCoord;

out vec4 outColor;

void main() {
  vec2 delta = 1.0 / uResolution;
  vec4 outputColor = vec4(0.0, 0.0, 0.0, 0.0);

  for (int index = -uKernalRadius; index <= uKernalRadius; index++) {
    vec2 step = vec2(index, 0.0);
    if (1 == uIsVertical) {
      step = vec2(0.0, index);
    }
    vec2 offset = vTextCoord + step * delta;
    outputColor += uKernelData[index + uKernalRadius] * texture(uSource, offset);
  }

  outColor = outputColor;
}
`;

export default gaussianBlurFragment;
