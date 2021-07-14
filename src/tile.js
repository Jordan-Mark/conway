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

class Wall extends Tile {
    constructor(){
        super();
    }
}

class DeadCell extends Tile {
    constructor(){
        super();
    }
    step(location, game){
        
        var nearby_livecells = 0;

        for (var nearby_location of game.getGrid().getNeighbours(location)){
            var nearby_tile = game.getTile(nearby_location);
            if (nearby_tile instanceof LiveCell){
                nearby_livecells++;
            }
        }

        if (nearby_livecells==3){
            game.setTile(location, new LiveCell());
        }
    }
}

class LiveCell extends Tile {
    constructor(){
        super();
        this.image = stonewall_img;
    }
    step(location, game){
        var nearby_livecells = 0;

        for (var nearby_location of game.getGrid().getNeighbours(location)){
            var nearby_tile = game.getTile(nearby_location);
            if (nearby_tile instanceof LiveCell){
                nearby_livecells++;
            }
        }


        if (nearby_livecells<2){
            game.setTile(location, new DeadCell());
        }

        else if (nearby_livecells>3){
            game.setTile(location, new DeadCell());
        }
        
    }
}