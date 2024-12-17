import { loadFile } from "./Loader.js";

export abstract class MyBase {
    
    /**顶点着色器源代码文件名 */
    protected vs: string;
    /**片元着色器源代码文件名 */
    protected fs: string;
    /**资源文件路径，资源文件包括着色器源码文件，纹理等 */
    protected assetsPath: string;

    constructor(vs: string, fs: string, path: string) {
        this.vs = vs;
        this.fs = fs;
        this.assetsPath = path;
        const tasks: Promise<string>[] = [];
        [vs, fs].forEach(f => {
            tasks.push(loadFile(f, path));
        })
        Promise.all(tasks)
        .then(([vs, fs]) => {
            this.onLoad(vs, fs);
        })
    }

    protected abstract onLoad(vs: string, fs: string): void;
}