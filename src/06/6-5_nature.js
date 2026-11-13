const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");

const GRAVITY = 2000;
const JUMP_SPEED = 700;
const MOVE_SPEED = 240;

const BOUNCE = 0.45;
const STOP_SPEED = 250;
const FRICTION = 0.88;

const player = {x:80,y:20,w:32,h:32,vy:0,vx:0,isGrounded:false};

const floor = {x:0,y:320,w:640,h:40};

const plat = {x:300,y:230,w:160,h:16};

const keys ={};

document.addEventListener("keydown",(e)=>{
     e.preventDefault();
    
    keys[e.code] = true;
    
    if(e.code === "Space" && player.isGrounded){
        player.vy = -JUMP_SPEED;
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
    player.vy += GRAVITY*dt;
    player.y += player.vy*dt;
    ctrl(dt);
    canvaswall();
    collideWithFloor();
    collideWithplatform(prevBottom);


}

function draw(){

    ctx.clearRect(0, 0,  canvas.width, canvas.height);

    // ctx.fillStyle = "#7ef5e1";
     ctx.fillStyle = player.isGrounded ? "#7ef5e1" : "#ffd166";
    ctx.fillRect(player.x,player.y,player.w,player.h);

    ctx.fillStyle = "#e8eeff";
    ctx.font = "20px monospace";
    ctx.fillText("vx = " + player.vx.toFixed(0) + "   vy = " + player.vy.toFixed(0) + "   isGrounded = " + player.isGrounded, 10, 20);

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
    ①手順2で BOUNCE を 1.2 にしたとき、どうなったか。現実ではありえないのはなぜか説明する
        BOUNCEを1.2にしたときは跳ねるたびに高さが上がった。
    現実では重力加速度が常にかかっており、自ら推進力をかけない限り、通常は運動エネルギーが減衰し最終的にはねなくなる。
    通常、反発係数が1の時では、床にぶつかった速度がその向きを180度変えた方向に、同じ速さのまま跳ね返る。
    今回の場合、1.2では衝突のたびに速度（運動エネルギー）を増幅させて返しているため、
    どんどん上昇していく。現実では外部からエネルギーを与えない限りエネルギーが増えることはないため、
    これはあり得ない。

    ②手順3で FRICTION を 1.0 にしたとき、キーを離したあと、どうなったか。なぜそうなったか
        FRICTIONが1.0のとき、このプログラムの計算上は速度が減衰しないため、物理における摩擦の無い状態（摩擦係数0）と同義となる。
    つまり、ブロックの速度は減衰することなく押した方向へ等速直線運動で進み続ける。
    通常は摩擦があり、その効果により減速するが、摩擦が無い場合は減速することがない。
    外力が働かないため、ブロックは慣性の法則によって進み続けるような動きになる。

*/