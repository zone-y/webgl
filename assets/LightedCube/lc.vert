attribute vec4 a_Position;
attribute vec4 a_Color;
attribute vec4 a_Normal;

uniform vec3 u_AmbientLight;
uniform mat4 u_MvpMat;
uniform mat4 u_NormalMat;
uniform vec3 u_LightColor;
uniform vec3 u_LightDirect;

varying vec4 v_Color;

void main() {
    gl_Position = u_MvpMat * a_Position;
    vec3 normal = normalize((u_NormalMat * a_Normal).xyz);
    float nDotL = max(dot(normal, u_LightDirect), 0.0);
    vec3 diffuse = u_LightColor * vec3(a_Color) * nDotL;
    vec3 ambient = u_AmbientLight * a_Color.rgb;
    v_Color = vec4(diffuse + ambient, a_Color.a);
}