import { MultiPoint2 } from "./MultiPoints.js";
class Main {
    run() {
        console.log("Hi webgl");
        let cvs = document.getElementById("view");
        let gl = cuon.getWebGLContext(cvs);
        let obj = new MultiPoint2(gl, cvs);
        // obj.draw();
    }
}
let app = new Main();
app.run();
