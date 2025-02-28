let images = [];
let frames = [];
let scrollSpeed = 2;
let frameWidth = 200;
let frameHeight = 200;
let gap = 20;

function preload() {
  for (let i = 1; i <= 5; i++) {
    images.push(loadImage(`image${i}.jpg`));
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let x = 0; x < width + frameWidth; x += frameWidth + gap) {
    addFrame(x);
  }
}

function draw() {
  background(240);
  for (let i = frames.length - 1; i >= 0; i--) {
    let frame = frames[i];
    frame.x -= scrollSpeed;
    stroke(0);
    noFill();
    rect(frame.x, frame.y, frameWidth, frameHeight);
    if (frame.img) {
      image(frame.img, frame.x, frame.y, frameWidth, frameHeight);
    }
    if (frame.x + frameWidth < 0) {
      frames.splice(i, 1);
      addFrame(width);
    }
  }
}

function addFrame(x) {
  let frame = {
    x: x,
    y: height / 2 - frameHeight / 2,
    img: random(images),
  };
  frames.push(frame);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}