import Element from './Element.js'
class Friend extends Element{
    constructor() {
        super(`<div class="friend"></div>`);
        this.score = -10;
        this.x = 1700;
        this.y = Math.floor(Math.random() * (900 - this.width)) + 100;
        this.speedX = -2;
    }
}
export default Friend;