// highPassFilterFragment.js

const highPassFilterFragment = `#version 300 es
precision highp float;

uniform sampler2D uSource;
uniform sampler2D uBlurredSource;
in vec2 vTextCoord;

out vec4 outColor;

void main() {
  vec4 originColor = texture(uSource, vTextCoord);
  vec4 blurredColor = texture(uBlurredSource, vTextCoord);
  outColor = originColor - blurredColor + vec4(0.5, 0.5, 0.5, 1.0);
}
`;

export default highPassFilterFragment;
