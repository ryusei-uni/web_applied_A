const BOUNCE = 0.45;
const STOP_SPEED = 250;
const FRICTION = 0.88;


const TARGET_HEIGHT = 64;

function collideWithFloor(object,palt){
    if(object.y + object.h > palt.y){
        object.y = palt.y - object.h;
        if(object.vy > STOP_SPEED){
            object.vy = -object.vy * BOUNCE;
            object.isGrounded = false;
        }else{
            object.vy = 0;
            object.isGrounded = true;
            
        }
    }else{
        object.isGrounded = false;
    }
}

