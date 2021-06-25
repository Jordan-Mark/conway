class Game {

    constructor () {
        this.grid = new Grid ({x:25*2, y:15*2});
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

class BasicGame extends Game {

    constructor () {
        super();
        this.tilemap = new TileMap(this.grid);
    }

    createMap () {
        
    }
}