class Game {

    constructor () {
        this.grid = new Grid ({x:50, y:25});
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
        this.set_tiles_iteration_orders = [];
    }

    step(){
        super.step();

        // step through all tiles and iterate
        var tiles = this.tilemap.getTileDict();
        for (var position_str in tiles){
            var tile = tiles[position_str];
            tile.step(this.grid.unhash(position_str), this);
        }

        // take set-tile iteration orders
        for (var order of this.set_tiles_iteration_orders){
            this.getTileMap().setTile(order.location, order.tile);
        }
    }

    getTile(location){
        return this.getTileMap().getTile(location);
    }

    setTile(location, tile){
        this.set_tiles_iteration_orders.push({location:location, tile:tile});
    }

    getTileMap () {
        return this.tilemap;
    }

    createMap () {
        var tilemap = this.getTileMap();
        var gridSize = this.getGrid().getSize();    

        for (var x = 0; x<gridSize.x; x++){
            for (var y = 0; y<gridSize.y; y++){
                var pos = {x:x, y:y};
                tilemap.setTile(pos, random([new DeadCell(), new LiveCell()]));
            }
        }
    }
}

