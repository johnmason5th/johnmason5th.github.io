class World {
  constructor(width,height) {
    this.width = width;
    this.height = height;
    
    this.particles = [];
    this.cells = new Array(width);
    for (let x = 0; x < width; x++) {
      this.cells[x] = new Array(height);
      for (let y = 0; y < height; y++) {
        this.cells[x][y] = new Cell(this,x,y);
      }
    }
    printToDebug("World created with dimensions ("+width+","+height+")");
  }
  
  getCell(x,y) {
    if (x < 0 || this.width <= x || y < 0 || this.height <= y) {
      // printToDebug("Tile ("+x+","+y+") is out of range");
      return null;
    }
    return this.cells[x][y];
  }
	
	getAdjCells(cell) {
		let possibleAdjCells = [
        this.getCell(cell.x-1,cell.y),
        this.getCell(cell.x+1,cell.y),
        this.getCell(cell.x,cell.y-1),
        this.getCell(cell.x,cell.y+1)
      ];
    for (let i = possibleAdjCells.length-1; i >= 0; i--) {
      if (possibleAdjCells[i] === null) {
        possibleAdjCells.splice(i,1);
      }
    }
    return possibleAdjCells;
	}
  
  createParticleAt(x,y,type) {
    let cell = this.getCell(x,y);
    let newParticle;
    if (cell.particle !== null) return;
    if (type == "dust") {
      newParticle = new Dust(this, cell);
    } else if (type == "water") {
      newParticle = new Water(this, cell);
    } else if (type == "steam") {
      newParticle = new Steam(this, cell);
    } else if (type == "ice") {
      newParticle = new Ice(this, cell);
    } else if (type == "salt") { 
			newParticle = new Salt(this, cell);
		} else if (type == "saltwater") { 
			newParticle = new Saltwater(this, cell);
		} else if (type == "fish") { 
			newParticle = new Fish(this, cell);
		} else {
      printToDebug('particle type: "'+type+'" does not exist.');
      return;
    }
    this.particles.push(newParticle);
    cell.particle = newParticle;
  }
  
  deleteParticleAt(x,y) {
    let cell = this.getCell(x,y);
    let particle = cell.particle;
    cell.particle = null;
    for (let i = 0; i < this.particles.length; i++) {
      if (this.particles[i] == particle) {
        this.particles.splice(i, 1);
        break;
      }
    }
  }
	
	changeParticleAt(cell,particleType) {
		this.deleteParticleAt(cell.x,cell.y);
		this.createParticleAt(cell.x,cell.y,particleType);
	}
  
  swapParticles(cell1, cell2) {
    let tempParticle = cell1.particle;
    cell1.particle.cell = cell2;
    cell1.particle = cell2.particle;
    cell2.particle.cell = cell1;
    cell2.particle = tempParticle;
  }
  
  moveParticle(initCell, targetCell) {
    targetCell.particle = initCell.particle;
    targetCell.particle.cell = targetCell;
    initCell.particle = null;
  }
  
  inBounds(x,y) {
    return 0<=x && x<this.width && 0<=y && y<this.height;
  }
}