import { MultiPoint1, MultiPoint2 } from "./MultiPoints.js";
import { Point } from "./OnePoint.js";
import { triangle } from "./triangle.js";

class Main {

    run(): void {
        console.log("Hi webgl");
        let cvs = <HTMLCanvasElement>document.getElementById("view");
        let gl = cuon.getWebGLContext(cvs);
        let obj = new MultiPoint2(gl, cvs);
        // obj.draw();
    }
}

let app = new Main();
app.run();