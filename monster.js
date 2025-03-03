let monster;
let detachedParts = [];
let images = {};

function preload() {
  console.log('Loading images...');
  images.heads = [loadImage('Colors.png')]; 
  images.torsos = [loadImage('Torso-Bones.png')];
  images.leftArms = [loadImage('Muscle-Left-Arm.png')];
  images.rightArms = [loadImage('Muscle-Right-Arm.png')];
  images.leftLegs = [loadImage('Muscle-Left-Leg.png')];
  images.rightLegs = [loadImage('Muscle-Right-Leg.png')];
}

function setup() {
  console.log('Setup function running...');
  let canvas = createCanvas(400, 600);
  canvas.parent('canvas-container');
  monster = new Monster();
}

function draw() {
  background(220);
  if (monster) {
    monster.show();
  }
  for (let part of detachedParts) {
    part.display();
  }
}

function mousePressed() {
  console.log('Mouse pressed!');
  if (monster) { 
    monster.checkClick();
  } else {
    console.warn('⚠ Monster is not defined yet!');
  }
}

class Monster {
  constructor() {
    console.log('Generating Monster...');
    this.parts = [
      new BodyPart(width / 2, 100, random(images.heads), 'head'),
      new BodyPart(width / 2, 200, random(images.torsos), 'torso'),
      new BodyPart(width / 2 - 60, 200, random(images.leftArms), 'leftArm'),
      new BodyPart(width / 2 + 60, 200, random(images.rightArms), 'rightArm'),
      new BodyPart(width / 2 - 30, 350, random(images.leftLegs), 'leftLeg'),
      new BodyPart(width / 2 + 30, 350, random(images.rightLegs), 'rightLeg')
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
        console.log('Removed ${this.parts[i].type}');
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