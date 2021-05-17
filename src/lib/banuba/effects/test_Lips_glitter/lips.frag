#version 300 es

precision mediump float;

layout(std140) uniform glfx_GLOBAL
{
	highp mat4 glfx_MVP;
	highp mat4 glfx_PROJ;
	highp mat4 glfx_MV;
	highp vec4 glfx_QUAT;

	highp vec4 js_face;
	
	highp vec4 js_color;
	highp vec4 params;
	highp vec4 glitter_params;
	highp vec4 nn_params;
	
};

layout(std140) uniform glfx_BASIS_DATA
{
	highp vec4 unused;
	highp vec4 glfx_SCREEN;
	highp vec4 glfx_BG_MASK_T[2];
	highp vec4 glfx_HAIR_MASK_T[2];
	highp vec4 glfx_LIPS_MASK_T[2];
	highp vec4 glfx_L_EYE_MASK_T[2];
	highp vec4 glfx_R_EYE_MASK_T[2];
	highp vec4 glfx_SKIN_MASK_T[2];
	highp vec4 glfx_OCCLUSION_MASK_T[2];
};

in vec4 var_uv;

layout( location = 0 ) out vec4 F;

uniform sampler2D glfx_BACKGROUND;
uniform sampler2D glfx_LIPS_MASK;
uniform sampler2D glfx_LIPS_SHINE_MASK;
uniform sampler2D noise_tex;

const float eps = 0.0000001;

vec3 hsv2rgb( in vec3 c )
{
    vec3 rgb = clamp( abs( mod( c.x * 6.0 + vec3(0.0,4.0,2.0), 6.0 ) - 3.0 ) - 1.0, 0.0, 1.0 );
	return c.z * mix( vec3(1.0), rgb, c.y );
}

vec3 rgb2hsv( in vec3 c )
{
    vec4 k = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix( vec4(c.zy, k.wz), vec4(c.yz, k.xy), (c.z < c.y) ? 1.0 : 0.0 );
    vec4 q = mix( vec4(p.xyw, c.x), vec4(c.x, p.yzx), (p.x < c.x) ? 1.0 : 0.0 );
    float d = q.x - min( q.w, q.y );
    return vec3(abs( q.z + (q.w - q.y) / (6.0 * d + eps) ), d / (q.x+eps), q.x );
}

vec3 lipstik( vec3 bg )
{
	float sCoef = params.x;

	vec3 js_color_hsv = rgb2hsv( js_color.rgb );
	vec3 bg_color_hsv = rgb2hsv( bg );

	float color_hsv_s = js_color_hsv.g * sCoef;
	if ( sCoef > 1. ) {
		color_hsv_s = js_color_hsv.g + (1. - js_color_hsv.g) * (sCoef - 1.);
	}

	vec3 color_lipstick = vec3(
		js_color_hsv.r,
		color_hsv_s,
		bg_color_hsv.b);

	return color_lipstick;
}

void main()
{
	//vec4 noise = texture(noise_tex,gl_FragCoord.xy/64.)*2.-1.;
	float nUVScale = glfx_SCREEN.y/(glitter_params.z*256.);
	vec4 noise = texture(noise_tex,var_uv.zw*nUVScale)*2.-1.;

	vec4 maskColor = texture( glfx_LIPS_MASK, var_uv.zw );
	float maskAlpha = maskColor[int(glfx_LIPS_MASK_T[0].w)];

	vec3 bg = texture( glfx_BACKGROUND, var_uv.xy ).xyz;

	float nCoeff = glitter_params.x*0.0025;
	vec3 bg_noised = texture( glfx_BACKGROUND, var_uv.xy + noise.xy*nCoeff ).xyz;

	// Lipstick

	vec3 color_lipstick = lipstik( bg );
	float nCoeff2 = glitter_params.y*0.02;
	float color_lipstick_b_noised = lipstik( bg_noised ).z + noise.z*nCoeff2;

	float vCoef = params.y;
	float sCoef1 = params.z;
	float bCoef = params.w;
	float a = 20.;
	float b = .75;

	vec3 color_lipstick_b = color_lipstick * vec3(1., 1., bCoef);
	vec3 color = maskAlpha * hsv2rgb( color_lipstick_b ) + (1. - maskAlpha) * bg;

	// Shine
	vec4 shineColor = texture( glfx_LIPS_SHINE_MASK, var_uv.zw );
	float shineAlpha = shineColor[int(glfx_LIPS_MASK_T[0].w)];

	float v_min = nn_params.x;
	float v_max = nn_params.y;

	float x = (color_lipstick_b_noised - v_min) / (v_max - v_min);
	float y = 1. / (1. + exp( -(x - b) * a * (1. + x) ));

	float v1 = color_lipstick_b_noised * (1. - maskAlpha) + color_lipstick_b_noised * maskAlpha * bCoef;
	float v2 = color_lipstick_b_noised + (1. - color_lipstick_b_noised) * vCoef * y;
	float v3 = mix( v1, v2, y );

	vec3 color_shine = vec3(
		color_lipstick.x,
		color_lipstick.y * (1. - sCoef1 * y),
		v3);

	color = mix( color, hsv2rgb( color_shine ), shineAlpha );

	F = vec4(mix(bg,color,js_color.w),1.0);

	// F = vec4(maskColor[int(glfx_LIPS_MASK_T[0].w)]);
	// F = vec4(shineColor[int(glfx_LIPS_MASK_T[0].w)]);
}
