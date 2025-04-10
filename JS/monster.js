let monster;
let detachedParts = [];
let images = {};
let draggingPart = null;
let offsetX, offsetY;

function preload() {
    images.heads = [loadImage('images/Skull.png')]; 
    images.ribcages = [loadImage('images/Ribcage.png')];
    images.hips = [loadImage('images/Sacrum.png')];
    images.leftArms = [loadImage('images/Muscle-Left-Arm.png')];
    images.rightArms = [loadImage('images/Muscle-Right-Arm.png')];
    images.leftLegs = [loadImage('images/Muscle-Left-Leg.png')];
    images.rightLegs = [loadImage('images/Muscle-Right-Leg.png')];
}

function setup() {
    const container = document.getElementById('canvas-container');
    let canvas = createCanvas(container.offsetWidth, container.offsetHeight);
    canvas.parent('canvas-container');
    monster = new Monster();
}

function draw() {
    clear();
    if (monster) monster.show();
    for (let part of detachedParts) {
        part.display();
    }
    if (draggingPart) {
        draggingPart.display(mouseX + offsetX, mouseY + offsetY);
    }
}

function mousePressed() {
    if (monster) monster.checkClick();
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
        draggingPart.x = mouseX + offsetX;
        draggingPart.y = mouseY + offsetY;
        draggingPart = null;
    }
}

function windowResized() {
    const container = document.getElementById('canvas-container');
    resizeCanvas(container.offsetWidth, container.offsetHeight);
}

class Monster {
    constructor() {
        const centerX = width / 2;
        const centerY = height / 2;
        this.hips = new BodyPart(centerX, centerY, images.hips[0], 'hips');
        this.ribcage = new BodyPart(centerX, centerY - this.hips.h / 2 - 10, images.ribcages[0], 'ribcage');
        this.head = new BodyPart(centerX, this.ribcage.y - this.ribcage.h / 2 - 10, images.heads[0], 'head');
        this.leftArm = new BodyPart(this.ribcage.x - this.ribcage.w / 2 - 20, this.ribcage.y, images.leftArms[0], 'leftArm');
        this.rightArm = new BodyPart(this.ribcage.x + this.ribcage.w / 2 + 20, this.ribcage.y, images.rightArms[0], 'rightArm');
        this.leftLeg = new BodyPart(this.hips.x - this.hips.w / 4, this.hips.y + this.hips.h / 2 + 20, images.leftLegs[0], 'leftLeg');
        this.rightLeg = new BodyPart(this.hips.x + this.hips.w / 4, this.hips.y + this.hips.h / 2 + 20, images.rightLegs[0], 'rightLeg');
        this.parts = [this.head, this.ribcage, this.hips, this.leftArm, this.rightArm, this.leftLeg, this.rightLeg];
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
    }
    calculateScaleFactor() {
        const maxDimension = max(this.img.width, this.img.height);
        return (this.baseSize / maxDimension) * (min(width, height) / 800);
    }
    display(x = this.x, y = this.y) {
        imageMode(CENTER);
        image(this.img, x, y, this.w, this.h);
    }
    isClicked(px, py) {
        return px > this.x - this.w / 2 && px < this.x + this.w / 2 &&
               py > this.y - this.h / 2 && py < this.y + this.h / 2;
    }
}