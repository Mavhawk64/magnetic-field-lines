/**
 * Magnetic Field Lines
 * by Maverick Berkland.
 * 
 * This is a simple simulation of magnetic field lines
 * for any number of magnets.
 */

let magnets = [];
let draggedMagnet = null;
let scl = 20;
let particles = [];
let flowfield = [];
let cols, rows;
let prevFrameStop = 0;
function setup() {
    createCanvas(800, 800);

    createParticles();

    // for (let i = 0; i < 2; i++) {
    //     magnets.push(new Magnet(random(80, width - 80), random(80, height - 80), random(TWO_PI), random(1, 10) * 0.1, random() > 0.5));
    // }
    magnets.push(new Magnet(400, 200, PI, 1, false));
    magnets.push(new Magnet(400, 600, 0, 1, true));
    background(51);
}

function draw() {
    // background(51);
    drawFieldVecs();
    if (frameCount - prevFrameStop < 40) {
        for (let particle of particles) {
            particle.follow(flowfield);
            particle.update();
            particle.edges();
            particle.show();
        }
    }
    for (let magnet of magnets) {
        magnet.update();
    }
}

function createParticles() {
    particles = [];
    for (let i = 0; i < 200; i++) {
        for (let j = 0; j < 200; j++) {
            particles.push(new Particle(i * 4, j * 4, random() > 0.5));
        }
    }
}

function drawFieldVecs() {
    let spacing = scl; // Space between field lines
    cols = floor(width / spacing);
    rows = floor(height / spacing);
    flowfield = new Array(cols * rows);

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let x = i * spacing;
            let y = j * spacing;
            let totalField = createVector(0, 0);

            for (let magnet of magnets) {
                let field = magnet.getFieldAtPoint(x, y);
                totalField.add(field);
            }

            let old_mag = totalField.mag() * 1e5;
            old_mag = map(old_mag, 0, 1, 0, 255);
            totalField.setMag(spacing / 2); // Normalize vector length for visualization
            push();
            translate(x, y);
            stroke(0, 0, 0, old_mag);
            line(0, 0, totalField.x, totalField.y);
            pop();
            let index = i + j * cols;
            flowfield[index] = totalField;
        }
    }
}

function mousePressed() {
    for (let magnet of magnets) {
        if (magnet.isMouseOver()) {
            draggedMagnet = magnet; // Set the currently dragged magnet
            particles = [];
            break;
        }
    }
}

function mouseDragged() {
    if (draggedMagnet) {
        draggedMagnet.setPosition(mouseX, mouseY);
        background(51);
        draw();
    }
}

function mouseReleased() {
    draggedMagnet = null; // Clear the dragged magnet when the mouse is released
    createParticles();
    prevFrameStop = frameCount;
}