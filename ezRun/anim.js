class Particle {


    constructor(x, y, size, veloX, veloY, airResistanceFactor = 1) {
        this.x = x;
        this.y = y;
        this.veloX = veloX;
        this.veloY = veloY * airResistanceFactor;
        this.size = size;

        this.airResistanceFactor = airResistanceFactor;
        
        this.xSwayDir = -1;
        this.xSwayMomentum = 0;
        this.ySwayDir = -1;
        this.ySwayMomentum = 0;
    }

    //Resets all the variables in this particle 
    reset(x, y, size, veloX = 0, veloY = 0) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.veloX = veloX;
        this.veloY = veloY * this.airResistanceFactor;

        this.xSwayDir = -1;
        this.xSwayMomentum = 0;
        this.ySwayDir = -1;
        this.ySwayMomentum = 0;
    }

    //Increases the velocity variables
    accelerate(deltaX, deltaY) {
        this.veloX = this.veloX + delta;
        this.veloY = this.veloY + deltaY - (this.veloX * this.airResistanceFactor);
    }

    /*Adds a small change in in the horizontal movement of the particle. 
     *  Tracks "momentum" of the particle (not physics momentum)
     *   pNotFlip is the probably that the particle will begin swaying in the opposite direction
     *   maxMonentum is largest absolute value of momentum the particle can have
     *   delta is the maximum change in momentum in one function call
     */
    swayX(pNotFlip, maxMomentum, delta) {
        if (Math.random() > pNotFlip)
            this.xSwayDir *= -1;

        this.xSwayMomentum += this.xSwayDir * Math.random() * delta;
        if (Math.abs(this.xSwayMomentum) > maxMomentum)
            this.xSwayMomentum = Math.sign(this.xSwayMomentum) * maxMomentum;
        this.x += this.xSwayMomentum;
    }

    /*Adds a small change in in the vertical movement of the particle. 
     *  Tracks "momentum" of the particle (not physics momentum)
     *   pNotFlip is the probably that the particle will begin swaying in the opposite direction
     *   maxMonentum is largest absolute value of momentum the particle can have
     *   delta is the maximum change in momentum in one function call
     */
    swayY(pNotFlip, maxMomentum, delta) {
        if (Math.random() > pNotFlip)
            this.ySwayDir *= -1;

        this.ySwayMomentum += this.ySwayDir * Math.random() * delta;
        if (Math.abs(this.ySwayMomentum) > maxMomentum)
            this.ySwayMomentum = Math.sign(this.ySwayMomentum) * maxMomentum;
        this.y += this.ySwayMomentum;
    }

}


class Snow extends Particle {

    constructor(x, y, rad, veloX = 0, veloY = 0) {
        super(x, y, rad, veloX, veloY, .45);
    }

    draw(context) {
        this.sway();

        context.save();
        this.drawHelper(context);

        let particle = new Path2D();
        particle.moveTo(this.x, this.y);
        particle.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.x += this.veloX;
        this.y += this.veloY;

        context.fill(particle);
        context.restore();
    }

    drawHelper(context) {
        let radialGradOffSet = this.size/3;
        let snowGrad = context.createRadialGradient(this.x, this.y, radialGradOffSet, this.x, this.y, this.size);
        snowGrad.addColorStop(.5, "rgb(255, 250, 250, .8)");
        snowGrad.addColorStop(.8, "rgb(255, 250, 250, .4)");
        snowGrad.addColorStop(1, "rgba(224, 255, 255, 0)");
    

        context.beginPath();
        context.fillStyle = snowGrad;
    }

    sway() {
        super.swayX(.85, .75, .02);
        super.swayY(.85, .3, .01);
    }

}


class Rain extends Particle {

    constructor(x, y, len, veloX = 0, veloY = 0) {
        super(x, y, len, veloX, veloY);

        this.swayMomentum = 0;
        this.swayDir = -1;
    }

    getRotationAngle() {
        let hyp = Math.sqrt(Math.pow(this.veloX, 2) + Math.pow(this.veloY, 2));
        return -(Math.PI/2 - Math.acos(this.veloX/hyp));
    }

