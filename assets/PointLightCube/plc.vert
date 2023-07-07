attribute vec4 a_Position;
attribute vec4 a_Color;
attribute vec4 a_Normal;

uniform vec3 u_LightPosition;
uniform vec3 u_AmbientLight;
uniform mat4 u_MvpMat;
uniform mat4 u_ModelMat;

varying mat4 u_NormalMat;
varying vec3 u_LightColor;
// uniform vec3 u_LightDirect;

varying vec4 v_Color;

void main() {
    gl_Position = u_MvpMat * u_ModelMat * a_Position;
    vec3 normal = normalize((u_NormalMat * a_Normal).xyz);
    vec3 lightDirect = normalize(u_LightPosition - (u_ModelMat * a_Position).xyz);
    float nDotL = max(dot(normal, lightDirect), 0.0);
    vec3 diffuse = u_LightColor * vec3(a_Color) * nDotL;
    vec3 ambient = u_AmbientLight * a_Color.rgb;
    v_Color = vec4(diffuse + ambient, a_Color.a);
}