import Element from './Element.js';
import Bullet from './Bullet.js';
class Enemy extends Element{
    constructor(game){
        super(`<div class="enemy"></div>`);
        this.score = 5;
        this.x = 1800;
        this.y = Math.floor(Math.random() * (900 - this.width)) + 100;
            this.game = game;
        this.speedX = -3;
        this.generateBullet();
        this.timeOut = 0;
    }
    generateBullet(){
        this.timeOut = setTimeout(()=>{
            if(this.game.allowInteractive())
                this.game.elements.push(new Bullet(this.game, this.x, this.y + this.height/2, -14));
            this.generateBullet();
        }, 1000 + Math.floor(Math.random() * 1000));
    }
}
export default Enemy;