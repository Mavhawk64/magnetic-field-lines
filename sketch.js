/**
 * Magnetic Field Lines
 * by Maverick Berkland.
 * 
 * This is a simple simulation of magnetic field lines
 * for any number of magnets.
 */

let magnets = [];

function setup() {
    createCanvas(400, 400);
    magnets[0] = new BarMagnet(200, 200, 50, 200, 1, createVector(0, -1));
}

function draw() {
    background(220);
    for (let magnet of magnets) {
        magnet.update();
    }
}