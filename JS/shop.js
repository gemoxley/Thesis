let customFont;
function preload() {
  customFont = loadFont('assets/OrticaAngular-Bold.otf');
}
function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container');
  textFont(customFont);
  textSize(28);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  noLoop();
  drawBoxes();
}
function drawBoxes() {
  const boxWidth = 180;
  const boxHeight = 90;
  const spacing = 220;
  const startX = width / 2 - spacing;
  const centerY = height / 2;
  drawTextBox(startX, centerY, "pen");
  drawTextBox(startX + spacing, centerY - 25, "TEST");
  drawTextBox(startX + spacing * 2, centerY + 20, "TEST");
}
function drawTextBox(x, y, label) {
  fill(255);
  stroke(0);
  strokeWeight(2);
  rect(x, y, 180, 90, 12);
  fill(0);
  noStroke();
  text(label, x, y);
}
