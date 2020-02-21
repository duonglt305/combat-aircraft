class Element{
    constructor(element, isPrepend = 1){
        this.element = $(element);

        this.element.css({
            top: -150,
            left: -150
        });

        if(isPrepend === 1) $('#elements').append(this.element);
        this.width = this.element.width();
        this.height = this.element.height();
        this.x = this.element.position().left;
        this.y = this.element.position().top;
        this.speedX = this.speedY = 0;

    }
    collision(element){
        return (this.x + this.width > element.x &&
                this.y + this.height > element.y &&
                element.x + element.width > this.x &&
                element.y + element.height > this.y);
    }
    update(isAirCraft = 0){
        if(isAirCraft){
            this.ax = (this.toX - this.x) / 200;
            this.ay = (this.toY - this.y) / 200;
            this.speedX = this.speedX + this.ax * this.speed;
            this.speedY = this.speedY + this.ay * this.speed;
        }

        this.x = Math.round(this.x + this.speedX);
        this.y = Math.round(this.y + this.speedY);

        if(isAirCraft){
            this.speedX /= this.friction;
            this.speedY /= this.friction;

            this.x = Math.max(0, Math.min(1600 - this.width, this.x));
            this.y = Math.max(0, Math.min(900 - this.height, this.y));
        }
        this.element.css({
            left: this.x,
            top: this.y
        });
    }
}
export default Element;