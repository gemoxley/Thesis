let frameImages = [];
let contentImages = [];
let frames = [];
const FRAME_HEIGHT = 600;
const FRAME_WIDTH = 400;
const ROWS = 2;
const COLS = 2;
const SCROLL_SPEED = 1.5;
let previousFrameImage = null;
let previousContentImage = null;

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
    'Somatometric-Chart-Bone-Lengths.png',
    'Muscogee-Shell-Carving.jpg',
    'Torben-Friedrich-Anatomy-Pelvis.jpg',
    'Teeth.jpg',
    'Copperplate-Engraving-Henry-Mutlow.png',
    'Leg-Lithograph-Albrecht-Von-Haller.png',
    'Legs-Jacob-Benard-1831.jpg',
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
  const frameImg = getRandomUnique(frameImages, previousFrameImage);
  const contentImg = getRandomUnique(contentImages, previousContentImage);
  previousFrameImage = frameImg;
  previousContentImage = contentImg;
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
      const newFrameImg = getRandomUnique(frameImages, previousFrameImage);
      const newContentImg = getRandomUnique(contentImages, previousContentImage);
      frames[i].x = farthestRight + FRAME_WIDTH;
      frames[i].frameImg = newFrameImg;
      frames[i].contentImg = newContentImg;
      previousFrameImage = newFrameImg;
      previousContentImage = newContentImg;
    }
  }
}

function getRandomUnique(imageArray, previousImage) {
  if (imageArray.length <= 1) return imageArray[0];
  let newImage;
  do {
    newImage = random(imageArray);
  } while (newImage === previousImage);
  return newImage;
}

class Frame {
  constructor(x, y, w, h, frameImg, contentImg, contentW, contentH, padding) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.frameImg = frameImg;
    this.con