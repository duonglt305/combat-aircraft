import Aircraft from './Aircraft.js';
import Cent from './Cent.js';
import Enemy from './Enemy.js';
import Friend from './Friend.js';
import Fuel from './Fuel.js';
import Score from './Score.js';
import Asteroid from './Asteroid.js';

class Game {
    /**/
    constructor() {
        this.muted = 0;
        this.started = 0;
        this.paused = 0;
        this.over = 0;

        this.onShoot = 0;
        this.onInvisible = 0;

        this.timer = 0;
        this.score = 0;
        this.fuel = 20;
        this.volume = 1;
        this.fontSize = 1.5;

        this.handles = {};
        this.elements = [];
        this.removes = [];
        this.sounds = {
            bg: new Audio('assets/sounds/background.mp3'),
            boom: new Audio('assets/sounds/boom.mp3'),
            destroyed: new Audio('assets/sounds/destroyed.mp3'),
            shoot: new Audio('assets/sounds/shoot.mp3'),
            invisible: new Audio('assets/sounds/invisible.mp3'),
            over: new Audio('assets/sounds/game_over.mp3'),
            cent: new Audio('assets/sounds/star.mp3'),
        };
        this.sounds.bg.loop = true;
        this.sounds.invisible.loop = true;

        this.aircraft = new Aircraft(this);
        this.eventListener();
    }

    /* allow interactive user*/
    allowInteractive() {
        return (this.started && !this.paused && !this.over);
    }

    /* play sound on game */
    playSound(key) {
        if (!this.muted) {
            this.sounds[key].currentTime = 0;
            this.sounds[key].play();
        }
    }

    /* bind muted */
    bindMuted() {
        this.muted = !this.muted;
        if (this.muted) this.setVolume(0);
        else this.setVolume(this.volume);
    }

    setVolume(volume) {
        for (let key in this.sounds) {
            this.sounds[key].volume = volume;
        }
    }

    /* event listener */
    eventListener() {
        /* aircraft shoot */
        $(document).on('keydown', (e) => {
            if (this.allowInteractive()) {
                if (e.keyCode === 32 && !this.onShoot) {
                    e.preventDefault();
                    this.onShoot = !0;
                    this.aircraft.shoot();
                    this.playSound('shoot');
                }
            }
            if (!this.over && this.started) {
                /* pause game 80 = P */
                if (e.ctrlKey && e.keyCode === 80) {
                    e.preventDefault();
                    this.paused = !this.paused;
                    if (this.paused) {
                        $('#game-area').addClass('paused');
                        this.setVolume(0);
                    } else {
                        $('#game-area').removeClass('paused');
                        if(!this.muted) this.setVolume(1);
                    }
                }
                if(!this.paused){

                    /* muted 77 = M */
                    if(e.ctrlKey && e.keyCode === 77){
                        e.preventDefault();
                        this.bindMuted();
                    }

                    /* font size down */
                    if(e.ctrlKey && e.keyCode === 189){
                        e.preventDefault();
                        this.fontSize -= 0.1;
                        if(this.fontSize * 10 <= 10) this.fontSize = 1;
                        this.bindFontSize();
                    }

                    /* font size up */
                    if(e.ctrlKey && e.keyCode === 187){
                        e.preventDefault();
                        this.fontSize += 0.1;
                        if(this.fontSize * 10 >= 20) this.fontSize = 2;
                        this.bindFontSize();
                    }
                }
            }
        }).on('keyup', (e) => {
            if (e.keyCode === 32) {
                this.onShoot = 0;
            }
        });

        /* control aircraft */
        $('.container').on('mousemove', (e) => {
            this.aircraft.move(e.offsetX, e.offsetY);
        });


        /* start game */
        $('#start').on('click', () => this.start());

        $('input#name').on('input',(e)=>{
            $('.btn-continue').attr('disabled',$(e.target).val().trim().length === 0);
        });

        $('.btn-continue').click((e)=>{
            $('#over').removeClass('active');
            let name = $('input#name').val();
            $('#rank tbody').html(this.sort(name));
            $('#rank').addClass('active');
        });

        $('.btn-restart').click( (e) => {
            location.reload()
        });

    }
    
