let monster;
let detachedParts = [];
let images = {};
let secondCanvas;
let draggingPart = null;
let offsetX, offsetY;

function preload() {
  images.heads = [loadImage('images/Colors.png')]; 
  images.ribcages = [loadImage('images/Ribcage.png')];
  images.hips = [loadImage('images/Sacrum.png')];
  images.leftArms = [loadImage('images/Muscle-Left-Arm.png')];
  images.rightArms = [loadImage('images/Muscle-Right-Arm.png')];
  images.leftLegs = [loadImage('images/Muscle-Left-Leg.png')];
  images.rightLegs = [loadImage('images/Muscle-Right-Leg.png')];
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container');
  secondCanvas = createGraphics(windowWidth, windowHeight);
  secondCanvas.parent('second-canvas-container');
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
  if (draggingPart) {
    draggingPart.display(mouseX + offsetX, mouseY + offsetY);
  }
  secondCanvas.clear();
  for (let part of detachedParts) {
    if (part.onSecondCanvas) {
      part.displayOnSecondCanvas();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  secondCanvas.resizeCanvas(windowWidth, windowHeight);
  monster = new Monster();
}

function mousePressed() {
  for (let i = detachedParts.length - 1; i >= 0; i--) {
    if (detachedParts[i].isClicked(mouseX, mouseY)) {
      draggingPart = detachedParts[i];
      offsetX = draggingPart.x - mouseX;
      offsetY = draggingPart.y - mouseY;
      break;
    }
  }
}

function mouseReleased() {
  if (draggingPart) {
    if (mouseX > width / 2) {
      draggingPart.onSecondCanvas = true;
    } else {
      draggingPart.onSecondCanvas = false;
    }
    draggingPart.x = mouseX + offsetX;
    draggingPart.y = mouseY + offsetY;
    draggingPart = null;
  }
}

class Monster {
  constructor() {
    const emSize = 16;
    const secondCanvasCenterX = width * 0.75; // Center of the second canvas
    const secondCanvasCenterY = height / 2;
    this.hips = new BodyPart(secondCanvasCenterX, secondCanvasCenterY, random(images.hips), 'hips');
    this.ribcage = new BodyPart(secondCanvasCenterX, secondCanvasCenterY - this.hips.h / 2 - emSize, random(images.ribcages), 'ribcage');
    this.parts = [
      this.hips,
      this.ribcage,
      new BodyPart(secondCanvasCenterX, secondCanvasCenterY - this.ribcage.h / 2 - this.hips.h / 2 - emSize, random(images.heads), 'head'),
      new BodyPart(secondCanvasCenterX - this.ribcage.w / 2, secondCanvasCenterY - this.hips.h / 2 - emSize, random(images.leftArms), 'leftArm'),
      new BodyPart(secondCanvasCenterX + this.ribcage.w / 2, secondCanvasCenterY - this.hips.h / 2 - emSize, random(images.rightArms), 'rightArm'),
      new BodyPart(secondCanvasCenterX - this.hips.w / 4, secondCanvasCenterY + this.hips.h / 2, random(images.leftLegs), 'leftLeg'),
      new BodyPart(secondCanvasCenterX + this.hips.w / 4, secondCanvasCenterY + this.hips.h / 2, random(images.rightLegs), 'rightLeg')
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
    this.baseSize = 300;
    this.scaleFactor = this.calculateScaleFactor();
    this.w = img.width * this.scaleFactor;
    this.h = img.height * this.scaleFactor;
    this.onSecondCanvas = false;
  }
  calculateScaleFactor() {
    const maxDimension = max(this.img.width, this.img.height);
    const scale = this.baseSize / maxDimension;
    return scale * (min(width, height) / 800);
  }
  display(x = this.x, y = this.y) {
    imageMode(CENTER);
    image(this.img, x, y, this.w, this.h);
  }
  displayOnSecondCanvas() {
    secondCanvas.imageMode(CENTER);
    secondCanvas.image(this.img, this.x, this.y, this.w, this.h);
  }
  isClicked(px, py) {
    return px > this.x - this.w / 2 && px < this.x + this.w / 2 &&
           py > this.y - this.h / 2 && py < this.y + this.h / 2;
  }
}