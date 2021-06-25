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

    collide(entity){
        // this is an abstract class. this is to be implemented by subclasses.
    }
}