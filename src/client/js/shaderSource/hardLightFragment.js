// hardLightFragment.js
// https://github.com/YuAo/YUGPUImageHighPassSkinSmoothing/blob/master/Sources/YUGPUImageHighPassSkinSmoothingFilter.m#L19

const hardLightFragment = `#version 300 es
precision lowp float;

uniform int uCycles;
uniform sampler2D uSource;
in vec2 vTextCoord;

out vec4 outColor;

void main() {
  vec4 originColor = texture(uSource, vTextCoord);

  float color = originColor.b;
  for (int i = 0; i < uCycles; ++i) {
    if (color < 0.5) {
      color = color * color * 2.0;
    } else {
      color = 1.0 - (1.0 - color) * (1.0 - color) * 2.0;
    }
  }

  float k = 255.0 / (164.0 - 75.0);
  color = (color - 75.0 / 255.0) * k;

  outColor = vec4(color, color, color, originColor.a);;
}
`;

export default hardLightFragment;
