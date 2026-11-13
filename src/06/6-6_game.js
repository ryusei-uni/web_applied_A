const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");

const GRAVITY = 2000;
const JUMP_SPEED = 700;
const MOVE_SPEED = 240;

const MAX_JUMPS = 2;
const FALL_GRAVITY_RATE = 2;

const BOUNCE = 0.45;
const STOP_SPEED = 250;
const FRICTION = 0.88;

const player = {x:80,y:20,w:32,h:32,vy:0,vx:0,isGrounded:false,jumpsLeft:MAX_JUMPS};

const floor = {x:0,y:320,w:640,h:40};

const plat = {x:300,y:230,w:160,h:16};

const keys ={};

document.addEventListener("keydown",(e)=>{
     e.preventDefault();
    
    keys[e.code] = true;
    
    if(e.code === "Space" && player.jumpsLeft > 0){
        player.vy = -JUMP_SPEED;
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
        player.vx = MOVE_SPEED;
    }
    else if(keys["ArrowLeft"]){
        player.vx = -MOVE_SPEED ;
    }
    else if(player.isGrounded){
         player.vx *=  FRICTION ** (dt * 60);
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
        player.jumpsLeft = MAX_JUMPS;
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
    const g = player.vy > 0 ? GRAVITY * FALL_GRAVITY_RATE : GRAVITY;
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
      ctx.fillText("vy = " + player.vy.toFixed(0) + "   jumpsLeft = " + player.jumpsLeft, 10, 20);

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
   ①手順1・2で、現実の式から何を変えたか。2つそれぞれについて、どの行で何を変えたかを説明する
        二段ジャンプと落ちる速度の加速をした
        jumpLeft:MAX_JUMPSでジャンプの回数を指定し。
        地面についたタイミングでジャンプ回数をリセットしている。
        updateの中の[const g = player.vy > 0 ? GRAVITY * FALL_GRAVITY_RATE : GRAVITY;]
        で落ちる速度をFALL_GRAVITY_RETE倍にしているplayer.vyがプラスつまり下へ落ちているときは速度が速くなる。
        
   ②手順3で2つの数を1に戻したとき、どんな動きになったか。それはどの課題の動きと同じか
        ジャンプの回数は一回になり，落ちるスピードと上に向かっているときのスピードが同じになった。
        なのでジャンプは地面にいるタイミング以外でできなくなり，
        左右対称なふんわりとした放物線を描くような着地となった。
        これは二段ジャンプと落下加速の追加前と同じ動きである。
*/