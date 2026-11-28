const MAX_ENEMIES = 6;

let SpawnFlag = true;
const statuses = ["default", "heavy", "shooter", "stalker","flyly"];
const flyenemies = ["flyly","drone"];
const ENEMY_HP = { default: 1, heavy: 3, shooter: 1, stalker: 1 ,flyly:1};
const ENEMY_CONTACT_DAMAGE = {
  default: 1,
  heavy: 1,
  shooter: 0.5,
  stalker: 1,
  flyly: 0.75
};
const ENEMY_SPEED = { default: 80, heavy: 40, shooter: 80, stalker: 140,flyly:Math.random() * 80 + 40 };
const CONFIG_ENEMY = {
  patrolSpeed:ENEMY_SPEED.stalker /2 -10,
 SHOOTER_FIRE_INTERVAL : 2.4,
  SHOOTER_BULLET_SPEED : 150
}


function createEnemy(x, vx, status = statuses[Math.floor(Math.random() * statuses.length)]) {
  const minFlyY = 20;
  const maxFlyY = floor.y - 60;
  const hp = ENEMY_HP[status];
  const speed = ENEMY_SPEED[status];
  const flyflag = flyenemies.includes(status);
  const Ey = flyflag 
  ? Math.random() * (maxFlyY - minFlyY) + minFlyY
   : floor.y - 32;
  return { x, y: Ey, patrolY: Ey,w: 32, h: 32, vx, status, hp,speed ,fly:flyflag};
}


let enemies = [];
let spawnTimer = 0;
let nextSpawn = 2;
let moveTime = 1.0;
let stopTime = 1.0;
function resetEnemies() {
  enemies = []; 
  if(SpawnFlag){
     enemies.push(createEnemy(380, -120,statuses[1]));
  enemies.push(createEnemy(340, 50,statuses[0]));
  enemies.push(createEnemy(520, 80,statuses[2]));
  enemies.push(createEnemy(590, 60,statuses[3]));
  enemies.push(createEnemy(590, 60,statuses[4]));
  }
  spawn = 0;
  nextSpawn = 2;
 
}

function spawnEnemies(dt){
  spawnTimer += dt;

  if((spawnTimer >= nextSpawn) && SpawnFlag){
    if(enemies.length < MAX_ENEMIES){
      if(Math.random() < 0.5){
        
        enemies.push(createEnemy(0, 100));
      }else{
        enemies.push(createEnemy(canvas.width - 32, -100));
      }
    }
    spawnTimer = 0;
    nextSpawn = 1 + Math.random()*2;
  }
}

function getEnemyDisPlayer(enemy, player) {
  const dx = player.x - enemy.x;
  const dy = player.y - enemy.y;
  const distance = Math.hypot(dx, dy);;
  return { dx, dy, distance };
}

function updateStalker(enemy, player) {
  const { dx, distance } = getEnemyDisPlayer(enemy, player);
  const chaseRange = 350; // 追いかける範囲（px）
  const speed = enemy.speed; 
  if (distance < chaseRange && distance > 5) {
    // プレイヤーがいる方向へ速度を設定
    enemy.vx = dx > 0 ? speed : -speed;

  } else {
    // 範囲外なら立ち止まる（またはゆっくり巡回させたい場合は vx を維持）
     const dir = enemy.vx >= 0 ? 1 : -1;
      enemy.vx = dir * CONFIG_ENEMY.patrolSpeed;
    }
}

function updatefly(enemy, player) {

const { dx,dy, distance } = getEnemyDisPlayer(enemy, player);
  const chaseRange = 350; // 追いかける範囲（px）
  const speed = enemy.speed; 
  const speedX = speed * 1.5; 
  const speedY = speed * 1;
  const patrolY = enemy.patrolY;
  if(distance < chaseRange){
    if(distance > 5){
       enemy.vx = (dx / distance) * speedX;
      enemy.vy = (dy / distance) * speedY;
    } else {
      
      enemy.vx = 0;
      enemy.vy = 0;
    }
  } else {
    
    const dir = enemy.vx >= 0 ? 1 : -1;
    enemy.vx = dir * CONFIG_ENEMY.patrolSpeed;

    
    const diffY = patrolY - enemy.y;
    if (Math.abs(diffY) > 2) {
      enemy.vy = Math.sign(diffY) * CONFIG_ENEMY.patrolSpeed * 0.4;
    } else {
      enemy.y = patrolY;
      enemy.vy = 0;
    }
  }
}




function updateShooter(enemy, dt) {
  enemy.fireTime = (enemy.fireTime ?? CONFIG_ENEMY.SHOOTER_FIRE_INTERVAL) - dt;
  if (enemy.fireTime <= 0) {
    const speed = CONFIG_ENEMY.SHOOTER_BULLET_SPEED;
    switch (enemy.attackPattern ?? 0) {
      case 0:
        wedgeBullet(enemy, player, 4, 18, speed);
        break;
      case 1:
        randomBarrage(enemy, player, speed);
        break;
      case 2:
        fireLaser(enemy, player);
        break;
      case 3:
        trackingBarrage(enemy, player, speed * 0.65);
        break;
      case 4:
        groundSlashBarrage(enemy, player);
        break;
    }
    enemy.attackPattern = ((enemy.attackPattern ?? 0) + 1) % 5;
    enemy.fireTime += CONFIG_ENEMY.SHOOTER_FIRE_INTERVAL;
  }
}


