precision mediump float;

uniform sampler2D u_Sampler0;
varying vec2 v_TexCoord;

void main() {
    gl_FragColor = texture2D(u_Sampler0, v_TexCoord);

    // if (gl_FragColor.a < 1.0) {
    //     discard;
    // }
}