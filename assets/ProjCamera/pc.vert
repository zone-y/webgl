attribute vec4 a_position;
attribute vec4 a_color;
varying vec4 v_color;

uniform mat4 u_viewMat;
uniform mat4 u_projMat;

void main() {
    gl_Position = u_projMat * u_viewMat * a_position;
    v_color = a_color;
}