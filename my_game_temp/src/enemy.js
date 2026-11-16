CONFIG_ENEMY ={
    GRAVITY:1160,
    JUMP_SPEED:560,
    MOVE_SPEED:200,
    MAX_JUMPS:2,
    FALL_GRAVITY_RATE:2,
    HIP_DROP_RATE :5
};


const enemys = [];

const enemy_a = {x:80,y:40,w:32,h:32,vx:0,vy:0,isAttack:false,isGrounde:false,isCrash:false,isDamage:false};

function drawEnemy(enemy){
    ctx.fillStyle = enemy.isDamage ?"#f90055" : "#00f955";
    ctx.fillRect(enemy.x,enemy.y,enemy.w,enemy.h);
}

function collideEnemywithPlayer(enemy){
    if(aabb(player,enemy)){
        enemy.isCrash = true;
    }else{
        enemy.isCrash = false;
    }
}

function spownEnemy(enemy){
    
    collideEnemywithPlayer(enemy);
    collideWithFloor(enemy,floor);
}

function enemy_Damaged(enemy,player){
    if(player.isAttack && enemy.isCrash && !(player.isGrounded)){
        enemy.isDamage = true;
        enemy.isAttack = false;
    }else{
        enemy.isDamage = false;
        enemy.isAttack = true;
    }
}

function draw_Enemy_spown(enemys){
    
}

function enemys_ai(dt,enemy){

     const prevBottom = enemy.y + enemy.h;
    const g = enemy.vy > 0 ? CONFIG_ENEMY.GRAVITY * CONFIG_ENEMY.FALL_GRAVITY_RATE : CONFIG_ENEMY.GRAVITY;
    enemy.vy = enemy.vy + g * dt;
    // player.vy += GRAVITY*dt;
    enemy.y += enemy.vy*dt;


    
    
}

function updataEnemy(dt,enemy){

    spownEnemy(enemy);
    enemys_ai(dt,enemy);
    enemy_Damaged(enemy,player);
}


