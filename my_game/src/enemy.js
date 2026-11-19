  function createEnemy(x,vx){
      return {x:x,y:floor.y-32,w:32,h:32,vx:vx,alive:true,id:null};
  }

let enemies = [];
// const one = new createEnemy(200, 80);
const one = createEnemy(200, 80);
// enemies.push(one);
// enemies.push(one);
// enemies.push(one);
enemies.push(createEnemy(200,80));
enemies.push(createEnemy(380,-120));
enemies.push(createEnemy(540,60));

function collideWithEnemies(prevBottom) {
  for (const enemy of enemies) {
    if (aabb(player, enemy) && prevBottom <= enemy.y && player.vy > 0) {
      enemy.alive = false;            // 倒した（状態を書き換える）
      player.vy = -CONFIG.JUMP_SPEED / 2;    // 踏んだら、少し跳ねる
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