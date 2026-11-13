

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");

const GRAVITY = 2000;
const JUMP_SPEED = 700;
const MOVE_SPEED = 240;

const player = {x:80,y:20,w:32,h:32,vy:0,isGrounded:false};

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
        player.x += MOVE_SPEED *dt;
    }
    if(keys["ArrowLeft"]){
        player.x -= MOVE_SPEED *dt;
    }
    
}

function update(dt){
    const prevBottom = player.y + player.h;
    player.vy += GRAVITY*dt;
    player.y += player.vy*dt;
    ctrl(dt);
    collideWithFloor();
    collideWithplatform(prevBottom);
}

function aabb(a,b){
    return  a.x < b.x + b.w &&
            a.x + a.w > b.x &&
            a.y < b.y + b.h &&
            a.y + a.h > b.y ;
           
}

function collideWithFloor(){
    if(player.y + player.h > floor.y){
        player.y = floor.y - player.h;
        player.vy = 0;
        player.isGrounded =true;
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

function draw(){

    ctx.clearRect(0, 0,  canvas.width, canvas.height);

    // ctx.fillStyle = "#7ef5e1";
     ctx.fillStyle = player.isGrounded ? "#7ef5e1" : "#ffd166";
    ctx.fillRect(player.x,player.y,player.w,player.h);

    ctx.fillStyle = "#e8eeff";
    ctx.font = "20px monospace";
     ctx.fillText("vy = " + player.vy.toFixed(0) + "   isGrounded = " + player.isGrounded + "   重なり = " + aabb(player, plat), 10, 20);

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
    ①aabb(a, b) は何を調べて、何を返す関数か。4つの条件が && でつながっているのはなぜか説明する
        aの座標がｂの範囲に入っているかを調べています。
        入っている場合はtrue,いない場合はfalseを返す。
        &&を使うことですべての条件を満たしている時にtrueを返すようにできます。
        なので  
                aの左端がbの右側より左にある
                aの右端がbの左側より右にある
                aの上側がbの下側より上にある
                aの下側がbの上側より下にある
        上記4つが満たした状態はaの箱がbに重なっているまたは衝突している状態にある
    ②手順2で「上から来たときだけ」の条件を消して、足場の下から跳んだとき、どうなったか。なぜそうなったか
        下から踏んだ時に上にワープしたように動いた。
        上から来たときが消えた場合，条件として見るのはplatと重なったか（衝突）したかどうかのみを
        検知して座標と速度，設置判定を変えているため自然無動きにならない
        
*/