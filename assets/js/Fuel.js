import Element from './Element.js';
class Fuel extends Element{
    constructor(game) {
        super(`<div class="fuel"></div>`);
        this.game = game;
        this.x = Math.floor(Math.random() * (1600 - this.width)) + 100;
        this.y = -100;
        this.speedY = 2;
        this.fuel = 10;
    }

}
export default Fuel;