let monster;
let detachedParts = [];
let images = {};
let draggingPart = null;
let offsetX, offsetY;
const SNAP_DISTANCE = 50;
function preload() {
    images.heads = [
        loadImage('images/Copperplate-Skull.png'),
        loadImage('images/Dagari-Skull.png')
    ];
    images.ribcages = [
        loadImage('images/Ribcage.png')
    ];
    images.hips = [
        loadImage('images/Sacrum.png')
    ];
    images.leftArms = [
        loadImage('images/Muscle-Left-Arm.png'),
        loadImage('images/Turkish-Mosaic-Left-Arm.png')
    ];
    images.rightArms = [
        loadImage('images/Muscle-Right-Arm.png'),
        loadImage('images/Mvskoke-Right-Arm.png'),
        loadImage('images/Viet-Medicine-Right-Arm.png')
    ];
    images.leftLegs = [
        loadImage('images/Muscle-Left-Leg.png'),
        loadImage('images/Visayans-Left-Leg.png')
    ];
    images.rightLegs = [
        loadImage('images/Muscle-Right-Leg.png'),
        loadImage('images/Algeria-Right-Leg.png')
    ];
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
        if (monster.trySnap(draggingPart)) {
            detachedParts = detachedParts.filter(p => p !== draggingPart);
        }
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
        this.hips = new BodyPart(centerX, centerY, random(images.hips), 'hips');
        this.ribcage = new BodyPart(centerX, centerY - this.hips.h / 2 - 10, random(images.ribcages), 'ribcage', this.hips, 1.1);
        this.head = new BodyPart(centerX, this.ribcage.y - this.ribcage.h / 2 - 10, random(images.heads), 'head', this.ribcage, 0.6);
        this.leftArm = new BodyPart(this.ribcage.x - this.ribcage.w / 2 - 20, this.ribcage.y, random(images.leftArms), 'leftArm', this.ribcage, 0.5);
        this.rightArm = new BodyPart(this.ribcage.x + this.ribcage.w / 2 + 20, this.ribcage.y, random(images.rightArms), 'rightArm', this.ribcage, 0.5);
        this.leftLeg = new BodyPart(this.hips.x - this.hips.w / 4, this.hips.y + this.hips.h / 2 + 20, random(images.leftLegs), 'leftLeg', this.hips, 0.6);
        this.rightLeg = new BodyPart(this.hips.x + this.hips.w / 4, this.hips.y + this.hips.h / 2 + 20, random(images.rightLegs), 'rightLeg', this.hips, 0.6);
        this.parts = [
            this.head,
            this.ribcage,
            this.hips,
            this.leftArm,
            this.rightArm,
            this.leftLeg,
            this.rightLeg
        ];
        for (let part of this.parts) {
            part.setSnapPosition(part.x, part.y);
        }
    }
    show() {
        for (let part of this.parts) {
            part.display();
        }
    }
    checkClick() {
        for (let i = this.parts.length - 1; i >= 0; i--) {
            if (this.parts[i].isClicked(mouseX, mouseY)) {
                this.parts[i].isDetached = true;
                detachedParts.push(this.parts[i]);
                this.parts.splice(i, 1);
                break;
            }
        }
    }
    trySnap(part) {
        for (let i = 0; i < this.parts.length; i++) {
            if (this.parts[i].type === part.type) {
                return false;
            }
        }
        if (dist(part.x, part.y, part.snapX, part.snapY) < SNAP_DISTANCE) {
            part.x = part.snapX;
            part.y = part.snapY;
            part.isDetached = false;
            this.parts.push(part);
            return true;
        }
        return false;
    }
}
class BodyPart {
    constructor(x, y, img, type, referencePart = null, relativeScale = 1) {
        this.x = x;
        this.y = y;
        this.img = img;
        this.type = type;
        this.baseSize = 200;
        this.isDetached = false;
        this.scaleFactor = referencePart
            ? (referencePart.w / img.width) * relativeScale
            : this.calculateScaleFactor();
        this.w = img.width * this.scaleFactor;
        this.h = img.height * this.scaleFactor;
        this.snapX = x;
        this.snapY = y;
    }
    calculateScaleFactor() {
        const maxDimension = max(this.img.width, this.img.height);
        return (this.baseSize / maxDimension) * (min(width, height) / 800);
    }
    setSnapPosition(x, y) {
        this.snapX = x;
        this.snapY = y;
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