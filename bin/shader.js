class shader {
}
shader.v_shader = `
    uniform vec4 u_Position;\n
    void main(){\n
        gl_Position = u_Position;\n
        gl_PointSize = 10.0;\n
    }
    `;
shader.f_shader = `
    precision mediump float;\n
    uniform vec4 u_FragColor;\n
    void main(){\n
        gl_FragColor = u_FragColor;\n
    }
    `;
