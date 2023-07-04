attribute vec4 a_Pos;
attribute vec4 a_Color;
uniform mat4 u_MvpMat;
varying vec4 v_Color;

void main() {
    gl_Position = u_MvpMat * a_Pos;
    v_Color = a_Color;
}