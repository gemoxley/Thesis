let frameImages = [];
let contentImages = [];
let frames = [];
const FRAME_HEIGHT = 600;
const FRAME_WIDTH = 400;
const ROWS = 2;
const COLS = 4;
const SCROLL_SPEED = 1.5;

function preload() {
  for (let i = 1; i <= 6; i++) {
    frameImages.push(loadImage(`images/frame-${i}.png`));
  }
  const contentFiles = [
    'Intestinal-Diagram.png',
    'Sympathetic-Man.png',
    'Hand-Radiograph.png',
    'Kaishi-Hen-Ribs.png',
    'Arm-Muscle-Ecorche.png',
    'Ribs-Pelvis-Diagram.png',
    'Somatometric-Chart-Bone-Lengths.png'
  ];
  contentFiles.forEach(file => {
    contentImages.push(loadImage(`images/${file}`));
  });
}

function setup() {
  const canvas = createCanvas(windowWidth, FRAME_HEIGHT * ROWS);
  canvas.parent('canvas-container');
  shuffleArrays();
  initializeGrid();
}

function draw() {
  clear();
  for (let frame of frames) {
    frame.update();
    frame.display();
  }
  recycleFrames();
}

function initializeGrid() {
  const totalFrames = ROWS * (COLS + 2);
  for (let i = 0; i < totalFrames; i++) {
    const row = Math.floor(i / (COLS + 2));
    const col = i % (COLS + 2);
    addNewFrame(
      col * FRAME_WIDTH,
      row * FRAME_HEIGHT
    );
  }
}

function addNewFrame(x, y) {
  const frameImg = random(frameImages);
  const contentImg = random(contentImages);
  const padding = 20;
  const maxContentWidth = FRAME_WIDTH - padding * 2;
  const maxContentHeight = FRAME_HEIGHT - padding * 2;
  let contentWidth, contentHeight;
  const contentRatio = contentImg.width / contentImg.height;
  if (contentRatio > 1) {
    contentWidth = maxContentWidth;
    contentHeight = contentWidth / contentRatio;
    if (contentHeight > maxContentHeight) {
      contentHeight = maxContentHeight;
      contentWidth = contentHeight * contentRatio;
    }
  } else {
    contentHeight = maxContentHeight;
    contentWidth = contentHeight * contentRatio;
    if (contentWidth > maxContentWidth) {
      contentWidth = maxContentWidth;
      contentHeight = contentWidth / contentRatio;
    }
  }
  
  frames.push(new Frame(
    x,
    y,
    FRAME_WIDTH,
    FRAME_HEIGHT,
    frameImg,
    contentImg,
    contentWidth,
    contentHeight,
    padding
  ));
}

function recycleFrames() {
  for (let i = frames.length - 1; i >= 0; i--) {
    if (frames[i].x + FRAME_WIDTH < -50) {
     const farthestRight = frames.reduce((max, frame) => 
        Math.max(max, frame.x), -Infinity);
      frames[i].x = farthestRight + FRAME_WIDTH;
     frames[i].y = frames[i].y;
      frames[i].frameImg = random(frameImages);
     frames[i].contentImg = random(contentImages);
    }
  }
}

class Frame {
  constructor(x, y, w, h, frameImg, contentImg, contentW, contentH, padding) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.frameImg = frameImg;
    this.contentImg = contentImg;
    this.contentWidth = contentW;
    this.contentHeight = contentH;
    this.padding = padding;
  }
  update() {
    this.x -= SCROLL_SPEED;
  }
  display() {
    const contentX = this.x + (this.width - this.contentWidth) / 2;
    const contentY = this.y + (this.height - this.contentHeight) / 2;
    image(this.contentImg, contentX, contentY, this.contentWidth, this.contentHeight);
    image(this.frameImg, this.x, this.y, this.width, this.height);
  }
}

function shuffleArrays() {
  shuffleArray(frameImages);
  shuffleArray(contentImages);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function windowResized() {
  resizeCanvas(windowWidth, FRAME_HEIGHT * ROWS);
}