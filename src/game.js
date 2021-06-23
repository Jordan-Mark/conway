class Game {

    constructor () {
        this.grid = new Grid ({x:25, y:15});
        this.steps = 0;
    }

    step () {
        this.steps += 1;
    }

    getGrid(){
        return this.grid;
    }

    getSteps(){
        return this.steps;
    }
}