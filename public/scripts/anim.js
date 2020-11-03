import { Rain } from "./rain.js";
import { Snow } from "./snow.js";

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
