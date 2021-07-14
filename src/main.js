

// game parameters
var margin = {x:200, y:100};
var game = new BasicGame();
var interface;
var stepInterval; /* interval callback */
var stepTimeInterval = 100;

function preload (){

    stonewall_img= loadImage('tiles/16x/wall.png');
    hamlet_img = loadImage('tiles/hamlet.png');
    farm_img = loadImage('tiles/farm.png');

    /*
    house_img = loadImage('tiles/house.png');
    hamlet_img = loadImage('tiles/hamlet.png');
    
    player_img = loadImage('tiles/player.png');
    windmill_img = loadImage('tiles/windmill.png');
    */

}

function setup (){


    // create game map
    this.game.createMap();

    // parameters
    var grid = game.getGrid();
    var grid_size = grid.getSize();
    var cell_size = {x:16, y:16};

    // get canvas dimensions
    var canvas_size_x = grid_size.x * cell_size.x + margin.x;
    var canvas_size_y = grid_size.y * cell_size.y + margin.y;

    // create p5 canvas
    createCanvas(canvas_size_x, canvas_size_y);

    // create interface
    interface = new BasicInterface(game, cell_size);

    // set game step interval.
    stepInterval = setInterval(step, stepTimeInterval);

    
}

function step (){

    // bring the game forward one step.
    game.step();

}

function draw () {


    // reset background.
	background(30, 30, 45);

    // draw game interface
    interface.draw();

    // draw steps counter
    push();
    strokeWeight(0);
    fill(255);
    textSize(15);
    text ('steps: ' + game.getSteps(), 25, 25)
    pop();

}

