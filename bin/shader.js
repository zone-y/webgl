class shader {
}
shader.v_shader = `
    attribute vec4 a_Position;\n
    void main(){\n
        gl_Position = a_Position;\n
        gl_PointSize = 10.0;\n
    }
    `;
shader.f_shader = `
    void main(){\n
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n
    }
    `;
