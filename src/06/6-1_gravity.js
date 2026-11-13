const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");

const GRAVITY = 500;

const player = {x:80,y:20,w:32,h:32,vy:0};

function update(dt){
    player.vy += GRAVITY*dt;
    player.y += player.vy*dt;
}

function draw(){

    ctx.clearRect(0, 0,  canvas.width, canvas.height);

    ctx.fillStyle = "#7ef5e1";
    ctx.fillRect(player.x,player.y,player.w,player.h);

    ctx.fillStyle = "#e8eeff";
    ctx.font = "14px monospace";
    ctx.fillText("vy ="+ player.vy.toFixed(0),10,20);
}

let last = performance.now();

function loop(now){
    const dt = (now - last) / 1000;

    last = now;
    update(dt);
    draw();
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

/*
①update の2行（①・②）は、それぞれ何が何を変えているか説明する（「速さ」「位置」という言葉を使う）
    ①はGRAVITY（重力の加速度）を元に速さを変えている
    ②は速さが位置を変えている。    

②手順2で ① の行を消したとき、四角はどう動き、vy の表示はどうなったか。なぜそうなったか
    消したときはvyが0になり四角は動かなかった
    速度の計算が行われなくて初期化の値である速度０とｄｔをかけることになり
    計算結果が０を加算している状態になっていたため

③物理には、落ちる距離を一度に求める式（½ × 重力 × 時間²）がある。それなのに、ゲームでは ①・② の2行をくり返して計算するのはなぜか
  ゲームの場合そんなに厳密な計算を行う必要はなく２乗のある式は処理がかさむにつれてコンピュータに負荷がかかる
  
  それ以外にもジャンプや着地の処理に繋げやすいという利点もある。
  そのためゲームでは２行を繰り返し計算を行うほうが軽量かつ利便性が高くなる。
  しかし，少しずつ足しているので，物理の式とは少しのズレを生む，だがゲームの中では見た目にそんなに影響が出ないため許容できる
*/