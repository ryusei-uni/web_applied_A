const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");



const CONFIG = {
    GRAVITY:1160,
    JUMP_SPEED:560,
    MOVE_SPEED:200,
    MAX_JUMPS:2,
    FALL_GRAVITY_RATE:2,
    HIP_DROP_RATE :5
};

const BOUNCE = 0.45;
const STOP_SPEED = 250;
const FRICTION = 0.88;


const TARGET_HEIGHT = 64;

const player = {x:80,y:20,w:32,h:32,vy:0,vx:0,isGrounded:false,jumpsLeft:CONFIG.MAX_JUMPS};

const enemys = [];

const enemy = {};

const floor = {x:0,y:320,w:640,h:40};

const plat = {x:300,y:230,w:160,h:16};

const keys ={};

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

    }else{
         CONFIG.FALL_GRAVITY_RATE = 2;
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

function collideWithFloor(){
    if(player.y + player.h > floor.y){
        player.y = floor.y - player.h;
        if(player.vy > STOP_SPEED){
            player.vy = -player.vy * BOUNCE;
            player.isGrounded = false;
        }else{
            player.vy = 0;
            player.isGrounded = true;
            
        }
    }else{
        player.isGrounded = false;
    }
}

function collideWithplatform(prevBottom){
    if(aabb(player,plat) && prevBottom <= plat.y && player.vy >=0){
        player.y = plat.y - player.h;
        player.vy = 0;
        player.isGrounded =true;
    }

    //  if(aabb(player,plat)){
    //     player.y = plat.y - player.h;
    //     player.vy = 0;
    //     player.isGrounded =true;
    // }
}


function update(dt){
    const prevBottom = player.y + player.h;
    const g = player.vy > 0 ? CONFIG.GRAVITY * CONFIG.FALL_GRAVITY_RATE : CONFIG.GRAVITY;
    player.vy = player.vy + g * dt;
    // player.vy += GRAVITY*dt;
    player.y += player.vy*dt;
    ctrl(dt);
    canvaswall();
    collideWithFloor();
    collideWithplatform(prevBottom);
    ResetJumpMax();

}

function draw(){

    ctx.clearRect(0, 0,  canvas.width, canvas.height);

    // ctx.fillStyle = "#7ef5e1";
     ctx.fillStyle = player.isGrounded ? "#7ef5e1" : "#ffd166";
    ctx.fillRect(player.x,player.y,player.w,player.h);

    ctx.fillStyle = "#e8eeff";
    ctx.font = "20px monospace";
    ctx.fillText("vy = " + player.vy.toFixed(0) + "   jumpsLeft = " + player.jumpsLeft + "     FALL_RETA = "+ CONFIG.FALL_GRAVITY_RATE, 10, 20);

    // 目印の線（跳んだ高さをくらべる）
    ctx.fillStyle = "#ff6b6b";
      ctx.fillRect(0, floor.y - TARGET_HEIGHT, canvas.width, 2);


    ctx.fillStyle = "#203060";
    ctx.fillRect(floor.x, floor.y, floor.w, floor.h);

    ctx.fillStyle = "#2e446e";
    ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
}

let last = performance.now();

function loop(now){
    const dt = Math.min((now - last) / 1000, 0.033);

    last = now;
    update(dt);
    draw();
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

/*
  
*/