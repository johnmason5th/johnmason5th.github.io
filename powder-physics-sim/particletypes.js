class Particle {
  constructor(world, cell) {
    this.world = world;
    this.cell = cell;
    
    this.temp = 20; //in celcius
    this.mass = 1; //no specific unit yet
  }
  update(){}
}

class Powder extends Particle {
  constructor(world, cell) {
    super(world,cell);
  }
  update() {
    this.move();
  }
  move() {
    let tx = this.cell.x+randomInt(-1,2);
    let ty = this.cell.y+1;
    if (!this.world.inBounds(tx,ty)) return;
    let targetCell = this.world.getCell(tx,ty);
    if (targetCell.isEmpty()) {
      this.world.moveParticle(this.cell, targetCell);
    } else if (targetCell.particle.mass < this.mass) {
      this.world.swapParticles(this.cell, targetCell);
    }
  }
}

class Solid extends Particle {}

class Liquid extends Particle {
  update() {
    this.move();
  }
  move() { // Experimental fluidity motion design
    //FIXME: Ends up going through ice walls. check obstacles, start nearer until obstacle is found or max travel distance reached
    let targets = [[0,1],[1,1],[2,1],[3,1],[3,0],[2,0],[1,0]];
    let randX = randomInt(0,2)?-1:1;
    for (let tgt of targets) {
      let tx = this.cell.x+tgt[0]*randX;
      let ty = this.cell.y+tgt[1];
      if (!this.world.inBounds(tx,ty)) continue;
      let targetCell = this.world.getCell(tx,ty);
      if (targetCell.isEmpty()) {
        this.world.moveParticle(this.cell, targetCell);
        break;
      } else if (targetCell.particle.mass < this.mass) {
        this.world.swapParticles(this.cell, targetCell);
        break;
      }
    }
  }
}
class Gas extends Particle {
  update() {
    this.move();
  }
  move() {
    let tx = this.cell.x+randomInt(-1,2);
    let ty = this.cell.y+randomInt(-1,2);
    if (!this.world.inBounds(tx,ty)) return;
    let targetCell = this.world.getCell(tx,ty);
    if (targetCell.particle === null) {
      this.world.moveParticle(this.cell, targetCell);
    } else if (targetCell.particle.mass < this.mass) {
      this.world.swapParticles(this.cell, targetCell);
    }
  }
}

/*
Particle classifications, create particle type tree or web. Ideally start using composition rather than the rigid inheritance
*/