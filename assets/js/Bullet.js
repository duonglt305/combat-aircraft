import Element from './Element.js';

class Bullet extends Element{
    constructor(game, x, y, speedX = 15) {
        let color = speedX < 0 ? 'red' : '';
        super(`<div class="bullet ${color}"></div>`);
        this.game = game;
        this.x = x;
        this.y = y;
        this.speedX = speedX;
    }
}

export default Bullet;