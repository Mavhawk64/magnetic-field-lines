// magnet.js
class Magnet {
    constructor(x, y, strength, north_vector) {
        this.x = x;
        this.y = y;
        this.strength = strength;
        this.north_vector = north_vector;
        // normalize the north vector
        this.north_vector.normalize();
    }
}