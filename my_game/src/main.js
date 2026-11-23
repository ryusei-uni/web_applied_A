let gameState = "title";
let score = 0;
let playTime = 0;
function resetGame() {
  resetPlayer();
  resetEnemies();
  score = 0;
  playTime = 0;
}
function startGame() {
  resetGame();
  gameState = "play";
}

document.addEventListener("keydown", (e)=>{
if(e.code === "Enter" && (gameState === "title" || gameState === "gameover")){
  startGame();
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
      playTime += dt;
    updataPlayer(dt);
    spawnEnemies(dt);
    updateEnemies(dt);

    collideWithEnemies(prevBottom);
    if(player.hp <= 0){
        gameState = "gameover";
      }
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

function drawHud(){
  ctx.fillStyle ="#e8eeff";
  ctx.fillText("SCORE" + score,500,20);
  ctx.strokeStyle = "#e8eeff";
  ctx.strokeRect(500,30,120,12);
  ctx.fillStyle = "#7ef5e1";
  ctx.fillRect(500,30,120 *player.hp / CONFIG.MAX_HP,12);
}

function draw(){

    ctx.clearRect(0, 0,  canvas.width, canvas.height);

    // ctx.fillStyle = "#7ef5e1";
     

    // 目印の線（跳んだ高さをくらべる）
    ctx.fillStyle = "#ff6b6b";
      ctx.fillRect(0, floor.y - TARGET_HEIGHT, canvas.width, 2);

    drawPlat();
   
    drawStage();

    drawHud();

    if (gameState === "title") {
    drawMessage("my game", "Enter で始める");
    return;                 // タイトルでは、敵とプレイヤーは描かない
  }
  
  drawEnemies();
  drawPlayer();
  if(gameState ==="pause"){
    drawMessage("PAUSE","Pでツヅケル");
  }
  if(gameState === "gameover"){
    drawMessage("GAME OVER","Enter でもう一度");
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