let frameImages = [];
let contentImages = [];
let frames = [];
let scrollSpeed = 2.5;
let gap = 50;
let lastFrameImg = null;
let lastContentImg = null;

function preload() {
  frameImages.push(loadImage('images/frame-1.png'));
  frameImages.push(loadImage('images/frame-2.png'));
  frameImages.push(loadImage('images/frame-3.png'));
  frameImages.push(loadImage('images/frame-4.png'));
  frameImages.push(loadImage('images/frame-5.png'));
  frameImages.push(loadImage('images/frame-6.png'));
  contentImages.push(loadImage('images/Intestinal-Diagram.png'));
  contentImages.push(loadImage('images/Sympathetic-Man.png'));
  contentImages.push(loadImage('images/Hand-Radiograph.png'));
  contentImages.push(loadImage('images/Kaishi-Hen-Ribs.png'));
  contentImages.push(loadImage('images/Arm-Muscle-Ecorche.png'));
  contentImages.push(loadImage('images/Ribs-Pelvis-Diagram.png'));
  contentImages.push(loadImage('images/Somatometric-Chart-Bone-Lengths.png'));
  console.log('Frame images loaded:', frameImages);
  console.log('Content images loaded:', contentImages);
}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container');
  console.log('Canvas created:', canvas);
  shuffleArray(frameImages);
  shuffleArray(contentImages);
  let x = 0;
  while (x < width) {
    addNewFrame(x);
    x += frames[frames.length - 1].w + gap;
  }
}

function draw() {
  background(240);
  for (let i = frames.length - 1; i >= 0; i--) {
    frames[i].update();
    frames[i].display();
    if (frames[i].isOffScreen()) {
      frames.splice(i, 1);
      let lastFrame = frames.length > 0 ? frames[frames.length - 1] : null;
      let x = lastFrame ? lastFrame.x + lastFrame.w + gap : width;
      addNewFrame(x);
    }
  }
}

function addNewFrame(x) {
  let frameImg, contentImg;
  do {
    frameImg = random(frameImages);
  } while (frameImg === lastFrameImg);
  lastFrameImg = frameImg;
  do {
    contentImg = random(contentImages);
  } while (contentImg === lastContentImg);
  lastContentImg = contentImg;
  let frameHeight = height;
  let frameWidth = (frameHeight * frameImg.width) / frameImg.height;
  let imgWidth = frameWidth;
  let imgHeight = (frameWidth * contentImg.height) / contentImg.width;
  if (imgHeight > frameHeight) {
    imgHeight = frameHeight;
    imgWidth = (frameHeight * contentImg.width) / contentImg.height;
  }
  frames.push(new ImageFrame(x, 0, frameWidth, frameHeight, frameImg, contentImg, imgWidth, imgHeight));
  console.log('Frame added at x:', x, 'with size:', frameWidth, frameHeight);
}

class ImageFrame {
  constructor(x, y, w, h, frameImg, contentImg, imgWidth, imgHeight) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.frameImg = frameImg;
    this.contentImg = contentImg;
    this.imgWidth = imgWidth;
    this.imgHeight = imgHeight;
  }
  update() {
    this.x -= scrollSpeed;
  }
  display() {
    if (this.contentImg && this.frameImg) {
      let contentX = this.x + (this.w - this.imgWidth) / 2;
      let contentY = this.y + (this.h - this.imgHeight) / 2;
      image(this.contentImg, contentX, contentY, this.imgWidth, this.imgHeight);
      image(this.frameImg, this.x, this.y, this.w, this.h);
      console.log('Frame displayed at:', this.x, this.y, 'with size:', this.w, this.h);
      class ImageFrame {
        constructor(x, y, w, h, frameImg, contentImg, imgWidth, imgHeight) {
          this.x = x;
          this.y = y;
          this.w = w;
          this.h = h;
          this.frameImg = frameImg;
          this.contentImg = contentImg;
          this.imgWidth = imgWidth;
          this.imgHeight = imgHeight;
        }
        update() {
          this.x -= scrollSpeed;
        }
        display() {
          if (this.contentImg && this.frameImg) {
            let contentX = this.x + (this.w - this.imgWidth) / 2;
            let contentY = this.y + (this.h - this.imgHeight) / 2;
            push();
            noStroke();
            rect(this.x, this.y, this.w, this.h);
            image(this.contentImg, contentX, contentY, this.imgWidth, this.imgHeight);
            pop();
            image(this.frameImg, this.x, this.y, this.w, this.h);
          }
        }
        isOffScreen() {
          return this.x + this.w < -preloadOffset;
        }
      }      
    }
  }
  isOffScreen() {
    return this.x + this.w < 0;
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  console.log('Canvas resized to:', windowWidth, windowHeight);
  frames = [];
  let x = 0;
  while (x < width + 300) {
    addNewFrame(x);
    x += frames[frames.length - 1].w + gap;
  }
}