    sort(name){
        let data = localStorage.rank = localStorage.rank ? JSON.parse(localStorage.rank) : [];
        data.push({name: name, score: this.score, time: this.timer });
        localStorage.rank = JSON.stringify(data);
        data.sort(function(a,b){
            if(a.score > b.score) return -1;
            else if(a.score < b.score) return 1;
            else return a.time - b.time;
        });
        let step = 0, rank = 1, row = '';
        for (let i = 0; i < data.length; i++) {
            if(i > 0 && ((data[i].time !== data[i-1].time) || (data[i].score !== data[i-1].score))){
                rank += step;
                step = 1;
            }else{
                step++;
            }
            row += `<tr><td>${rank}</td><td>${data[i].name}</td><td>${data[i].score}</td><td>${data[i].time}</td></tr>`
        }
        return row;
    }
    /* update element on game */
    update() {
        if (this.allowInteractive()) {
            this.aircraft.update(1);
            /* update all element */
            this.updateElement();
            this.detectCollision();
            this.removeElements();
            this.gameOver();
        }
        this.bindData();
        requestAnimationFrame(this.update.bind(this));
    }

    /* update all element */
    updateElement() {
        this.elements.map((object, index) => {
            object.update();
            /* remove element outside game area */
            if ((object.speedX > 0 && object.x + object.width > 1600) ||
                (object.speedY > 0 && object.y > 900) ||
                (object.speedX < 0 && object.x + object.width < 0) ||
                (object.speedY < 0 && object.y < 0)) {
                this.elements[index].element.remove();
                this.elements.splice(index, 1);
            }
            /* remove element outside game area */
        });
    }

    /* bind data counter */
    bindData() {
        $('#score').text(this.score);
        $('#timers').text(this.timer);
        $('#fuels').text(this.fuel);
        $('.fill').css({
            width: `${this.fuel * 100 / 40}%`,
        });
    }

    /* bind font-size */
    bindFontSize(){
        $('.font-control').css({
            fontSize: `${this.fontSize}em`,
        })
    }

    /* update fuel */
    updateFuelCounter() {
        this.handles.fuelCounter = setTimeout(() => {
            clearTimeout(this.handles.fuelCounter);
            if (this.allowInteractive())
                this.fuel--;
            this.updateFuelCounter();
        }, 1000);
    }

    /* update timer */
    updateTimeCounter() {
        this.handles.timeCounter = setTimeout(() => {
            clearTimeout(this.handles.timeCounter);
            if (this.allowInteractive()) {
                this.timer++;
            }
            this.updateTimeCounter();
        }, 1000);
    }

    /* generate cent */
    generateCent() {
        this.handles.cent = setTimeout(() => {
            clearTimeout(this.handles.cent);
            if (this.allowInteractive())
                this.elements.push(new Cent(this));
            this.generateCent();
        }, Math.floor(Math.random() * 2500) + 1000);
    }

    /* auto generate enemy ship */
    generateEnemy() {
        this.handles.enemy = setTimeout(() => {
            clearTimeout(this.handles.enemy);
            if (this.allowInteractive())
                this.elements.push(new Enemy(this));
            this.generateEnemy();
        }, Math.floor(Math.random() * 2500) + 1500)
    }

    /* auto generate friend ship */
    generateFriend() {
        this.handles.friend = setTimeout(() => {
            clearTimeout(this.handles.friend);
            if (this.allowInteractive())
                this.elements.push(new Friend(this));
            this.generateFriend();
        }, Math.floor(Math.random() * 2500) + 1500);
    }

    /* auto generate fuel */
    generateFuel() {
        this.handles.fuel = setTimeout(() => {
            clearTimeout(this.handles.fuel);
            if (this.allowInteractive())
                this.elements.push(new Fuel(this));
            this.generateFuel();
        }, Math.floor(Math.random() * 2500) + 2000);
    }

    generateAsteroid(){
        this.handles.asteroid = setTimeout(()=>{
            clearTimeout(this.handles.asteroid);
            if(this.allowInteractive())
                this.elements.push(new Asteroid(this));
            this.generateAsteroid();
        }, Math.floor(Math.random() * 2500) + 1500);
    }

    /* auto generate all element */
    generateAllElement() {
        this.generateCent();
        this.generateEnemy();
        this.generateFriend();
        this.generateFuel();
        this.generateAsteroid();
    }

