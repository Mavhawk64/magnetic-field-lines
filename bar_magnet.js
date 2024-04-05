// bar_magnet.js extends Magnet:
class BarMagnet extends Magnet {
    constructor(x, y, w, h, strength, north_vector) {
        super(x, y, strength, north_vector);
        this.w = w;
        this.h = h;
    }
    draw() {
        push();
        translate(this.x, this.y);
        rectMode(CENTER);
        // Draw the bar magnet
        // based on the vector of the north pole, we can color the magnet
        // red for the north pole, blue for the south pole
        let c1 = color(255, 0, 0);
        let c2 = color(0, 0, 255);
        let nx = 0;
        let ny = 0;
        let sx = 0;
        let sy = 0;
        const m = this.north_vector.y / this.north_vector.x;

        if (this.north_vector.y >= abs(this.h / this.w * (this.north_vector.x - this.w) + this.h) || this.north_vector.y <= -abs(this.h / this.w * (this.north_vector.x + this.w) - this.h)) {
            const sign = this.north_vector.y >= 0 ? 1 : -1;
            ny = this.h / 2 * sign;
            sy = -this.h / 2 * sign;
            // ny - y1 = m(nx - x1)
            // nx = (ny - y1)/m + x1
            nx = sign * ((ny - this.north_vector.y) / m + this.north_vector.x);
            sx = -nx * sign;
        } else {
            const sign = this.north_vector.x >= 0 ? 1 : -1;
            nx = this.w / 2 * sign;
            sx = -this.w / 2 * sign;
            // ny - y1 = m(nx - x1)
            // ny = m(nx - x1) + y1
            ny = m * (nx - this.north_vector.x) + this.north_vector.y;
            sy = -ny;
        }

        let gradient = this.linearGradient(sx, sy, nx, ny, c1, c2);
        drawingContext.fillStyle = gradient;
        rect(0, 0, this.w, this.h);
        pop();
    }
    update() {
        this.draw();
    }

    linearGradient(x, y, x2, y2, c1, c2) {
        let gradient = drawingContext.createLinearGradient(x, y, x2, y2);
        gradient.addColorStop(0, c1);
        gradient.addColorStop(1, c2);
        return gradient;
    }
}