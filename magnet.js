// magnet.js
// Maverick Berkland
class Magnet {
    // horse-shoe magnet
    constructor(x, y, angle, strength, flipped = false) {
        this.pos = createVector(x, y);
        this.angle = angle;
        this.strength = strength;
        this.flipped = flipped;
    }

    isMouseOver() {
        // Calculate the position of the mouse relative to the center of the magnet
        let x = mouseX - this.pos.x;
        let y = mouseY - this.pos.y;

        // Reverse the angle to account for the rotation of the magnet
        let angle = -this.angle;

        // Rotate the point back, which essentially unrotates the rectangle area
        let x1 = x * cos(angle) - y * sin(angle);
        let y1 = x * sin(angle) + y * cos(angle);

        // Check if the mouse is within the bounds of the unrotated rectangle
        let isOver = x1 > -40 && x1 < 40 && y1 > -80 && y1 < 0; // Adjusted for correct height bounds

        return isOver;
    }


    setPosition(x, y) {
        this.pos.set(x, y);
    }

    update() {
        this.draw();
    }

    getLeftBounds(flip) {
        if (flip) {
            return this.getRightBounds(false);
        }
        let bounds = [];
        bounds.push(createVector(-40, -80));
        bounds.push(createVector(-20, -80));
        bounds.push(createVector(-20, -40));
        for (let i = 180; i >= 90; i -= 10) {
            let x = 20 * cos(radians(i));
            let y = 20 * sin(radians(i));
            bounds.push(createVector(x, y - 40));
        }
        bounds.push(createVector(0, 0));
        for (let i = 90; i <= 180; i += 10) {
            let x = 40 * cos(radians(i));
            let y = 40 * sin(radians(i));
            bounds.push(createVector(x, y - 40));
        }
        return bounds;
    }

    getRightBounds(flip) {
        if (flip) {
            return this.getLeftBounds(false);
        }
        let bounds = [];
        bounds.push(createVector(40, -80));
        bounds.push(createVector(20, -80));
        bounds.push(createVector(20, -40));
        for (let i = 0; i <= 90; i += 10) {
            let x = 20 * cos(radians(i));
            let y = 20 * sin(radians(i));
            bounds.push(createVector(x, y - 40));
        }
        bounds.push(createVector(0, 0));
        for (let i = 90; i >= 0; i -= 10) {
            let x = 40 * cos(radians(i));
            let y = 40 * sin(radians(i));
            bounds.push(createVector(x, y - 40));
        }
        return bounds;
    }

    draw() {
        /**
         *     x xx x    x xx x
         *     x    x    x    x
         *     x    x    x    x
         *     x     xxxx     x
         *      x            x
         *       x x x x x x 
         */
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.angle);
        scale(this.flipped ? -1 : 1, 1);
        fill(255, 0, 0);
        stroke(0);
        strokeWeight(2);

        // Left side
        beginShape();
        for (let v of this.getLeftBounds(false)) {
            vertex(v.x, v.y);
        }
        endShape(CLOSE);

        // Right side
        fill(0, 0, 255);
        beginShape();
        for (let v of this.getRightBounds(false)) {
            vertex(v.x, v.y);
        }
        endShape(CLOSE);
        noFill();
        // rectMode(CENTER);
        // rect(0, -40, 80, 80);
        pop();

        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.angle);
        fill(255);
        textSize(16);
        text('N', -30 * (this.flipped ? -1 : 1) - 5, -60);
        text('S', 30 * (this.flipped ? -1 : 1) - 5, -60);
        pop();
    }

    getFieldAtPoint(px, py) {
        let northPole = createVector(-30 * (this.flipped ? -1 : 1), -60).rotate(this.angle).add(this.pos);
        let southPole = createVector(30 * (this.flipped ? -1 : 1), -60).rotate(this.angle).add(this.pos);
        let point = createVector(px, py);

        let toNorth = p5.Vector.sub(point, northPole);
        let toSouth = p5.Vector.sub(point, southPole);

        // Calculate field vector from north pole (assuming it behaves like a positive monopole)
        let fieldNorth = p5.Vector.div(toNorth, pow(toNorth.mag(), 3)).mult(this.strength);

        // Calculate field vector from south pole (assuming it behaves like a negative monopole)
        let fieldSouth = p5.Vector.div(toSouth, pow(toSouth.mag(), 3)).mult(-this.strength);

        // Superpose fields from both poles
        return p5.Vector.add(fieldNorth, fieldSouth);
    }
}