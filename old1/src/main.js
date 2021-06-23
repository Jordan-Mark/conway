
/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

// deprecated
class Color{
    constructor(r, g, b, a=255){
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    stroke(){
        stroke(this.r, this.g, this.b, this.a);
    }

    fill(){
        fill(this.r, this.g, this.b, this.a);
    }
}


class Grid {

    constructor (grid_size, cell_size){
        this.grid_size = grid_size;
        this.cell_size = cell_size;
        this.tiles = {};
    }

    inBounds (coords){
        /* return true if the (grid) coords are within the bounds of the grid. */

        if (coords.x<0 || coords.x>=this.grid_size.x){
            return false;
        }
        else if (coords.y<0 || coords.y>=this.grid_size.y){
            return false;
        }
        else {
            return true;
        }
    }

    getNeighbours (coords, range=1){
        var coordsList = [];

        for (var x = -1*range; x <= 1*range; x++){
            for (var y = -1*range; y <= 1*range; y++){
                if (!(x==0 && y==0)){
                    var testPosition = {x:coords.x + x, y:coords.y + y};
                    if (this.inBounds(testPosition)){
                        coordsList.push(testPosition);
                    }
                }
            }
        }

        return coordsList;
    }

    getTotalSize (){
        return {x:this.grid_size.x*this.cell_size.x, y:this.grid_size.y*this.cell_size.y};
    }

    getGridSize (){
        return this.grid_size;
    }
    
    getCellSize(){
        return this.cell_size;
    }

    draw (centre_pos) {
        
        push();
        stroke(255*0.15);
        fill(35);
        strokeWeight(1);

        // iterate through cells in grid
        for (var i=0;i<this.grid_size.x;i++){
            for (var j=0; j<this.grid_size.y;j++){

                // draw grid cell   
                const x = centre_pos.x + (i-this.grid_size.x/2)*this.cell_size.x;
                const y = centre_pos.y + (j-this.grid_size.y/2)*this.cell_size.y;
                rect(x, y, this.cell_size.x, this.cell_size.y);

                var tile =  this.getTile({x:i, y:j});
                if (tile != null){
                    tile.draw({x:x, y:y});
                }
            }
        }
        pop();
    }

    hash (position) {
        // creates a unique ID for a position so it can be used as a key in this.tiles;
        return position.x + '.' + position.y;
    }

    unhash (position_str){
        // creates a position interface {x, y} from a hash key.
        var pos = position_str.split('.')
        return {x:parseInt(pos[0]), y:parseInt(pos[1])};
    }

    setTile(position, tile){
        this.tiles[this.hash(position)] = tile;
        if (tile == null){
            delete this.tiles[this.hash(position)];
            return;
        }

    }

    getTile(position){
        return this.tiles[this.hash(position)];
    }

    getTiles(){
        return Object.values(this.tiles)
    }

    getTileDict(){
        return this.tiles;
    }
}

class Game {

    constructor () {
        this.grid = new Grid (
            /* grid size */{x:25, y:15},
            /* cell size */{x:32, y:32});

        this.steps = 0;
    }

    step () {

        this.steps += 1;

        // iterate through and step all tiles in the grid
        var tiles = this.grid.getTileDict();
        for (var position_str in tiles){
            var tile_position = this.grid.unhash(position_str);
            var tile = this.grid.getTile(tile_position);
            tile.step(tile_position, this);
        }
    }

    draw () {

        // draw grid
        this.grid.draw({x:width/2, y:height/2});

    }

    getGrid(){
        return this.grid;
    }

    getSteps(){
        return this.steps;
    }

    getPlayerPosition(){
        var tiles = this.grid.getTileDict();
        for (var position_str in tiles){
            var tile_position = this.grid.unhash(position_str);
            var tile = this.grid.getTile(tile_position);
            if (tile instanceof Player){
                return tile_position;
            }
        }
    }

    movePlayer(direction){
        var playerPosition = this.getPlayerPosition();
        var trialPosition = {x: playerPosition.x + direction.x, y: playerPosition.y + direction.y};
        if (this.getGrid().inBounds(trialPosition)){

            this.getGrid().setTile(trialPosition, this.getGrid().getTile(playerPosition));
            this.getGrid().setTile(playerPosition, null);

            // reset the interval to 1 second
            clearInterval(stepInterval);    
            stepInterval = setInterval(step, stepTimeInterval);

            // step the game 1
            this.step();
        }
    }
}

class Tile {
    // abstract tile class

    constructor(){
        this.image = null;
    }

    draw(coords){
        push();
        noSmooth();
        image(this.image, coords.x, coords.y);
        pop();
    }

    step(location, game){
        // this is an abstract class. this is to be implemented by subclasses.
    }

}

class Windmill extends Tile {

    constructor(){
        super();
        this.image = windmill_img;
    }

    step(location, game){

        var farm_creation_chance = 1/10 /* ticks */;

        if (farm_creation_chance > random(1)){
            // create new farm
            var neighbours = game.getGrid().getNeighbours(location, 2);
            shuffleArray(neighbours);

            for (var loc of neighbours){
                if (game.getGrid().getTile(loc) == null){
                    game.getGrid().setTile(loc, new Windmill());
                    break;
                }
            }    
        }

    }
}

class Hamlet extends Tile {
    constructor(){
        super();
        this.image = farm_img;
    }

    step(location, game){

        var farm_creation_chance = 1/10 /* ticks */;

        if (farm_creation_chance > random(1)){
            // create new farm
            var neighbours = game.getGrid().getNeighbours(location, 2);
            shuffleArray(neighbours);

            for (var loc of neighbours){
                if (game.getGrid().getTile(loc) == null){
                    game.getGrid().setTile(loc, new Hamlet());
                    break;
                }
            }    
        }

    }
}

class Farm extends Tile {

    constructor(){
        super();
        this.image = farm_img;
    }
}

class Player extends Tile {
    constructor(){
        super();
        this.image = player_img;
    }
}




// game parameters
var margin = {x:200, y:100};
var game = new Game();
var stepInterval;
var stepTimeInterval = 10;

function preload (){
    house_img = loadImage('tiles/house.png');
    hamlet_img = loadImage('tiles/hamlet.png');
    farm_img = loadImage('tiles/farm.png');
    player_img = loadImage('tiles/player.png');
    windmill_img = loadImage('tiles/windmill.png');
}

function setup (){

    var grid = game.getGrid();
    var grid_size = grid.getGridSize();
    var cell_size = grid.getCellSize();

    createCanvas(grid_size.x * cell_size.x + margin.x, 
                 grid_size.y * cell_size.y + margin.y);


    grid.setTile({x:10, y:5}, new Windmill());

    grid.setTile({x:20, y:5}, new Hamlet());

    grid.setTile({x:20, y:8}, new Player());




    // set interval every 1 second.
    stepInterval = setInterval(step, stepTimeInterval);
    
}

function step (){

    // bring the game forward one step.
    game.step();

}

function keyPressed() {


    switch (keyCode){
        case 87:
            //w
            game.movePlayer({x:0, y:-1});
            break;
        
        case 65:
            // a
            game.movePlayer({x:-1, y:0});
            break;
        
        case 68:
            // d
            game.movePlayer({x:1, y:0});
            break;
        
        case 83:
            // s
            game.movePlayer({x:0, y:1});
            break;
    }


}

function draw () {


    // reset background.
	background(30, 30, 45);

    game.draw();


    // draw steps counter
    push();
    strokeWeight(0);
    fill(255);
    textSize(15);
    text ('steps: ' + game.getSteps(), 25, 25)
    pop();

}

