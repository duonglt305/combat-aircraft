import Element from './Element.js';

class Cent extends Element {
    constructor(game) {
        super(`<div class="cent"></div>`);
        this.game = game;
        this.x = Math.floor(Math.random() * (1600 - this.width)) + 200;
        this.y = -100;
        this.speedY = 2;
        this.score = 5;
    }
    update(){
        super.update();
    }
}
export default Cent;