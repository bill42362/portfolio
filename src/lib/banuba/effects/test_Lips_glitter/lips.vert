#version 300 es

layout( location = 3 ) in vec2 attrib_uv;

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

out vec4 var_uv;

void main()
{
	mat3 lips_m = inverse( mat3( 
		glfx_LIPS_MASK_T[0].xyz, 
		glfx_LIPS_MASK_T[1].xyz, 
		vec3(0.,0.,1.) ) );

	gl_Position = vec4( (vec3(attrib_uv,1.)*lips_m).xy, 0., 1. );
	var_uv.xy = gl_Position.xy *0.5 + 0.5;
	var_uv.zw = attrib_uv;

	if(js_face.x == 0.) gl_Position = vec4(2.,2.,2.,1.);
}