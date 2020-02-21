import Element from './Element.js';
class Asteroid extends Element{
    constructor() {
        super(`<div class="asteroid"></div>`);
        this.x = 1700;
        this.y = Math.floor(Math.random() * 900 + 100);
        this.element.data('heath', 2);
        this.speedX = -3.5;
        this.heath = 2;
        this.score = 10;
    }
}
export default Asteroid;