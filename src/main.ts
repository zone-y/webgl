import { DrawTextures } from "./DrawTexture.js";
import { HelloCube } from "./HelloCube.js";
import { LightedCube } from "./LightedCube.js";
import { LookAtTriangle } from "./LookAtTriangle.js";
import { MultiPoint1, MultiPoint2 } from "./MultiPoints.js";
import { MultiTextures } from "./MultiTextures.js";
import { Point } from "./OnePoint.js";
import { PointLightCube } from "./PointLightCube.js";
import { triangle } from "./triangle.js";
import { clickPoint } from "./clickPoint.js";

class Main {

    run(): void {
        console.log("Hi webgl");
        let cvs = <HTMLCanvasElement>document.getElementById("view");
        let gl = cuon.getWebGLContext(cvs);
        let obj = new clickPoint(gl, cvs);
        // obj.draw();
    }
}

let app = new Main();
app.run();