    draw(context) {
        this.sway();

        context.save();
        this.drawHelper(context);
        
        let particle = new Path2D();
        particle.moveTo(this.x, this.y);
        particle.lineTo(this.x, this.y + this.size);    
        this.x += this.veloX;
        this.y += this.veloY;
        
        context.stroke(particle);
        context.restore();
    }

    drawHelper(context) {
        let angle = this.getRotationAngle();

        context.beginPath();
        context.strokeStyle = "rgb(175, 195, 204, .75)";
        context.translate(this.x, this.y + this.size/2);
        context.rotate(angle);  
        context.translate(-(this.x), -(this.y + this.size/2));
    }

    sway() {
        super.swayX(.3, .25, .1);
        super.swayY(.3, .25, .1);
    }

}


const canvas = document.getElementById("canvas");
const Y_MAX = canvas.height;
const Y_MIN = -(canvas.height + 100);
const X_MAX = canvas.width + 50;
const X_MIN = -50;

const numParticles = 650;
const snowRadRange = 7;
const rainLenRange = 10;
const minSnowRad = 3;
const minRainLen = 5;

//Intializes all particles and starts the animation
function init() {
    particles = [];
    switch (setting) {
        case "rain":
            particle = Rain;
            minSize = minRainLen;
            sizeRange = rainLenRange;
            break;
        case "snow":
            particle = Snow;
            minSize = minSnowRad;
            sizeRange = snowRadRange;
            break;
        default:
            alert("Error: Unrecognized particle setting");
    }

    for (let i = 0; i < numParticles; i++) {
        addNewParticle();
    }

    anim = window.requestAnimationFrame(precipitate);
}

//Resets a particle p as if were a new particle
function resetParticle(p) {
    let x;
    let y;

    let pos = Math.random();
    if (pos < .2) {
        x = Math.random() * X_MIN;
        y = Math.random() * (Y_MAX - Y_MIN) + Y_MIN;
    } 
    else if (pos < .4) {
        x = Math.random() * (X_MAX - canvas.width) + canvas.width;
        y = Math.random() * (Y_MAX - Y_MIN) + Y_MIN;
    }
    else {
        x = (Math.random() * (canvas.width - X_MIN)) + X_MIN;
        y = Math.random() * Y_MIN;
    }
    let size = Math.random() * sizeRange + minSize;
    let xVelo = wind;
    let yVelo = Math.random() * .3 + 5;

    p.reset(x, y, size, xVelo, yVelo);
}

//Adds a new particle to the animation
function addNewParticle() {
    let x = Math.random() * (X_MAX - X_MIN) + X_MIN;
    let y = Math.random() * (Y_MAX - Y_MIN) + Y_MIN;
    let size = Math.random() * sizeRange + minSize;
    let xVelo = wind;
    let yVelo = Math.random() * .3 + 5;

    particles.push(new particle(x, y, size, xVelo, yVelo));
}

//Updates the position of all particles and resets them if they're off screen
function precipitate() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        if (p.y < Y_MIN || p.y > Y_MAX || p.x < X_MIN || p.x > X_MAX) {
            resetParticle(p);
        }
        if (p.veloX != wind) {
            p.veloX += Math.sign(wind - p.veloX);
        }

        p.draw(context);
    });
    anim = window.requestAnimationFrame(precipitate);
}


let context = canvas.getContext("2d");
let setting = "rain";
let wind = 0;
let anim;
document.getElementById(setting).classList.add("active");

let particles = [];
let particle;
let minSize;
let sizeRange;

init();

//Changes the animation based on option that was clicked
document.querySelectorAll(".list-group-item").forEach(el => {
    el.addEventListener("click", function() {
        let current = document.getElementsByClassName("active").item(0);
        if (current)
            current.classList.remove("active");
        el.classList.add("active");
        setting = el.id;
        window.cancelAnimationFrame(anim);
        document.getElementById("playToggle").innerText = "Pause";
        init();
    })
})

//Pauses/plays animation on button click
document.getElementById("playToggle").addEventListener("click", (e) => {
    if (e.target.innerText == "Pause") {
        window.cancelAnimationFrame(anim);
        e.target.innerText = "Play";
    } 
    else {
        anim = window.requestAnimationFrame(precipitate);
        e.target.innerText = "Pause";
    }
});

//Adjusts windspeed based on slider value
document.getElementById("windSlider").addEventListener("change", 
    (e) => wind = parseInt(e.target.value));
