function createEnemy(x,vx){
    return {x:x,y:floor.y-32,w:32,h:32,vx:vx,alive:true};
}

let enemies = [];
const one = createEnemy(200, 80);
// enemies.push(one);
// enemies.push(one);
// enemies.push(one);
enemies.push(createEnemy(200,80));
enemies.push(createEnemy(380,-120));
enemies.push(createEnemy(540,60));


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
}

function drawEnemies(){
    ctx.fillStyle = "#ff6b6b";
    for(const enemy of enemies){
        ctx.fillRect(enemy.x,enemy.y,enemy.w,enemy.h);
    }
}