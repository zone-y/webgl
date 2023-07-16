precision mediump float;

uniform vec3 u_LightPosition;
uniform vec3 u_AmbientLight;
uniform vec3 u_LightColor;

varying vec4 v_Position;
varying vec3 v_Normal;

varying vec4 v_Color;

void main() {
    vec3 normal = normalize(vec3(v_Normal));
    vec3 lightDirect = normalize(u_LightPosition - vec3(v_Position));
    float nDotL = max(dot(lightDirect, normal), 0.0);
    vec3 diffuse = u_LightColor * vec3(v_Color) * nDotL;
    vec3 ambient = u_AmbientLight * vec3(v_Color);
    gl_FragColor = vec4(diffuse + ambient, v_Color.a);
}