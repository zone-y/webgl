precision mediump float;

uniform sampler2D u_Sampler0;
// uniform sampler2D u_Sampler1;
varying vec2 v_TexCoord;
// varying float v_Index;

void main() {
    // if (v_Index > 0.5) {
    //     gl_FragColor = texture2D(u_Sampler1, v_TexCoord);
    // } else {
    // }
    gl_FragColor = texture2D(u_Sampler0, v_TexCoord);

    if (gl_FragColor.a < 1.0) {
        discard;
    }
}