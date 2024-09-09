/*
Particle classifications, create particle type tree or web. Ideally start using composition rather than the rigid inheritance

Main particle class: Particle
Particle Types: Powder, Solid, Liquid, Gas

*/
/*
Salt and saltwater
Salt behaviors: powder movement. dissolves in water to become saltwater. 
Saltwater behaviors: liquid movement. when boiled, becomes steam and salt.
Should salt dissolving into water create two saltwater or one saltwater, and when saltwater is boiled, how should it release the two?

Maybe for now when salt and water touch they both become saltwater to conserve 'mass' and when saltwater is boiled it would have 50% chance between turning into salt or water. Won't properly conserve but good enough.
*/

//Powders

class Dust extends Powder {
  constructor(world, cell) {
    super(world, cell);
    this.type = "dust";
    this.color = "tan";
    this.mass = 3;
  }
}

class Salt extends Powder {
	constructor(world, cell) {
		super(world,cell);
		this.type = "salt";
		this.color = "rgb(200,200,200)";
		this.mass = 4;
	}
	update() {
		this.move();
		this.dissolve();
	}
	dissolve() {
		/*
		if the salt is touching water, the salt and water cells' particles both convert to saltwater. Maybe for now just check the 4 bordering cells.
		*/
		let adjCells = this.world.getAdjCells(this.cell);
		for (let adjCell of adjCells) {
			if (adjCell.particle !== null && adjCell.particle.type == "water") {
				this.world.changeParticleAt(this.cell,"saltwater");
				this.world.changeParticleAt(adjCell,"saltwater");
			}
		}
	}
}

//Solids

class Ice extends Solid {
  constructor(world, cell) {
    super(world, cell);
    this.type = "ice";
    this.color = "rgb(155, 220, 220)";
    this.mass = 5;
    this.temp = -10;
  }
	update() {
    this.phaseChange();
  }
  phaseChange() {
    if (this.temp > 0) {
      this.changeTo("water");
    }
  }
  changeTo(newType) {
    this.world.deleteParticleAt(this.cell.x,this.cell.y);
    this.world.createParticleAt(this.cell.x,this.cell.y,newType);
  }
}

//Liquids

class Water extends Liquid {
  constructor(world, cell) {
    super(world, cell);
    this.type = "water";
    this.color = "blue";
    this.mass = 1;
  }
  update() {
    this.move();
    this.phaseChange();
  }
  phaseChange() {
    if (this.temp > 100) {
      this.changeTo("steam");
    } else if (this.temp < 0) {
      this.changeTo("ice");
    }
  }
  changeTo(newType) {
    this.world.deleteParticleAt(this.cell.x,this.cell.y);
    this.world.createParticleAt(this.cell.x,this.cell.y,newType);
  }
}

class Saltwater extends Liquid {
	constructor(world, cell) {
		super(world, cell);
		this.type = "saltwater";
		this.color = "rgb(100,100,200)";
		this.mass = 2;
	}
	update() {
		this.move();
		this.distillation();
	}
	distillation() {
		
	}
}

//Gases

class Steam extends Gas {
  constructor(world, cell) {
    super(world, cell);
    this.type = "steam";
    this.color = "white";
    this.mass = 0;
    this.temp = 110;
  }
	update() {
    this.move();
    this.phaseChange();
  }
  phaseChange() {
    if (this.temp < 100) {
      this.changeTo("water");
    }
  }
  changeTo(newType) {
    this.world.deleteParticleAt(this.cell.x,this.cell.y);
    this.world.createParticleAt(this.cell.x,this.cell.y,newType);
  }
}

class Fire extends Particle {
	constructor(world, cell) {
		super(world, cell);
		this.type = "fire";
		this.color = "coral";
		this.mass = 0;
		this.temp = 200;
		this.lifespan = 30;
		this.life = 0;
	}
	update() {
		this.move();
		this.life++;
		if (this.life > this.lifespan) {
			this.world.deleteParticleAt(this.cell.x,this.cell.y);
		}
	}
}

/*
Try to use concept of boids
*/

class Bird extends Particle {
	constructor(world,cell) {
		super(world,cell);
	}
}

class Fish extends Particle {
	constructor(world,cell) {
		super(world,cell);
			this.type = "fish";
			this.color = "rgb("+randomInt(100,255)+","+randomInt(100,255)+","+randomInt(100,255)+")";
			this.mass = 1;
			this.dir = 1;
	}
	update() {
    this.move();
  }
	move() {
		/*
		if this is in water,
			move like fish:
			move side to side, have chance of randomly changing direction left or right.
			also have random chance of changing altitude.
			If fish runs into something that isn't water, change direction.
			
		else act like dust (for now)
		
		
		how to check if surroundings are water:
		1 way: just check cells on each 4 sides if they are water
		being in water shouldn't mean having all 4 sides as water. Fish could be at surface of water, meaning top cell is empty without water, but fish would seem to be in water by user. Maybe fish could instead just search for the next best tile which could be water and is most reasonable for its movement behavior. If it runs out of the 4 possible directions, it would behave like powder.
		
		
		*/
		//check all 4 cells
		//if cell is water, act like fish
		  //in lots of water, fish should move in sideways direction, occasionally changing horizontal direction or +-1 vertical cell. In future have some fish behave like boids or groups.
		//if no cell is water, act like dust


		// let chanceHoriz = (randomInt(0,1))?(randomInt(0,2)?-1:1):0;
		let adjCells = this.world.getAdjCells(this.cell);
		let adjWaterCells = [];
		for (let adjCell of adjCells) {
			if (adjCell.particle !== null && adjCell.particle.type == "water") {
				adjWaterCells.push(adjCell);
			}
		}
		
		let tx = this.cell.x+this.dir;
		let ty = this.cell.y;
		if (adjWaterCells.length < 2) {
			let tx = this.cell.x+randomInt(-1,2);
			let ty = this.cell.y+1;
			if (!this.world.inBounds(tx,ty)) return;
			let targetCell = this.world.getCell(tx,ty);
			if (targetCell.isEmpty()) {
				this.world.moveParticle(this.cell, targetCell);
			} else if (targetCell.particle.mass < this.mass) {
				this.world.swapParticles(this.cell, targetCell);
			}
		} else {
			if (!this.world.inBounds(tx,ty)) {
				this.dir = -this.dir;
				return;
			}
			let targetCell = this.world.getCell(tx,ty);
			if (targetCell.particle !== null && targetCell.particle.type == "water") { //if in water, move like fish
				this.world.swapParticles(this.cell, targetCell);
			}
			if (randomInt(0,10)==1) {
				this.dir = -this.dir;
			}
		}
	}
}