function collideWithEnemies(prevBottom) {
  
  if (player.isAttack && player.vy > 0) {
    const bottom = player.y + player.h;
    const stompIndex = enemies.findIndex((enemy) =>
      prevBottom <= enemy.y && bottom >= enemy.y &&
      player.x < enemy.x + enemy.w && player.x + player.w > enemy.x
    );
    if (stompIndex !== -1) {
      const enemy = enemies[stompIndex];
      player.y = enemy.y - player.h;
      finishHipDrop();
      player.vy = -CONFIG.HIP_DROP_BOUNCE;
      player.jumpsLeft = Math.max(player.jumpsLeft, 1);
      enemy.hp -= 1;
      if (enemy.hp <= 0) {
        enemies.splice(stompIndex, 1);
      }
      awardStompScore();
      return;
    }
  }
  if (player.hittimer > 0 || player.invincible) return;

  const hurtbox = getPlayerHurtbox();
  let damage = 0;
  for (const enemy of enemies) {
    if (aabb(hurtbox, enemy)) {
      damage = Math.max(damage, ENEMY_CONTACT_DAMAGE[enemy.status] ?? ENEMY_CONTACT_DAMAGE.default);
    }
  }
  if (damage > 0) {
    player.hp = Math.max(0, player.hp - damage);
    player.hittimer = CONFIG.HIT_TIME;
  }
}

function updateEnemies(dt) {
  let cycle = moveTime + stopTime;
  let currentTime = playTime % cycle;

  for (const enemy of enemies) {
    if (enemy.status === statuses[3]) {
      
      updateStalker(enemy, player);
      enemy.x += enemy.vx * dt;

    } else if (enemy.status === statuses[4]) {
      
      updatefly(enemy, player);
      enemy.x += enemy.vx * dt;
      enemy.y += enemy.vy * dt;

    } else {
      
      if (currentTime < moveTime) {
        enemy.x += enemy.vx * dt;
      }
    }

    // 画面端の跳ね返り処理
    if (enemy.x < 0) {
      enemy.x = 0;
      enemy.vx = -enemy.vx;
    }
    if (enemy.x + enemy.w > canvas.width) {
      enemy.x = canvas.width - enemy.w;
      enemy.vx = -enemy.vx;
    }

    if (enemy.status === "shooter") updateShooter(enemy, dt);
  }
}


function drawEnemies() {
  for (const enemy of enemies) {
    const x = Math.round(enemy.x);
    const y = enemy.y;

    // ステータスに応じた色変数の初期化（デフォルト値を設定）
    let baseColor = "#441e43";   // 外枠・影
    let bodyColor = "#bf577b";   // 服・体
    let faceColor = "#ffd19d";   // 顔・肌
    let eyeColor  = "#fff2de";   // 目

   
    switch (enemy.status) {
      case statuses[1]:
        
        baseColor = "#222a2a";
        bodyColor = "#4a6767";
        faceColor = "#a3b899";
        eyeColor  = "#ff6b6b"; 
        break;

      case statuses[2]:
       
        baseColor = "#1a1c2e";
        bodyColor = "#3b5dc9";
        faceColor = "#a3d2ca";
        eyeColor  = "#00ffcc"; 
        break;

      case statuses[3]: // "stalker"
        baseColor = "#1f1024";
        bodyColor = "#6a1b9a"; // 紫系
        faceColor = "#e1bee7";
        eyeColor  = "#ff1744"; // 赤い目
        break;
      case statuses[4]: // "flyly"
        baseColor = "#1f1024";
        bodyColor = "#6a1b9a"; // 紫系
        faceColor = "#bee7d1";
        eyeColor  = "#45ff17"; // 赤い目
        break;

      case statuses[0]:
      default:
        
        baseColor = "#441e43";
        bodyColor = "#bf577b";
        faceColor = "#ffd19d";
        eyeColor  = "#fff2de";
        break;
    }

   
    ctx.fillStyle = baseColor;
    ctx.fillRect(x, y + 8, 32, 24);
    ctx.fillRect(x + 5, y, 22, 8);

    // 服・体
    ctx.fillStyle = bodyColor;
    ctx.fillRect(x + 3, y + 9, 26, 18);
    ctx.fillRect(x + 7, y + 3, 18, 6);

    // 顔・肌
    ctx.fillStyle = faceColor;
    ctx.fillRect(x + 7, y + 4, 11, 3);

    // 目（左目・右目）
    ctx.fillStyle = eyeColor;
    ctx.fillRect(x + 8, y + 13, 5, 6);
    ctx.fillRect(x + 19, y + 13, 5, 6);

    const maxHp = ENEMY_HP[enemy.status];
    if (maxHp > 1) {
      const left = x + (enemy.w - maxHp * 7 + 2) / 2;
      for (let i = 0; i < maxHp; i++) {
        ctx.fillStyle = i < enemy.hp ? "#ffcc98" : "#241831";
        ctx.fillRect(left + i * 7, y - 7, 5, 3);
      }
    }
  }
}
