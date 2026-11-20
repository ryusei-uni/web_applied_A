const MAX_ENEMISES = 6;

function createEnemy(x,vx){
      return {x:x,y:floor.y-32,w:32,h:32,vx:vx,alive:true,id:null};
  }

let enemies = [];
let spawnTimer = 0;
let nextSpawn = 2;
function resetEnemies() {
  enemies = [];
  enemies.push(createEnemy(200, 80));
  enemies.push(createEnemy(380, -120));
  enemies.push(createEnemy(540, 60));
  spawn = 0;
  nextSpawn = 2;
  // ↑ 授業でくじの敵を足した人は、その行（const special = … から enemies.push(special); まで）もここへ
}

function spawnEnemies(dt){
  spawnTimer =+ dt;

  if(spawnTimer >= nextSpawn){
    if(enemies.length < MAX_ENEMISES){
      if(Math.random() < 0.5){
        
        enemies.push(createEnemy(0,100));
      }else{
        enemies.push(createEnemy(canvas.width -32,-100));
      }
    }
    spawnTimer = 0;
    nextSpawn = 1 + Math.random()*2;
  }
}

function collideWithEnemies(prevBottom) {
  for (const enemy of enemies) {
    if (aabb(player, enemy) && prevBottom <= enemy.y && player.vy > 0) {
      enemy.alive = false;            // 倒した（状態を書き換える）
      player.vy = -CONFIG.JUMP_SPEED / 2;    // 踏んだら、少し跳ねる
      score ++;
    }else if(aabb(player,enemy) && player.hittimer <= 0){
      player.hp -= 1;
      player.hittimer = CONFIG.HIT_TIME;
    }
    // }else if(aabb(player,enemy) ){
    //   player.hp -= 1;
    //   player.hittimer = CONFIG.HIT_TIME;
    // }
  }
   enemies = enemies.filter((enemy) => enemy.alive); 
}

function updateEnemies(dt){
    for(const enemy of enemies){
        // enemy.x += enemy.vx * dt;
        

      
        enemy.x = enemy.x + enemy.vx * dt;
        if(enemy.x < 0){
            enemy.x = 0;
            enemy.vx = -enemy.vx;
        }
        if(enemy.x + enemy.w > canvas.width){
            enemy.x = canvas.width - enemy.w;
            enemy.vx = -enemy.vx;

        }
    }

    ctx.fillStyle = "#e8eeff";
    ctx.fillText("敵 = " + enemies.length, 10, 40);
}

function drawEnemies(){
   ctx.fillStyle = "#ff6b6b";
  for (const enemy of enemies) {
    ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);
  }
  ctx.fillStyle = "#e8eeff";
  ctx.fillText("敵 = " + enemies.length, 10, 40);
}