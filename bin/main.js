class Main {
    run() {
        console.log("Hi webgl");
        let cvs = document.getElementById("view");
        let gl = cuon.getWebGLContext(cvs);
        let obj = new triangle();
        obj.init(gl, cvs);
    }
}
let app = new Main();
app.run();
