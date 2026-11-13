

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");

const GRAVITY = 2000;
const JUMP_SPEED = 700;
const MOVE_SPEED = 240;

const player = {x:80,y:20,w:32,h:32,vy:0,isGrounded:false};

const floor = {x:0,y:320,w:640,h:40};

const keys ={}
;

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
    player.vy += GRAVITY*dt;
    player.y += player.vy*dt;
    ctrl(dt);
    collideWithFloor();
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

function draw(){

    ctx.clearRect(0, 0,  canvas.width, canvas.height);

    // ctx.fillStyle = "#7ef5e1";
     ctx.fillStyle = player.isGrounded ? "#7ef5e1" : "#ffd166";
    ctx.fillRect(player.x,player.y,player.w,player.h);

    ctx.fillStyle = "#e8eeff";
    ctx.font = "20px monospace";
     ctx.fillText("vy = " + player.vy.toFixed(0) + "   isGrounded = " + player.isGrounded, 10, 20);

    ctx.fillStyle = "#203060";
    ctx.fillRect(floor.x, floor.y, floor.w, floor.h);
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
①スペースを押してから、跳んで床に戻るまでに、player.vy と player.isGrounded はどう変わるか。順番に説明する
    スペースを押すとplayer.isGrounded がtrueつまり床についている時かつSpaceがオンの時に　player.vyは-JUMP_SPEEDに変わります。
    その時地面の判定側離れるためplayer.isGroundedがfalseになり上の条件から抜けますそのためplayer.vyはGRAVITYに変わり地面に落ちていきます。
    
②手順2で「地面にいるときだけ」の条件を消して、スペースを続けて押したとき、どうなったか。なぜそうなったか
    isGroundedがないときは地面にいない時でもジャンプできます。
    isGroundedがないと自分が今足がついているのかわからないため
    スペースを押したという時に条件を満たしてしまっているため
    ジャンプができてしまう。

    思ったこと
    回数などの条件をつけて回数を時間で解除つまりクールタイム
    を実装してカウンターを使うことで二段ジャンプなどに応用できるかもと思いました。

*/