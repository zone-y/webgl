interface Point {
    x: number;
    y: number;
}

class Main {

    run(): void {
        console.log("Hi webgl");
        let cp = new clickPoint();
        cp.init();
    }

    
}

let app = new Main();
app.run();