    /* detect collision element  */
    detectCollision() {
        this.elements.map((fItem, i) => {
            /* check collision all element vs aircraft */
            if (this.aircraft.collision(fItem)) {
                switch (fItem.constructor.name) {
                    case 'Fuel': {
                        this.removes.push(i);
                        this.fuel += fItem.fuel;
                        if (this.fuel >= 40) this.fuel = 40;
                        this.playSound('cent');
                        break;
                    }
                    case 'Cent': {
                        this.removes.push(i);
                        this.elements.push(new Score(fItem.x, fItem.y, fItem.score));
                        this.score += fItem.score;
                        this.playSound('cent');
                        break;
                    }
                    case 'Enemy': {
                        this.removes.push(i);
                        this.elements.push(new Score(fItem.x, fItem.y, -10));
                        this.fuel += -10;
                        this.playSound('destroyed');
                        this.animatedRedLayer();
                        break;
                    }
                    case 'Friend': {
                        this.removes.push(i);
                        this.elements.push(new Score(fItem.x, fItem.y, -5));
                        this.fuel += -5;
                        this.playSound('destroyed');
                        this.animatedRedLayer();
                        break;
                    }
                    case 'Bullet': {
                        if (fItem.speedX < 0) {
                            this.removes.push(i);
                            this.fuel += -5;
                            this.animatedRedLayer();
                        }
                        break;
                    }
                    case 'Asteroid':{
                        this.removes.push(i);
                        this.elements.push(new Score(fItem.x, fItem.y, -10));
                        this.fuel += -10;
                        this.playSound('destroyed');                        
                        this.animatedRedLayer();
                        break;
                    }
                }
            }
            this.elements.map((sItem, j) => {
                if (fItem.collision(sItem) && i !== j && fItem.constructor.name === 'Bullet') {
                    if (fItem.speedX > 0) {
                        switch (sItem.constructor.name) {
                            case 'Enemy': {
                                this.removes.push(i);
                                this.removes.push(j);
                                this.elements.push(new Score(sItem.x, sItem.y, sItem.score));
                                this.score += sItem.score;
                                this.playSound('destroyed');
                                break;
                            }
                            case 'Friend': {
                                this.removes.push(i);
                                this.removes.push(j);
                                this.elements.push(new Score(sItem.x, sItem.y, sItem.score));
                                this.score += sItem.score;
                                this.playSound('destroyed');
                                break;
                            }
                            case 'Asteroid':{
                                if(sItem.heath === 1 && parseInt(sItem.element.data('heath')) === 1){
                                    this.removes.push(i);
                                    this.removes.push(j);
                                    this.elements.push(new Score(sItem.x, sItem.y, sItem.score))
                                    this.score += sItem.score;
                                    this.playSound('destroyed');
                                }else{
                                    sItem.heath = 1;
                                    sItem.element.data('heath', 1);
                                    sItem.element.addClass('shooted');
                                    this.removes.push(i);
                                }
                                break;
                            }
                        }
                    }
                }
            })
        });
    }

    /* remove elements */
    removeElements() {
        for (let i = 0; i < this.removes.length; i++) {
            let indexItem = this.removes[i];
            this.elements[indexItem].element.remove();
            clearTimeout(this.elements[indexItem].timeOut);
            this.elements.splice(indexItem, 1);
        }
        this.removes = [];
    }

    /* animation red layer */
    animatedRedLayer() {
        let redLayer = $('.red-layer');
        redLayer.addClass('active');
        this.handles.redLayer = setTimeout(() => {
            clearTimeout(this.handles.redLayer);
            if (redLayer.hasClass('active')) redLayer.removeClass('active');
        }, 500);
    }

    /* start game */
    start() {
        this.started = !0;
        this.playSound('bg');
        this.generateAllElement();
        $("#ready").removeClass('active');
        $("#game-area").addClass('active').removeClass('paused');
        this.updateTimeCounter();
        this.updateFuelCounter();
        this.update();
    }

    /* game over */
    gameOver() {
        if (this.fuel <= 0) {
            this.fuel = 0;
            this.over = !0;
            $('#game-area').addClass('paused').removeClass('active');
            $('#over').addClass('active');
            this.setVolume(0);
        }
    }
}

(() => {
    const game = new Game();
})();