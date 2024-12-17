declare interface Point {
    x: number;
    y: number;
}

declare interface ILWebGL {
    new (_gl: WebGLRenderingContext, _cvs?: HTMLCanvasElement): ILWebGL;
}