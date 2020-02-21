import Element from './Element.js';
import Bullet from './Bullet.js';

class Aircraft extends Element{
    constructor(game){
        super('#aircraft', 0);
        this.game = game;
        this.x = 0;
        this.y = 400;
        this.ax = this.ay = 0;
        this.toX = 0;
        this.toY = 400;
        this.speed = 1.5;
        this.friction = 1.2;
    }
    /* move aircraft */
    move(x,y){
        if(this.game.allowInteractive()){
            this.toX = x - (this.width / 2);
            this.toY = y - (this.height / 2);
        }
    }
    shoot(){
        if(this.game.allowInteractive())
            this.game.elements.push(new Bullet(this.game, this.x + this.width, this.y + (this.height/2)));
    }
}
export default Aircraft;