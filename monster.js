let monster;
let detachedParts = [];
let images = {};

function preload() {
  images.heads = [loadImage("head1.png"), loadImage("head2.png")]; 
  images.torsos = [loadImage("torso1.png"), loadImage("torso2.png")];
  images.arms = [loadImage("arm1.png"), loadImage("arm2.png")];
  images.legs = [loadImage("leg1.png"), loadImage("leg2.png")];
}

function setup() {
  let canvas = createCanvas(400, 600);
  canvas.parent("canvas-container");
  monster = new Monster();
}

function draw() {
  background(220);
  monster.show();
  
  for (let part of detachedParts) {
    part.display();
  }
}

function mousePressed() {
  monster.checkClick();
}

class Monster {
  constructor() {
    this.parts = [
      new BodyPart(width / 2, 100, random(images.heads), "head"),
      new BodyPart(width / 2, 200, random(images.torsos), "torso"),
      new BodyPart(width / 2 - 60, 200, random(images.arms), "leftArm"),
      new BodyPart(width / 2 + 60, 200, random(images.arms), "rightArm"),
      new BodyPart(width / 2 - 30, 350, random(images.legs), "leftLeg"),
      new BodyPart(width / 2 + 30, 350, random(images.legs), "rightLeg")
    ];
  }

  show() {
    for (let part of this.parts) {
      part.display();
    }
  }

  checkClick() {
    for (let i = this.parts.length - 1; i >= 0; i--) {
      if (this.parts[i].isClicked(mouseX, mouseY)) {
        detachedParts.push(this.parts[i]); 
        this.parts.splice(i, 1);
        break;
      }
    }
  }
}

class BodyPart {
  constructor(x, y, img, type) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.type = type;
    this.w = img.width / 2;
    this.h = img.height / 2;
  }

  display() {
    imageMode(CENTER);
    image(this.img, this.x, this.y, this.w, this.h);
  }

  isClicked(px, py) {
    return px > this.x - this.w / 2 && px < this.x + this.w / 2 &&
           py > this.y - this.h / 2 && py < this.y + this.h / 2;
  }
}
