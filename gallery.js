let images = [];
let frames = [];
let scrollSpeed = 1;
let frameWidth, frameHeight;
let gap = 50;

function preload() {
  images.push(loadImage('images/frame-1.png'));
  images.push(loadImage('images/frame-2.png'));
  images.push(loadImage('images/frame-3.png'));
  images.push(loadImage('images/frame-4.png'));
  images.push(loadImage('images/frame-5.png'));
  images.push(loadImage('images/frame-6.png'));
}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container');
  frameWidth = width / 4;
  frameHeight = height;
  for (let x = 0; x < width + frameWidth; x += frameWidth + gap) {
    let img = random(images);
    frames.push(new ImageFrame(x, 0, frameWidth, frameHeight, img));
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
      frames.push(new ImageFrame(width, 0, frameWidth, frameHeight, img));
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
    this.imgWidth = w;
    this.imgHeight = (w * img.height) / img.width;
    if (this.imgHeight > h) {
      this.imgHeight = h;
      this.imgWidth = (h * img.width) / img.height;
    }
  }
  update() {
    this.x -= scrollSpeed;
  }
  display() {
    if (this.img) {
      let imgX = this.x + (this.w - this.imgWidth) / 2;
      let imgY = this.y + (this.h - this.imgHeight) / 2;
      image(this.img, imgX, imgY, this.imgWidth, this.imgHeight);
    }
  }
  isOffScreen() {
    return this.x + this.w < 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  frameWidth = width / 2;
  frameHeight = height;
}