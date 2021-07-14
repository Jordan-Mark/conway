

class Interface {

    constructor (game){
        this.game = game;
    }

    draw () {

    }
}


class BasicInterface extends Interface {

    constructor (game, cell_size){
        super(game);
        this.cell_size = cell_size;
    }

    draw () {
        
        push();
        stroke(255*0.20);
        fill(35);
        strokeWeight(1);
        
        var centre = {x:width/2, y:height/2};
        var grid_size = this.game.getGrid().getSize();
        var cell_size = this.cell_size

        // iterate through cells in grid
        for (var i=0;i<grid_size.x;i++){
            for (var j=0; j<grid_size.y;j++){

                // draw grid cell   
                const x = centre.x + (i-grid_size.x/2)*cell_size.x;
                const y = centre.y + (j-grid_size.y/2)*cell_size.y;
                rect(x, y, cell_size.x, cell_size.y);

                // get grid tile and draw
                var tile = this.game.getTileMap().getTile({x:i, y:j});

                if (tile != null){
                    if (tile.image != null){
                        tile.draw({x:x, y:y});
                    }
                }

            }
        }
        pop();
    }
}