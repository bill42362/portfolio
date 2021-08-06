// blendTextureByAlphaFragment.js

const blendTextureByAlphaFragment = `#version 300 es
precision lowp float;

uniform sampler2D uBaseSource;
uniform sampler2D uAddonSource;
in vec2 vBaseTextCoord;
in vec2 vAddonTextCoord;
in float vAddonAlpha;
out vec4 outColor;

void main() {
  vec4 baseColor = texture(uBaseSource, vBaseTextCoord);
  vec4 addonColor = texture(uAddonSource, vAddonTextCoord);
  outColor = (1.0 - vAddonAlpha) * baseColor + vAddonAlpha * addonColor;
}
`;

export default blendTextureByAlphaFragment;
