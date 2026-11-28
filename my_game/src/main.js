let gameState = "title";
let score = 0;
let playTime = 0;
let showHitboxes = false;
const STREAK_WINDOW_SECONDS = 2.5;
let stompStreak = 0;
let streakDeadline = -Infinity;

function awardStompScore() {
  stompStreak = playTime <= streakDeadline ? stompStreak + 1 : 1;
  score += stompStreak;
  streakDeadline = playTime + STREAK_WINDOW_SECONDS;
}

function resetGame() {
  resetPlayer();
  resetEnemies();
  bullets.length = 0;
  lasers.length = 0;
  score = 0;
  playTime = 0;
  stompStreak = 0;
  streakDeadline = -Infinity;
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

document.addEventListener("pointerdown", ()=>{
if((gameState === "title" || gameState === "gameover")){
  startGame();
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
    updateBullet(dt);
    if(player.hp <= 0){
        gameState = "gameover";
      }
}

function drawMessage(text, sub) {
  ctx.fillStyle = "#160f26aa";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#241831";
  ctx.fillRect(152, 105, 336, 142);
  ctx.strokeStyle = "#ba829e";
  ctx.strokeRect(152.5, 105.5, 335, 141);
  ctx.fillStyle = "#ffcc98";
  ctx.fillRect(296, 105, 48, 3);
  ctx.textAlign = "center";
  ctx.fillStyle = "#fff2de";
  ctx.font = "bold 36px system-ui, sans-serif";
  ctx.fillText(text, canvas.width / 2, 165);
  ctx.fillStyle = "#e9c4d1";
  ctx.font = "16px system-ui, sans-serif";
  ctx.fillText(sub, canvas.width / 2, 207);
  ctx.textAlign = "left";
}
function drawHud() {
  ctx.fillStyle = "#241831ee";
  ctx.fillRect(16, 14, 128, 34);
  ctx.fillRect(496, 14, 128, 34);
  ctx.fillStyle = "#fff2de";
  ctx.font = "bold 14px monospace";
  ctx.fillText("SCORE", 26, 36);
  ctx.fillText("HP", 506, 36);
  ctx.textAlign = "right";
  ctx.fillText(String(score).padStart(3, "0"), 134, 36);
  ctx.textAlign = "left";

  for (let i = 0; i < CONFIG.MAX_HP; i++) {
    const x = 535 + i * 28;
    const width = 22;

    // 1. まず背景（空のゲージ）をすべての枠に描画する
    ctx.fillStyle = "#654662";
    ctx.fillRect(x, 26, width, 10);

    // 2. このブロックに描画すべきHPの割合（0.0 〜 1.0）を計算
    const ratio = Math.max(0, Math.min(1, player.hp - i));

    // 3. 残量がある分だけ、上からピンク色のバーを重ねて描画する
    if (ratio > 0) {
      ctx.fillStyle = "#ff9d9d";
      ctx.fillRect(x, 26, width * ratio, 10);
    }
  }
  const remaining = streakDeadline - playTime;
  if (remaining > 0) {
    ctx.fillStyle = "#241831ee";
    ctx.fillRect(228, 14, 184, 34);
    ctx.fillStyle = "#ffcc98";
    ctx.fillText(stompStreak + " 連続  +" + stompStreak, 238, 34);
    ctx.textAlign = "right";
    ctx.fillText(remaining.toFixed(1) + "s", 402, 34);
    ctx.textAlign = "left";
    ctx.fillStyle = "#654662";
    ctx.fillRect(238, 40, 164, 3);
    ctx.fillStyle = "#ffcc98";
    ctx.fillRect(238, 40, 164 * remaining / STREAK_WINDOW_SECONDS, 3);
  }
}

function drawHitboxes() {
  ctx.save();
  ctx.lineWidth = 1;

  ctx.strokeStyle = "#74fff0";
  const hurtbox = getPlayerHurtbox();
  ctx.strokeRect(hurtbox.x, hurtbox.y, hurtbox.w, hurtbox.h);

  ctx.strokeStyle = "#ff86b3";
  for (const enemy of enemies) {
    ctx.strokeRect(enemy.x, enemy.y, enemy.w, enemy.h);
  }

  drawProjectileHitboxes(ctx);

  ctx.strokeStyle = "#a8ff93";
  ctx.beginPath();
  ctx.moveTo(floor.x, floor.y);
  ctx.lineTo(floor.x + floor.w, floor.y);
  ctx.stroke();
  ctx.strokeRect(plat.x, plat.y, plat.w, plat.h);
  ctx.restore();
}

function draw(){

    drawScenery();

    if (gameState === "title") {
    drawMessage("夕空ダイブ", "Enter キー / クリックでスタート");
    drawAim();
    return;                 // タイトルでは、敵とプレイヤーは描かない
  }
  
  drawEnemies();
  drawBullet(ctx);
  drawPlayer();
  if (showHitboxes) drawHitboxes();
  if(gameState ==="pause"){
    drawMessage("一時停止", "P キーで再開");
  }
  if(gameState === "gameover"){
    drawMessage("ゲームオーバー", "Enter キー / クリックでもう一度");
  }
  drawHud();
  drawAim();
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
