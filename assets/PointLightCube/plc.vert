attribute vec4 a_Position;
attribute vec4 a_Color;
attribute vec4 a_Normal;

uniform mat4 u_MvpMat;
uniform mat4 u_ModelMat;
uniform mat4 u_NormalMat;

varying vec4 v_Position;
varying vec3 v_Normal;
varying vec4 v_Color;

void main() {
    gl_Position = u_MvpMat * u_ModelMat * a_Position;
    v_Normal = normalize(vec3(u_NormalMat * a_Normal));
    v_Position = u_ModelMat * a_Position;
    // float nDotL = max(dot(normal, lightDirect), 0.0);
    // vec3 diffuse = u_LightColor * vec3(a_Color) * nDotL;
    // vec3 ambient = u_AmbientLight * a_Color.rgb;
    v_Color = a_Color;
}