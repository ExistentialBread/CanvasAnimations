export class Particle {


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