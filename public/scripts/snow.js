import { Particle } from "./particle.js";

export class Snow extends Particle {

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