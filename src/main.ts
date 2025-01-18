import { DrawTextures } from "./DrawTexture.js";
import { HelloCube } from "./HelloCube.js";
import { LightedCube } from "./LightedCube.js";
import { LookAtTriangle } from "./LookAtTriangle.js";
import { MultiPoint1, MultiPoint2 } from "./MultiPoints.js";
import { MultiTextures } from "./MultiTextures.js";
import { Point } from "./OnePoint.js";
import { PointLightCube } from "./PointLightCube.js";
import { triangle } from "./triangle.js";
import { ColorfulTriangle } from "./ColorfulTriangle.js";
import { ClickPoint } from "./ClickPoints.js";
import { ProjCamera } from "./ProjCamera.js";
import { ch1_bos } from "./book_of_shader/ch1.js";

class Main {

    run(): void {
        console.log("Hi webgl");
        let cvs = <HTMLCanvasElement>document.getElementById("view");
        let gl = cuon.getWebGLContext(cvs);
        let obj = new ch1_bos(gl, cvs);
        // obj.draw();
    }
}

let app = new Main();
app.run();