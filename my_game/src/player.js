const CONFIG = {
    GRAVITY:1160,
    JUMP_SPEED:560,
    MOVE_SPEED:200,
    MAX_JUMPS:2,
    FALL_GRAVITY_RATE:2,
    HIP_DROP_RATE :5,
    MAX_HP:3,
    HIT_TIME:1
};

const playerImg = new Image();
playerImg.src = "img/7-3_bird.png";
const FRAME_SIZE = 32;
const FRAME_TIME = 0.12;

const ANIMS = {
  idle: { row: 0, count: 2 },
  run:  { row: 1, count: 4 },
  jump: { row: 2, count: 2 },
  fall: { row: 3, count: 2 },
};

const STATE_COLORS = { idle: "#7ef5e1", run: "#6dd3ff", jump: "#ffd166", fall: "#ff9999" };

const player = {x:80,y:20,w:32,h:32,vy:0,vx:0,hp:CONFIG.MAX_HP,hittimer:0,isGrounded:false,jumpsLeft:CONFIG.MAX_JUMPS,state:"idle", frameIndex: 0, frameTimer: 0,facing:1 };






const keys = {};

document.addEventListener("keydown",(e)=>{
     e.preventDefault();
    
    keys[e.code] = true;
    
    if(e.code === "Space" && player.jumpsLeft > 0){
        player.vy = -CONFIG.JUMP_SPEED;
        player.jumpsLeft -= 1;
    }
    
    // if(e.code === "Space" ){
    //     player.vy = -JUMP_SPEED;
    // }
});

document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

function decidestate(){
    if(!player.isGrounded){
        if(player.vy < 0){
            return "jump";
        }
        return "fall";
    }
    if(player.vx !== 0){
        return "run";
    }
    return "idle";
}

function ctrl(dt){
    if(keys["ArrowRight"]){
        player.vx = CONFIG.MOVE_SPEED;
    }
    else if(keys["ArrowLeft"]){
        player.vx = -CONFIG.MOVE_SPEED ;
    }
     else if(player.isGrounded){
         player.vx *=  FRICTION ** (dt * 60);
    }

    if(keys["ArrowDown"]){
        CONFIG.FALL_GRAVITY_RATE = CONFIG.HIP_DROP_RATE;
        player.isAttack = true;
    }else{
        CONFIG.FALL_GRAVITY_RATE = 2;
        player.isAttack = false;
    }
    player.x += player.vx * dt;
}



function ResetJumpMax(){
    if (player.isGrounded){
        player.jumpsLeft = CONFIG.MAX_JUMPS;
    }
}

function canvaswall(object){
    if(object.x < 0){
        object.x = 0;
        object.vx = 0;
    }
    if(object.x > canvas.width - object.w){
        object.x = canvas.width - object.w
        object.vx = 0;
    }
}

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

function collideWithplatform(prevBottom){
    if(aabb(player,plat) && prevBottom <= plat.y && player.vy >=0){
        player.y = plat.y - player.h;
        player.vy = 0;
        player.isGrounded =true;
    }
}

function drawPlayer(){
    // ctx.fillStyle = player.isGrounded ? "#7ef5e1" : "#ffd166";
    // ctx.fillStyle = STATE_COLORS[player.state];
    // ctx.fillRect(player.x,player.y,player.w,player.h);
    if(player.hittimer > 0){
        ctx.globalAlpha = 0.4;
    }
    
    const sx = player.frameIndex * FRAME_SIZE;
    const sy = ANIMS[player.state].row * FRAME_SIZE;

    ctx.save();
    ctx.translate(player.x + player.w /2,player.y + player.h/2);
    ctx.scale(player.facing,1);
    ctx.drawImage(playerImg,sx,sy,FRAME_SIZE,FRAME_SIZE,-player.w / 2,-player.h / 2,player.w,player.h);
    ctx.restore();

    ctx.globalAlpha = 1;

    ctx.fillStyle = "#e8eeff";
  ctx.font = "14px monospace";
  ctx.fillText("vy = " + player.vy.toFixed(0) + "   jumpsLeft = " + player.jumpsLeft + " vx = "+ player.vx, 10, 20);
  ctx.fillText("vy = " + player.vy.toFixed(0) + "   jumpsLeft = " + player.jumpsLeft + "   state = " + player.state, 10, 40);
  ctx.fillText("vy = " + player.vy.toFixed(0) + "   jumpsLeft = " + player.jumpsLeft + "   state = " + player.state + "   frameIndex = " + player.frameIndex + "  hp = " + player.hp + "  hittimer = " + player.hittimer, 10, 60);
   ctx.fillStyle = "#e8eeff";
    ctx.font = "20px monospace";
    // ctx.fillText("vy = " + player.vy.toFixed(0) + "   jumpsLeft = " + player.jumpsLeft + "     FALL_RETA = "+ CONFIG.FALL_GRAVITY_RATE, 10, 40);
}


function updataPlayer(dt){
    const prevBottom = player.y + player.h;
    const g = player.vy > 0 ? CONFIG.GRAVITY * CONFIG.FALL_GRAVITY_RATE : CONFIG.GRAVITY;
    player.vy = player.vy + g * dt;
    // player.vy += GRAVITY*dt;
    player.y += player.vy*dt;

    const newState = decidestate();

    if(newState !== player.state){
        player.state = newState;
        player.frameIndex = 0;
        player.frameTimer = 0;
    }
   
    player.frameTimer += dt;
    if(player.frameTimer >= FRAME_TIME){
        player.frameIndex = (player.frameIndex + 1) % ANIMS[player.state].count;
        player.frameTimer = 0;
    }
    
    if(player.hittimer > 0){
        player.hittimer -= dt;
    }

    if(player.vx > 0){
        player.facing = 1;
    }

    if(player.vx < 0){
        player.facing = -1;
    }

    //  player.facing = player.vx > 0 ? 1 : -1;

     
    ctrl(dt);

   

    canvaswall(player);

    collideWithFloor(player,floor);

    collideWithplatform(prevBottom);

    ResetJumpMax();
}

/*


*/