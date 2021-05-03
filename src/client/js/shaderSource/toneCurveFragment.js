// toneCurveFragment.js

const toneCurveFragment = `#version 300 es
precision lowp float;

uniform float uStrength;
uniform sampler2D uSource;
uniform sampler2D uTone;
in vec2 vTextCoord;

out vec4 outColor;

void main() {
  vec4 colorIndex = texture(uSource, vTextCoord);
  float revStr = 1.0 - uStrength;
  outColor = vec4(
    uStrength * vec4(texture(uTone, vec2(colorIndex.r, 0))).r + revStr * colorIndex.r,
    uStrength * vec4(texture(uTone, vec2(colorIndex.g, 0))).g + revStr * colorIndex.g,
    uStrength * vec4(texture(uTone, vec2(colorIndex.b, 0))).b + revStr * colorIndex.b,
    1.0
  );
}
`;

export default toneCurveFragment;
