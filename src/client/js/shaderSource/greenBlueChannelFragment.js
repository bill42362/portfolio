// greenBlueChannelFragment.js

const greenBlueChannelFragment = `#version 300 es
precision highp float;

uniform sampler2D uSource;
in vec2 vTextCoord;

out vec4 outColor;

void main() {
  vec4 originColor = texture(uSource, vTextCoord);
  float gbColor = 2.0 * originColor.b * originColor.g;
  outColor = vec4(gbColor, gbColor, gbColor, originColor.a);
}
`;

export default greenBlueChannelFragment;
