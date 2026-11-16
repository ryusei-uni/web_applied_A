const CONFIG = {
    GRAVITY:1160,
    JUMP_SPEED:560,
    MOVE_SPEED:200,
    MAX_JUMPS:2,
    FALL_GRAVITY_RATE:2,
    HIP_DROP_RATE :5
};



const player = {x:80,y:20,w:32,h:32,vy:0,vx:0,isGrounded:false,jumpsLeft:CONFIG.MAX_JUMPS,isDamage:false,isAttack:false,state:"idle"};






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


function aabb(a,b){
    return  a.x < b.x + b.w &&
            a.x + a.w > b.x &&
            a.y < b.y + b.h &&
            a.y + a.h > b.y ;
           
}

function ResetJumpMax(){
    if (player.isGrounded){
        player.jumpsLeft = CONFIG.MAX_JUMPS;
    }
}

function canvaswall(){
    if(player.x < 0){
        player.x = 0;
        player.vx = 0;
    }
    if(player.x > canvas.width - player.w){
        player.x = canvas.width - player.w
        player.vx = 0;
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
    ctx.fillStyle = player.isGrounded ? "#7ef5e1" : "#ffd166";
    ctx.fillRect(player.x,player.y,player.w,player.h);

    ctx.fillStyle = "#e8eeff";
  ctx.font = "14px monospace";
  ctx.fillText("vy = " + player.vy.toFixed(0) + "   jumpsLeft = " + player.jumpsLeft + " isDamage = " + player.isDamage , 10, 20);
   ctx.fillStyle = "#e8eeff";
    ctx.font = "20px monospace";
    // ctx.fillText("vy = " + player.vy.toFixed(0) + "   jumpsLeft = " + player.jumpsLeft + "     FALL_RETA = "+ CONFIG.FALL_GRAVITY_RATE, 10, 40);
}

function playerDamage(enemy,player){
    if(enemy.isAttack && enemy.isCrash){
        player.isDamage = true;
    }else{

        player.isDamage = false;
    }
}

function updataPlayer(dt,enemy){
    const prevBottom = player.y + player.h;
    const g = player.vy > 0 ? CONFIG.GRAVITY * CONFIG.FALL_GRAVITY_RATE : CONFIG.GRAVITY;
    player.vy = player.vy + g * dt;
    // player.vy += GRAVITY*dt;
    player.y += player.vy*dt;


    
    ctrl(dt);

    playerDamage(enemy,player);

    canvaswall();

    collideWithFloor(player,floor);

    collideWithplatform(prevBottom);

    ResetJumpMax();
}