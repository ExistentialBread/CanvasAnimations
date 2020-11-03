
import { Particle } from "./particle.js";

export class Rain extends Particle {

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