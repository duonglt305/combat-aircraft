import Element from './Element.js';

class Score extends Element{
    constructor(x, y, score) {
        let color = score < 0 ? 'red' : 0;
        let sign = score < 0 ? '' : '+';
        super(`<div class="score ${color}">${sign}${score}</div>`);
        this.x = x;
        this.y = y;
        this.speedY = -2;
        this.speedX = 1;
    }
}
export default Score;