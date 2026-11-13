

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");

const GRAVITY = 2000;

const player = {x:80,y:20,w:32,h:32,vy:0};
const floor = {x:0,y:320,w:640,h:40};

function update(dt){
    player.vy += GRAVITY*dt;
    player.y += player.vy*dt;

    collideWithFloor();
}

function collideWithFloor(){
    if(player.y + player.h > floor.y){
        player.y = floor.y - player.h;
        player.vy = 0;
    }
}

function draw(){

    ctx.clearRect(0, 0,  canvas.width, canvas.height);

    ctx.fillStyle = "#7ef5e1";
    ctx.fillRect(player.x,player.y,player.w,player.h);

    ctx.fillStyle = "#e8eeff";
    ctx.font = "14px monospace";
    ctx.fillText("vy ="+ player.vy.toFixed(0) + "  y = " + player.y.toFixed(0),10,20);

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
①collideWithFloor の中の2行は、それぞれ何をしているか。なぜ2行とも必要か説明する（「位置」「速さ」という言葉を使う）
    キャラの位置を判断して
    プレイヤーの位置を床の上に戻す
    その後縦の速度を０にしています。

    どちらが欠けても正常に固定されない
    仮に位置の固定を消した（コメントアウト）場合（ｖｙを０にするのみ）の場合はじわじわ下に落ちていき
    ｖｙ＝０を消した（コメントアウト）場合は固定はされたがすこしピクピク動いて見えたし
    下への速度がたまり続けた
    この状態では正常な動作に不安が残る

    そのため，安定して停止させる場合は両方ある方が良い。
②手順2で「位置を戻す」行を消したとき、四角はどうなったか。なぜそうなったか
    位置を戻すものを消した際はじわじわ下へ沈んでいった。
    固定されていないため少ない誤差を修正できないため動き続けた。
*/