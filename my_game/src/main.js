
let gameState = "title";

document.addEventListener("keydown", (e)=>{
if(e.code === "Enter" && gameState === "title"){
  gameState = "play";
}
if(e.code ==="KeyP"){
  if(gameState === "play"){
    gameState = "pause";
  }
  else if(gameState === "pause"){
    gameState = "play"
  }
}
});

function update(dt){
     if (gameState !== "play") {
        return;                 // プレイ中でなければ、動かさない
      }

      const prevBottom = player.y + player.h;

    updataPlayer(dt);
    updateEnemies(dt);
    collideWithEnemies(prevBottom);
}

function drawMessage(text, sub) {
  ctx.fillStyle = "#e8eeff";
  ctx.textAlign = "center";
  ctx.font = "32px sans-serif";
  ctx.fillText(text, canvas.width / 2, 150);
  ctx.font = "16px sans-serif";
  ctx.fillText(sub, canvas.width / 2, 190);
  ctx.textAlign = "left";   // ほかの文字のために戻す
  ctx.font = "14px monospace";
}

function draw(){

    ctx.clearRect(0, 0,  canvas.width, canvas.height);

    // ctx.fillStyle = "#7ef5e1";
     

    // 目印の線（跳んだ高さをくらべる）
    ctx.fillStyle = "#ff6b6b";
      ctx.fillRect(0, floor.y - TARGET_HEIGHT, canvas.width, 2);

    drawPlat();
   
    drawStage();

    if (gameState === "title") {
    drawMessage("my game", "Enter で始める");
    return;                 // タイトルでは、敵とプレイヤーは描かない
  }
  
  drawEnemies();
  drawPlayer();
  if(gameState ==="pause"){
    drawMessage("PAUSE","Pでツヅケル");
  }
}

let last = performance.now();

function loop(now){
    const dt = Math.min((now - last) / 1000, 0.033);

    last = now;
    update(dt);
    draw();
    requestAnimationFrame(loop);
}

for(const enemy of enemies){
  console.log("enemeis[ "+enemy+ "]");
}


requestAnimationFrame(loop);



/*
  
*/