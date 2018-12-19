class shader {
    static v_shader: string = `
    attribute vec4 a_Position;\n
    void main(){\n
        gl_Position = a_Position;\n
        gl_PointSize = 10.0;\n
    }
    `;
    static f_shader: string = `
    precision mediump float;\n
    uniform vec4 u_FragColor;\n
    void main(){\n
        gl_FragColor = u_FragColor;\n
    }
    `;
}