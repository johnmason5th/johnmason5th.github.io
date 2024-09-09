class Cell {
  constructor(world,x,y) {
    this.particle = null;

    this.world = world;
    this.x = x;
    this.y = y;
  }
  isEmpty() {
    return this.particle === null;
  }
}