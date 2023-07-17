precision mediump float;

uniform sampler2D u_Sampler;

varying vec2 v_TexCoord;

void main() {
    vec4 color = texture2D(u_Sampler, v_TexCoord);
    // if (color.a < 0.5) {
    //     discard;
    // } 
    // else {

        color.a = min(color.a, 0.6);
    // }
    gl_FragColor = color;
}