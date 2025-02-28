let images = [];
let frames = [];
let scrollSpeed = 2;
let frameWidth = 200;
let frameHeight = 200;
let gap = 20;

function preload() {
  images.push(loadImage('images/frame1.png'));
  images.push(loadImage('images/frame2.png'));
  images.push(loadImage('images/frame3.png'));
  images.push(loadImage('images/frame4.png'));
  images.push(loadImage('images/frame5.png'));
  images.push(loadImage('images/frame6.png'));
}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container');
  for (let x = 0; x < width + frameWidth; x += frameWidth + gap) {
    let img = random(images);
    frames.push(new ImageFrame(x, height / 2 - frameHeight / 2, frameWidth, frameHeight, img));
  }
}

function draw() {
  background(240);
  for (let i = frames.length - 1; i >= 0; i--) {
    frames[i].update();
    frames[i].display();

    if (frames[i].isOffScreen()) {
      frames.splice(i, 1);
      let img = random(images);
      frames.push(new ImageFrame(width, height / 2 - frameHeight / 2, frameWidth, frameHeight, img));
    }
  }
}

class ImageFrame {
  constructor(x, y, w, h, img) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.img = img;
  }
  update() {
    this.x -= scrollSpeed;
  }
  display() {
    stroke(0);
    noFill();
    rect(this.x, this.y, this.w, this.h);
    if (this.img) {
      image(this.img, this.x, this.y, this.w, this.h);
    }
  }
  isOffScreen() {
    return this.x + this.w < 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}